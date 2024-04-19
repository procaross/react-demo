import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

import pingRoutes from "./routes/pingRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

app.use("/", pingRoutes);
app.use("/", movieRoutes);
app.use("/", userRoutes);
app.use("/", favoriteRoutes);
app.use("/", commentRoutes);

app.listen(8000, () => {
  console.log("Server running on http://localhost:8000 🎉 🚀");
});