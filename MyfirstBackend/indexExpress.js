const express = require("express");
const { console } = require("node:inspector");

// create a server app
const app = express();

// define a port for the sever app
const PORT = 3000;

app, use(express.json()); // middleware to parse JSON bodies

// Lets have the student here in local data (later, in the database)
let students = [
  { id: 1, name: "Alice", creditPoints: 30 },
  { id: 2, name: "Bob", creditPoints: 25 },
  { id: 3, name: "Charlie", creditPoints: 28 },
];

// define the Rest endpoints (/ and /students)
// GET is basically fetching / reading from a server
app.get("/", (req, res) => {
  res.send("Hello from my Express app");
});

app.get("/students", (req, res) => {
  res.json(students);
});

// GET students by id
app.get("/students/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const student = students.find((s) => s.id === id);
  if (student) {
    res.json(student);
  } else {
    res.status(404).json({ message: "Student not found" });
  }
});

// post /students -> create a new student
app.post("/students", (req, res) => {
  const newStudent = req.body;
  // check validity of the data
  if (
    !newStudent.id ||
    !newStudent.name ||
    !newStudent.creditPoints === undefined
  ) {
    return res.status(400).json({ message: "Invalid student data" });
  }
  students.push(newStudent);
  consolele.log(newStudent);
  // return created status and the created student
  return res.status(201).json(newStudent);
});

// handle 404 for other routes
app.use((req, res) => {
  res.status(404).send("Oops! Not Found");
});
// Start the server
app.listen(PORT, () => {
  console.log(`My Node Express server running at http://localhost:${PORT}`);
});
