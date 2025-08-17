import ballerina/constraint;

type UserInsert record {|
    string name;
    string email;
    string contactNumber;
|};

type User record {|
    readonly string id; 
    *UserInsert;          
|};
type RoomInsert record {|  
    string ownerId;
    string name;         
    string[] roommateIds;   
|};

type Room record {|
    readonly string id;
    string roomCode;   
    *RoomInsert;     
|};

type RoommateInsert record {|
    @constraint:String {minLength: 2}   
    string roomCode; 
    int[] busyDays;
    string[] dislikedChores?;
|};

public type Roommate record {
    readonly string userId;
    *UserInsert;
    *RoommateInsert;
};

public enum TaskStatus {
    PENDING = "Pending",
    COMPLETED = "Completed",
    NEGLECTED = "Neglected"
};

public type Assignment record {
    readonly string id;
    string taskName;
    string assignedDate;     
    string assigneeId;     
    TaskStatus status = PENDING;
};

type RotaTaskInsert record {|      
    string taskName;
    string[] roommateIds; // IDs of all roommates in this rota 
    string startDate; // yyyy-mm-dd   
    string frequency; // daily,weekly,monthly
    int day; // how often to rotate for weekly day of week, for monthly day of month  , 0 for sunday
    Assignment[] history = [];
|};

type RotaTask record {|
    readonly string id;
    *RotaTaskInsert;
    int currentIndex = 0;
    string currentAssignee;
|};

type ExpenseInsert record {|
    string payer;
    decimal amount;
    string[] participants; // All people responsible
    string date; 
    map<decimal>owes;
    string status; 
|};

public type Expense record {
    readonly string id;
    *ExpenseInsert;
   
};


// type TaskInsert record {|
//    @constraint:String {minLength: 3}
//     string title;    
    
// |};

// public type Task record {
//     readonly string id;
//     *TaskInsert; 
// };

// type completedTask record {|
//     TaskStatus status;
//     string completedDate;
// |};