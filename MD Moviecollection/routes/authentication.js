// import express
import { Router } from "express";
import { signup, login } from "../controllers/authController.js";

// create router
const authenticationRouter = Router();

// create routes
authenticationRouter.post("/signup", signup);
authenticationRouter.post("/login", login);

// export router
export default authenticationRouter;
