import ballerinax/mysql;
import ballerina/sql;

configurable int port = ?;
configurable string host = ?;
configurable string database = ?;
configurable string password = ?;
configurable string user = ?;

final mysql:Client dbClient = check new(
    host = host,
    port = port,
    database = database,
    user = user,
    password = password
);

//========== USER OPERATIONS ==========
 function insertUser(User entry) returns sql:ExecutionResult|error {
    User {id, name, email, contactNumber,password} = entry;
    sql:ParameterizedQuery insertQuery = `INSERT INTO Users (id, name, email, contactNumber,password) VALUES (
                                            ${id}, ${name}, ${email}, ${contactNumber}, ${password})`;
    return dbClient->execute(insertQuery);
}

function selectUser(string email) returns User|sql:Error {
    sql:ParameterizedQuery selectQuery = `SELECT * FROM Users WHERE email = ${email}`;
    return dbClient->queryRow(selectQuery);
}
function selectAllUsers() returns User[]|error {
    sql:ParameterizedQuery selectQuery = `SELECT * FROM Users`;
    stream<User, error?> userStream = dbClient->query(selectQuery);
    return from User u in userStream select u;
}
 function updateUser(string id, UserInsert data) returns sql:ExecutionResult|error {
    UserInsert {name, email, contactNumber} = data;
    sql:ParameterizedQuery updateQuery = `UPDATE Users SET name = ${name}, email = ${email}, 
                                            contactNumber = ${contactNumber} WHERE id = ${id}`;
    return dbClient->execute(updateQuery);
}

 function deleteUser(string id) returns sql:ExecutionResult|error {
    sql:ParameterizedQuery deleteQuery = `DELETE FROM Users WHERE id = ${id}`;
    return dbClient->execute(deleteQuery);
}
// ========== ROOM OPERATIONS ==========

 function insertRoom(Room entry) returns sql:ExecutionResult|error {
    Room {roomCode, name, ownerId, roommateIds} = entry;
    sql:ParameterizedQuery insertQuery = `INSERT INTO Rooms (roomCode, name, ownerId, roommateIds) VALUES (
                                            ${roomCode}, ${name}, ${ownerId}, ${roommateIds})`;
    return dbClient->execute(insertQuery);
}

 function selectRoom(string roomCode) returns Room|sql:Error {
    sql:ParameterizedQuery selectQuery = `SELECT * FROM Rooms WHERE roomCode = ${roomCode}`;
    return dbClient->queryRow(selectQuery);
}

 function selectAllRooms() returns Room[]|error {
    sql:ParameterizedQuery selectQuery = `SELECT * FROM Rooms`;
    stream<Room, error?> roomStream = dbClient->query(selectQuery);
    return from Room r in roomStream select r;
}
 function updateRoom(string id, Room data) returns sql:ExecutionResult|error {
    Room {ownerId, name, roomCode, roommateIds} = data;
    sql:ParameterizedQuery updateQuery = `UPDATE Rooms SET ownerId = ${ownerId}, name = ${name}, roomCode = ${roomCode},
                                            roommateIds = ${roommateIds} WHERE id = ${id}`;
    return dbClient->execute(updateQuery);
}
 function deleteRoom(string roomCode) returns sql:ExecutionResult|error {
    sql:ParameterizedQuery deleteQuery = `DELETE FROM Rooms WHERE roomCode = ${roomCode}`;
    return dbClient->execute(deleteQuery);
}
 function updateRoomCode(string id, string roomCode) returns sql:ExecutionResult|error {
    sql:ParameterizedQuery updateQuery = `UPDATE Rooms SET roomCode = ${roomCode}
                                            WHERE id = ${id}`;
    return dbClient->execute(updateQuery);
}
// ========== ROOMMATE OPERATIONS ==========
 function insertRoommate(Roommate entry) returns sql:ExecutionResult|error {
    Roommate {userId, busyDays, dislikedChores} = entry;
    sql:ParameterizedQuery insertQuery = `INSERT INTO Roommates (userId, busyDays, dislikedChores) VALUES (
                                            ${userId},${busyDays}, ${dislikedChores})`;
    return dbClient->execute(insertQuery);
}

 function selectRoommate(string id) returns Roommate|sql:Error {
    sql:ParameterizedQuery selectQuery = `SELECT * FROM Roommates WHERE id = ${id}`;
    return dbClient->queryRow(selectQuery);
}

 function selectAllRoommates() returns Roommate[]|error {
    sql:ParameterizedQuery selectQuery = `SELECT * FROM Roommates`;
    stream<Roommate, error?> roommateStream = dbClient->query(selectQuery);
    return from Roommate rm in roommateStream select rm;
}

 function updateRoommate(string id, Roommate data) returns sql:ExecutionResult|error {
    sql:ParameterizedQuery updateQuery = 
        `UPDATE Roommates 
         SET name = ${data.name}, 
             email = ${data.email}, 
             contactNumber = ${data.contactNumber}, 
             roomCode = ${data.roomCode}, 
             busyDays = ${data.busyDays}, 
             dislikedChores = ${data.dislikedChores}
         WHERE id = ${id}`;
         
    return dbClient->execute(updateQuery);
}
 function updateRoommateData(string id, RoommateInsert data) returns sql:ExecutionResult|error {
    sql:ParameterizedQuery updateQuery = 
        `UPDATE Roommates 
         SET roomCode = ${data.roomCode}, 
             busyDays = ${data.busyDays}, 
             dislikedChores = ${data.dislikedChores}
         WHERE id = ${id}`;
         
    return dbClient->execute(updateQuery);
}


 function deleteRoommate(string id) returns sql:ExecutionResult|error {
    sql:ParameterizedQuery deleteQuery = `DELETE FROM Roommates WHERE id = ${id}`;
    return dbClient->execute(deleteQuery);
}

