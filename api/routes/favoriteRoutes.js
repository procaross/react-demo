import express from "express";
import pkg from "@prisma/client";
import { requireAuth } from "../middleware.js";
const router = express.Router();
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

router.post('/favorites', requireAuth, async (req, res) => {
  const { movieId } = req.body;
  const userId = parseInt(req.body.userId, 10);
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

router.get('/favorites', requireAuth, async (req, res) => {
  const userId = parseInt(req.query.userId, 10);

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

router.delete('/favorites', requireAuth, async (req, res) => {
  const { movieId } = req.body;
  const userId = parseInt(req.body.userId, 10);
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

router.get('/isFavorite', requireAuth, async (req, res) => {
  const userId = parseInt(req.query.userId, 10);
  const movieId = req.query.movieId;

  if (!userId || !movieId) {
    return res.status(400).json({ error: 'Missing userId or movieId' });
  }

  try {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_movieId: {
          userId,
          movieId,
        },
      },
    });

    res.json({ isFavorite: !!favorite });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while checking the favorite status' });
  }
});

export default router;