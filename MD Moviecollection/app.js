// access environment variables
import "dotenv/config";

// import express and routes
import express from "express";
import moviesRouter from "./routes/movies.js";
import { getDatabase } from "./config/dbConfig.js";
import authenticationRouter from "./routes/authentication.js";

// Create express app
const app = express();
app.use(express.json());

// Initialize database and start server
const startServer = async () => {
  try {
    // Initialize database first
    await getDatabase();
    console.log("Database initialized successfully");

    // Set up routes
    app.use("/movies", moviesRouter);
    app.use("/auth", authenticationRouter);

    // 404 handler
    app.use((req, res) => {
      res.status(404).send("Not found");
    });

    // Start the server
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Start the application
startServer();
