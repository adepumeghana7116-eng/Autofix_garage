# AutoFix Garage – Service Bay Management System

## 1. Project Introduction

AutoFix Garage is a Service Bay Management System developed using Node.js, Express.js and SQLite.

The main purpose of this project is to manage mechanics, service bays and vehicle service assignments.

The system helps to:
- Manage mechanic details.
- Manage service bays and vehicle types.
- Assign mechanics to service bays.
- Track the status of service assignments.
- Search service bays based on vehicle type.
- Validate data and handle errors.

## 2. Technologies Used

- **Node.js** – JavaScript runtime environment.
- **Express.js** – Backend framework used to develop REST APIs.
- **SQLite** – Database used to store project information.
- **Postman** – Used for API testing.
- **VS Code** – Code editor used for development.

## 3. Project Folder Structure

The project is organized into the following structure:

```text
autofix-garage/
│
├── screenshots/
│   ├── 1-update-mechanic.png
│   ├── 2-delete-mechanic-protection.png
│   ├── 3-get-bay-by-id.png
│   ├── 4-search-bays-by-vehicle.png
│   ├── 5-create-bay.png
│   ├── 6-update-bay.png
│   ├── 7-delete-bay.png
│   ├── 8-create-assignment.png
│   ├── 9-get-assignments-with-join.png
│   ├── 10-assignment-invalid-mechanic.png
│   ├── 11-assignment-invalid-bay.png
│   ├── 12-invalid-assignment-status.png
│   ├── 13-assignment-approved.png
│   ├── 14-assignment-done.png
│   ├── 15-mechanic-not-found.png
│   ├── 16-bay-not-found.png
│   ├── 17-assignment-approved-for-rejection.png
│   └── 18-approved-to-pending-rejected.png
│
├── database.js
├── server.js
├── seed.js
├── seed-bays.js
├── seed-assignments.js
├── autofix.db
├── package.json
├── package-lock.json
├── AutoFix-Garage.postman_collection.json
└── README.md
```

## 4. Database Structure

The project uses SQLite with three related tables.

### 4.1 Mechanics Table

Stores mechanic information.

| Column | Description |
|---|---|
| id | Mechanic ID |
| name | Mechanic name |
| specialization | Mechanic specialization |

### 4.2 Bays Table

Stores service bay information.

| Column | Description |
|---|---|
| id | Bay ID |
| name | Bay name |
| vehicle | Vehicle type |

### 4.3 Assignments Table

Stores mechanic and service bay assignment details.

| Column | Description |
|---|---|
| id | Assignment ID |
| mechanic_id | Mechanic reference |
| bay_id | Bay reference |
| job_description | Work description |
| status | Assignment status |
| created_at | Assignment creation time |

The assignments table is connected to the mechanics and bays tables using foreign keys.

## 5. API Endpoints

**Base URL:** `http://localhost:3000`

### 5.1 Mechanics API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/mechanics` | Get all mechanics |
| GET | `/mechanics/:id` | Get mechanic by ID |
| POST | `/mechanics` | Add a mechanic |
| PUT | `/mechanics/:id` | Update mechanic |
| DELETE | `/mechanics/:id` | Delete a mechanic |

### 5.2 Bays API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/bays` | Get all bays |
| GET | `/bays/:id` | Get bay by ID |
| POST | `/bays` | Add a bay |
| PUT | `/bays/:id` | Update a bay |
| DELETE | `/bays/:id` | Delete a bay |

### 5.3 Bay Search API

This endpoint searches for service bays based on vehicle type.

**Example:**

```http
GET /bays?vehicle=Car
```

It returns the bays that match the specified vehicle type.

### 5.4 Assignments API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/assignments` | Get all assignments with mechanic and bay names |
| POST | `/assignments` | Create a new assignment |
| PATCH | `/assignments/:id/status` | Update assignment status |

## 6. Assignment Status Flow

Every new assignment starts with the status `pending`.

The status can move only one step forward.

**Valid Status Flow:**

```text
pending → approved → done
```

The following tests are performed:

| Test | Expected Status Code |
|---|---|
| Create assignment with pending status | 201 |
| Change pending to approved | 200 |
| Change approved back to pending | 400 |

Invalid status changes return the following error message:

```json
{
  "error": "Invalid status change"
}
```

## 7. Validation and Error Handling

