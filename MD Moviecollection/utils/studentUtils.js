// a function to generate a new unique id
export const generateId = () => {
  if (movies.length === 0) return 1;
  return Math.max(...movies.map((movie) => movie.id)) + 1;
};

// a function to validate a movie
export const validate_movie = (movie) => {
  const { title, director, year } = movie;
  if (!title || !director || !year) {
    return "Missing required fields";
  }
  if (
    typeof title !== "string" ||
    typeof director !== "string" ||
    typeof year !== "number"
  ) {
    return "Invalid data type";
  }
  return null;
};
