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

// POST /users
app.post("/users", requireAuth, async (req, res) => {
  try {
    const { email, name, address } = req.body;
    const newUser = await User.create({
      data: {
        email,
        name,
        address: {
          create: address
        }
      }
    });
    res.json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/users", requireAuth, async (req, res) => {
  try {
    const users = await User.findMany({
      include: {
        address: true
      }
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/users/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findUnique({
      where: { id },
      include: {
        address: true,
        posts: true
      }
    });
    res.json(user);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

app.put("/users/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name, address } = req.body;
    const updatedUser = await User.update({
      where: { id },
      data: {
        email,
        name,
        address: {
          upsert: {
            create: address,
            update: address
          }
        }
      }
    });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(8000, () => {
  console.log("Server running on http://localhost:8000 🎉 🚀");
});


