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
-- Create Roommates table
CREATE TABLE IF NOT EXISTS Roommates (
    user_id VARCHAR(36) PRIMARY KEY,
    room_code VARCHAR(10) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    busyDays JSON NOT NULL, -- Array of integers representing busy days (0=Sunday, 1=Monday, etc.)
    dislikedChores JSON, -- Array of strings representing disliked chores
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create RotaTasks table
CREATE TABLE IF NOT EXISTS RotaTasks (
    id VARCHAR(36) PRIMARY KEY,
    task VARCHAR(255) NOT NULL,
    roommateIds JSON NOT NULL, -- Array of roommate IDs
    startDate DATE NOT NULL,
    frequency ENUM('daily', 'weekly', 'monthly') NOT NULL,
    day INT NOT NULL, -- For weekly: 0-6 (Sunday-Saturday), for monthly: 1-31
    history VARCHAR(1000) DEFAULT '[]', -- Array of Assignment objects
    currentIndex INT DEFAULT 0,
    currentAssignee VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (currentAssignee) REFERENCES users(id) ON DELETE SET NULL
);

-- Create Assignments table
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
    --FOREIGN KEY (rota_task_id) REFERENCES rota_tasks(id) ON DELETE SET NULL
);

-- Create Expenses table
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

-- Create indexes for better performance
CREATE INDEX idx_roommates_email ON Roommates(email);
CREATE INDEX idx_assignments_assignee ON Assignments(assigneeId);
CREATE INDEX idx_assignments_date ON Assignments(assignedDate);
CREATE INDEX idx_assignments_status ON Assignments(status);
CREATE INDEX idx_rotatasks_frequency ON RotaTasks(frequency);
CREATE INDEX idx_expenses_paidby ON Expenses(payer);
CREATE INDEX idx_expenses_date ON Expenses(addedDate);

-- Insert sample data (optional)
-- INSERT INTO Roommates (id, name, email, busyDays, dislikedChores) VALUES 
--     ('550e8400-e29b-41d4-a716-446655440001', 'John Doe', 'john@example.com', '[1,3,5]', '["Dishes", "Laundry"]'),
--     ('550e8400-e29b-41d4-a716-446655440002', 'Jane Smith', 'jane@example.com', '[0,6]', '["Vacuuming"]');

-- INSERT INTO RotaTasks (id, task, roommateIds, startDate, frequency, day, currentAssignee) VALUES 
--     ('550e8400-e29b-41d4-a716-446655440003', 'Dishes', '["550e8400-e29b-41d4-a716-446655440001", "550e8400-e29b-41d4-a716-446655440002"]', '2024-01-01', 'daily', 0, '550e8400-e29b-41d4-a716-446655440001');
