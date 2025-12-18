const Recipe = require("../models/Recipe");
const {
  createRecipeSchema,
  updateRecipeSchema,
} = require("../validation/recipeValidation");

// Get all recipes
const getAllRecipes = async (req, res) => {
  try {
    const { title, category, prepTime } = req.query;
    let query = {};
    if (title) query.title = { $regex: title, $options: "i" };
    if (category) query.category = category;
    if (prepTime) query.prepTime = { $lte: parseInt(prepTime) };

    const recipes = await Recipe.find(query).populate("createdBy", "username");
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single recipe by ID
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate(
      "createdBy",
      "username"
    );
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new recipe
const createRecipe = async (req, res) => {
  try {
    const { error } = createRecipeSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const recipe = new Recipe({
      ...req.body,
      createdBy: req.user.id,
    });
    await recipe.save();
    res.status(201).json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a recipe
const updateRecipe = async (req, res) => {
  try {
    const { error } = updateRecipeSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    if (recipe.createdBy.toString() !== req.user.id)
      return res.status(403).json({ error: "Unauthorized" });

    Object.assign(recipe, req.body);
    await recipe.save();
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a recipe
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    if (recipe.createdBy.toString() !== req.user.id)
      return res.status(403).json({ error: "Unauthorized" });

    await recipe.remove();
    res.json({ message: "Recipe deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};
