import ballerina/http;
import ballerina/sql;
import ballerina/uuid;
import ballerina/io;
//import ballerinax/googleapis.gmail;


table<User> key(id) userTable = table [];
table<Roommate> key(userId) roommateTable = table [];
table<Assignment> key(id) assignmentTable = table [];
table<RotaTask> key(id) rotaTable = table [];
table<Expense> key(id) expenseTable = table [];
table<Room> key(id) roomTable = table [];

// configurable string refreshToken = ?;
// configurable string clientId = ?;
// configurable string clientSecret = ?;

// final gmail:Client gmailClient = check new gmail:Client(
//     config = {auth: {
//         refreshToken,
//         clientId,
//         clientSecret
//     }}
// );

@http:ServiceConfig {
    cors: {
        allowOrigins: ["*"]
    }
}
service /roomsync on new http:Listener(8085) {

    // Add a new user
    resource function post user(UserInsert data) returns User {
        User user = {
            id: uuid:createRandomUuid(),
            ...data
        };
        userTable.put(user);

        sql:ExecutionResult|error result = insertUser(user);
        io:println(result);
        return user;
    }
    //Get a user
  
resource function get user(string email) returns User|http:NotFound {
    User|sql:Error|() result = selectUser(email);

    if result is sql:Error {
        return http:NOT_FOUND;
    }
    if result is User {
        return result;
    }
    return http:NOT_FOUND;
}

    // Update a user
    resource function put user/[string id](UserInsert data) returns User|http:NotFound {
        User? user = userTable[id];
        if user is () {
            return http:NOT_FOUND;
        }
        // Update user with new data
        User updatedUser = {
            id: id,
            ...data
        };
        userTable.put(updatedUser);
        return updatedUser;
    }

    resource function post room(RoomInsert data) returns Room|error {

        string roomCode = generateRoomCode();
        Room room = {
            id: uuid:createRandomUuid(),
            roomCode: roomCode,
            ...data
        };

        //  _ =  check sendRoomCodeEmail(data.ownerId, roomCode);

        roomTable.put(room);
        sql:ExecutionResult|error result = insertRoom(room);
        io:println(result);

        return room;
    }

    resource function patch room/roomCode/[string id](RoomInsert data) returns Room|error{
      
        Room updatedRoom = {
            id: id,
            roomCode: generateRoomCode(),
            ...data
        };
        roomTable.put(updatedRoom);
        return updatedRoom;
    }

    // Add a new roommate
    resource function post roommate(@http:Payload RoommateRequest data) returns Roommate {
    Roommate roommate = {
        userId: data.user.id,
        name: data.user.name,
        email: data.user.email,
        contactNumber: data.user.contactNumber,
        password: data.user.password,
        roomCode: data.roommate.roomCode,
        busyDays: data.roommate.busyDays,
        dislikedChores: data.roommate.dislikedChores
    };

    roommateTable.put(roommate);
    return roommate;
}

// Get all roommates
resource function get roommates() returns Roommate[] {
    return roommateTable.toArray();
}

// Get a roommate by ID
resource function get roommate/[string id]() returns Roommate|http:NotFound {
    Roommate? roommate = roommateTable[id];
    if roommate is () {
        return http:NOT_FOUND;
    }
    return roommate;
}

// Update a roommate
resource function patch roommate/[string id](RoommateInsert data) returns Roommate|http:NotFound|error {
    Roommate? existingRoommate = roommateTable[id];
    if existingRoommate is () {
        return http:NOT_FOUND;
    }

    // Create updated roommate preserving existing user data
    Roommate updatedRoommate = {
            userId: id,
            name: existingRoommate.name,
            email: existingRoommate.email,
            contactNumber: existingRoommate.contactNumber,
            password: existingRoommate.password,
            roomCode: data.roomCode,
            busyDays: data.busyDays,
            dislikedChores: data.dislikedChores
        };

    roommateTable.put(updatedRoommate);
    return updatedRoommate;
}

// Add a new rota
resource function post rota(@http:Payload RotaTaskInsert rotaData) returns [RotaTask, Assignment[]]|error {

    // Get all roommate IDs from roommateTable
    string[] allRoommateIds = [];
    foreach Roommate r in roommateTable.toArray() {
        allRoommateIds.push(r.userId);
    }

    // Check if we have roommates
    if allRoommateIds.length() == 0 {
        return error("No roommates found to assign tasks to");
    }

    // Create the new rota      
    RotaTask newRota = {
            id: uuid:createRandomUuid(),
            taskId: rotaData.taskId,
            roommateIds: allRoommateIds,
            startDate: rotaData.startDate,
            frequency: rotaData.frequency,
            day: rotaData.day,
            history: [],
            currentIndex: 0,
            currentAssignee: allRoommateIds[0]
        };

    // Store in rotaTable
    rotaTable.put(newRota);

    // Generate assignments for, say, the next 30 days
    Assignment[] assignments = check generateSchedule(newRota, 30);

    return [newRota, assignments];
}

// Get all rotas
resource function get rotas() returns RotaTask[] {
    return rotaTable.toArray();
}

// View current assignee for a rota
resource function get rotas/[string id]/current() returns string|http:NotFound {
    RotaTask? rota = rotaTable[id];
    if rota is () {
        return http:NOT_FOUND;
    }
    return rota.currentAssignee;
}

// Add a new expense
resource function post expense(ExpenseInsert data) returns Expense|string {
    Expense expense = {
        id: uuid:createRandomUuid(),
        payer: data.payer,
        amount: data.amount,
        participants: data.participants,
        date: data.date,
        owes: {}, 
        status: ""
    };

    if expense.participants.length() == 1 {
        expense.status = "Paid in full";
    } else {
        decimal share = expense.amount / expense.participants.length();
        foreach string person in expense.participants {
            if person != expense.payer {
                expense.owes[person] = share;
            }
        }
        expense.status = "Pending";
    }

    expenseTable.put(expense);
    return expense;
}

// Get all expenses
resource function get expenses() returns Expense[] {
    return from var e in expenseTable
        select e;
}

// Delete an expense by ID and return remaining
resource function delete expense/[string id]() returns Expense[] {
    if expenseTable.hasKey(id) {
        _ = expenseTable.remove(id);
    }
    return from var e in expenseTable
        select e;
    }
}

function generateRoomCode() returns string {
    int roomCount = userTable.length();
    int nextNumber = roomCount + 1;
    return string `RM${nextNumber.toString().padStart(4, "0")}`;
}

  //  send room code via email
// function sendRoomCodeEmail(string ownerId, string roomCode) returns error? {
//     string ownerEmail = check getOwnerEmail(ownerId);

//     gmail:MessageRequest message = {
//         to: [ownerEmail],
//         subject: "Room code generated",
//         bodyInHtml: string `<!DOCTYPE html>
//                             <html>
//                                 <head>
//                                     <title>Room Code</title>
//                                 </head>
//                                 <body>
//                                     <p>The room code of your newly created room is <strong>${roomCode}</strong>.</p>
//                                 </body>
//                             </html>`
//     };

//     gmail:Message _ = check gmailClient->/users/me/messages/send.post(message);
// }

// function getOwnerEmail(string ownerId) returns string|error {
//     string? email = from var u in userTable
//                     where u.id == ownerId
//                     select u.email;

//     if email is string {
//         return email;
//     } else {
//         return error("Owner not found");
//     }
// }




    