// ========== ROTA OPERATIONS ==========

 function insertRota(RotaTask entry) returns sql:ExecutionResult|error {
    RotaTask {id, taskName, roommateIds, startDate, frequency, day, history, currentIndex, currentAssignee} = entry;

   
    json historyJson = <json>history;
    string historyJsonString = historyJson.toJsonString();

    json roommateJson = <json>roommateIds;
    string roommateJsonString = roommateJson.toJsonString();


    sql:ParameterizedQuery insertQuery = `INSERT INTO RotaTasks (id, taskName, roommateIds, startDate, frequency, day, history, currentIndex, currentAssignee) VALUES (
                                            ${id}, ${taskName}, ${roommateJsonString}, ${startDate}, ${frequency}, ${day}, ${historyJsonString}, ${currentIndex}, ${currentAssignee})`;
    return dbClient->execute(insertQuery);
}

 function selectRota(string id) returns RotaTask|sql:Error {
    sql:ParameterizedQuery selectQuery = `SELECT * FROM RotaTasks WHERE id = ${id}`;
    return dbClient->queryRow(selectQuery);
}

 function selectAllRotas() returns RotaTask[]|error {
    sql:ParameterizedQuery selectQuery = `SELECT * FROM RotaTasks`;
    stream<RotaTask, error?> rotaStream = dbClient->query(selectQuery);
    return from RotaTask rt in rotaStream select rt;
}

 function selectRotasByTask(string taskName) returns RotaTask[]|error {
    sql:ParameterizedQuery selectQuery = `SELECT * FROM RotaTasks WHERE taskName = ${taskName}`;
    stream<RotaTask, error?> rotaStream = dbClient->query(selectQuery);
    return from RotaTask rt in rotaStream select rt;
}

 function updateRota(string id, RotaTaskInsert data) returns sql:ExecutionResult|error {
    RotaTaskInsert {taskName, roommateIds, startDate, frequency, day, history} = data;

    json historyJson = <json>history;
    string historyJsonString = historyJson.toJsonString();

    json roommateJson = <json>roommateIds;
    string roommateJsonString = roommateJson.toJsonString();
 
    //there are toJson converts to json,tostring converts array to string

    sql:ParameterizedQuery updateQuery = `UPDATE RotaTasks SET taskName = ${taskName}, roommateIds = ${roommateJsonString}, 
                                            startDate = ${startDate}, frequency = ${frequency}, day = ${day}, 
                                            history = ${historyJsonString} WHERE id = ${id}`;
    return dbClient->execute(updateQuery);
}

 function updateRotaCurrentAssignee(string id, string currentAssignee, int currentIndex) returns sql:ExecutionResult|error {
    sql:ParameterizedQuery updateQuery = `UPDATE RotaTasks SET currentAssignee = ${currentAssignee}, 
                                            currentIndex = ${currentIndex} WHERE id = ${id}`;
    return dbClient->execute(updateQuery);
}

 function deleteRota(string id) returns sql:ExecutionResult|error {
    sql:ParameterizedQuery deleteQuery = `DELETE FROM RotaTasks WHERE id = ${id}`;
    return dbClient->execute(deleteQuery);
}

