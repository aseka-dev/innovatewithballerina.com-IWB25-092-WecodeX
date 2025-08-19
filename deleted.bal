 // Get all expenses
    // resource function get expenses(http:Caller caller) returns error? {
    //     Expense[] allExpenses = from var e in expenseTable select e;
    //     check caller->respond(allExpenses);
    // }

    // // Delete an expense by ID
    // resource function delete expenses/(string id) returns json {
    //     if expenseTable.hasKey(id) {
    //         Expense expense = expenseTable.remove(id);
    //         return { message: "Expense deleted" };
    //     } else {
    //         return { "Expense not found"};
    //     }
    // }

// function sendRoomCodeEmail(string ownerId, string roomCode, string roomName) returns error? {
    //     // Get user email from userTable
    //     User? owner = userTable[ownerId];
    //     if owner is () {
    //         return error("Owner not found");
    //     }
        
    //     // Create email client
    //     email:SmtpClient smtpClient = check new (smtpHost, smtpUsername, smtpPassword, smtpPort);
        
    //     // Prepare email content
    //     email:Message emailMessage = {
    //         to: [owner.email],
    //         subject: "Your Room Code - " + roomName,
    //         body: "Hello " + owner.name + ",\n\n" +
    //                "Your room '" + roomName + "' has been created successfully!\n" +
    //                "Room Code: " + roomCode + "\n\n" +
    //                "Share this code with your roommates so they can join the room.\n\n" +
    //                "Best regards,\nRoomSync Team"
    //     };
        
    //     // Send email
    //     check smtpClient->sendMessage(emailMessage);
        
    //     // Close the client
    //     check smtpClient->close();
        
    //     return;
    // }
    
// Email configuration
// configurable string smtpHost = ?;
// configurable int smtpPort = ?;
// configurable string smtpUsername = ?;
// configurable string smtpPassword = ?;


// [connectionOptions]
// useSSL = false
// allowPublicKeyRetrieval = true

// [connectionOptions]
// ssl = false
// publicKeyRetrieval = true
