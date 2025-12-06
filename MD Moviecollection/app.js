// access environment variables
import "dotenv/config";

// import express and routes
import express from "express";
import moviesRouter from "./routes/movies.js";
import { getDatabase } from "./config/dbConfig.js";
import authenticationRouter from "./routes/authentication.js";

// initialize the database
await getDatabase();

// create express app
const app = express();
app.use(express.json());

// use middleware
app.use("/movies", moviesRouter);
app.use("/auth", authenticationRouter);

// Read environment variables
const port = process.env.PORT;

// 404 fallback
app.use((req, res) => {
  res.status(404).send("Not found");
});

// start the server
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
