from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import db_manager  # Importing our database manager module

app = FastAPI()

# --- CORS Configuration (To allow Frontend communication) ---
# This setup allows the Frontend (running on a different port) to access this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (for development)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allows all headers
)

# --- Pydantic Model (Data Schema) ---
# This defines the structure of the data we expect or return.
# It acts as a contract with the Frontend.
class Task(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    status: str
    assignee: Optional[str] = None

# --- Model for Incoming Data (POST requests) ---
# We use this model when creating a task because the client
# does not send 'id' or 'status' (the backend handles those).
class TaskInput(BaseModel):
    title: str
    description: Optional[str] = "No description"
    assignee: Optional[str] = "Unassigned"

# --- Endpoint 1: Hello World (Root) ---
# Useful for testing if the server is running.
@app.get("/")
def read_root():
    return {"message": "Kanban API is running!"}

# --- Endpoint 2: GET /tasks (List All Tasks) ---
# This endpoint retrieves all tasks from the database.
@app.get("/tasks", response_model=List[Task])
def get_tasks():
    """
    Reads all tasks from the JSON database and returns them as a list.
    """
    tasks = db_manager.get_all_tasks()
    return tasks

# --- Endpoint 3: Create a New Task (POST) ---
@app.post("/tasks", response_model=Task, status_code=201)
def create_task(task_input: TaskInput):
    """
    Receives task details from the frontend.
    Calls the database manager to save the new task.
    Returns the created task with its new ID and default status.
    """
    new_task = db_manager.add_task(
        title=task_input.title,
        description=task_input.description,
        assignee=task_input.assignee
    )
    return new_task