import ballerina/http;
import ballerina/uuid;

table<User> key (id) userTable = table [];
table<Roommate> key(userId) roommateTable = table [];
table<Assignment> key(id) assignmentTable = table [];
table<RotaTask> key(id) rotaTable = table [];
table<Expense> key(id) expenseTable = table [];
// Room table removed - using database instead

// Email configuration
configurable string smtpHost = "smtp.gmail.com";
configurable int smtpPort = 587;
configurable string smtpUsername = ?;
configurable string smtpPassword = ?;

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
        return user;
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

      //   _ =  check sendRoomCodeEmail(data.ownerId, roomCode, data.name);
        
        return room;
    }

    // Add a new roommate
    resource function post roommates(User userData, RoommateInsert data) returns Roommate {
        Roommate roommate = {
            userId: userData.id,
            name: userData.name,
            email: userData.email,
            contactNumber: userData.contactNumber,
            roomCode: data.roomCode,
            busyDays: data.busyDays,
            dislikedChores: data.dislikedChores
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
    resource function patch roommates/[string id](RoommateInsert data) returns Roommate|http:NotFound|error {
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
            taskName: rotaData.taskName,
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
    resource function post expenses(ExpenseInsert data) returns Expense|string {
        Expense expense = {
            id: uuid:createRandomUuid(),
            ...data,
            owes: {}
        };     
        
        if expense.participants.length() == 1 {
            // Only one person responsible → No split
            expense.status = "Paid in full";
        } else {
            // Split equally among responsible people
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
        return from var e in expenseTable select e;
    }

    // Delete an expense by ID and return remaining
    resource function delete expenses/[string id]() returns Expense[] {
        if expenseTable.hasKey(id) {
            _ = expenseTable.remove(id);
        }
        return from var e in expenseTable select e;
    }  
}

function generateRoomCode() returns string {
    int roomCount = userTable.length();
    int nextNumber = roomCount + 1;
    return string `RM${nextNumber.toString().padStart(4, "0")}`;
}
