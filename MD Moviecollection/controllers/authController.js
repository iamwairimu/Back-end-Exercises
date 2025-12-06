import bcrypt from "bcrypt";
import { users, getNextUserId } from "../data/mockUsers.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config.js";

// signup controller function
export const signup = async (req, res) => {
  // get the username and password from the request body
  const { username, password } = req.body;

  // check if the username and password are provided
  if (!username || !password)
    return res
      .status(400) // 400 = bad request
      .json({ error: "username and password are required" });

  // check if the user exists
  const existing = users.find((u) => u.username === username);
  if (existing)
    return res.status(409).json({ error: "username is already taken" }); // 409 = conflict

  // hash the password
  const passwordHash = await bcrypt.hash(password, 10);

  // create the new user
  const newUser = { id: getNextUserId(), username, passwordHash };
  users.push(newUser);

  console.log("Users now: ", users);

  // return the new username
  res.status(201).json({ id: newUser.id, username: newUser.username }); // 201 = created
};

// login controller function
export const login = async (req, res) => {
  // get the username and password from the request body
  const { username, password } = req.body;
  // check if the username and password are provided
  if (!username || !password)
    return res
      .status(400) // 400 = bad request
      .json({ error: "username and password are required" });

  // check if the user exists
  const user = users.find((u) => u.username === username);
  if (!user) return res.status(401).json({ error: "invalid credentials" }); // 401 = unauthorized

  // check if the password is correct
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid)
    return res.status(401).json({ error: "invalid credentials" });

  // create a payload
  const payload = { id: user.id, username: user.username };

  // create a token
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

  console.log("Bearer token: ", token);

  // return the token
  res.status(200).json({ token });

  console.log("User logged in successfully");
};
