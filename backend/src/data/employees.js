let base = [
  { id: "emp_001", name: "Priya Sharma", role: "Senior Engineer", department: "Engineering", initials: "PS", joiningDate: "2021-04-12" },
  { id: "emp_002", name: "John Doe", role: "Product Designer", department: "Design", initials: "JD", joiningDate: "2022-01-10" },
  { id: "emp_003", name: "Marcus Vance", role: "Senior Developer", department: "Engineering", initials: "MV", joiningDate: "2020-09-01" },
  { id: "emp_004", name: "Elena Rostova", role: "Product Manager", department: "Product", initials: "ER", joiningDate: "2019-06-17" },
  { id: "emp_005", name: "Sarah Jenkins", role: "HR Director", department: "Human Resources", initials: "SJ", joiningDate: "2018-03-05" },
  { id: "emp_006", name: "Daniel Kim", role: "QA Engineer", department: "Engineering", initials: "DK", joiningDate: "2022-11-21" },
  { id: "emp_007", name: "Amara Okafor", role: "Marketing Lead", department: "Marketing", initials: "AO", joiningDate: "2021-02-14" },
  { id: "emp_008", name: "Liam Chen", role: "DevOps Engineer", department: "Engineering", initials: "LC", joiningDate: "2023-05-30" },
  { id: "emp_009", name: "Fatima Al-Sayed", role: "Finance Analyst", department: "Finance", initials: "FA", joiningDate: "2020-01-20" },
  { id: "emp_010", name: "Tom Becker", role: "Sales Executive", department: "Sales", initials: "TB", joiningDate: "2022-07-08" },
  { id: "emp_011", name: "Nina Petrova", role: "UX Researcher", department: "Design", initials: "NP", joiningDate: "2021-10-04" },
  { id: "emp_012", name: "Ravi Patel", role: "Backend Engineer", department: "Engineering", initials: "RP", joiningDate: "2023-02-27" },
  // Self-service employee — the person EmployeeDashboardPage.jsx and EmployeeProfilePage.jsx represent.
  { id: "emp_013", name: "Swaraj Kadam", role: "Software Engineer", department: "Engineering", initials: "SK", joiningDate: "2022-03-14" },
];

function slugEmail(name) {
  return name.toLowerCase().replace(/[^a-z\s]/g, "").trim().replace(/\s+/g, ".") + "@greathire.com";
}

function employeeCode(id) {
  // emp_013 -> GH-1013
  let n = id.replace("emp_", "");
  return `GH-1${n}`;
}

function seededScore(id, min, max) {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return min + (hash % (max - min + 1));
}

function seedDocuments(name) {
  let firstName = name.split(" ")[0];
  return [
    { name: "Offer_Letter.pdf", note: "Added on joining", type: "pdf" },
    { name: "ID_Proof_Passport.pdf", note: "Verified", type: "image" },
    { name: `Resume_${firstName}.pdf`, note: "On file", type: "image" },
  ];
}

export let employees = base.map((e) => ({
  ...e,
  avatar: null,
  employeeCode: employeeCode(e.id),
  email: slugEmail(e.name),
  phone: `+1 (555) 0${seededScore(e.id + "phone", 10, 99)}-${seededScore(e.id + "phone2", 1000, 9999)}`,
  performanceScore: seededScore(e.id + "perf", 82, 98),
  taskLoadPercent: seededScore(e.id + "load", 35, 85),
  // Annual leave-day allocations; balances are computed at request time from approved leave.
  leaveAllocation: { casual: 6, paid: 12, sick: 4 },
  documents: seedDocuments(e.name),
}));

export let departments = [...new Set(employees.map((e) => e.department))];

/** No auth system yet — this is the employee EmployeeDashboardPage/EmployeeProfilePage act as "me". */
export let CURRENT_EMPLOYEE_ID = "emp_013";