// ========== ASSIGNMENT OPERATIONS ==========

 function insertAssignment(Assignment entry) returns sql:ExecutionResult|error {
    Assignment {id, taskName, assignedDate, assigneeId, status} = entry;
    sql:ParameterizedQuery insertQuery = `INSERT INTO Assignments (id, taskName, assignedDate, assigneeId, status) VALUES (
                                            ${id}, ${taskName}, ${assignedDate}, ${assigneeId}, ${status})`;
    return dbClient->execute(insertQuery);
}

 function selectAssignment(string id) returns Assignment|sql:Error {
    sql:ParameterizedQuery selectQuery = `SELECT * FROM Assignments WHERE id = ${id}`;
    return dbClient->queryRow(selectQuery);
}

 function selectAllAssignments() returns Assignment[]|error {
    sql:ParameterizedQuery selectQuery = `SELECT * FROM Assignments`;
    stream<Assignment, error?> assignmentStream = dbClient->query(selectQuery);
    return from Assignment a in assignmentStream select a;
}

 function selectAssignmentsByAssignee(string assigneeId) returns Assignment[]|error {
    sql:ParameterizedQuery selectQuery = `SELECT * FROM Assignments WHERE assigneeId = ${assigneeId} ORDER BY assignedDate DESC`;
    stream<Assignment, error?> assignmentStream = dbClient->query(selectQuery);
    return from Assignment a in assignmentStream select a;
}

 function selectAssignmentsByStatus(TaskStatus status) returns Assignment[]|error {
    sql:ParameterizedQuery selectQuery = `SELECT * FROM Assignments WHERE status = ${status} ORDER BY assignedDate DESC`;
    stream<Assignment, error?> assignmentStream = dbClient->query(selectQuery);
    return from Assignment a in assignmentStream select a;
}

 function selectAssignmentsByDateRange(string startDate, string endDate) returns Assignment[]|error {
    sql:ParameterizedQuery selectQuery = `SELECT * FROM Assignments WHERE assignedDate BETWEEN ${startDate} AND ${endDate} 
                                            ORDER BY assignedDate DESC`;
    stream<Assignment, error?> assignmentStream = dbClient->query(selectQuery);
    return from Assignment a in assignmentStream select a;
}

 function updateAssignmentStatus(string id, TaskStatus status) returns sql:ExecutionResult|error {
    sql:ParameterizedQuery updateQuery = `UPDATE Assignments SET status = ${status} WHERE id = ${id}`;
    return dbClient->execute(updateQuery);
}

 function updateAssignment(string id, Assignment data) returns sql:ExecutionResult|error {
    Assignment {taskName, assignedDate, assigneeId, status} = data;
    sql:ParameterizedQuery updateQuery = `UPDATE Assignments SET taskName = ${taskName}, assignedDate = ${assignedDate}, 
                                            assigneeId = ${assigneeId}, status = ${status} WHERE id = ${id}`;
    return dbClient->execute(updateQuery);
}

 function deleteAssignment(string id) returns sql:ExecutionResult|error {
    sql:ParameterizedQuery deleteQuery = `DELETE FROM Assignments WHERE id = ${id}`;
    return dbClient->execute(deleteQuery);
}

