# QA Test Plan

Tester: Berkay Paray
Date: 18th January 2026
Project: Task Manager

Test scenarios to validate the application functionality before final release.

## 1. Functional Tests
Basic features that must work for the MVP.

| ID | Test Name | Steps to Reproduce | Expected Result | Status |
|----|-----------|--------------------|-----------------|--------|
| T-01 | Add Task | 1. Type "Buy Coffee" in input box.<br>2. Click Add button. | Task appears in the To Do list instantly. | Pending |
| T-02 | Refresh Persistence | 1. Add a few tasks.<br>2. Refresh the browser page. | Tasks should still be there (fetched from DB). | Pending |
| T-03 | Delete Task | 1. Click the X button on a task. | Task is removed from the UI. | Pending |
| T-04 | Move Task | 1. Move a task from To Do to In Progress. | Task status updates and stays in new column. | Pending |

## 2. Error Handling & Edge Cases
Checking how the system handles invalid inputs.

| ID | Test Name | Steps to Reproduce | Expected Result | Status |
|----|-----------|--------------------|-----------------|--------|
| T-05 | Empty Input | 1. Leave input field empty.<br>2. Click Add button. | System should not add an empty task. Warning shown. | Pending |
| T-06 | Long String | 1. Enter a very long text (100+ chars). | Text should wrap correctly in the card, not break layout. | Pending |
| T-07 | Backend Down | 1. Stop the Python server.<br>2. Try to add a task. | User should see a connection error or alert. | Pending |

## 3. Backend & API Tests
Technical validation of the REST API endpoints using Swagger UI.

| ID | Test Name | Steps to Reproduce | Expected Result | Status |
|----|-----------|--------------------|-----------------|--------|
| B-01 | Direct API Connectivity | 1. Go to http://127.0.0.1:8000/docs.<br>2. Execute "GET /" endpoint. | Returns JSON {"message": "Kanban API is running!"} with status 200 OK. | Passed |
| B-02 | Data Structure Validation | 1. Execute "GET /tasks" via Swagger UI. | Returns a valid JSON list [{"id": 1, ...}], not an HTML error page. | Passed |
| B-03 | Manual Data Integrity | 1. Add a task via Swagger (POST /tasks).<br>2. Open "backend/tasks.json" file in VS Code. | The new task should be physically visible in the raw JSON file. | Pending |
| B-04 | Invalid Data Rejection | 1. Try to POST a task without a "title" field via Swagger. | Server returns 422 Unprocessable Entity (Pydantic validation blocks it). | Pending |

## 4. Frontend UI Tests
Validation of the User Interface structure and interactions.

| ID | Test Name | Steps to Reproduce | Expected Result | Status |
|----|-----------|--------------------|-----------------|--------|
| F-01 | Static UI Structure | 1. Open index.html in Chrome/Edge.<br>2. Inspect elements. | Page loads without errors. "To Do", "In Progress", "Done" columns exist with unique HTML IDs. | Passed |