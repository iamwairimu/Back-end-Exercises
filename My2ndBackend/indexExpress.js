// Part 1: The General part
// Server startup, PORT, basic middleware

const express = require("express");
const morgan = require("morgan");
// Create a server app
const app = express();
// Define a port for the server app
const PORT = 3000;

// use json in express
app.use(express.json());

// use morgan middleware for logging
app.use(morgan("dev"));

// Start the server
app.listen(PORT, () => {
  console.log("My Node Express server running at http://localhost:3000");
});

// Part 2: The data (should be in the db etc. in real apps (later))
// Let's have the student here in local data (later, in the database)
let students = [
  { id: 1, name: "Tony", age: 24, creditPoints: 100, campus: "Kauppi" },
  { id: 2, name: "Kalle", age: 20, creditPoints: 30, campus: "Hervanta" },
  { id: 3, name: "Maija", age: 21, creditPoints: 120, campus: "Center" },
];

// Define valid campuses somewhere in top level (for data validation)
const validCampuses = ["Kauppi", "Hervanta", "Center"];

// Define the Rest Endpoints - The REST API itself
// GET is basically fetching / Reading from a server
app.get("/", (req, res) => {
  let html = "<b>Student management app V1 (in-memory JSON)</b><ul>";
  students.forEach((student) => {
    html += `<li>Name: ${student.name}, Age: ${student.age}, Credit points: ${student.creditPoints}, Campus: ${student.campus}</li>`;
  });
  html += "</ul>";
  res.send(html);
});

// If you don't return a status code, 200 will be the default
// Todo: add possible filters (by campus, by credit points, by name etc....)
app.get("/students", (req, res) => {
  // Support query parameters by name, by minimun credit units or by campus
  // Let's define the result, which is all students by default
  let result = [...students]; // all students by default (spread operator)
  // Check and filter by query parameters
  if (req.query.campus) {
    const campus = req.query.campus.toLowerCase();
    // return students only from that campus
    result = result.filter(
      (student) => student.campus.toLowerCase() === campus
    );
  }

  if (req.query.creditPointsMin) {
    const min = parseInt(req.query.creditPointsMin);
    if (isNaN(min)) {
      return res
        .status(400)
        .send("Invalid credit points in the query parameter");
    }
    result = result.filter((student) => student.creditPoints >= min);
  }

  if (req.query.name) {
    const name = req.query.name.toLowerCase();
    result = result.filter((student) => student.name.toLowerCase() === name);
  }

  console.log("Returning filtered students");
  res.json(result);
});

// Todo: Let's add get methods to Get student by id (GET by parameter id) and create a new student (POST with a new student id)
app.get("/students/:id", (req, res) => {
  // Find the student with the given id and return if found
  const id = parseInt(req.params.id);
  const student = students.find((student) => student.id == id);
  if (student) {
    res.json(student); // 200 OK
  } else {
    res.status(404).json({ message: "Student with that id not found" });
  }
});

// Post /students -> add new student. When posting, we need to validate the data (e.g. unique id, legal name and positive credit points etc.)
app.post("/students", (req, res) => {
  // validate the student through a validation function (validates the data)
  const error = validateStudentData(req.body);
  if (error) {
    return res.status(400).send(error); // invalid data
  }

  // Ok. We can proceed with creating a new student
  const { name, age, creditPoints, campus } = req.body;
  const newStudent = {
    id: generateNextId(),
    name,
    age,
    campus,
    creditPoints, // todo: generate a new one
  };

  // add the new student to students list
  students.push(newStudent);
  res.status(201).json(newStudent);
});

// A function to generate a new, unique ID
function generateNextId() {
  if (students.length === 0) return 1;
  // find a current max id and add a new one, which will be the max + 1
  return Math.max(...students.map((student) => student.id)) + 1;
}

// Our data validation helper function in JavaScript
function validateStudentData(student) {
  // Destruct the student object properties (check ES6+ object destruct)
  // Modern way ES 6+ object destruct in one row
  const { name, age, creditPoints, campus } = student;

  if (!name || typeof name !== "string") return "Invalid or missing 'name'";
  if (age === undefined || typeof age !== "number" || age < 0)
    return "Invalid or missing 'age'";
  if (!campus || !validCampuses.includes(campus))
    return "Invalid or missing 'campus'";
  // Todo: more rules if needed

  return null; // the data is valid :)
}

// Update a student data (student with a specific id)
app.put("/students/:id", (req, res) => {
  const id = parseInt(req.params.id);
  // First verify that the id is an integer
  if (isNaN(id)) return res.status(400).send("Invalid student ID");

  // Let's find the student with that ID. If not found, return 404
  const index = students.findIndex((student) => student.id === id);
  if (index === -1) {
    return res.status(404).send("No student with that ID found");
  }

  // The student with that id found -> we can proceed with updating but we have to validate :)
  const updatedStudent = { ...students[index], ...req.body };

  // Let's validate the updated student data
  const error = validateStudentData(updatedStudent);
  if (error) {
    return res.status(400).send(error);
  }

  // Let's replace the old info with the new info to the array
  student[index] = updatedStudent;
  res.json(updatedStudent); // 200 OK
});

// Delete student by id
app.delete("/students/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).send("Invalid student ID");

  const index = students.findIndex((s) => s.id === id);

  if (index === -1) {
    return res.status(404).send("No student with that ID found");
  }

  // The student exists -> delete it from the array. We use splice function of JS
  students.splice(index, 1);
  res.status(204).end();
});

// 404 fallback for all other routes (non-specific routes)
app.use((req, res) => {
  res.status(404).send("Oops. Not found!");
});
