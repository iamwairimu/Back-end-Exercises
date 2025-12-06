import jwt from "jsonwebtoken";

const JWT_SECRET = "my_secret_key254";

// authenticate token
export const authenticateToken = (req, res, next) => {
  // get the token from the header
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.sendStatus(400).json({ error: "Invalid token" }); // return error if no token
  }

  // get the token
  const token = authHeader.substring(7); // remove the "Bearer " prefix

  // verify the token
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(401).json({ error: "Invalid token" });
    }

    // add the user to the request
    req.user = user;
    next();
  });
};
