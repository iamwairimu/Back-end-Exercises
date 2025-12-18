const express = require("express");
const {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} = require("../controllers/recipeController");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();

// Public routes (authenticated users only)
router.get("/", auth, getAllRecipes); // All authenticated users
router.get("/:id", auth, getRecipeById);

// Admin only routes
router.post("/", auth, admin, createRecipe);
router.put("/:id", auth, admin, updateRecipe);
router.delete("/:id", auth, admin, deleteRecipe);

module.exports = router;