// ========== EXPENSE OPERATIONS ==========

 function insertExpense(Expense entry) returns sql:ExecutionResult|error {
    Expense {id, payer,amount, participants, date, owes,status} = entry;
    sql:ParameterizedQuery insertQuery = `INSERT INTO Expenses (id, payer,amount, participants, date, owes,status) VALUES (
                                            ${id}, ${payer}, ${amount}, ${participants},${date},${owes},${status})`;
    return dbClient->execute(insertQuery);
}

 function selectExpense(string id) returns Expense|sql:Error {
    sql:ParameterizedQuery selectQuery = `SELECT * FROM Expenses WHERE id = ${id}`;
    return dbClient->queryRow(selectQuery);
}

 function selectAllExpenses() returns Expense[]|error {
    sql:ParameterizedQuery selectQuery = `SELECT * FROM Expenses ORDER BY addedDate DESC`;
    stream<Expense, error?> expenseStream = dbClient->query(selectQuery);
    return from Expense e in expenseStream select e;
}

 function selectExpensesByPaidBy(string payer) returns Expense[]|error {
    sql:ParameterizedQuery selectQuery = `SELECT * FROM Expenses WHERE payer = ${payer} ORDER BY addedDate DESC`;
    stream<Expense, error?> expenseStream = dbClient->query(selectQuery);
    return from Expense e in expenseStream select e;
}


isolated function updateExpense(string id, ExpenseInsert data) returns sql:ExecutionResult|error {
    ExpenseInsert { payer, amount, participants, date } = data;

    json participantsJson = <json>participants;
    string participantsJsonString = participantsJson.toJsonString();

    sql:ParameterizedQuery updateQuery = 
        `UPDATE Expenses 
         SET payer = ${payer}, 
             amount = ${amount}, 
             participants = ${participantsJsonString}, 
             date = ${date} 
         WHERE id = ${id}`;

    return dbClient->execute(updateQuery);
}


 function deleteExpense(string id) returns sql:ExecutionResult|error {
    sql:ParameterizedQuery deleteQuery = `DELETE FROM Expenses WHERE id = ${id}`;
    return dbClient->execute(deleteQuery);
}

// ========== UTILITY FUNCTIONS ==========

 function getRoommateCount() returns int|error {
    sql:ParameterizedQuery countQuery = `SELECT COUNT(*) as count FROM Roommates`;
    record {|int count;|} result = check dbClient->queryRow(countQuery);
    return result.count;
}

 function getActiveAssignmentsCount() returns int|error {
    sql:ParameterizedQuery countQuery = `SELECT COUNT(*) as count FROM Assignments WHERE status = 'Pending'`;
    record {|int count;|} result = check dbClient->queryRow(countQuery);
    return result.count;
}

 function getRotasByFrequency(string frequency) returns RotaTask[]|error {
    sql:ParameterizedQuery selectQuery = `SELECT * FROM RotaTasks WHERE frequency = ${frequency}`;
    stream<RotaTask, error?> rotaStream = dbClient->query(selectQuery);
    return from RotaTask rt in rotaStream select rt;
}

 function getRoommatesByBusyDays(int[] busyDays) returns Roommate[]|error {
    sql:ParameterizedQuery selectQuery = `SELECT * FROM Roommates WHERE JSON_CONTAINS(busyDays, ${busyDays})`;
    stream<Roommate, error?> roommateStream = dbClient->query(selectQuery);
    return from Roommate rm in roommateStream select rm;
}

 function getRoommatesByDislikedChore(string chore) returns Roommate[]|error {
    sql:ParameterizedQuery selectQuery = `SELECT * FROM Roommates WHERE JSON_CONTAINS(dislikedChores, ${chore})`;
    stream<Roommate, error?> roommateStream = dbClient->query(selectQuery);
    return from Roommate rm in roommateStream select rm;
}

 function getAssignmentsByDate(string date) returns Assignment[]|error {
    sql:ParameterizedQuery selectQuery = `SELECT * FROM Assignments WHERE assignedDate = ${date} ORDER BY assigneeId`;
    stream<Assignment, error?> assignmentStream = dbClient->query(selectQuery);
    return from Assignment a in assignmentStream select a;
}

 function getCompletedAssignmentsCount(string assigneeId) returns int|error {
    sql:ParameterizedQuery countQuery = `SELECT COUNT(*) as count FROM Assignments WHERE assigneeId = ${assigneeId} AND status = 'Completed'`;
    record {|int count;|} result = check dbClient->queryRow(countQuery);
    return result.count;
}
