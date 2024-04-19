import express from "express";
import pkg from "@prisma/client";
const router = express.Router();
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

router.get('/users/:userId/commented-movies', async (req, res) => {
  const { userId } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: { userId: parseInt(userId) },
      include: {
        movie: true,
      },
    });

    const commentedMovies = comments.map(comment => comment.movie);
    res.json(commentedMovies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching commented movies' });
  }
});

router.post('/movies/:movieId/comments', async (req, res) => {
  const { movieId } = req.params;
  const { content } = req.body;
  const userId = parseInt(req.body.userId, 10);

  try {
    const movie = await prisma.movie.findUnique({
      where: { movieId: movieId },
    });

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        userId,
        movieId: movie.id,
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating a comment' });
  }
});

router.get('/movies/:movieId/comments', async (req, res) => {
  const { movieId } = req.params;

  try {
    const movie = await prisma.movie.findUnique({
      where: { movieId: movieId },
      include: {
        comments: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.json(movie.comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching comments' });
  }
});

router.delete('/comments/:commentId', async (req, res) => {
  const { commentId } = req.params;
  const userId = parseInt(req.body.userId, 10);

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(commentId) },
    });

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    if (comment.userId !== userId) {
      return res.status(403).json({ error: 'You are not authorized to delete this comment' });
    }

    await prisma.comment.delete({
      where: { id: comment.id },
    });

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting the comment' });
  }
});

export default router;