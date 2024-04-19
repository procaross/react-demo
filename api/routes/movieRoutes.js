import express from "express";
import axios from "axios";
import pkg from "@prisma/client";
const router = express.Router();
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

router.get('/detail/:movieId', async (req, res) => {
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

router.get('/movies', async (req, res) => {
  const page = req.query.page || '1';
  const options = {
    method: 'GET',
    url: `https://moviesdatabase.p.rapidapi.com/titles`,
    headers: {
      'X-RapidAPI-Key': 'a2243b4875msha2e1ea67bcd72ecp18279ejsn4e35862a83e9',
      'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
    },
    params: {
      page: page,
      info: 'base_info'
    }
  };

  try {
    const response = await axios.request(options);
    const moviesData = response.data.results;

    if (moviesData.length > 0) {
      for (const movieData of moviesData) {
        const existingMovie = await prisma.movie.findUnique({
          where: { movieId: movieData.id }
        });

        if (!existingMovie) {
          await prisma.movie.create({
            data: {
              movieId: movieData.id,
              title: movieData.titleText.text,
              originalTitle: movieData.originalTitleText.text,
              releaseYear: movieData.releaseYear.year,
              // Assume releaseDate is properly defined in movieData
              primaryImage: movieData.primaryImage?.url || null
            }
          });
        }
      }
    }

    res.json(moviesData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching movies data' });
  }
});

router.get('/search/movies', async (req, res) => {
  const keyword = req.query.keyword || 'love';
  const page = req.query.page || '1';

  const options = {
    method: 'GET',
    url: `https://moviesdatabase.p.rapidapi.com/titles/search/title/${keyword}`,
    headers: {
      'X-RapidAPI-Key': 'a2243b4875msha2e1ea67bcd72ecp18279ejsn4e35862a83e9',
      'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
    },
    params: {
      page: page,
      limit: '30',
      exact: 'false',
    }
  };

  try {
    const response = await axios.request(options);
    const moviesData = response.data.results;

    if (moviesData.length > 0) {
      for (const movieData of moviesData) {
        const existingMovie = await prisma.movie.findUnique({
          where: { movieId: movieData.id }
        });

        if (!existingMovie) {
          await prisma.movie.create({
            data: {
              movieId: movieData.id,
              title: movieData.titleText.text,
              originalTitle: movieData.originalTitleText.text,
              releaseYear: movieData.releaseYear?.year,
              primaryImage: movieData.primaryImage?.url || null
            }
          });
        }
      }
    }

    res.json(moviesData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching movies data' });
  }
});

router.get('/movie/:id', async (req, res) => {
  const movieId = req.params.id;

  try {
    let movie = await prisma.movie.findUnique({
      where: { movieId: movieId }
    });

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
          primaryImage: movieData.primaryImage?.url
        }
      });
    }

    res.json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the movie details.' });
  }
});

export default router;