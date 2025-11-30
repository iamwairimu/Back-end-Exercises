// access .env file
import dotenv from "dotenv";
dotenv.config();

// import express and mongodb
import express from "express";
import { MongoClient } from "mongodb";

// create express app
const app = express();
app.use(express.json());

// Read environment variables
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Problem with uri");
  process.exit(1);
}

const dbName = process.env.MONGODB_DBNAME;
const port = process.env.PORT;

// Connect to MongoDB
const client = new MongoClient(uri);

// the movies data collection
const movies = [
  { id: 1, title: "Inception", director: "Christopher Nolan", year: 2010 },
  { id: 2, title: "The Matrix", director: "The Wachowskis", year: 1999 },
  { id: 3, title: "Parasite", director: "Bong Joon-ho", year: 2019 },
];

let movieCollection;
// function to connect to MongoDB and seed data if the collection is empty
async function initialDatabase() {
  try {
    await client.connect(); // Connect to MongoDB
    console.log("Connected to MongoDB");

    const db = client.db(dbName); // create database
    movieCollection = db.collection("movies"); // create collection

    //check if collection is empty
    const count = await movieCollection.countDocuments();
    if (count === 0) {
      const result = await movieCollection.insertMany(movies); // insert data
      console.log("Movies created successfully");
    } else {
      console.log("Data already exists");
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

await initialDatabase();

// start the server
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

// GET all movies
// Also using async as DB connection is over the cloud
app.get("/movies", async (req, res) => {
  try {
    const movies = await movieCollection.find({}).toArray();
    let result = movies;
    // if title is provided, find movie by title
    if (req.query.title) {
      const title = req.query.title.toLowerCase();
      // return movie with the title
      result = result.filter((movie) => movie.title.toLowerCase() === title);
    }
    // if director is provided, find movie by director
    if (req.query.director) {
      const director = req.query.director.toLowerCase();
      // return movie with the director
      result = result.filter(
        (movie) => movie.director.toLowerCase() === director
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
});

// GET /movies/:id
app.get("/movies/:id", async (req, res) => {
  try {
    // find the movie with the given id and return if found
    const id = parseInt(req.params.id);
    // Get the movie from MongoDB
    const movie = await movieCollection.findOne({ id });
    if (movie) {
      res.json(movie); // return movie as JSON with ok 200
    } else {
      res.status(404).json({ error: "Movie not found" }); // return error as JSON with not found 404
    }
  } catch (error) {
    console.error("Error fetching movie:", error);
    res.status(500).json({ error: "Failed to fetch movie" }); // return error as JSON with internal server error 500
  }
});

// POST /movies
app.post("/movies", async (req, res) => {
  try {
    // validate movie
    const error = validate_movie(req.body);
    if (error) {
      return res.status(400).json({ error }); // return error as JSON with bad request 400
    }
    // check if movie already exists
    const movie = await movieCollection.findOne({ title: req.body.title });
    if (movie) {
      return res.status(400).json({ error: "Movie already exists" }); // return error as JSON with bad request 400
    }
    // Create the new movie
    const { title, director, year } = req.body;
    const newMovie = { title, director, year };
    // add movie to MongoDB
    const result = await movieCollection.insertOne(newMovie);
    res.status(201).json({ id: result.insertedId }); // return movie as JSON with created 201
  } catch (error) {
    res.status(500).json({ error: "Failed to create new movie" }); // return error as JSON with internal server error 500
  }
});

// PUT /movies/:id
app.put("/movies/:id", async (req, res) => {
  try {
    // find the movie with the given id and update if found
    const id = parseInt(req.params.id);
    if (isNaN(!id)) return res.status(400).json({ error: "Invalid id" }); // return error as JSON with bad request 400
    // Update the movie in MongoDB
    const existing = await movieCollection.updateOne(
      { id },
      { $set: req.body }
    );
    if (!existing) return res.status(404).json({ error: "Movie not found" }); // return error as JSON with not found 404
    // update and validate
    const updatedMovie = { ...existing, ...req.body };
    const error = validate_movie(updatedMovie);
    if (error) {
      return res.status(400).json({ error }); // return error as JSON with bad request 400
    }
    // delete the id as we won't update it
    delete updatedMovie._id;
    await movieCollection.updateOne({ id }, { $set: updatedMovie });
    res.status(200).json(updatedMovie); // return updated movie as JSON with ok 200
  } catch (error) {
    console.error("Error updating movie:", error);
    res.status(500).json({ error: "Failed to update movie" }); // return error as JSON with internal server error 500
  }
});

// DELETE /movies/:id
app.delete("/movies/:id", async (req, res) => {
  try {
    // find the movie with the given id and delete if found
    const id = parseInt(req.params.id);
    if (isNaN(!id)) return res.status(400).json({ error: "Invalid id" }); // return error as JSON with bad request 400
    // Delete the movie from MongoDB
    const result = await movieCollection.deleteOne({ id });
    if (result.deletedCount === 0) {
      res.status(404).json({ error: "Movie not found" }); // return error as JSON with not found 404
    } else {
      res.status(204).send(); // return no content with no content 204
    }
  } catch (error) {
    console.error("Error deleting movie:", error);
    res.status(500).json({ error: "Failed to delete movie" }); // return error as JSON with internal server error 500
  }
});
