import { Router } from "express";
import {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} from "../controllers/movieController.js";
import validateMovie from "../middleware/validateMovie.js";
import logger from "../middleware/logger.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

// Create the router
const router = Router();

// Define all REST Endpoints for the movies and add middleware for validation and logging
router.get("/", logger, getMovies);
router.get("/:id", authenticateToken, getMovieById);
router.post("/", validateMovie, createMovie);
router.put("/:id", validateMovie, updateMovie);
router.delete("/:id", deleteMovie);

export default router;
