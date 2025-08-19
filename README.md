# roomsync-ballerina
Smart Roommate Organizer project using Ballerina

# RoomSync Backend

This is the backend service for **RoomSync**, a room management and roommate coordination application built using **Ballerina** and **MySQL**.

---

## Table of Contents

- [Features](#features)  
- [Prerequisites](#prerequisites)  
- [Setup](#setup)  
- [Configuration](#configuration)  
- [Running the Application](#running-the-application)  
- [API Endpoints](#api-endpoints)  
- [Testing](#testing)  
- [Contributing](#contributing)  
- [License](#license)  

---

## Features

- User registration and authentication  
- Room creation and management  
- Roommate assignment  
- Email notifications for room codes (optional)  
- RESTful API endpoints for frontend integration  

---

## Prerequisites

Make sure you have the following installed:

- [Ballerina](https://ballerina.io/downloads/) (Swan Lake or latest version)  
- [MySQL](https://dev.mysql.com/downloads/mysql/)  
- [Postman](https://www.postman.com/) (for API testing)  
- Git (optional, for cloning the repo)

---

## Setup

1. **Clone the repository** (if using Git):

   ```bash
   git clone https://github.com/yourusername/roomsync-backend.git
   cd roomsync-backend

## Install Ballerina dependencies:
bal build

## Setup MySQL database:
CREATE DATABASE roomsync;

## Import schema
mysql -u root -p roomsync < schema.sql

## Update the Ballerina.toml or config.bal file with your MySQL credentials:

[database]
url = "jdbc:mysql://localhost:3306/roomsync"
username = "root"
password = "yourpassword"

Email notifications (optional): Update email configurations in emailConfig.bal if sending room codes via email.

## Run the backend using Ballerina:

bal run

## The backend will start and listen on the default port (usually 9090). You can test endpoints using Postman:

Base URL: http://localhost:9090

Example: POST /user to register a new user.

## API Endpoints

### Users
POST /user – Create a new user

GET /user?email={email} – Get user by email

POST /login – User login

### Rooms
POST /room – Create a new room

GET /room/{roomCode} – Get room details

### Roommates
POST /roommates – Add roommates to a room

### Tasks
POST /tasks – Create a new task

Get /task{id} - Get task details

### RotaTasks
POST /rotatasks – Create a new rota for a task

### Assignments
POST /assignments – Assign a new task to an assignee

### Expenses
POST /expenses – Add a new expense

## Testing

Open Postman

Import the provided RoomSync.postman_collection.json (if available)

Test endpoints like registration, login, and room creation

## Contributing

Fork the repository

Create a new branch: git checkout -b feature-name

Make changes and commit: git commit -m "Description"

Push to branch: git push origin feature-name

Open a Pull Request