The API includes validation to prevent invalid data and maintain database consistency.

The following validations are implemented:

- Mechanic name and specialization are required.
- Bay name and vehicle are required.
- Assignment mechanic ID and bay ID must be valid integers.
- The mechanic and bay must exist before creating an assignment.
- Missing records return a `404` response.
- Invalid data returns a `400` response.
- Records connected through foreign keys cannot be deleted.
- Invalid assignment status transitions are rejected.

## 8. How to Run the Project

### Step 1: Open the Project

Open the `autofix-garage` folder in VS Code.

### Step 2: Install Dependencies

Open the terminal and execute:

```bash
npm install
```

### Step 3: Start the Server

Run the following command:

```bash
node server.js
```

### Step 4: Check the Server

Open the following URL in your browser:

`http://localhost:3000`

Expected response:

```json
{
  "message": "AutoFix Garage API is running"
}
```

### Step 5: Test APIs Using Postman

Open Postman and use the base URL:

`http://localhost:3000`

Test the available GET, POST, PUT, DELETE and PATCH endpoints.

## 9. Postman Testing and Screenshots

The following screenshots demonstrate the API operations, successful responses and error handling performed using Postman.

### 9.1 Mechanic Operations

**1. Update Mechanic**

![Update Mechanic](screenshots/1-update-mechanic.png)

**2. Delete Mechanic Protection**

![Delete Mechanic Protection](screenshots/2-delete-mechanic-protection.png)

### 9.2 Service Bay Operations

**3. Get Bay by ID**

![Get Bay by ID](screenshots/3-get-bay-by-id.png)

**4. Search Bays by Vehicle**

![Search Bays by Vehicle](screenshots/4-search-bays-by-vehicle.png)

**5. Create Bay**

![Create Bay](screenshots/5-create-bay.png)

**6. Update Bay**

![Update Bay](screenshots/6-update-bay.png)

**7. Delete Bay**

![Delete Bay](screenshots/7-delete-bay.png)

### 9.3 Assignment Operations

**8. Create Assignment**

![Create Assignment](screenshots/8-create-assignment.png)

**9. Get Assignments with JOIN**

![Get Assignments with Join](screenshots/9-get-assignments-with-join.png)

**10. Assignment with Invalid Mechanic**

![Invalid Mechanic Assignment](screenshots/10-assignment-invalid-mechanic.png)

**11. Assignment with Invalid Bay**

![Invalid Bay Assignment](screenshots/11-assignment-invalid-bay.png)

**12. Invalid Assignment Status**

![Invalid Assignment Status](screenshots/12-invalid-assignment-status.png)

**13. Assignment Approved**

![Assignment Approved](screenshots/13-assignment-approved.png)

**14. Assignment Done**

![Assignment Done](screenshots/14-assignment-done.png)

### 9.4 Error Handling and Status Validation

**15. Mechanic Not Found**

![Mechanic Not Found](screenshots/15-mechanic-not-found.png)

**16. Bay Not Found**

![Bay Not Found](screenshots/16-bay-not-found.png)

**17. Assignment Approved for Rejection**

![Assignment Approved for Rejection](screenshots/17-assignment-approved-for-rejection.png)

**18. Approved to Pending Rejected**

![Approved to Pending Rejected](screenshots/18-approved-to-pending-rejected.png)

## 10. Postman Testing Summary

The APIs are tested using Postman to verify the functionality and correctness of the system.

The testing covers:

- Retrieving mechanics and service bays.
- Updating mechanic details.
- Adding, updating and deleting service bays.
- Searching bays using vehicle query parameters.
- Creating new assignments.
- Retrieving assignments using SQL JOIN operations.
- Validating incorrect mechanic and bay IDs.
- Testing missing mechanic and bay records.
- Testing valid and invalid assignment status transitions.
- Verifying foreign key restrictions.

## 11. Project Conclusion

AutoFix Garage provides a simple and efficient way to manage mechanics, service bays and vehicle service assignments.

The project uses Node.js and Express.js for backend API development and SQLite for storing related information. It implements CRUD operations, database relationships, search functionality, validation and error handling.

Postman is used to test the API endpoints and verify both successful operations and invalid requests.

Through this project, we gained practical experience in backend development, REST API creation, database management, SQL JOIN operations and API testing.

The system demonstrates how a garage can organize its mechanics, service bays and vehicle assignments through a structured backend application.