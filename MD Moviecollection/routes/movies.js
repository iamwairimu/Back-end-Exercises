import { Router } from "express";
import { getMovies } from "../controllers/movieController";
import { getMovieById } from "../controllers/movieController";
import { createMovie } from "../controllers/movieController";
import { updateMovie } from "../controllers/movieController";
import { deleteMovie } from "../controllers/movieController";
import { validateMovie } from "../middleware/validateMovie";
import { logger } from "../middleware/logger";

// Create the router
const router = Router();

// Define all REST Endpoints for the movies and add middleware for validation and logging
router.get("/", logger, getMovies);
router.get("/:id", getMovieById);
router.post("/", validateMovie, createMovie);
router.put("/:id", validateMovie, updateMovie);
router.delete("/:id", deleteMovie);

export default router;
