from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import db_manager  # Importing the database manager we created earlier

# Initialize the FastAPI application
app = FastAPI()

# --- CORS Configuration (Handling Task #7 in advance) ---
# This allows the Frontend (running on a different port) to communicate with this Backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (for development purposes)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allows all headers
)

# --- Task #2: Hello World Endpoint ---
@app.get("/")
def read_root():
    """
    Root endpoint to verify the server is running.
    """
    return {"message": "Hello World! Kanban Board API is running."}

# --- Preparation: Test DB Connection ---
@app.get("/test-db")
def test_db():
    """
    Temporary endpoint to check if db_manager can read the JSON file.
    """
    return db_manager.get_all_tasks()