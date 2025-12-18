const Joi = require("joi");

const createRecipeSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  ingredients: Joi.array().items(Joi.string().min(1)).min(1).required(),
  instructions: Joi.string().min(10).required(),
  category: Joi.string().valid("vegan", "quick", "dessert").optional(),
  prepTime: Joi.number().integer().min(1).required(),
});

const updateRecipeSchema = Joi.object({
  title: Joi.string().min(3).max(100).optional(),
  ingredients: Joi.array().items(Joi.string().min(1)).optional(),
  instructions: Joi.string().min(10).optional(),
  category: Joi.string().valid("vegan", "quick", "dessert").optional(),
  prepTime: Joi.number().integer().min(1).optional(),
}).min(1);

module.exports = { createRecipeSchema, updateRecipeSchema };
