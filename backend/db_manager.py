import json
import os

# Define the database file name
DB_FILE = 'tasks.json'


# --- HELPER FUNCTIONS (Internal Use) ---

def _read_json_file():
    """
    Reads data from the JSON file.
    Returns an empty list if the file does not exist or is corrupted.
    """
    if not os.path.exists(DB_FILE):
        return []
    try:
        with open(DB_FILE, 'r', encoding='utf-8') as file:
            return json.load(file)
    except json.JSONDecodeError:
        return []


def _save_json_file(data):
    """
    Writes the list of tasks back to the JSON file.
    Uses indentation for readability.
    """
    with open(DB_FILE, 'w', encoding='utf-8') as file:
        json.dump(data, file, indent=4, ensure_ascii=False)


# --- PUBLIC FUNCTIONS (API Use) ---

def get_all_tasks():
    """
    Retrieves all tasks from the database.
    Returns: List of dictionaries.
    """
    return _read_json_file()


def add_task(title, description, assignee="Unassigned"):
    """
    Adds a new task to the database with an auto-incremented ID.
    Default status is always set to 'To Do'.
    Returns: The newly created task dictionary.
    """
    tasks = _read_json_file()

    # Calculate new ID (Last ID + 1)
    new_id = 1
    if tasks:
        # Ensure we treat the ID as an integer for calculation
        new_id = int(tasks[-1]['id']) + 1

    new_task = {
        "id": new_id,
        "title": title,
        "description": description,
        "status": "To Do",
        "assignee": assignee
    }

    tasks.append(new_task)
    _save_json_file(tasks)
    return new_task


def update_task_status(task_id, new_status):
    """
    Updates the status of a specific task (e.g., 'To Do' -> 'Done').
    Returns: True if successful, False if task not found.
    """
    tasks = _read_json_file()
    found = False

    for task in tasks:
        # Convert both to string to ensure safe comparison
        if str(task['id']) == str(task_id):
            task['status'] = new_status
            found = True
            break

    if found:
        _save_json_file(tasks)
        return True
    return False


def delete_task(task_id):
    """
    Removes a task from the database by its ID.
    Returns: True if successful, False if task not found.
    """
    tasks = _read_json_file()
    initial_count = len(tasks)

    # Filter out the task with the matching ID
    # We keep tasks where ID is NOT equal to task_id
    updated_tasks = [task for task in tasks if str(task['id']) != str(task_id)]

    # If the list size changed, it means we deleted something
    if len(updated_tasks) < initial_count:
        _save_json_file(updated_tasks)
        return True
    return False