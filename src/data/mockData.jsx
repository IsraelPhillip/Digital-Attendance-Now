// No interfaces in JavaScript

const departments = ["Engineering", "Marketing", "HR", "Finance", "Operations", "Sales", "Design", "Support"];
const positions = ["Manager", "Senior", "Junior", "Lead", "Intern", "Director", "Analyst", "Specialist"];
const firstNames = ["John", "Jane", "Samuel", "Ada", "Chigozie", "Mohammed", "Richard", "Sameer", "Grace", "David", "Sarah", "Michael", "Emily", "Daniel", "Olivia", "James", "Sophia", "Robert", "Emma", "William", "Ava", "Joseph", "Mia", "Charles", "Isabella", "Thomas", "Charlotte", "Andrew", "Amelia", "Henry", "Harper", "Benjamin", "Evelyn", "Alexander", "Abigail", "Sebastian", "Ella", "Jack", "Scarlett", "Owen"];
const lastNames = ["Doe", "Ene", "Jude", "Ali", "Fernando", "Bashiru", "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen", "King"];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateEmployees(count) {
  const employees = [];
  for (let i = 1; i <= count; i++) {
    const first = randomFrom(firstNames);
    const last = randomFrom(lastNames);
    employees.push({
      id: String(i).padStart(3, "0"),
      name: `${first} ${last}`,
      department: randomFrom(departments),
      position: randomFrom(positions),
      email: `${first.toLowerCase()}.${last.toLowerCase()}@company.com`,
      phone: `+1-${Math.floor(200 + Math.random() * 800)}-${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
      attendanceRate: Math.floor(60 + Math.random() * 40),
    });
  }
  return employees;
}

function generateAttendance(employees) {
  const records = [];
  const today = new Date();

  for (let d = 0; d < 7; d++) {
    const date = new Date(today);
    date.setDate(date.getDate() - d);

    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const dateStr = date.toISOString().split("T")[0];
    const presentCount = Math.floor(employees.length * (0.6 + Math.random() * 0.35));
    const shuffled = [...employees].sort(() => Math.random() - 0.5);

    for (let i = 0; i < shuffled.length; i++) {
      const emp = shuffled[i];
      const isPresent = i < presentCount;
      const hour = 7 + Math.floor(Math.random() * 3);
      const min = Math.floor(Math.random() * 60);
      const isLate = hour >= 9;
      const isEarly = hour < 8;

      records.push({
        employeeId: emp.id,
        employeeName: emp.name,
        date: dateStr,
        timeIn: isPresent ? `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}` : "--",
        status: isPresent
          ? isLate
            ? "Late"
            : isEarly
            ? "Early"
            : "Present"
          : "Absent",
      });
    }
  }

  return records.sort((a, b) => b.date.localeCompare(a.date));
}

// Generated data
export const employees = generateEmployees(497);
export const attendanceRecords = generateAttendance(employees);

// Security access list
export const securityAccessList = [
  { id: "1", code: "SEC000012233", name: "Ada Ene", password: "Password 01", dateCreated: "2026-01-15" },
  { id: "2", code: "SEC000012234", name: "Chigozie Jude", password: "Password 02", dateCreated: "2026-02-01" },
  { id: "3", code: "SEC000012235", name: "Mohammed Ali", password: "Password 03", dateCreated: "2026-02-20" },
];

// Utility functions
export function getTodayStr() {
  return new Date().toISOString().split("T")[0];
}

export function getTodayAttendance() {
  const today = getTodayStr();
  return attendanceRecords.filter((r) => r.date === today);
}

export function getWeeklyData() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const today = new Date();
  const result = [];

  for (let i = 4; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(
      d.getDate() -
        ((today.getDay() - 1 + 7) % 7) +
        days.indexOf(days[4 - i])
    );

    const dateStr = d.toISOString().split("T")[0];
    const dayRecords = attendanceRecords.filter((r) => r.date === dateStr);
    const present = dayRecords.filter((r) => r.status !== "Absent").length;

    result.push({
      day: days[4 - i],
      present,
      total: employees.length,
    });
  }

  return result;
}