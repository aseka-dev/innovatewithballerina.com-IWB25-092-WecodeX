import ballerina/constraint;

type UserInsert record {|
    string name;
    string email;
    string contactNumber;
    string password;
|};

type User record {|
    readonly string id; 
    *UserInsert;          
|};

type LoginRequest record {|
    string email;
    string password;
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

type RoommateRequest record {|
    User user;
    RoommateInsert roommate;
|};

type TaskInsert record {|
   @constraint:String {minLength: 3}
    string title;    
    string description;
    string category;
|};

public type Task record {
    readonly string id;
    *TaskInsert; 
};

public enum TaskStatus {
    PENDING = "Pending",
    COMPLETED = "Completed",
     NEGLECTED = "Neglected"
};

public type Assignment record {
    readonly string id;
    string taskId;
    string assigneeId;
    string assignedDate;    
    TaskStatus status = PENDING;
};

type RotaTaskInsert record {|      
    string taskId;
    string startDate; // yyyy-mm-dd   
    string frequency; // daily,weekly,monthly
    int day; // how often to rotate for weekly day of week, for monthly day of month  , 0 for sunday
    Assignment[] history = [];
|};

type RotaTask record {|
    readonly string id;
    *RotaTaskInsert;
    string[] roommateIds;
    int currentIndex = 0;
    string currentAssignee;
|};

type ExpenseInsert record {|
    string title;
    string description;
    string payer;
    decimal amount;
    string[] participants; // All people responsible
    string addedDate; 
|};

public type Expense record {
    readonly string id;
    *ExpenseInsert;
    map<decimal>owes;
    string status;   
};



