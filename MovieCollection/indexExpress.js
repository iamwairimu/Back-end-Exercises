const express = require("express");
const morgan = require("morgan");

// create express app
const app = express();

// define the port for the server app
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Use Morgan for logging in development mode
app.use(morgan("dev"));

// Default data structure
let movies = [
  { id: 1, title: "Inception", director: "Christopher Nolan", year: 2010 },
  { id: 2, title: "The Matrix", director: "The Wachowskis", year: 1999 },
  { id: 3, title: "Parasite", director: "Bong Joon-ho", year: 2019 },
];

// Define the Rest endpoint / which is to return all movies as an HTML list
app.get("/", (req, res) => {
  let html = "<h2>Movies</h2><ul>";
  movies.forEach((movie) => {
    html += `<li>${movie.title} by ${movie.director} (${movie.year})</li>`;
  });
  html += "</ul>";
  res.send(html);
});

// Define the Rest endpoint /movies which is to return all movies as JSON, with optional filtering
app.get("/movies", (req, res) => {
  let filteredMovies = movies;

  // Filter by title (case-insensitive partial match)
  if (req.query.title) {
    filteredMovies = filteredMovies.filter((movie) =>
      movie.title.toLowerCase().includes(req.query.title.toLowerCase())
    );
  }

  // Filter by year (exact match)
  if (req.query.year) {
    const year = parseInt(req.query.year);
    if (!isNaN(year)) {
      filteredMovies = filteredMovies.filter((movie) => movie.year === year);
    }
  }

  // Filter by director (case-insensitive partial match)
  if (req.query.director) {
    filteredMovies = filteredMovies.filter((movie) =>
      movie.director.toLowerCase().includes(req.query.director.toLowerCase())
    );
  }

  res.json(filteredMovies);
});

// POST /movies -> create a new movie
app.post("/movies", (req, res) => {
  const newMovie = req.body;
  // Validating the title, director, and year are present and valid
  if (
    !newMovie.title ||
    typeof newMovie.title !== "string" ||
    newMovie.title.trim() === "" ||
    !newMovie.director ||
    typeof newMovie.director !== "string" ||
    newMovie.director.trim() === "" ||
    !newMovie.year ||
    typeof newMovie.year !== "number" ||
    newMovie.year < 1996
  ) {
    return res
      .status(400) // status code 400 -> bad request
      .json({
        message: "Invalid data",
      });
  }
  // Auto-generate ID
  const newId =
    movies.length > 0 ? Math.max(...movies.map((m) => m.id)) + 1 : 1;
  const movieToAdd = { id: newId, ...newMovie };
  movies.push(movieToAdd);
  return res.status(201).json(movieToAdd); // status code 201 -> created
});

// GET movies by id
app.get("/movies/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  const movie = movies.find((m) => m.id === id);
  if (movie) {
    res.json(movie);
  } else {
    res.status(404).json({ error: "Movie not found" }); // status code 404 -> not found
  }
});

// PUT /movies/:id -> update a movie by id
app.put("/movies/:id", (req, res) => {
  const id = parseInt(req.params.id); // get the id from the request parameters
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  const updatedMovie = req.body; // get the updated movie from the request body
  const movieIndex = movies.findIndex((m) => m.id === id); // find the index of the movie to update
  if (movieIndex !== -1) {
    // Validating the title, director, and year are not empty
    if (
      !updatedMovie.title ||
      typeof updatedMovie.title !== "string" ||
      updatedMovie.title.trim() === "" ||
      !updatedMovie.director ||
      typeof updatedMovie.director !== "string" ||
      updatedMovie.director.trim() === "" ||
      !updatedMovie.year ||
      typeof updatedMovie.year !== "number" ||
      updatedMovie.year < 1996
    ) {
      return res.status(400).json({
        message: "Invalid data",
      }); // status code 400 -> bad request
    }
    // Preserve the ID
    movies[movieIndex] = { id, ...updatedMovie };
    res.json(movies[movieIndex]);
  } else {
    res.status(404).json({ error: "Movie not found" }); // status code 404 -> not found
  }
});

// DELETE /movies/:id -> delete a movie by id
app.delete("/movies/:id", (req, res) => {
  const id = parseInt(req.params.id); // get the id from the request parameters
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  const movieIndex = movies.findIndex((m) => m.id === id); // find the index of the movie to delete
  if (movieIndex !== -1) {
    movies.splice(movieIndex, 1); // delete the movie
    res.sendStatus(204); // status code 204 -> no content
  } else {
    res.status(404).json({ error: "Movie not found" }); // status code 404 -> not found
  }
});

// Catch-all route for 404
app.use((req, res) => {
  res.status(404).send("Oops! Not found");
});

// Start the server
app.listen(port, () => {
  console.log(`My Node Express server running at http://localhost:${port}`);
});
