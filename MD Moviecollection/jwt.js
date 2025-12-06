// import jwt
import jwt from "jsonwebtoken";

// secret token
const JWT_SECRET = "my_secret_key254";

// create token
const token = jwt.sign({ id: 1, username: "test" }, JWT_SECRET, {
  expiresIn: "1h",
});
console.log("Token: ", token);

// verify token
const decoded = jwt.verify(token, JWT_SECRET);
console.log("Decoded token: ", decoded);
