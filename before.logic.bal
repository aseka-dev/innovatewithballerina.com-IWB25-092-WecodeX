// function generateSchedule(RotaTask rota, int daysToGenerate) returns error|Assignment[] {

//     Assignment[] assignments = [];
//     //Get the current UTC time
//     time:Utc currentTime = time:utcNow();

//     // Convert the UTC time to a Civil time (date and time)
//     time:Civil today = time:utcToCivil(currentTime);
    
//     int totalRoommates = rota.roommateIds.length();

//   foreach int i in 0..< daysToGenerate {
//         time:Civil currentDate =  check addDaysToCivil(today, i);
//         string dateStr = formatCivilDate(currentDate);

//         boolean shouldAssign = false;
//         int rotaWeekday = 0; // Initialize outside the frequency blocks

//         if rota.frequency == "daily" {
//             shouldAssign = true;
//         } else if rota.frequency == "weekly" {
//             // dayOfWeek() takes a Date, returns 0=Sunday .. 6=Saturday
//             time:Date dateOnly = { year: currentDate.year, month: currentDate.month, day: currentDate.day };
//             int weekday = time:dayOfWeek(dateOnly);

//             // Adjust if rota.day uses 1=Monday...7=Sunday
//             rotaWeekday = (weekday == 0) ? 7 : weekday; 

//             if rotaWeekday == rota.day {
//                 shouldAssign = true;
//             }
//         } else if (rota.frequency == "monthly") {
//             int dom = currentDate.day;
//             if dom == rota.day {
//                 shouldAssign = true;
//             }
//         }
        
//          if shouldAssign {
//             string assigneeId = rota.roommateIds[rota.currentIndex];
           
//             Roommate? roommate = roommateTable.get(assigneeId);
            
//             if (roommate is Roommate) {
//                 // Check if roommate is available (not busy) on this weekday
//                 if (!intArrayContains(roommate.busyDays, rotaWeekday)) {
//                     // Create new task for this schedule
//                     Assignment task = {
//                         id: uuid:createRandomUuid(),
//                         task: rota.task,
//                         assignedDate: dateStr,
//                         assigneeId: assigneeId
//                     };
//                     assignmentTable.put(task);
                    
//                     assignments.push(task);
//                     // Move to next roommate
//                     rota.currentIndex = (rota.currentIndex + 1) % totalRoommates;
//                 } else {
//                     // Roommate is busy, try next roommate
//                     rota.currentIndex = (rota.currentIndex + 1) % totalRoommates;
//                 }
//             } else {
//                 // Roommate not found, try next roommate
//                 rota.currentIndex = (rota.currentIndex + 1) % totalRoommates;
//             }
//          } 
//      } 
//     return assignments;    
// }

// function addDaysToCivil(time:Civil civil, int days) returns time:Civil|error {
//     return time:utcToCivil(time:utcAddSeconds(check time:utcFromCivil(civil), days * 86400));
// }

// function formatCivilDate(time:Civil civil) returns string {
//     return string `${civil.year}-${civil.month}-${civil.day}`;
// }

// function intArrayContains(int[] arr, int val) returns boolean {
//         foreach int i in arr {
//             if i == val {
//                 return true;
//             }
//         }
//         return false;
// }