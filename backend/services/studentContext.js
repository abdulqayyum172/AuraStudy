import { HIGHER_INSTITUTION_LEVELS, SSS_LEVELS, getSubjectsForClass, getCoursesForDepartment } from '../config/constants.js';

export function buildStudentContext(classLevel, course, stream, department) {
  if (!classLevel) return '';
  if (HIGHER_INSTITUTION_LEVELS.includes(classLevel)) {
    const deptCourses = department ? getCoursesForDepartment(department) : [];
    const coursesList = deptCourses.length > 0
      ? ` The ${department || 'department'} offers the following courses: ${deptCourses.join(', ')}.`
      : '';
    if (course) {
      const deptNote = department ? ` in the ${department} department` : '';
      return `The student is a ${classLevel} student studying ${course}${deptNote} at a higher institution (university/polytechnic).${coursesList} Tailor explanations, examples, and terminology to that course and level. `;
    }
    return `The student is a ${classLevel} student at a higher institution.${coursesList} `;
  }
  if (SSS_LEVELS.includes(classLevel) && stream) {
    return `The student is currently in ${classLevel} on the ${stream} stream. Tailor explanations, examples, and vocabulary to be appropriate for that level and stream (subjects: ${getSubjectsForClass(classLevel, stream).join(', ')}). `;
  }
  return `The student is currently in ${classLevel}. Tailor explanations, examples, and vocabulary to be appropriate for that level. `;
}
