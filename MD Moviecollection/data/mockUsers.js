// import bcrypt
import bcrypt from "bcrypt";

// array of users
export const users = [
  {
    id: 1,
    username: "pigglet",
    role: "regular",
    password: bcrypt.hashSync("mypassword", 10),
  },
  {
    id: 2,
    username: "bacon",
    role: "Admin",
    password: bcrypt.hashSync("mypassword", 10),
  },
];

// the next id
let nextId = 3;
export const getNextUserId = () => nextId++;
