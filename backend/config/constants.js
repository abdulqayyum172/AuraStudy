// Class levels offered at signup
export const CLASS_LEVELS = [
  'Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5', 'Basic 6',
  'JSS 1', 'JSS 2', 'JSS 3',
  'SSS 1', 'SSS 2', 'SSS 3',
  '100 Level', '200 Level', '300 Level', '400 Level', '500 Level', 'Higher Institution (Other)'
];

export const HIGHER_INSTITUTION_LEVELS = [
  '100 Level', '200 Level', '300 Level', '400 Level', '500 Level', 'Higher Institution (Other)'
];

export const SSS_LEVELS = ['SSS 1', 'SSS 2', 'SSS 3'];
export const BASIC_LEVELS = ['Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5', 'Basic 6'];
export const JSS_LEVELS = ['JSS 1', 'JSS 2', 'JSS 3'];

export const SSS_STREAMS = ['Science', 'Art', 'Commercial'];

export const SUBJECTS_BASIC = [
  'Mathematics', 'English Language', 'Basic Science & Technology',
  'Social Studies', 'Civic Education', 'Cultural & Creative Arts',
  'Christian/Islamic Religious Studies', 'Physical & Health Education',
];

export const SUBJECTS_JSS = [
  'Mathematics', 'English Language', 'Basic Science & Technology',
  'Social Studies', 'Civic Education', 'Business Studies',
  'Agricultural Science', 'Computer Studies / ICT', 'French',
  'Christian/Islamic Religious Studies', 'Cultural & Creative Arts',
  'Physical & Health Education',
];

export const SUBJECTS_SSS_CORE = ['English Language', 'Mathematics', 'Civic Education'];

export const SUBJECTS_SSS_BY_STREAM = {
  Science: ['Physics', 'Chemistry', 'Biology', 'Further Mathematics', 'Agricultural Science', 'Geography', 'Computer Science'],
  Art: ['Literature-in-English', 'Government', 'History', 'Christian/Islamic Religious Studies', 'Fine Arts', 'French', 'Geography'],
  Commercial: ['Financial Accounting', 'Commerce', 'Economics', 'Business Studies / Office Practice', 'Marketing'],
};

export const DEPARTMENTS_WITH_COURSES = [
  { department: 'Sciences', courses: ['Computer Science', 'Information Technology', 'Physics', 'Chemistry', 'Mathematics', 'Statistics', 'Biochemistry', 'Microbiology', 'Agricultural Science'] },
  { department: 'Engineering', courses: ['Engineering (Electrical/Electronic)', 'Engineering (Mechanical)', 'Engineering (Civil)', 'Engineering (Chemical)'] },
  { department: 'Health Sciences', courses: ['Medicine & Surgery', 'Nursing Science', 'Pharmacy'] },
  { department: 'Management & Social Sciences', courses: ['Accounting', 'Business Administration', 'Economics', 'Banking & Finance', 'Mass Communication', 'Political Science', 'Sociology', 'Psychology'] },
  { department: 'Environmental Sciences', courses: ['Architecture'] },
  { department: 'Law', courses: ['Law'] },
  { department: 'Education', courses: ['Education'] },
  { department: 'Other', courses: ['Other'] },
];

export const DEPARTMENTS = DEPARTMENTS_WITH_COURSES.map(d => d.department);
export const COURSE_OPTIONS = DEPARTMENTS_WITH_COURSES.flatMap(d => d.courses);

export function getCoursesForDepartment(department) {
  return DEPARTMENTS_WITH_COURSES.find(d => d.department === department)?.courses || [];
}

export function getSubjectsForClass(classLevel, stream, department) {
  if (!classLevel) return [];
  if (HIGHER_INSTITUTION_LEVELS.includes(classLevel)) {
    return department ? getCoursesForDepartment(department) : [];
  }
  if (BASIC_LEVELS.includes(classLevel)) return SUBJECTS_BASIC;
  if (JSS_LEVELS.includes(classLevel)) return SUBJECTS_JSS;
  if (SSS_LEVELS.includes(classLevel)) {
    return stream ? [...SUBJECTS_SSS_CORE, ...(SUBJECTS_SSS_BY_STREAM[stream] || [])] : SUBJECTS_SSS_CORE;
  }
  return [];
}

export function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
