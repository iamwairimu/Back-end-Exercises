import Joi from "joi";

const movieSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  director: Joi.string().min(3).max(100).required(),
  year: Joi.number().integer().min(1900).max(2030).required(),
});

// middleware to validate movie
const validateMovie = (req, res, next) => {
  const { error } = movieSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export default validateMovie;
