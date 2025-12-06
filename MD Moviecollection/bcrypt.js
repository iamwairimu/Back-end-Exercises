// import bcrypt
import bcrypt from "bcrypt";

// the password
const password = "mySecret254";

const run = async () => {
  // hash the password
  const hash = await bcrypt.hash(password, 10);
  console.log("Hashed password: ", hash);

  // compare the password
  const isMatch = await bcrypt.compare(password, hash);
  console.log("Password match: ", isMatch);

  // compare the wrong password
  const wrongPassword = await bcrypt.compare("wrongPassword", hash);
  console.log("Password match: ", wrongPassword);
};

run();
