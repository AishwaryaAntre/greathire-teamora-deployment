export const employees = [
  { id: "emp_001", name: "Priya Sharma", role: "Senior Engineer", department: "Engineering", initials: "PS", avatar: null },
  { id: "emp_002", name: "John Doe", role: "Product Designer", department: "Design", initials: "JD", avatar: null },
  { id: "emp_003", name: "Marcus Vance", role: "Senior Developer", department: "Engineering", initials: "MV", avatar: null },
  { id: "emp_004", name: "Elena Rostova", role: "Product Manager", department: "Product", initials: "ER", avatar: null },
  { id: "emp_005", name: "Sarah Jenkins", role: "HR Director", department: "Human Resources", initials: "SJ", avatar: null },
  { id: "emp_006", name: "Daniel Kim", role: "QA Engineer", department: "Engineering", initials: "DK", avatar: null },
  { id: "emp_007", name: "Amara Okafor", role: "Marketing Lead", department: "Marketing", initials: "AO", avatar: null },
  { id: "emp_008", name: "Liam Chen", role: "DevOps Engineer", department: "Engineering", initials: "LC", avatar: null },
  { id: "emp_009", name: "Fatima Al-Sayed", role: "Finance Analyst", department: "Finance", initials: "FA", avatar: null },
  { id: "emp_010", name: "Tom Becker", role: "Sales Executive", department: "Sales", initials: "TB", avatar: null },
  { id: "emp_011", name: "Nina Petrova", role: "UX Researcher", department: "Design", initials: "NP", avatar: null },
  { id: "emp_012", name: "Ravi Patel", role: "Backend Engineer", department: "Engineering", initials: "RP", avatar: null },
];

export const departments = [...new Set(employees.map((e) => e.department))];
