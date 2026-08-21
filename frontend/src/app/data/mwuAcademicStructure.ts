export interface CollegeDepartment {
  college: string;
  departments: string[];
}

export const MWU_OFFICIAL_COLLEGES: CollegeDepartment[] = [
  {
    college: "College of Computing",
    departments: [
      "Computer Science",
      "Information Technology",
      "Information Systems",
      "Software Engineering",
      "Data Science"
    ]
  },
  {
    college: "College of Engineering",
    departments: [
      "Civil Engineering",
      "Electrical & Computer Engineering",
      "Mechanical Engineering",
      "Construction Engineering & Management",
      "Surveying and Geomatics Engineering",
      "Hydraulic and Water Resources Engineering"
    ]
  },
  {
    college: "College of Health Sciences & Medicine (Goba Campus)",
    departments: [
      "Medicine",
      "Public Health",
      "Nursing",
      "Midwifery",
      "Pharmacy",
      "Medical Laboratory Science",
      "Anesthesia"
    ]
  },
  {
    college: "College of Business and Economics",
    departments: [
      "Accounting and Finance",
      "Economics",
      "Management",
      "Public Administration and Development Management",
      "Marketing Management",
      "Logistics and Supply Chain Management"
    ]
  },
  {
    college: "College of Natural and Computational Sciences",
    departments: [
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "Statistics",
      "Biotechnology",
      "Sport Science"
    ]
  },
  {
    college: "College of Social Sciences and Humanities",
    departments: [
      "Afan Oromo and Literature",
      "English Language and Literature",
      "Amharic Language and Literature",
      "Sociology",
      "Geography and Environmental Studies",
      "History and Heritage Management",
      "Civics and Ethical Studies",
      "Journalism and Communication"
    ]
  },
  {
    college: "College of Agriculture and Natural Resources",
    departments: [
      "Plant Science",
      "Animal Science",
      "Natural Resource Management",
      "Agricultural Economics",
      "Horticulture",
      "Agribusiness and Value Chain Management",
      "Forestry"
    ]
  },
  {
    college: "College of Education and Behavioral Studies",
    departments: [
      "Educational Planning and Management",
      "Psychology",
      "Special Needs and Inclusive Education",
      "Curriculum and Instruction"
    ]
  },
  {
    college: "School of Law",
    departments: [
      "Law (LL.B)"
    ]
  }
];

export const MWU_OFFICIAL_PROGRAMS: string[] = [
  "Undergraduate Regular",
  "Undergraduate Extension (Evening)",
  "Undergraduate Weekend",
  "Undergraduate Summer (Kiremt)",
  "Postgraduate Regular (Master's)",
  "Postgraduate Weekend (Master's)",
  "Postgraduate Summer (Master's)",
  "Doctoral Program (PhD)"
];
