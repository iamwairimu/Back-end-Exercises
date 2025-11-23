const http = require("http");

// We create a web server with node http library (without Express etc)
const server = http.createServer((req, res) => {
  // Here we define how do the server respond to requests
  // if request path is / and the method is GET
  if (req.url === "/" && req.method === "GET") {
    res.statusCode = 200; // OK
    res.setHeader("Content-Type", "text/plain");
    res.end("Hello from my server");
  } else if (req.url === "/students" && req.method === "GET") {
    // return some json data maybe (from a db or locally...)
    const students = [
      { id: 1, name: "Alice", creditPoints: 30 },
      { id: 2, name: "Bob", creditPoints: 25 },
      { id: 3, name: "Charlie", creditPoints: 28 },
    ];
    // return students as JSON to the client
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(students));
  } else {
    res.statusCode = 404;
    res.end("Oops! Not Found");
  }
});

// Start the server listening at port 3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running at port 3000`);
});
