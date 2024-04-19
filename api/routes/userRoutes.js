import express from "express";
import pkg from "@prisma/client";
import { requireAuth } from "../middleware.js";
const router = express.Router();
const { PrismaClient } = pkg;
const prisma = new PrismaClient();
const { User } = prisma;

router.post("/users/auth", async (req, res) => {
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

router.put("/users/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
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

export default router;