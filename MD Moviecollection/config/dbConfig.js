// configuration code for the mongoDB
import { MongoClient } from "mongodb";
import "dotenv/config";

// log the uri and db name because it is hidden in the logs
console.log("MongoDB URI:", process.env.MONGODB_URI ? "Found" : "Missing");
console.log("DB Name:", process.env.MONGODB_DBNAME || "Not set");

// Read environment variables
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DBNAME;

//validation
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

// Create a new MongoClient
const client = new MongoClient(uri);

let db;
let movieCollection;
// the movies data collection
const movies = [
  { id: 1, title: "Inception", director: "Christopher Nolan", year: 2010 },
  { id: 2, title: "The Matrix", director: "The Wachowskis", year: 1999 },
  { id: 3, title: "Parasite", director: "Bong Joon-ho", year: 2019 },
];

// function to connect to MongoDB and seed data if the collection is empty
export const initialDatabase = async () => {
  try {
    await client.connect(); // Connect to MongoDB
    console.log("Connected to MongoDB");

    db = client.db(dbName); // create database
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
};

// function to get the database
export const getDatabase = () => db;
// function to get the movie collection
export const getMovieCollection = () => movieCollection;
