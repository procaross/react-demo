import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import { auth } from "express-oauth2-jwt-bearer";

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


app.listen(8000, () => {
  console.log("Server running on http://localhost:8000 🎉 🚀");
});


