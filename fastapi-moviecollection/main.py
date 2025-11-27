# Create a FastAPI server
from fastapi import FastAPI, HTTPException # HTTPException is used for error handling
from fastapi.responses import HTMLResponse # HTMLResponse is used for returning HTML responses
 
# Then create an app
app = FastAPI()

# A dictionary of movies collection, in python objects are dictionaries
movies = [
  { "id": 1, "title": "Inception", "director": "Christopher Nolan", "year": 2010 },
  { "id": 2, "title": "The Matrix", "director": "The Wachowskis", "year": 1999 },
  { "id": 3, "title": "Parasite", "director": "Bong Joon-ho", "year": 2019 },
]

# Helper function for generating the next id
def next_id():
    if len(movies) == 0:
        return 1
    return max(movie["id"] for movie in movies) + 1 # Generate the next id by finding the maximum id in the movies list and adding 1

# GET / this is the root endpoint
@app.get("/")
def index():
    html = "<h2>Movies</h2><ul>"
    for movie in movies:
        html += (f"<li>{movie['title']} by {movie['director']} ({movie['year']})</li>")
    html += "</ul>"
    return HTMLResponse(content=html)

# GET /movies and filter by the title, director, or year using query parameters
@app.get("/movies")
def get_movies(title: str = None, director: str = None, year: int = None): # Query parameters are optional
    result = movies.copy() # Copy the movies list to avoid modifying the original list
    
    if title:
        # filter movie with the specific title
        result = [movie for movie in result if movie["title"].lower() == title.lower()]
    if director:
        # filter movie with the specific director
        result = [movie for movie in result if movie["director"].lower() == director.lower()]
    if year:
        # filter movie with the specific year
        result = [movie for movie in result if movie["year"] == year]
    
    return result
    
# GET /movies/{id} and return the movie with the specific id
@app.get("/movies/{id}")
def get_movie(id: int):
    for movie in movies:
        if movie["id"] == id:
            return movie 
    raise HTTPException(status_code=404, detail="Movie not found")  # Return a 404 error if the movie is not found

# POST /movies and add a new movie to the dictionary
@app.post("/movies", status_code=201)
def add_movie(movie: dict):
    error = validate_movie(movie)
    if error:
        raise HTTPException(status_code=400, detail=error) # Return a 400 error if the movie is not valid
    # Check if the movie already exists
    for m in movies:
        if m["title"] == movie["title"]:
            raise HTTPException(status_code=400, detail="Movie already exists") # Return a 400 error if the movie already exists
    movie["id"] = next_id() # Generate the next id
    movies.append(movie) # Add the movie to the movies list
    return movie

# PUT /movies/{id} and update the movie with the specific id
@app.put("/movies/{id}")
def update_movie(id: int, movie: dict):
    error = validate_movie(movie)
    if error:
        raise HTTPException(status_code=400, detail=error) # Return a 400 error if the movie is not valid
    for m in movies:
        if m["id"] == id: # Check if the movie exists
            m["title"] = movie["title"] # Update the movie title
            m["director"] = movie["director"] # Update the movie director
            m["year"] = movie["year"] # Update the movie year
            error = validate_movie(m)
            if error:
                raise HTTPException(status_code=400, detail=error) # Return a 400 error if the movie is not valid
            return m
    raise HTTPException(status_code=404, detail="Movie not found") # Return a 404 error if the movie is not found   

# DELETE /movies/{id} and delete the movie with the specific id
@app.delete("/movies/{id}")
def delete_movie(id: int):
    for m in movies:
        if m["id"] == id: # Check if the movie exists
            movies.remove(m) # Remove the movie from the movies list
            return { "message": "Movie deleted" }
    raise HTTPException(status_code=404, detail="Movie not found") # Return a 404 error if the movie is not found   

# validation function
def validate_movie(movie: dict):
    if not movie["title"] or not movie["director"] or not movie["year"]:
        return "Missing required fields"
    # if no error is found, return None
    return None 
