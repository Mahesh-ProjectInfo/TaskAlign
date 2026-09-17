export const MD_ASSIGNMENT_TYPES = [
  "Software Project Assignment",
  "Manufacturing Job Assignment",
  "Construction Project Assignment",
  "Sales Region Assignment",
];

export const SEED_ROLES = [
  {
    type: "Software Project Assignment",
    names: ["Backend Developer", "Frontend Developer", "QA Engineer", "DevOps Engineer"],
  },
  {
    type: "Manufacturing Job Assignment",
    names: [
      "Machine Operator",
      "Assembly Technician",
      "Production Supervisor",
      "Quality Inspector",
    ],
  },
  {
    type: "Construction Project Assignment",
    names: ["Civil Engineer", "Site Supervisor", "Plumbing Engineer", "Safety Officer"],
  },
  {
    type: "Sales Region Assignment",
    names: ["Sales Executive", "Territory Manager", "Sales Manager", "Key Account Executive"],
  },
];

export const SEED_SKILLS = [
  {
    type: "Software Project Assignment",
    names: ["Java", "Spring Boot", "React", "REST API", "Database Design"],
  },
  {
    type: "Manufacturing Job Assignment",
    names: [
      "Machine Operation",
      "Product Assembly",
      "Packaging",
      "Product Testing",
      "Quality Inspection",
    ],
  },
  {
    type: "Construction Project Assignment",
    names: [
      "Structural Design",
      "Concrete Technology",
      "Site Planning",
      "Electrical Wiring",
      "Material Testing",
    ],
  },
  {
    type: "Sales Region Assignment",
    names: [
      "Product Knowledge",
      "Customer Communication",
      "Negotiation",
      "Lead Generation",
      "Territory Management",
    ],
  },
];

let _id = 1;
export const nextId = () => `${Date.now()}-${_id++}`;

export function buildInitialRoles() {
  const out = [];
  SEED_ROLES.forEach(({ type, names }) =>
    names.forEach((n) => out.push({ id: nextId(), type, name: n })),
  );
  return out;
}

export function buildInitialSkills() {
  const out = [];
  SEED_SKILLS.forEach(({ type, names }) =>
    names.forEach((n) => out.push({ id: nextId(), type, name: n })),
  );
  return out;
}

export const SEED_RESOURCES = [
  {
    id: nextId(),
    type: "Software Project Assignment",
    name: "Aarav Sharma",
    role: "Backend Developer",
    salary: 90000,
    rating: 88,
    skills: ["Java", "Spring Boot", "REST API"],
  },
  {
    id: nextId(),
    type: "Software Project Assignment",
    name: "Priya Verma",
    role: "Frontend Developer",
    salary: 82000,
    rating: 91,
    skills: ["React", "REST API"],
  },
  {
    id: nextId(),
    type: "Manufacturing Job Assignment",
    name: "Ravi Kumar",
    role: "Machine Operator",
    salary: 45000,
    rating: 78,
    skills: ["Machine Operation", "Packaging"],
  },
  {
    id: nextId(),
    type: "Sales Region Assignment",
    name: "Neha Iyer",
    role: "Territory Manager",
    salary: 72000,
    rating: 84,
    skills: ["Negotiation", "Territory Management", "Product Knowledge"],
  },
];
