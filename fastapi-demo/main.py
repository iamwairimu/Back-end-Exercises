# Let's create a FastAPI server. FastAPI <=> Express
from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
 
# We do just like we did with Express. Create an app.
app = FastAPI()
 
# In Python the equivalent is a dictionary
students = [
    { "id": 1, "name": 'Tony', "age": 24, "creditPoints": 100, "campus": "Kauppi"},
    { "id": 2, "name": 'Kalle', "age": 20, "creditPoints": 30, "campus": "Hervanta"},
    { "id": 4, "name": 'Maija', "age": 21, "creditPoints": 120, "campus": "Center"},
]
 
validCampuses = ["Kauppi", "Hervanta", "Center"]  # this is almost like in JS
 
def generate_next_id():
    if len(students) == 0:
        return 1
    return max(student["id"] for student in students) + 1
 
 
# Write some REST endpoints. Basic get for root.
@app.get("/", response_class=HTMLResponse)
def read_root():
    html = "<b>Student management app Version 1 with Fast API</b><ol>"
    for student in students:
        html += (
            f"<li>Name:{student['name']}, Age: {student['age']}, Campus: {student['campus']}</li>"
        )
 
    html += "</ol>"
    return html
 
# Add support for query parameters (by name, by min credit points etc...)
@app.get("/students")
def get_students(campus: str = None, creditPointsMin: int = None, name: str = None): 
    result = students.copy()
 
    if campus:
        #filter all the students from that specific campus
        result = [ student for student in result if student["campus"].lower() == campus.lower() ]
 
    if creditPointsMin:
      result =  [ student for student in result if student["creditPoints"] >= creditPointsMin ]
 
    if name:
        result = result = [ student for student in result if student["name"].lower() == name.lower() ]
 
    return result  # automatically returned as JS object array (like in Express)
 
# Get student by id
@app.get("/students/{id}")
def get_student(id: int):
    for student in students:
        if student["id"] == id:
            return student   # this automatically results server code 200 OK
    raise HTTPException( status_code = 404, detail = "Student with that ID not found")
 
 
# Post a new student to the "db" (in memory dictionary)
@app.post("/students", status_code=201)
def add_student(student: dict):  #student object as a parameter. in Python it is a dict (not JS object)
    # todo: add validation
    new_student = {
        "id": generate_next_id(), # creates an unique id for a new student
        "name" : student.get("name"),
        "age" : student.get("age"),
        "creditPoints" : student.get("creditPoints", 0),
        "campus" : student.get("campus")
    }
    students.append(new_student)
    return new_student
 
# Update a student by id
@app.patch("/students/{id}")
def update_student(id: int, new_student_data: dict):
    for i, student in enumerate( students ):
        if student["id"] == id: # student is found
            updated_student = { **student, **new_student_data }  # python spread operator is ** while javascript it is ...
            error = validate_student_data( updated_student )
            if error:
                raise HTTPException( status_code=400, detail=error)
            students[i] = updated_student
            return updated_student
    raise HTTPException( status_code=404, detail="No student with that ID found")
 
@app.delete("/students/{id}", status_code=204) # 204 = No Content (we don't return anything)
def delete_student( id: int ):
    for i, student in enumerate(students):
        if student["id"] == id:
            students.pop(i)
            return
    raise HTTPException(status_code=404, detail="No student with that ID found")
 
 
 
# a simple validation function (in real projects we use Pydantic library (in JS we can use JOI library))
def validate_student_data(student):
    # age must be an integer and 0 or greater
    if not isinstance(student["age"], int) or student["age"] < 0:
        return "Invalid age"
   
    # credit points must not be <=
    if student["creditPoints"] < 0:
        return "Credit points must be >=0"
   
    # name is required
    if not student["name"]:
        return "Name is required"
   
    # if no error, return None
    return None
