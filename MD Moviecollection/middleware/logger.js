// middleware to log requests
const logger = (req, res, next) => {
  console.log("Logging request");
  next();
};

export default logger;
