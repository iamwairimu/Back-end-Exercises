// configuration code for the mongoDB
import { MongoClient } from "mongodb";
import "dotenv/config";

// log the uri and db name because it is hidden in the logs
console.log("MongoDB URI:", process.env.MONGODB_URI ? "Found" : "Missing");
console.log("DB Name:", process.env.MONGODB_DBNAME || "Not set");

// Read environment variables
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DBNAME;

// validation
if (!uri) {
  console.error("MONGODB_URI is not defined in environment variables");
  process.exit(1);
}

if (!dbName) {
  console.error("MONGODB_DBNAME is not defined in environment variables");
  process.exit(1);
}

console.log(
  "Connecting to MongoDB with URI:",
  uri.replace(/\/\/[^:]+:[^@]+@/, "//***:***@")
); // Hide credentials in logs
console.log("Using database:", dbName);

// Create a new MongoClient with connection pooling
const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  maxPoolSize: 10, // Maintain up to 10 socket connections
  retryWrites: true,
  w: "majority",
});

let db = null;
let movieCollection = null;
let isConnected = false;

// the movies data collection
const movies = [
  { id: 1, title: "Inception", director: "Christopher Nolan", year: 2010 },
  { id: 2, title: "The Matrix", director: "The Wachowskis", year: 1999 },
  { id: 3, title: "Parasite", director: "Bong Joon-ho", year: 2019 },
];

// Function to connect to MongoDB and seed data if the collection is empty
export const initialDatabase = async () => {
  if (isConnected) {
    console.log("Using existing database connection");
    return;
  }

  try {
    await client.connect(); // Connect to MongoDB
    isConnected = true;
    console.log("Connected to MongoDB");

    db = client.db(dbName);
    movieCollection = db.collection("movies");

    // Create index on id field for faster lookups
    await movieCollection.createIndex({ id: 1 }, { unique: true });

    // Check if collection is empty
    const count = await movieCollection.countDocuments();
    if (count === 0) {
      console.log("Seeding initial movie data...");
      const result = await movieCollection.insertMany(movies);
      console.log(`Successfully seeded ${result.insertedCount} movies`);
    } else {
      console.log(`Found ${count} existing movies in the collection`);
    }

    return { db, movieCollection };
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    // Close the connection if there's an error
    await client.close();
    isConnected = false;
    throw error;
  }
};

// Function to get the database
export const getDatabase = async () => {
  if (!isConnected) {
    await initialDatabase();
  }
  if (!db) {
    throw new Error("Database connection failed");
  }
  return db;
};

// Function to get the movie collection
export const getMovieCollection = async () => {
  if (!isConnected || !movieCollection) {
    await initialDatabase();
  }
  if (!movieCollection) {
    throw new Error("Failed to initialize movie collection");
  }
  return movieCollection;
};

// Graceful shutdown handler
process.on("SIGINT", async () => {
  if (isConnected) {
    await client.close();
    console.log("MongoDB connection closed");
    process.exit(0);
  }
});
