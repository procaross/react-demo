import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import { auth } from "express-oauth2-jwt-bearer";
import axios from 'axios'

// this is a middleware that will validate the access token sent by the client
const requireAuth = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: "RS256",
});

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// this is a public endpoint because it doesn't have the requireAuth middleware
app.get("/ping", (req, res) => {
  res.send("pong");
});

app.get('/detail/:movieId', async (req, res) => {
  try {
    const movieId = req.params.movieId;

    let movie = await prisma.movie.findUnique({ where: { movieId } });

    if (!movie) {
      const options = {
        method: 'GET',
        url: `https://moviesdatabase.p.rapidapi.com/titles/${movieId}`,
        headers: {
          'X-RapidAPI-Key': 'a2243b4875msha2e1ea67bcd72ecp18279ejsn4e35862a83e9',
          'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
        }
      };

      const response = await axios.request(options);
      const movieData = response.data.results;

      movie = await prisma.movie.create({
        data: {
          movieId: movieData.id,
          title: movieData.titleText.text,
          originalTitle: movieData.originalTitleText.text,
          releaseYear: movieData.releaseYear.year,
          releaseDate: new Date(movieData.releaseDate.year, movieData.releaseDate.month - 1, movieData.releaseDate.day),
          primaryImage: movieData.primaryImage.url
        }
      });
    }

    res.json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});


const { User } = prisma;

app.post("/users/auth", async (req, res) => {
  try {
    const {
      given_name,
      family_name,
      nickname,
      name,
      picture,
      locale,
      updated_at,
      email,
      email_verified,
      sub,
    } = req.body;

    const existingUser = await User.findUnique({ where: { email } });

    if (existingUser) {
      res.json(existingUser);
    } else {
      const newUser = await User.create({
        data: {
          email,
          givenName: given_name,
          familyName: family_name,
          nickname,
          locale,
          emailVerified: email_verified,
          updatedAt: new Date(updated_at),
          sub,
        },
      });
      res.json(newUser);
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/users/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { givenName, familyName, nickname } = req.body;
    const updatedUser = await User.update({
      where: { id },
      data: {
        givenName,
        familyName,
        nickname,
      },
    });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/favorites', requireAuth, async (req, res) => {
  const { userId, movieId } = req.body;

  try {
    const existingFavorite = await prisma.favorite.findUnique({
      where: { userId_movieId: { userId, movieId } },
    });

    if (existingFavorite) {
      res.status(409).json({ error: 'Movie already favorited by this user' });
      return;
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId,
        movieId,
      },
    });

    res.json(favorite);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while favoriting the movie' });
  }
});

app.get('/favorites', requireAuth, async (req, res) => {
  const { userId } = req.body;
  console.log(userId)

  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: { movie: true },
    });

    res.json(favorites.map(favorite => favorite.movie));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching favorites' });
  }
});

app.delete('/favorites', requireAuth, async (req, res) => {
  const { userId, movieId } = req.body;

  try {
    const deleteResponse = await prisma.favorite.delete({
      where: { userId_movieId: { userId, movieId } },
    });

    res.json({ message: 'Favorite removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while removing the favorite' });
  }
});


app.listen(8000, () => {
  console.log("Server running on http://localhost:8000 🎉 🚀");
});


