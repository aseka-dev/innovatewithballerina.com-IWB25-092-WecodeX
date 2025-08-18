import ballerina/time;
import ballerina/uuid;

function generateSchedule(RotaTask rota, int daysToGenerate) returns error|Assignment[] {

    Assignment[] assignments = [];
    //Get the current UTC time
    time:Utc currentTime = time:utcNow();

    // Convert the UTC time to a Civil time (date and time)
    time:Civil today = time:utcToCivil(currentTime);
    
    int totalRoommates = rota.roommateIds.length();
        if totalRoommates == 0 {
            return assignments;
}

foreach int i in 0..<daysToGenerate {
    time:Civil currentDate = check addDaysToCivil(today, i);
    string dateStr = formatCivilDate(currentDate);

    boolean shouldAssign = false;
    int rotaWeekday = 0;

    if rota.frequency == "daily" {
        shouldAssign = true;
    } else if rota.frequency == "weekly" {
        time:Date dateOnly = { year: currentDate.year, month: currentDate.month, day: currentDate.day };
        int weekday = time:dayOfWeek(dateOnly);
        rotaWeekday = (weekday == 0) ? 7 : weekday;
        if rotaWeekday == rota.day {
            shouldAssign = true;
        }
    } else if rota.frequency == "monthly" {
        if currentDate.day == rota.day {
            shouldAssign = true;
        }
    }

    if shouldAssign {
        if rota.currentIndex >= totalRoommates {
            rota.currentIndex = 0;
        }

        string assigneeId = rota.roommateIds[rota.currentIndex];

        Roommate? roommate = roommateTable.get(assigneeId);
        if (roommate is Roommate) {
            if (!intArrayContains(roommate.busyDays, rotaWeekday)) {
                Assignment task = {
                    id: uuid:createRandomUuid(),
                    taskId: rota.taskId,
                    assignedDate: dateStr,
                    assigneeId: assigneeId
                };
                assignmentTable.put(task);
                assignments.push(task);
                rota.currentIndex = (rota.currentIndex + 1) % totalRoommates;
            } else {
                rota.currentIndex = (rota.currentIndex + 1) % totalRoommates;
            }
        } else {
            rota.currentIndex = (rota.currentIndex + 1) % totalRoommates;
        }
    }
}
return  assignments;
}

function addDaysToCivil(time:Civil civil, int days) returns time:Civil|error {
    return time:utcToCivil(time:utcAddSeconds(check time:utcFromCivil(civil), days * 86400));
}

function formatCivilDate(time:Civil civil) returns string {
    return string `${civil.year}-${civil.month}-${civil.day}`;
}

function intArrayContains(int[] arr, int val) returns boolean {
        foreach int i in arr {
            if i == val {
                return true;
            }
        }
        return false;
}

