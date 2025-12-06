// import the getMovieCollection function
import { getMovieCollection } from "../config/dbConfig.js";

// A controller that returns all movies
export const getMovies = async (req, res) => {
  try {
    // get the movie collection
    const collection = await getMovieCollection();
    if (!collection) {
      console.error("Movie collection is not available");
      return res.status(500).json({ error: "Database not initialized" });
    }
    // find the movies
    const movies = await collection.find({}).toArray();
    let result = movies;
    // if title is provided, find movie by title
    if (req.query.title) {
      const title = req.query.title.toLowerCase();
      // return movie with the title
      result = result.filter(
        (movie) => movie.title && movie.title.toLowerCase().includes(title)
      );
    }
    // if director is provided, find movie by director
    if (req.query.director) {
      const director = req.query.director.toLowerCase();
      // return movie with the director
      result = result.filter(
        (movie) =>
          movie.director && movie.director.toLowerCase().includes(director)
      );
    }
    // if year is provided, find movie by year
    if (req.query.year) {
      const year = parseInt(req.query.year);
      // return movie with the year
      result = result.filter((movie) => movie.year === year);
    }
    // return result as JSON with ok 200
    res.json(result);
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ error: "Failed to fetch movies" }); // status code 500 meaning there is a server error
  }
};

// Controller function that returns a movie by id
export const getMovieById = async (req, res) => {
  try {
    // get the movie collection
    const collection = await getMovieCollection();
    if (!collection) {
      console.error("Movie collection is not available");
      return res.status(500).json({ error: "Database not initialized" });
    }
    // find the movie with the given id and return if found
    const id = parseInt(req.params.id);
    // Get the movie from MongoDB
    const movie = await collection.findOne({ id });
    if (movie) {
      res.json(movie); // return movie as JSON with ok 200
    } else {
      res.status(404).json({ error: "Movie not found" }); // return error as JSON with not found 404
    }
  } catch (error) {
    console.error("Error fetching movie:", error);
    res.status(500).json({ error: "Failed to fetch movie" }); // return error as JSON with internal server error 500
  }
};

// Controller function that creates a new movie
export const createMovie = async (req, res) => {
  try {
    // get the movie collection
    const collection = await getMovieCollection();
    if (!collection) {
      console.error("Movie collection is not available");
      return res.status(500).json({ error: "Database not initialized" });
    }
    // check if movie already exists
    const movie = await collection.findOne({ title: req.body.title });
    if (movie) {
      return res.status(400).json({ error: "Movie already exists" }); // return error as JSON with bad request 400
    }
    // Create the new movie
    const { title, director, year } = req.body;
    const newMovie = { title, director, year };
    // add movie to MongoDB
    const result = await collection.insertOne(newMovie);
    res.status(201).json({ id: result.insertedId }); // return movie as JSON with created 201
  } catch (error) {
    res.status(500).json({ error: "Failed to create new movie" }); // return error as JSON with internal server error 500
  }
};

// Controller function that updates a movie by id
export const updateMovie = async (req, res) => {
  try {
    const collection = await getMovieCollection(); // Add await here
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const { title, director, year } = req.body;
    const result = await collection.updateOne(
      { id },
      { $set: { title, director, year } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.json({ message: "Movie updated successfully" });
  } catch (error) {
    console.error("Error updating movie:", error);
    res.status(500).json({ error: "Failed to update movie" });
  }
};

// Controller function that deletes a movie by id
export const deleteMovie = async (req, res) => {
  try {
    const collection = await getMovieCollection(); // Add await here
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const result = await collection.deleteOne({ id });
    if (result.deletedCount === 0) {
      res.status(404).json({ error: "Movie not found" }); // return error as JSON with not found 404
    } else {
      res.status(204).send(); // return no content with no content 204
    }
  } catch (error) {
    console.error("Error deleting movie:", error);
    res.status(500).json({ error: "Failed to delete movie" }); // return error as JSON with internal server error 500
  }
};
