-- RoomSync Database Schema
CREATE DATABASE IF NOT EXISTS roomsync;
use roomsync;
-- This file contains the SQL statements to create all necessary tables

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    contact_number VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS Rooms (
    id VARCHAR(36) PRIMARY KEY,
    room_code VARCHAR(10) NOT NULL,
    owner_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    roommate_ids JSON, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES Users(id) 
);

CREATE TABLE IF NOT EXISTS Roommates (
    user_id VARCHAR(36) PRIMARY KEY,
    room_code VARCHAR(10) NOT NULL,
    busyDays JSON , -- Array of integers representing busy days (0=Sunday, 1=Monday, etc.)
    dislikedChores JSON, -- Array of strings representing disliked chores
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Tasks (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS RotaTasks (
    id VARCHAR(36) PRIMARY KEY,
    task VARCHAR(255) NOT NULL,
    roommateIds JSON NOT NULL, 
    startDate DATE NOT NULL,
    frequency ENUM('daily', 'weekly', 'monthly') NOT NULL,
    day INT NOT NULL, -- For weekly: 0-6 (Sunday-Saturday), for monthly: 1-31
    history VARCHAR(1000) DEFAULT '[]', -- Array of Assignment objects
    currentIndex INT DEFAULT 0,
    currentAssignee VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES Tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (currentAssignee) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Assignments (
    id VARCHAR(36) PRIMARY KEY,
    task VARCHAR(255) NOT NULL,
    assignedDate DATE NOT NULL,
    assignee_id VARCHAR(36) NOT NULL,
    status ENUM('Pending', 'Completed', 'Neglected') DEFAULT 'Pending',
    completedDate TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY ( assignee_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (task_id) REFERENCES Tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (rota_task_id) REFERENCES rota_tasks(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Expenses (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    addedDate DATE NOT NULL,
    payer VARCHAR(36) NOT NULL,
    amount DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (payer) REFERENCES users(id) ON DELETE CASCADE
);
-- indexes 
CREATE INDEX idx_roommates_email ON Roommates(email);
CREATE INDEX idx_assignments_assignee ON Assignments(assigneeId);
CREATE INDEX idx_assignments_date ON Assignments(assignedDate);
CREATE INDEX idx_assignments_status ON Assignments(status);
CREATE INDEX idx_rotatasks_frequency ON RotaTasks(frequency);
CREATE INDEX idx_expenses_paidby ON Expenses(payer);
CREATE INDEX idx_expenses_date ON Expenses(addedDate);

