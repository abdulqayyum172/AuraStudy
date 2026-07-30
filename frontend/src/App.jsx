import React, { useState, useEffect, useRef, Component } from 'react';
import './App.css';
import heroImage from './assets/hero.png';
import logoImage from './assets/image(1).png';
import PlannerTab from './components/PlannerTab.jsx';
import PomodoroTab from './components/PomodoroTab.jsx';
import SettingsTab from './components/SettingsTab.jsx';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0f1117', color: '#e8eaed', fontFamily: "'Inter', sans-serif", padding: '40px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '12px' }}>Something went wrong</h2>
          <p style={{ color: '#8b8fa3', marginBottom: '20px', fontSize: '0.9rem' }}>A component crashed. Click below to recover.</p>
          <button onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }} style={{ padding: '10px 20px', background: '#7c5cfc', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
            Reload App
          </button>
          <pre style={{ marginTop: '20px', fontSize: '0.75rem', color: '#ff6b6b', maxWidth: '600px', textAlign: 'left', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{this.state.error?.toString()}{'\n'}{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
import {
  auth,
  onAuthStateChanged,
  signInWithGoogle,
  signInWithApple,
  handleRedirectResult,
  loginWithEmail,
  registerWithEmail,
  logout,
  requestFCMToken,
  onForegroundMessage,
  messaging,
} from './firebase.js';

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000/api'
  : 'https://aurastudy-znwp.onrender.com/api';

// Class levels offered at signup, grouped to mirror the Nigerian school
// system: Basic (Primary), JSS, SSS, and Higher Institution.
const HIGHER_INSTITUTION_LABEL = 'Higher Institution';
const CLASS_LEVEL_GROUPS = [
  { label: 'Basic', options: ['Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5', 'Basic 6'] },
  { label: 'JSS (Junior Secondary School)', options: ['JSS 1', 'JSS 2', 'JSS 3'] },
  { label: 'SSS (Senior Secondary School)', options: ['SSS 1', 'SSS 2', 'SSS 3'] },
  { label: HIGHER_INSTITUTION_LABEL, options: ['100 Level', '200 Level', '300 Level', '400 Level', '500 Level', 'Higher Institution (Other)'] },
];

// A level string belongs to the Higher Institution group if it appears in
// that group's options list above.
const isHigherInstitutionLevel = (level) =>
  CLASS_LEVEL_GROUPS.find(g => g.label === HIGHER_INSTITUTION_LABEL)?.options.includes(level) || false;

const SSS_GROUP_LABEL = 'SSS (Senior Secondary School)';

// A level string belongs to the SSS group if it appears in that group's
// options list above.
const isSSSLevel = (level) =>
  CLASS_LEVEL_GROUPS.find(g => g.label === SSS_GROUP_LABEL)?.options.includes(level) || false;

// SSS students choose a stream, which (together with the shared core
// subjects) determines their subject layout.
const SSS_STREAMS = ['Science', 'Art', 'Commercial'];

// Fixed subject layout for Basic and JSS classes — the same subjects apply
// across every grade in the group. SSS pairs a shared core with subjects
// specific to the chosen stream.
const SUBJECTS_BASIC = [
  'Mathematics', 'English Language', 'Basic Science & Technology',
  'Social Studies', 'Civic Education', 'Cultural & Creative Arts',
  'Christian/Islamic Religious Studies', 'Physical & Health Education',
];
const SUBJECTS_JSS = [
  'Mathematics', 'English Language', 'Basic Science & Technology',
  'Social Studies', 'Civic Education', 'Business Studies',
  'Agricultural Science', 'Computer Studies / ICT', 'French',
  'Christian/Islamic Religious Studies', 'Cultural & Creative Arts',
  'Physical & Health Education',
];
const SUBJECTS_SSS_CORE = ['English Language', 'Mathematics', 'Civic Education'];
const SUBJECTS_SSS_BY_STREAM = {
  Science: ['Physics', 'Chemistry', 'Biology', 'Further Mathematics', 'Agricultural Science', 'Geography', 'Computer Science'],
  Art: ['Literature-in-English', 'Government', 'History', 'Christian/Islamic Religious Studies', 'Fine Arts', 'French', 'Geography'],
  Commercial: ['Financial Accounting', 'Commerce', 'Economics', 'Business Studies / Office Practice', 'Marketing'],
};

// Returns the subject layout for a class level (and SSS stream or Higher
// Institution department, where relevant). Higher Institution uses the
// department's course list as its subject layout so the AI and UI can show
// what courses are available in that department.
const getSubjectsForClass = (level, stream, department) => {
  if (!level) return [];
  if (isHigherInstitutionLevel(level)) {
    return department ? getCoursesForDepartment(department) : [];
  }
  const group = CLASS_LEVEL_GROUPS.find(g => g.options.includes(level))?.label;
  if (group === 'Basic') return SUBJECTS_BASIC;
  if (group === 'JSS (Junior Secondary School)') return SUBJECTS_JSS;
  if (group === SSS_GROUP_LABEL) {
    return stream ? [...SUBJECTS_SSS_CORE, ...(SUBJECTS_SSS_BY_STREAM[stream] || [])] : SUBJECTS_SSS_CORE;
  }
  return [];
};

// Maps a user's class level to the most relevant Learn category IDs.
// Returns an object { primary, related } where `primary` is the single best
// category and `related` is an ordered list of all relevant categories.
const getCategoryForLevel = (level, stream) => {
  if (!level) return { primary: null, related: [] };
  const group = CLASS_LEVEL_GROUPS.find(g => g.options.includes(level))?.label;
  if (group === 'Basic') return { primary: 'primary', related: ['primary', 'junior-secondary'] };
  if (group === 'JSS (Junior Secondary School)') return { primary: 'junior-secondary', related: ['junior-secondary', 'primary'] };
  if (group === SSS_GROUP_LABEL) {
    if (stream === 'Science') return { primary: 'senior-secondary', related: ['senior-secondary', 'university'] };
    if (stream === 'Art') return { primary: 'senior-secondary', related: ['senior-secondary'] };
    if (stream === 'Commercial') return { primary: 'senior-secondary', related: ['senior-secondary'] };
    return { primary: 'senior-secondary', related: ['senior-secondary'] };
  }
  if (group === HIGHER_INSTITUTION_LABEL) return { primary: 'university', related: ['university', 'developer'] };
  return { primary: null, related: [] };
};

// Departments (faculties) offered when the signup class level is Higher
// Institution. Picking a department first narrows the course list below it,
// so the AI can reason about relevant, department-specific courses.
const DEPARTMENTS_WITH_COURSES = [
  { department: 'Sciences', courses: ['Computer Science', 'Information Technology', 'Physics', 'Chemistry', 'Mathematics', 'Statistics', 'Biochemistry', 'Microbiology', 'Agricultural Science'] },
  { department: 'Engineering', courses: ['Engineering (Electrical/Electronic)', 'Engineering (Mechanical)', 'Engineering (Civil)', 'Engineering (Chemical)'] },
  { department: 'Health Sciences', courses: ['Medicine & Surgery', 'Nursing Science', 'Pharmacy'] },
  { department: 'Management & Social Sciences', courses: ['Accounting', 'Business Administration', 'Economics', 'Banking & Finance', 'Mass Communication', 'Political Science', 'Sociology', 'Psychology'] },
  { department: 'Environmental Sciences', courses: ['Architecture'] },
  { department: 'Law', courses: ['Law'] },
  { department: 'Education', courses: ['Education'] },
  { department: 'Other', courses: ['Other'] },
];
const DEPARTMENTS = DEPARTMENTS_WITH_COURSES.map(d => d.department);
const getCoursesForDepartment = (department) =>
  DEPARTMENTS_WITH_COURSES.find(d => d.department === department)?.courses || [];

const LEARNING_CATEGORIES = [
  {
    id: 'primary',
    title: 'Primary School',
    subtitle: 'Basic 1 – Basic 6',
    color: 'var(--accent-primary)',
    topics: [
      { id: 'math-primary', name: 'Mathematics', desc: 'Numbers, arithmetic, fractions, money, measurement, and basic geometry' },
      { id: 'english-primary', name: 'English Language', desc: 'Reading comprehension, grammar, vocabulary, spelling, and creative writing' },
      { id: 'science-primary', name: 'Basic Science & Technology', desc: 'Living things, weather, matter, energy, and simple experiments' },
      { id: 'social-primary', name: 'Social Studies', desc: 'Our environment, culture, civic responsibilities, and Nigerian heritage' },
      { id: 'civic-primary', name: 'Civic Education', desc: 'Rights, duties, citizenship, and community values' },
      { id: 'ict-primary', name: 'Computer Studies', desc: 'Introduction to computers, parts of a computer, and basic operations' },
    ],
  },
  {
    id: 'junior-secondary',
    title: 'Junior Secondary School',
    subtitle: 'JSS 1 – JSS 3',
    color: 'var(--accent-secondary)',
    topics: [
      { id: 'math-jss', name: 'Mathematics', desc: 'Algebra, geometry, statistics, probability, and problem solving' },
      { id: 'english-jss', name: 'English Language', desc: 'Comprehension, summary, composition, and literature appreciation' },
      { id: 'bst', name: 'Basic Science & Technology', desc: 'Integrated science, computer studies, and practical technology' },
      { id: 'business-jss', name: 'Business Studies', desc: 'Introduction to commerce, entrepreneurship, and office practice' },
      { id: 'agriculture-jss', name: 'Agricultural Science', desc: 'Farming methods, crop production, animal husbandry, and agro-processing' },
      { id: 'french-jss', name: 'French Language', desc: 'Basic French conversation, grammar, and vocabulary' },
      { id: 'social-jss', name: 'Social Studies', desc: 'Nigerian society, culture, governance, and national development' },
    ],
  },
  {
    id: 'senior-secondary',
    title: 'Senior Secondary School',
    subtitle: 'SSS 1 – SSS 3 (Science / Art / Commercial)',
    color: 'var(--accent-primary)',
    topics: [
      { id: 'math-sss', name: 'Mathematics', desc: 'Calculus intro, trigonometry, vectors, matrices, and statistics' },
      { id: 'physics-sss', name: 'Physics', desc: 'Mechanics, waves, electricity, magnetism, and modern physics' },
      { id: 'chemistry-sss', name: 'Chemistry', desc: 'Atomic structure, chemical reactions, organic chemistry, and practicals' },
      { id: 'biology-sss', name: 'Biology', desc: 'Cells, genetics, ecology, evolution, and human biology' },
      { id: 'economics-sss', name: 'Economics', desc: 'Demand & supply, micro/macro economics, and the Nigerian economy' },
      { id: 'literature-sss', name: 'Literature-in-English', desc: 'Prose, poetry, drama, literary devices, and critical analysis' },
      { id: 'government-sss', name: 'Government', desc: 'Nigerian political system, constitutional law, and international relations' },
      { id: 'crs-sss', name: 'Christian/Islamic Religious Studies', desc: 'Religious texts, moral values, and comparative religion' },
    ],
  },
  {
    id: 'university',
    title: 'University & Higher Institution',
    subtitle: '100 Level – 500 Level',
    color: 'var(--accent-secondary)',
    topics: [
      { id: 'comp-sci', name: 'Computer Science', desc: 'Programming, algorithms, data structures, databases, and software engineering' },
      { id: 'engineering', name: 'Engineering', desc: 'Electrical, mechanical, civil, and chemical engineering principles' },
      { id: 'medicine', name: 'Medicine & Health Sciences', desc: 'Anatomy, physiology, pharmacology, pathology, and clinical practice' },
      { id: 'law-uni', name: 'Law', desc: 'Nigerian legal system, constitutional law, criminal law, and legal practice' },
      { id: 'business-admin', name: 'Business & Management', desc: 'Accounting, marketing, HR, finance, and strategic management' },
      { id: 'mass-comm', name: 'Mass Communication', desc: 'Journalism, media studies, public relations, and broadcasting' },
      { id: 'sciences-uni', name: 'Pure Sciences', desc: 'Physics, chemistry, mathematics, biochemistry, and microbiology' },
      { id: 'social-sciences', name: 'Social Sciences', desc: 'Economics, political science, sociology, psychology, and international relations' },
    ],
  },
  {
    id: 'developer',
    title: 'Developer & Programming',
    subtitle: 'For coders at every level',
    color: 'var(--accent-primary)',
    topics: [
      { id: 'web-dev', name: 'Web Development', desc: 'HTML, CSS, JavaScript, React, Node.js, and full-stack development' },
      { id: 'mobile-dev', name: 'Mobile Development', desc: 'React Native, Flutter, iOS (Swift), and Android (Kotlin)' },
      { id: 'python', name: 'Python Programming', desc: 'Core Python, Django, Flask, automation, and scripting' },
      { id: 'data-science', name: 'Data Science & AI', desc: 'Machine learning, deep learning, statistics, pandas, and TensorFlow' },
      { id: 'devops', name: 'DevOps & Cloud', desc: 'AWS, Docker, Kubernetes, CI/CD, Linux, and system administration' },
      { id: 'cybersecurity', name: 'Cybersecurity', desc: 'Network security, ethical hacking, cryptography, and defense strategies' },
      { id: 'databases', name: 'Databases & SQL', desc: 'MySQL, PostgreSQL, MongoDB, Redis, and database design' },
      { id: 'game-dev', name: 'Game Development', desc: 'Unity, Unreal Engine, game design, and 3D graphics programming' },
    ],
  },
];

// --- Comprehensive Nigerian Curriculum Data ---
const CURRICULUM_DATA = {
  'basic': {
    label: 'Basic (Primary School)',
    subtitle: 'Basic 1 – Basic 6',
    color: '#10b981',
    icon: '📚',
    levels: {
      'Basic 1': {
        subjects: [
          { name: 'Mathematics', icon: '🔢', topics: ['Counting 1-50', 'Addition within 10', 'Subtraction within 10', 'Shapes (circle, square, triangle)', 'Patterns', 'Measurement (long/short, heavy/light)'] },
          { name: 'English Language', icon: '📖', topics: ['Letter recognition A-Z', 'Phonics (letter sounds)', 'Simple 3-letter words', 'Reading simple sentences', 'Handwriting (uppercase & lowercase)', 'Picture comprehension'] },
          { name: 'Basic Science & Technology', icon: '🔬', topics: ['My body parts', 'Things around me', 'Plants and animals', 'Weather (sunny, rainy)', 'Water and its uses', 'Simple hygiene'] },
          { name: 'Social Studies', icon: '🌍', topics: ['My family', 'My school', 'My neighbourhood', 'Good manners', 'Rules in the home', 'Nigerian flags and symbols'] },
          { name: 'Civic Education', icon: '🏛️', topics: ['Being a good child', 'Honesty and truthfulness', 'Respect for elders', 'Sharing and cooperation', 'Personal hygiene', 'Safety at home'] },
          { name: 'Cultural & Creative Arts', icon: '🎨', topics: ['Singing and rhythm', 'Drawing and colouring', 'Clay modelling', 'Simple dances', 'Folk tales', 'Traditional games'] },
          { name: 'Physical & Health Education', icon: '🏃', topics: ['Walking and running exercises', 'Jumping and hopping', 'Ball handling', 'Personal cleanliness', 'Healthy eating', 'Rest and sleep'] },
        ]
      },
      'Basic 2': {
        subjects: [
          { name: 'Mathematics', icon: '🔢', topics: ['Counting 1-100', 'Addition within 20', 'Subtraction within 20', 'Place value (tens and ones)', 'Multiplication as repeated addition', 'Time (o\'clock)', 'Money (coins and notes)'] },
          { name: 'English Language', icon: '📖', topics: ['Consonant blends', 'Vowel sounds (short and long)', 'Simple comprehension passages', 'Sentence construction', 'Opposites (antonyms)', 'Singular and plural'] },
          { name: 'Basic Science & Technology', icon: '🔬', topics: ['Parts of a plant', 'Domestic animals', 'States of matter (solid, liquid, gas)', 'Air and its uses', 'Food and nutrition', 'Simple machines (lever, wheel)'] },
          { name: 'Social Studies', icon: '🌍', topics: ['My community', 'Occupations in my community', 'Types of houses', 'Means of transportation', 'Nigerian ethnic groups', 'National symbols'] },
          { name: 'Civic Education', icon: '🏛️', topics: ['Rights of children', 'Duties at home and school', 'Environmental cleanliness', 'Community helpers', 'Gender equality', 'Traffic rules'] },
          { name: 'Christian/Islamic Religious Studies', icon: '📖', topics: ['Creation stories', 'Prayer and worship', 'Good moral values from religion', 'Stories of prophets/religious leaders', 'Respect and kindness', 'Religious festivals'] },
          { name: 'Physical & Health Education', icon: '🏃', topics: ['Stretching exercises', 'Relay races', 'Hand-eye coordination games', 'Cleanliness of body', 'First aid basics', 'Effects of drugs'] },
        ]
      },
      'Basic 3': {
        subjects: [
          { name: 'Mathematics', icon: '🔢', topics: ['Addition and subtraction up to 999', 'Multiplication tables (1-5)', 'Division basics', 'Fractions (½, ¼, ⅓)', 'Word problems', 'Measurement (cm, m, kg, g)', 'Perimeter of squares and rectangles'] },
          { name: 'English Language', icon: '📖', topics: ['Comprehension passages', 'Story writing', 'Grammar: nouns, verbs, adjectives', 'Tenses (present, past)', 'Punctuation marks', 'Letter writing (informal)', 'Synonyms and antonyms'] },
          { name: 'Basic Science & Technology', icon: '🔬', topics: ['The solar system', 'Rocks and soil', 'Simple experiments', 'Electrical safety', 'The human body systems', 'Environmental pollution'] },
          { name: 'Social Studies', icon: '🌍', topics: ['Nigeria: states and capitals', 'Cultural festivals', 'Trade and commerce', 'Government and leadership', 'Our natural resources', 'Population and census'] },
          { name: 'Business Studies', icon: '💼', topics: ['Introduction to business', 'Buying and selling', 'Types of markets', 'Basic bookkeeping', 'Entrepreneurship basics', 'Money and banking'] },
          { name: 'Agricultural Science', icon: '🌱', topics: ['Crops and their uses', 'Simple farming tools', 'Seasons and farming', 'Soil types', 'Composting', 'Farm animals'] },
          { name: 'Computer Studies / ICT', icon: '💻', topics: ['Parts of a computer', 'Input and output devices', 'Computer memory', 'Using a mouse and keyboard', 'Basic file management', 'Internet safety'] },
        ]
      },
      'Basic 4': {
        subjects: [
          { name: 'Mathematics', icon: '🔢', topics: ['Multiplication tables (1-12)', 'Long division', 'Fractions and decimals', 'Factors and multiples', 'Area and perimeter', 'Angles (right, acute, obtuse)', 'Data handling (bar charts)'] },
          { name: 'English Language', icon: '📖', topics: ['Reading comprehension', 'Summary writing', 'Grammar: adverbs, prepositions, conjunctions', 'Direct and reported speech', 'Essay writing (narrative)', 'Idioms and colloquialisms'] },
          { name: 'Basic Science & Technology', icon: '🔬', topics: ['States of matter and changes', 'Simple machines (continued)', 'The water cycle', 'Energy and its forms', 'Food preservation methods', 'The respiratory system'] },
          { name: 'Social Studies', icon: '🌍', topics: ['Nigerian history (pre-colonial)', 'Colonial administration', 'Types of government', 'Cultural diversity in Nigeria', 'National development', 'International organizations'] },
          { name: 'Civic Education', icon: '🏛️', topics: ['Constitutional democracy', 'Human rights', 'Rule of law', 'Corruption and its effects', 'Environmental protection', 'Social values and norms'] },
          { name: 'Agricultural Science', icon: '🌱', topics: ['Crop diseases and pests', 'Irrigation methods', 'Livestock management', 'Fish farming basics', 'Agricultural marketing', 'Government agricultural policies'] },
          { name: 'Computer Studies / ICT', icon: '💻', topics: ['Introduction to spreadsheets', 'Word processing basics', 'Presentation software', 'Database concepts', 'Coding with Scratch', 'Digital citizenship'] },
        ]
      },
      'Basic 5': {
        subjects: [
          { name: 'Mathematics', icon: '🔢', topics: ['HCF and LCM', 'Ratio and proportion', 'Percentages', 'Simple interest', 'Profit and loss', 'Volume of cubes and cuboids', 'Coordinate geometry basics'] },
          { name: 'English Language', icon: '📖', topics: ['Formal letter writing', 'Comprehension and summary', 'Grammar: passive voice, conditionals', 'Punctuation (advanced)', 'Essay types (argumentative, expository)', 'Literary devices (simile, metaphor)'] },
          { name: 'Basic Science & Technology', icon: '🔬', topics: ['Electricity and circuits', 'Magnets and magnetism', 'The periodic table basics', 'Human body systems (continued)', 'Space and technology', 'Climate change'] },
          { name: 'Social Studies', icon: '🌍', topics: ['Nigerian independence', 'Political parties', 'Elections and voting', 'Economic activities in Nigeria', 'Population growth', 'National unity'] },
          { name: 'Business Studies', icon: '💼', topics: ['Types of business organizations', 'Commerce and industry', 'Basic accounting principles', 'Marketing concepts', 'Banking services', 'Insurance basics'] },
          { name: 'Agricultural Science', icon: '🌱', topics: ['Processing of farm produce', 'Storage methods', 'Agricultural tools and implements', 'Extension services', 'Environmental conservation', 'Government agencies in agriculture'] },
          { name: 'French', icon: '🇫🇷', topics: ['Greetings and introductions', 'Numbers and counting in French', 'Days, months, and seasons', 'Family members vocabulary', 'Colours and shapes', 'Simple conversations'] },
        ]
      },
      'Basic 6': {
        subjects: [
          { name: 'Mathematics', icon: '🔢', topics: ['Operations with fractions and decimals', 'Word problems (multi-step)', 'Algebraic expressions', 'Graphs and charts', 'Probability basics', 'Mensuration (cylinder, cone)', 'Matrices introduction'] },
          { name: 'English Language', icon: '📖', topics: ['Advanced comprehension', 'Summary and note-taking', 'Grammar review', 'Essay writing (all types)', 'Oral English and pronunciation', 'Literature appreciation', 'Library skills'] },
          { name: 'Basic Science & Technology', icon: '🔬', topics: ['The circulatory system', 'The digestive system', 'Chemical reactions', 'Environmental sustainability', 'Technology and innovation', 'Science project methods'] },
          { name: 'Social Studies', icon: '🌍', topics: ['Nigeria after independence', 'ECOWAS and African Union', 'Population census', 'Urbanization', 'Cultural heritage preservation', 'Global citizenship'] },
          { name: 'Civic Education', icon: '🏛️', topics: ['Constitutional law basics', 'The judiciary', 'Public accountability', 'Civil society organizations', 'Voter education', 'National identity'] },
          { name: 'Christian/Islamic Religious Studies', icon: '📖', topics: ['Moral lessons from scriptures', 'Religious tolerance', 'Community service', 'Ethical living', 'Interfaith dialogue', 'Religious leaders in Nigeria'] },
          { name: 'Physical & Health Education', icon: '🏃', topics: ['Athletics (track and field)', 'Team sports basics', 'Health and fitness', 'Drug education', 'First aid and emergency', 'Doping and fair play'] },
        ]
      }
    }
  },
  'jss': {
    label: 'Junior Secondary School',
    subtitle: 'JSS 1 – JSS 3',
    color: '#3b82f6',
    icon: '🎓',
    levels: {
      'JSS 1': {
        subjects: [
          { name: 'Mathematics', icon: '🔢', topics: ['Number bases (binary, decimal)', 'Fractions, decimals, percentages', 'Standard form and significant figures', 'Algebraic expressions and equations', 'Linear equations', 'Angles and parallel lines', 'Statistics: mean, median, mode'] },
          { name: 'English Language', icon: '📖', topics: ['Comprehension techniques', 'Summary writing', 'Grammar: parts of speech review', 'Tenses (all forms)', 'Essay writing: narrative and descriptive', 'Vocabulary development', 'Figure of speech'] },
          { name: 'Basic Science & Technology', icon: '🔬', topics: ['Cells and tissues', 'Plant and animal classification', 'Energy transformations', 'The periodic table', 'Acids, bases, and salts', 'Simple machines and mechanical advantage'] },
          { name: 'Social Studies', icon: '🌍', topics: ['Nigerian cultural heritage', 'Social values and norms', 'Nigeria: geographic regions', 'Population and development', 'Civic responsibilities', 'National identity'] },
          { name: 'Business Studies', icon: '💼', topics: ['Introduction to commerce', 'Trade and aids to trade', 'Types of business organizations', 'Office practice basics', 'Introduction to bookkeeping', 'Entrepreneurship'] },
          { name: 'Agricultural Science', icon: '🌱', topics: ['Agricultural ecology', 'Soil science basics', 'Crop production', 'Animal husbandry', 'Farm management', 'Agricultural extension'] },
          { name: 'Computer Studies / ICT', icon: '💻', topics: ['Computer systems overview', 'Operating systems', 'Word processing (advanced)', 'Spreadsheets (formulas)', 'Introduction to HTML', 'Cybersecurity basics'] },
          { name: 'French', icon: '🇫🇷', topics: ['Conversation practice', 'Grammar: articles and gender', 'Verbs (present tense)', 'Describing people and places', 'Shopping and dining vocabulary', 'French-speaking countries'] },
        ]
      },
      'JSS 2': {
        subjects: [
          { name: 'Mathematics', icon: '🔢', topics: ['Simultaneous equations', 'Quadratic equations (introduction)', 'Mensuration (surface area and volume)', 'Trigonometry basics (sin, cos, tan)', 'Probability', 'Data presentation (histograms, pie charts)', 'Inequalities'] },
          { name: 'English Language', icon: '📖', topics: ['Précis writing', 'Report writing', 'Grammar: concord and clause analysis', 'Phonetics introduction', 'Essay writing: argumentative and expository', 'Comprehension: inference and interpretation', 'Idiomatic expressions'] },
          { name: 'Basic Science & Technology', icon: '🔬', topics: ['Chemical bonding', 'The periodic table (Groups and Periods)', 'Ecology and ecosystems', 'The nervous system', 'Light and optics', 'Electrical circuits (series and parallel)'] },
          { name: 'Social Studies', icon: '🌍', topics: ['Nigerian political system', 'Types of government', 'Economic activities', 'Social problems in Nigeria', 'Population studies', 'International relations'] },
          { name: 'Business Studies', icon: '💼', topics: ['Commerce: home and foreign trade', 'Banking and finance', 'Marketing concepts', 'Insurance principles', 'Transport and communication', 'Public finance'] },
          { name: 'Agricultural Science', icon: '🌱', topics: ['Crop pests and diseases', 'Animal nutrition', 'Fishery and aquaculture', 'Forestry and wildlife', 'Agricultural tools and machines', 'Agricultural policies'] },
          { name: 'Computer Studies / ICT', icon: '💻', topics: ['Database management (Access)', 'Web design (HTML & CSS)', 'Programming logic', 'Networking basics', 'Data processing', 'Information systems'] },
          { name: 'Christian/Islamic Religious Studies', icon: '📖', topics: ['Bible/Quran study methods', 'Moral teachings', 'Religious history', 'Contemporary moral issues', 'Inter-faith relations', 'Religion and society'] },
        ]
      },
      'JSS 3': {
        subjects: [
          { name: 'Mathematics', icon: '🔢', topics: ['Quadratic equations (completing the square)', 'Variation (direct, inverse)', 'Matrices and determinants', 'Construction and loci', 'Trigonometry (sine and cosine rules)', 'Statistics (standard deviation)', 'Past JSSCE questions'] },
          { name: 'English Language', icon: '📖', topics: ['Advanced comprehension', 'Précis and summary', 'Grammar: advanced structures', 'Essay writing: all types', 'Literature: prose and poetry', 'Oral English examination', 'Creative writing'] },
          { name: 'Basic Science & Technology', icon: '🔬', topics: ['Organic chemistry basics', 'Cells and cell division', 'Energy and work', 'Electromagnetic induction', 'Industrial production', 'Environmental science'] },
          { name: 'Social Studies', icon: '🌍', topics: ['Nigerian constitution', 'Human rights in Nigeria', 'Population census', 'National development plans', 'Social welfare', 'Civic education (advanced)'] },
          { name: 'Business Studies', icon: '💼', topics: ['Office management', 'Typing and shorthand', 'Business communication', 'Entrepreneurship skills', 'Consumer education', 'Career planning'] },
          { name: 'Agricultural Science', icon: '🌱', topics: ['Agricultural economics', 'Food processing and storage', 'Agricultural engineering', 'Agricultural biology', 'Farm records and accounts', 'Agricultural marketing'] },
          { name: 'Computer Studies / ICT', icon: '💻', topics: ['Advanced web development', 'Programming (Python basics)', 'System analysis and design', 'Computer maintenance', 'Data communication', 'ICT in society'] },
          { name: 'French', icon: '🇫🇷', topics: ['Past tense verbs', 'Travel vocabulary', 'Health and body vocabulary', 'Writing short paragraphs', 'French literature basics', 'Francophone culture'] },
        ]
      }
    }
  },
  'sss': {
    label: 'Senior Secondary School',
    subtitle: 'SSS 1 – SSS 3',
    color: '#8b5cf6',
    icon: '🎓',
    streams: ['Science', 'Art', 'Commercial'],
    examBoards: ['WAEC', 'NECO', 'JAMB'],
    description: 'Senior Secondary education covers three years (SSS 1–3) with specialized streams in Science, Art, and Commercial. Students prepare for WAEC, NECO, and JAMB examinations.',
    levels: {
      'SSS 1': {
        core: ['English Language', 'Mathematics', 'Civic Education'],
        yearDesc: 'Foundation year — introducing core concepts across all subjects.',
        Science: [
          { name: 'Physics', icon: '⚡', desc: 'Study of matter, energy, and the fundamental forces of nature.', boards: ['WAEC', 'NECO', 'JAMB'], topics: ['Mechanics: motion and forces', 'Scalars and vectors', 'Energy and work', 'Properties of matter', 'Temperature and heat', 'Waves and sound'] },
          { name: 'Chemistry', icon: '🧪', desc: 'Science of substances — their composition, structure, properties, and reactions.', boards: ['WAEC', 'NECO', 'JAMB'], topics: ['Atomic structure', 'Periodic table (advanced)', 'Chemical bonding', 'Stoichiometry', 'States of matter', 'Gas laws'] },
          { name: 'Biology', icon: '🧬', desc: 'Study of living organisms — from cells to ecosystems.', boards: ['WAEC', 'NECO', 'JAMB'], topics: ['Cell biology', 'Classification of organisms', 'Tissues and systems', 'Plant biology', 'Ecology basics', 'Genetics introduction'] },
          { name: 'Further Mathematics', icon: '📐', desc: 'Advanced mathematical concepts beyond the standard curriculum.', boards: ['WAEC', 'NECO', 'JAMB'], topics: ['Logic and proof', 'Sets and Venn diagrams', 'Number bases (advanced)', 'Modular arithmetic', 'Matrices (advanced)', 'Trigonometry (ratios and graphs)'] },
          { name: 'Agricultural Science', icon: '🌱', desc: 'Principles of farming, crop production, and animal husbandry.', boards: ['WAEC', 'NECO'], topics: ['Agricultural ecology', 'Soil science', 'Crop production', 'Animal husbandry', 'Agricultural economics', 'Farm management'] },
          { name: 'Geography', icon: '🗺️', desc: 'Study of Earth\'s physical features, climate, and human populations.', boards: ['WAEC', 'NECO', 'JAMB'], topics: ['Earth as a planet', 'Tectonic processes', 'Climate and weather', 'Vegetation regions', 'Population geography', 'Nigerian geography'] },
          { name: 'Computer Science', icon: '💻', desc: 'Theory of computation, programming, and digital systems.', boards: ['WAEC', 'NECO', 'JAMB'], topics: ['Number systems', 'Boolean algebra', 'Logic gates', 'Computer architecture', 'Programming fundamentals', 'Data representation'] },
        ],
        Art: [
          { name: 'Literature-in-English', icon: '📚', desc: 'Critical reading and analysis of English literary works.', boards: ['WAEC', 'NECO', 'JAMB'], topics: ['Prose fiction', 'Poetry', 'Drama', 'Literary devices', 'African literature', 'Critical appreciation'] },
          { name: 'Government', icon: '🏛️', desc: 'Study of political systems, governance, and public administration.', boards: ['WAEC', 'NECO', 'JAMB'], topics: ['Political concepts', 'Nigerian political system', 'Constitutional law', 'Local government', 'Electoral process', 'Public administration'] },
          { name: 'History', icon: '📜', desc: 'Exploration of past events, civilizations, and their impact on the present.', boards: ['WAEC', 'NECO', 'JAMB'], topics: ['West African kingdoms', 'Trans-Saharan trade', 'European colonization', 'Nationalism and independence', 'Post-independence Africa', 'Contemporary issues'] },
          { name: 'Christian/Islamic Religious Studies', icon: '📖', desc: 'Study of religious texts, ethics, and the role of religion in society.', boards: ['WAEC', 'NECO'], topics: ['Bible/Quran studies', 'Moral philosophy', 'Religious ethics', 'Contemporary religious issues', 'Religion in Nigeria', 'Inter-faith dialogue'] },
          { name: 'Fine Arts', icon: '🎨', desc: 'Creative expression through drawing, painting, sculpture, and design.', boards: ['WAEC', 'NECO'], topics: ['Drawing and painting', 'Sculpture', 'Printmaking', 'Art history', 'Nigerian art traditions', 'Modern art movements'] },
          { name: 'French', icon: '🇫🇷', desc: 'French language skills — speaking, reading, writing, and comprehension.', boards: ['WAEC', 'NECO'], topics: ['Advanced grammar', 'French literature', 'Translation skills', 'Oral proficiency', 'French civilization', 'Contemporary France'] },
          { name: 'Geography', icon: '🗺️', desc: 'Study of Earth\'s physical features, climate, and human populations.', boards: ['WAEC', 'NECO', 'JAMB'], topics: ['Physical geography', 'Human geography', 'Economic geography', 'Regional geography', 'Environmental management', 'Cartography'] },
        ],
        Commercial: [
          { name: 'Financial Accounting', icon: '📊', desc: 'Recording, classifying, and reporting financial transactions.', boards: ['WAEC', 'NECO', 'JAMB'], topics: ['Introduction to accounting', 'Double entry bookkeeping', 'Financial statements', 'Cash book and ledger', 'Trial balance', 'Partnership accounts'] },
          { name: 'Commerce', icon: '🏪', desc: 'Trade activities, business operations, and commercial services.', boards: ['WAEC', 'NECO', 'JAMB'], topics: ['Commerce and trade', 'Aids to trade', 'Transport and communication', 'Warehousing', 'Insurance', 'Banking'] },
          { name: 'Economics', icon: '📈', desc: 'Study of production, distribution, and consumption of goods and services.', boards: ['WAEC', 'NECO', 'JAMB'], topics: ['Basic economic concepts', 'Demand and supply', 'Production', 'Market structures', 'National income', 'Money and banking'] },
          { name: 'Business Studies / Office Practice', icon: '💼', desc: 'Office management, business communication, and organizational skills.', boards: ['WAEC', 'NECO'], topics: ['Office organization', 'Filing systems', 'Business communication', 'Office equipment', 'Records management', 'Business ethics'] },
          { name: 'Marketing', icon: '🎯', desc: 'Principles of promoting and selling products and services.', boards: ['WAEC', 'NECO'], topics: ['Introduction to marketing', 'Market research', 'Product and pricing', 'Distribution channels', 'Promotion', 'Consumer behaviour'] },
        ]
      },
      'SSS 2': {
        core: ['English Language', 'Mathematics', 'Civic Education'],
        yearDesc: 'Intermediate year — deepening understanding and building exam readiness.',
        Science: [
          { name: 'Physics', icon: '⚡', desc: 'Advanced study of electricity, magnetism, optics, and nuclear physics.', boards: ['WAEC', 'NECO', 'JAMB'], topics: ['Electricity and circuits', 'Magnetism', 'Optics (light)', 'Electromagnetic waves', 'Atomic physics', 'Nuclear physics'] },
          { name: 'Chemistry', icon: '🧪', desc: 'Chemical reactions, equilibrium, organic chemistry, and industrial processes.', boards: ['WAEC', 'NECO', 'JAMB'], topics: ['Chemical kinetics', 'Equilibrium', 'Acids and bases', 'Electrochemistry', 'Organic chemistry intro', 'Nuclear chemistry'] },
          { name: 'Biology', icon: '🧬', desc: 'Genetics, evolution, biotechnology, and advanced human biology.', boards: ['WAEC', 'NECO', 'JAMB'], topics: ['Genetics', 'Evolution', 'Human biology', 'Plant physiology', 'Animal behaviour', 'Biotechnology'] },
          { name: 'Further Mathematics', icon: '📐', desc: 'Calculus, vectors, advanced statistics, and differential equations.', boards: ['WAEC', 'NECO', 'JAMB'], topics: ['Calculus (differentiation)', 'Calculus (integration)', 'Vectors', 'Statistics (advanced)', 'Probability (conditional)', 'Differential equations intro'] },
          { name: 'Agricultural Science', icon: '🌱', desc: 'Advanced farming techniques, mechanization, and food security.', boards: ['WAEC', 'NECO'], topics: ['Agricultural biology', 'Animal nutrition', 'Farm mechanization', 'Agricultural policies', 'Food security', 'Agro-processing'] },
          { name: 'Geography', icon: '🗺️', desc: 'Resources, industrial development, and fieldwork methods.', boards: ['WAEC', 'NECO', 'JAMB'], topics: ['Resources geography', 'Industrial geography', 'Transport geography', 'Tourism', 'Development studies', 'Fieldwork methods'] },
          { name: 'Computer Science', icon: '💻', desc: 'Programming, data structures, algorithms, and networking.', boards: ['WAEC', 'NECO', 'JAMB'], topics: ['Programming (C/Python)', 'Data structures', 'Algorithms', 'Database management', 'Networking', 'Web development'] },
        ],
        Art: [
          { name: 'Literature-in-English', icon: '📚', desc: 'African and non-African literary works, criticism, and comparative literature.', boards: ['WAEC', 'NECO', 'JAMB'], topics: ['African prose', 'Non-African prose', 'African poetry', 'Drama texts', 'Literary criticism', 'Comparative literature'] },
          { name: 'Government', icon: '🏛️', desc: 'Nigerian political history, constitutional development, and international relations.', boards: ['WAEC', 'NECO', 'JAMB'], topics: ['Nigerian political history', 'Constitutional development', 'Political parties', 'Pressure groups', 'Foreign policy', 'International organizations'] },
          { name: 'History', icon: '📜', desc: 'Nigerian and African history from pre-colonial era to modern day.', boards: ['WAEC', 'NECO', 'JAMB'], topics: ['Nigerian states before colonialism', 'British colonial rule', 'Independence movements', 'First and Second Republic', 'Military rule', 'Fourth Republic'] },
          { name: 'Christian/Islamic Religious Studies', icon: '📖', desc: 'Religious themes, ethics, leadership, and contemporary challenges.', boards: ['WAEC', 'NECO'], topics: ['Themes in Bible/Quran', 'Religious ethics in modern society', 'Leadership in religion', 'Social justice', 'Religion and development', 'Contemporary challenges'] },
          { name: 'Fine Arts', icon: '🎨', desc: 'Mixed media, photography, graphic design, and contemporary art.', boards: ['WAEC', 'NECO'], topics: ['Mixed media', 'Photography', 'Graphic design basics', 'Art criticism', 'Nigerian contemporary art', 'Art and society'] },
          { name: 'French', icon: '🇫🇷', desc: 'French composition, conversation, translation, and Francophone literature.', boards: ['WAEC', 'NECO'], topics: ['French composition', 'Translation exercises', 'French conversation', 'Francophone literature', 'French education system', 'Cultural comparisons'] },
          { name: 'Geography', icon: '🗺️', desc: 'Environmental issues, climate change, urbanization, and sustainable development.', boards: ['WAEC', 'NECO', 'JAMB'], topics: ['Environmental issues', 'Climate change', 'Urbanization', 'Migration', 'Food security', 'Sustainable development'] },
        ],
        Commercial: [
          { name: 'Financial Accounting', icon: '📊', desc: 'Final accounts, partnership accounts, company accounts, and manufacturing accounts.', boards: ['WAEC', 'NECO', 'JAMB'], topics: ['Final accounts', 'Consignment accounts', 'Partnership accounts (advanced)', 'Company accounts', 'Manufacturing accounts', 'Bank reconciliation'] },
          { name: 'Commerce', icon: '🏪', desc: 'International trade, customs, e-commerce, and globalization.', boards: ['WAEC', 'NECO', 'JAMB'], topics: ['International trade', 'Balance of payments', 'Customs and excise', 'Trade associations', 'E-commerce', 'Globalization'] },
          { name: 'Economics', icon: '📈', desc: 'Macroeconomics, inflation, government budgets, and development economics.', boards: ['WAEC', 'NECO', 'JAMB'], topics: ['Macroeconomics', 'Inflation', 'Unemployment', 'Government budget', 'International trade', 'Development economics'] },
          { name: 'Business Studies / Office Practice', icon: '💼', desc: 'Business management, HR, production, and corporate governance.', boards: ['WAEC', 'NECO'], topics: ['Business management', 'Human resource management', 'Production management', 'Quality control', 'Business law basics', 'Corporate governance'] },
          { name: 'Marketing', icon: '🎯', desc: 'Marketing management, advertising, digital marketing, and brand management.', boards: ['WAEC', 'NECO'], topics: ['Marketing management', 'Advertising', 'Sales management', 'Digital marketing', 'Brand management', 'International marketing'] },
        ]
      },
      'SSS 3': {
        core: ['English Language', 'Mathematics', 'Civic Education'],
        yearDesc: 'Final year — intensive revision and exam preparation for WAEC, NECO & JAMB.',
        Science: [
          { name: 'Physics', icon: '⚡', desc: 'Comprehensive revision of all WAEC/NECO/JAMB physics topics.', boards: ['WAEC', 'NECO', 'JAMB'], topics: ['Revision: mechanics', 'Revision: electricity', 'Revision: waves', 'Revision: modern physics', 'Exam strategies', 'Past questions analysis'] },
          { name: 'Chemistry', icon: '🧪', desc: 'Full revision of organic, physical, and inorganic chemistry for exams.', boards: ['WAEC', 'NECO', 'JAMB'], topics: ['Revision: organic chemistry', 'Revision: physical chemistry', 'Revision: inorganic chemistry', 'Practical chemistry', 'Exam techniques', 'Past questions'] },
          { name: 'Biology', icon: '🧬', desc: 'Exam-focused revision covering genetics, ecology, and human biology.', boards: ['WAEC', 'NECO', 'JAMB'], topics: ['Revision: genetics', 'Revision: ecology', 'Revision: human biology', 'Practical biology', 'Exam preparation', 'Past questions'] },
          { name: 'Further Mathematics', icon: '📐', desc: 'Advanced revision of calculus, vectors, statistics, and problem-solving.', boards: ['WAEC', 'NECO', 'JAMB'], topics: ['Revision: calculus', 'Revision: vectors', 'Revision: statistics', 'Exam techniques', 'Past questions', 'Problem-solving strategies'] },
          { name: 'Agricultural Science', icon: '🌱', desc: 'Comprehensive revision and practical agricultural skills for exams.', boards: ['WAEC', 'NECO'], topics: ['Comprehensive revision', 'Practical agricultural skills', 'Agricultural technology', 'Career in agriculture', 'Exam preparation', 'Past questions'] },
          { name: 'Geography', icon: '🗺️', desc: 'Revision of physical and human geography with practical exam prep.', boards: ['WAEC', 'NECO', 'JAMB'], topics: ['Physical geography revision', 'Human geography revision', 'Practical geography', 'Map reading', 'Exam preparation', 'Past questions'] },
          { name: 'Computer Science', icon: '💻', desc: 'Revision of programming, theory, and practical skills for exams.', boards: ['WAEC', 'NECO', 'JAMB'], topics: ['Revision: programming', 'Revision: theory', 'Practical skills', 'Exam strategies', 'Past questions', 'Career in IT'] },
        ],
        Art: [
          { name: 'Literature-in-English', icon: '📚', desc: 'Text revision, unseen passages, and exam technique practice.', boards: ['WAEC', 'NECO', 'JAMB'], topics: ['Text revision (prose)', 'Text revision (poetry)', 'Text revision (drama)', 'Unseen passages', 'Exam techniques', 'Past questions'] },
          { name: 'Government', icon: '🏛️', desc: 'Revision of Nigerian government, political concepts, and current affairs.', boards: ['WAEC', 'NECO', 'JAMB'], topics: ['Nigerian government revision', 'Political concepts review', 'International relations', 'Exam strategies', 'Past questions', 'Current affairs'] },
          { name: 'History', icon: '📜', desc: 'Revision of Nigerian and world history with exam-focused practice.', boards: ['WAEC', 'NECO', 'JAMB'], topics: ['Nigerian history revision', 'World history highlights', 'Exam techniques', 'Essay writing', 'Past questions', 'Research skills'] },
          { name: 'Christian/Islamic Religious Studies', icon: '📖', desc: 'Scripture revision, moral philosophy, and ethical reasoning for exams.', boards: ['WAEC', 'NECO'], topics: ['Scripture revision', 'Moral philosophy review', 'Contemporary issues', 'Exam preparation', 'Past questions', 'Ethical reasoning'] },
          { name: 'Fine Arts', icon: '🎨', desc: 'Portfolio preparation, art theory, and practical exam techniques.', boards: ['WAEC', 'NECO'], topics: ['Portfolio preparation', 'Art theory revision', 'Practical exam prep', 'Art history review', 'Creative techniques', 'Exam strategies'] },
          { name: 'French', icon: '🇫🇷', desc: 'French revision, translation practice, and oral exam preparation.', boards: ['WAEC', 'NECO'], topics: ['French revision', 'Translation practice', 'Oral exam prep', 'Grammar review', 'Past questions', 'Cultural knowledge'] },
          { name: 'Geography', icon: '🗺️', topics: ['Physical geography revision', 'Human geography revision', 'Practical exam prep', 'Map work', 'Past questions', 'Environmental issues'] },
        ],
        Commercial: [
          { name: 'Financial Accounting', icon: '📊', topics: ['Comprehensive revision', 'Company accounts (advanced)', 'Ethics in accounting', 'Exam techniques', 'Past questions', 'Career in accounting'] },
          { name: 'Commerce', icon: '🏪', topics: ['Trade revision', 'Business law review', 'Global trade', 'Exam preparation', 'Past questions', 'Career guidance'] },
          { name: 'Economics', icon: '📈', topics: ['Macroeconomics revision', 'Microeconomics review', 'Nigerian economy', 'Exam techniques', 'Past questions', 'Current economic issues'] },
          { name: 'Business Studies / Office Practice', icon: '💼', topics: ['Management revision', 'Office technology', 'Business ethics', 'Exam preparation', 'Past questions', 'Career planning'] },
          { name: 'Marketing', icon: '🎯', topics: ['Marketing principles review', 'Digital marketing', 'Consumer behaviour', 'Exam strategies', 'Past questions', 'Marketing careers'] },
        ]
      }
    }
  },
  'university': {
    label: 'University & Higher Institution',
    subtitle: '100 Level – 500 Level',
    color: '#f59e0b',
    icon: '🏛️',
    description: 'Higher institution education covering undergraduate degree programs across multiple disciplines, typically spanning 4–6 years depending on the course of study.',
    departments: [
      {
        name: 'Sciences',
        icon: '🔬',
        courses: [
          { name: 'Computer Science', icon: '💻', desc: 'Theory of computation, software development, AI, and systems design.', duration: '4 years', topics: ['Programming Fundamentals', 'Discrete Mathematics', 'Data Structures & Algorithms', 'Operating Systems', 'Database Systems', 'Computer Networks', 'Software Engineering', 'Artificial Intelligence', 'Compiler Design', 'Computer Graphics'] },
          { name: 'Information Technology', icon: '🌐', desc: 'Application of technology to solve business and organizational problems.', duration: '4 years', topics: ['IT Fundamentals', 'Systems Analysis & Design', 'Web Technologies', 'Database Management', 'IT Project Management', 'Networking & Security', 'Cloud Computing', 'IT Governance', 'Digital Transformation', 'Emerging Technologies'] },
          { name: 'Physics', icon: '⚛️', desc: 'Study of matter, energy, and fundamental forces governing the universe.', duration: '4 years', topics: ['Classical Mechanics', 'Electromagnetism', 'Thermodynamics', 'Quantum Mechanics', 'Optics', 'Solid State Physics', 'Nuclear Physics', 'Computational Physics', 'Electronics', 'Astrophysics'] },
          { name: 'Chemistry', icon: '🧪', desc: 'Science of substances — their composition, reactions, and applications.', duration: '4 years', topics: ['Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry', 'Analytical Chemistry', 'Biochemistry', 'Industrial Chemistry', 'Environmental Chemistry', 'Polymer Chemistry', 'Medicinal Chemistry', 'Spectroscopy'] },
          { name: 'Mathematics', icon: '📐', desc: 'Study of numbers, structures, space, and change — the language of science.', duration: '4 years', topics: ['Pure Mathematics', 'Applied Mathematics', 'Statistics', 'Numerical Analysis', 'Operations Research', 'Mathematical Modelling', 'Fluid Mechanics', 'Topology', 'Abstract Algebra', 'Functional Analysis'] },
          { name: 'Biochemistry', icon: '🧬', desc: 'Chemical processes within and relating to living organisms.', duration: '4 years', topics: ['Protein Structure', 'Enzyme Kinetics', 'Metabolism', 'Molecular Biology', 'Clinical Biochemistry', 'Immunology', 'Genetic Engineering', 'Biotechnology', 'Nutrition Biochemistry', 'Research Methods'] },
          { name: 'Microbiology', icon: '🦠', desc: 'Study of microorganisms — bacteria, viruses, fungi, and their applications.', duration: '4 years', topics: ['Bacteriology', 'Virology', 'Mycology', 'Immunology', 'Medical Microbiology', 'Industrial Microbiology', 'Environmental Microbiology', 'Food Microbiology', 'Pharmaceutical Microbiology', 'Biotechnology'] },
        ]
      },
      {
        name: 'Engineering',
        icon: '⚙️',
        courses: [
          { name: 'Electrical/Electronic Engineering', icon: '⚡', desc: 'Design and development of electrical systems, circuits, and electronic devices.', duration: '5 years', topics: ['Circuit Theory', 'Electromagnetic Theory', 'Power Systems', 'Control Systems', 'Digital Electronics', 'Communication Systems', 'Signal Processing', 'Microprocessors', 'Renewable Energy', 'Project Management'] },
          { name: 'Mechanical Engineering', icon: '⚙️', desc: 'Design, manufacturing, and maintenance of mechanical systems and machines.', duration: '5 years', topics: ['Thermodynamics', 'Fluid Mechanics', 'Strength of Materials', 'Machine Design', 'Manufacturing Processes', 'Heat Transfer', 'Automobile Engineering', 'Robotics', 'CAD/CAM', 'Project Management'] },
          { name: 'Civil Engineering', icon: '🏗️', desc: 'Design, construction, and maintenance of infrastructure — roads, bridges, buildings.', duration: '5 years', topics: ['Structural Analysis', 'Geotechnical Engineering', 'Transportation Engineering', 'Water Resources', 'Environmental Engineering', 'Construction Management', 'Surveying', 'Building Technology', 'Urban Planning', 'Project Management'] },
          { name: 'Chemical Engineering', icon: '⚗️', desc: 'Application of chemistry and engineering to process raw materials into products.', duration: '5 years', topics: ['Process Engineering', 'Mass Transfer', 'Heat Transfer', 'Fluid Dynamics', 'Chemical Reaction Engineering', 'Process Control', 'Plant Design', 'Petroleum Engineering', 'Environmental Engineering', 'Safety Engineering'] },
        ]
      },
      {
        name: 'Health Sciences',
        icon: '🏥',
        courses: [
          { name: 'Medicine & Surgery', icon: '🏥', desc: 'Diagnosis, treatment, and prevention of disease — the core medical degree.', duration: '6 years', topics: ['Anatomy', 'Physiology', 'Biochemistry', 'Pathology', 'Pharmacology', 'Microbiology', 'Clinical Medicine', 'Surgery', 'Paediatrics', 'Obstetrics & Gynaecology'] },
          { name: 'Nursing Science', icon: '👩‍⚕️', desc: 'Healthcare, patient care, and community health nursing practice.', duration: '5 years', topics: ['Fundamentals of Nursing', 'Medical-Surgical Nursing', 'Paediatric Nursing', 'Midwifery', 'Community Health', 'Mental Health Nursing', 'Nursing Research', 'Health Assessment', 'Pharmacology', 'Leadership in Nursing'] },
          { name: 'Pharmacy', icon: '💊', desc: 'Study of drugs — their preparation, dispensing, and therapeutic effects.', duration: '5 years', topics: ['Pharmaceutics', 'Pharmacology', 'Medicinal Chemistry', 'Pharmacognosy', 'Clinical Pharmacy', 'Drug Information', 'Pharmaceutical Chemistry', 'Pharmacy Practice', 'Drug Development', 'Regulatory Affairs'] },
        ]
      },
      {
        name: 'Management & Social Sciences',
        icon: '🏢',
        courses: [
          { name: 'Accounting', icon: '📊', desc: 'Financial reporting, auditing, taxation, and management accounting.', duration: '4 years', topics: ['Financial Accounting', 'Management Accounting', 'Auditing', 'Taxation', 'Corporate Finance', 'Cost Accounting', 'Accounting Information Systems', 'Forensic Accounting', 'Public Sector Accounting', 'International Accounting'] },
          { name: 'Business Administration', icon: '🏢', desc: 'Management principles, organizational behaviour, and strategic leadership.', duration: '4 years', topics: ['Principles of Management', 'Organizational Behaviour', 'Strategic Management', 'Human Resource Management', 'Marketing Management', 'Operations Management', 'Business Ethics', 'Entrepreneurship', 'International Business', 'Corporate Governance'] },
          { name: 'Economics', icon: '📈', desc: 'Theory of production, distribution, and consumption — micro and macro.', duration: '4 years', topics: ['Microeconomic Theory', 'Macroeconomic Theory', 'Econometrics', 'Development Economics', 'International Economics', 'Public Finance', 'Money & Banking', 'Environmental Economics', 'Health Economics', 'Labour Economics'] },
          { name: 'Banking & Finance', icon: '🏦', desc: 'Financial markets, investment, risk management, and banking operations.', duration: '4 years', topics: ['Banking Operations', 'Financial Markets', 'Investment Analysis', 'Risk Management', 'Corporate Finance', 'Insurance', 'Financial Regulation', 'Islamic Banking', 'Fintech', 'Portfolio Management'] },
          { name: 'Mass Communication', icon: '📡', desc: 'Media theory, journalism, PR, advertising, and digital media.', duration: '4 years', topics: ['Media Theory', 'Journalism', 'Public Relations', 'Advertising', 'Broadcasting', 'Digital Media', 'Media Law & Ethics', 'Development Communication', 'Media Management', 'Research Methods'] },
          { name: 'Political Science', icon: '🏛️', desc: 'Political theory, governance, international relations, and public administration.', duration: '4 years', topics: ['Political Theory', 'Comparative Politics', 'International Relations', 'Public Administration', 'Nigerian Government', 'Political Economy', 'Conflict Resolution', 'Electoral Studies', 'Human Rights', 'Research Methods'] },
        ]
      },
      {
        name: 'Law',
        icon: '⚖️',
        courses: [
          { name: 'Law', icon: '⚖️', desc: 'Legal systems, constitutional law, and the practice of justice.', duration: '5 years (LLB)', topics: ['Legal System of Nigeria', 'Constitutional Law', 'Criminal Law', 'Contract Law', 'Tort Law', 'Property Law', 'Commercial Law', 'International Law', 'Jurisprudence', 'Legal Practice & Ethics'] },
        ]
      },
      {
        name: 'Environmental Sciences',
        icon: '🌿',
        courses: [
          { name: 'Architecture', icon: '🏛️', desc: 'Building design, urban planning, and sustainable environmental design.', duration: '5 years (B.Arch)', topics: ['Architectural Design', 'Building Construction', 'History of Architecture', 'Urban Design', 'Environmental Design', 'Computer-Aided Design', 'Structural Systems', 'Building Services', 'Project Management', 'Sustainable Architecture'] },
        ]
      }
    ]
  }
};

// --- SVG Icons (custom inline SVGs for zero dependency) ---
const DashboardIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>;
const CardsIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>;
const TimerIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const NotesIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
const PlannerIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const AIIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const LearnIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>;
const CodeIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>;
const CurriculumIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path><line x1="8" y1="7" x2="16" y2="7"></line><line x1="8" y1="11" x2="16" y2="11"></line><line x1="8" y1="15" x2="12" y2="15"></line></svg>;
const QuizIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
const SettingsIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
  </svg>
);
const AppleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.51-.63.73-1.18 1.87-1.03 2.98.12.01.24.02.36.02.95 0 2.1-.63 2.62-1.45z"/>
  </svg>
);

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [authEmail, setAuthEmail] = useState('');
  const [authDisplayName, setAuthDisplayName] = useState('');
  const [authClassLevel, setAuthClassLevel] = useState('');
  const [authStream, setAuthStream] = useState('');
  const [authDepartment, setAuthDepartment] = useState('');
  const [authCourse, setAuthCourse] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = 'success', duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  };

  const [activeTab, setActiveTab] = useState('learn');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [curriculumLevel, setCurriculumLevel] = useState(null);
  const [curriculumSubject, setCurriculumSubject] = useState(null);
  const [curriculumSearch, setCurriculumSearch] = useState('');
  const [isSimulatedAI, setIsSimulatedAI] = useState(true);

  // Theme state
  const [theme, setTheme] = useState(() => localStorage.getItem('aura-theme') || 'light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('aura-theme', theme);
  }, [theme]);
  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  // Learn page state
  const [activeLearnCategory, setActiveLearnCategory] = useState(null);
  const [learnSearch, setLearnSearch] = useState('');

  // Core Data States
  const [decks, setDecks] = useState([]);
  const [cards, setCards] = useState([]);
  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [pomodoros, setPomodoros] = useState([]);
  const [activities, setActivities] = useState([]);

  // Loading & Connection states
  const [connectionError, setConnectionError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Modal / Detail States
  const [activeDeck, setActiveDeck] = useState(null);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [reviewCardsList, setReviewCardsList] = useState([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [showCardAnswer, setShowCardAnswer] = useState(false);

  // Modals
  const [showDeckModal, setShowDeckModal] = useState(false);
  const [newDeckTitle, setNewDeckTitle] = useState('');
  const [newDeckDesc, setNewDeckDesc] = useState('');

  const [showCardModal, setShowCardModal] = useState(false);
  const [newCardQ, setNewCardQ] = useState('');
  const [newCardA, setNewCardA] = useState('');

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskEstPomos, setNewTaskEstPomos] = useState(2);

  // AI status — tracks live/fallback mode returned by /api/ai/status
  const [aiStatus, setAiStatus] = useState({ mode: 'unconfigured', reason: 'Loading...', cooldownRemainingMs: 0 });

  // Pomodoro States
  const [timerMode, setTimerMode] = useState('focus'); // focus (25), shortBreak (5), longBreak (15)
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerActive, setTimerActive] = useState(false);
  const [timerTotalDuration, setTimerTotalDuration] = useState(25 * 60);
  const [pomoTaskLink, setPomoTaskLink] = useState('');
  const [customDurations, setCustomDurations] = useState(() => {
    const saved = localStorage.getItem('aura-focus-prefs');
    if (saved) {
      const prefs = JSON.parse(saved);
      return { focus: prefs.focusDuration || 25, shortBreak: prefs.shortBreakDuration || 5, longBreak: prefs.longBreakDuration || 15 };
    }
    return { focus: 25, shortBreak: 5, longBreak: 15 };
  });
  const [focusPrefs, setFocusPrefs] = useState(() => {
    const saved = localStorage.getItem('aura-focus-prefs');
    return saved ? JSON.parse(saved) : { focusDuration: 25, shortBreakDuration: 5, longBreakDuration: 15, longBreakInterval: 4, autoStartBreaks: false, autoStartFocus: false, timerSound: true };
  });
  const [completedPomosToday, setCompletedPomosToday] = useState(() => {
    const saved = localStorage.getItem('pomo-completed-today');
    if (saved) {
      const { count, date } = JSON.parse(saved);
      if (date === new Date().toDateString()) return count;
    }
    return 0;
  });

  // Sync focus preferences from settings to pomodoro custom durations
  useEffect(() => {
    setCustomDurations({
      focus: focusPrefs.focusDuration || 25,
      shortBreak: focusPrefs.shortBreakDuration || 5,
      longBreak: focusPrefs.longBreakDuration || 15,
    });
  }, [focusPrefs]);

  // Quiz States
  const [quizInput, setQuizInput] = useState('');
  const [quizCount, setQuizCount] = useState(5);
  const [quizDifficulty, setQuizDifficulty] = useState('Medium');
  const [quizMode, setQuizMode] = useState('timed'); // 'timed' or 'practice'
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizTimeLeft, setQuizTimeLeft] = useState(0);
  const [quizTimerActive, setQuizTimerActive] = useState(false);
  const [quizCurrentQuestionIndex, setQuizCurrentQuestionIndex] = useState(0);
  const [quizBookmarked, setQuizBookmarked] = useState({});
  const [quizReviewFilter, setQuizReviewFilter] = useState('all'); // 'all', 'incorrect', 'bookmarked'
  const [quizHistory, setQuizHistory] = useState([]);
  const [quizStats, setQuizStats] = useState(null);
  const [selectedHistoryRecord, setSelectedHistoryRecord] = useState(null);
  const [pomoSessionNotes, setPomoSessionNotes] = useState('');
  const timerIntervalRef = useRef(null);

  // Notes Active State
  const [activeNote, setActiveNote] = useState(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiNoteSuggestion, setAiNoteSuggestion] = useState('');

  // AI Chat States
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', content: '' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const [editingMessageIndex, setEditingMessageIndex] = useState(null);
  const [editingMessageText, setEditingMessageText] = useState('');
  const [chatCategoryFilter, setChatCategoryFilter] = useState('all');
  const chatEndRef = useRef(null);

  // Session Memory States
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);

  // File Upload State
  const [pendingImage, setPendingImage] = useState(null);
  const fileInputRef = useRef(null);

  // Code Execution State
  const [executingCode, setExecutingCode] = useState(false);

  // Holds the class level chosen on the signup form so the (mount-once)
  // onAuthStateChanged listener below can read the latest value via .current
  // instead of a stale closure over component state.
  const pendingClassLevelRef = useRef('');
  const pendingStreamRef = useRef('');
  const pendingDepartmentRef = useRef('');
  const pendingCourseRef = useRef('');

  // Global code block handlers (copy + preview)
  useEffect(() => {
    window.__copyCode = (btn) => {
      const code = btn.getAttribute('data-code').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
      navigator.clipboard.writeText(code).then(() => {
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = 'Copy'; }, 1500);
        addToast('Code copied to clipboard');
      }).catch(() => {
        addToast('Failed to copy', 'error');
      });
    };
    window.__previewCode = (btn) => {
      const code = btn.getAttribute('data-code').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
      window.__setPreviewHtml && window.__setPreviewHtml(code);
    };
    window.__runCode = async (btn) => {
      const code = btn.getAttribute('data-code').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
      btn.textContent = '⏳ Running...';
      btn.disabled = true;
      try {
        const res = await fetch(`${API_BASE}/ai/execute`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code })
        });
        const data = await res.json();
        if (data.success) {
          addToast(`✅ Output: ${data.output || '(no output)'}`);
        } else {
          addToast(`❌ Error: ${data.error || data.output || 'Execution failed'}`, 'error');
        }
      } catch (err) {
        addToast('Failed to execute code', 'error');
      }
      btn.textContent = '▶ Run';
      btn.disabled = false;
    };
  }, []);

  // Tracks whether the page has been scrolled — used to give the landing
  // nav a "compact glass" look once the hero has scrolled out of view.
  const [landingScrolled, setLandingScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setLandingScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lightweight scroll-reveal: any element with [data-reveal] fades/slides
  // into place the first time it enters the viewport. Re-runs whenever the
  // active tab or auth screen changes so newly-mounted content is observed.
  useEffect(() => {
    const targets = document.querySelectorAll('[data-reveal]:not(.is-revealed)');
    if (!targets.length) return undefined;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [currentUser, showAuth, activeTab]);

  // Firebase Auth state listener — runs once on mount
  useEffect(() => {
    // Handle redirect result (popup-free sign-in)
    handleRedirectResult().catch((err) => {
      if (err.code !== 'auth/popup-blocked' && 
          err.code !== 'auth/popup-closed-by-user' && 
          err.code !== 'auth/cancelled-popup-request') {
        console.error('Redirect sign-in error:', err);
      }
    });
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Use pending signup values immediately so the UI has the class
        // level from the very first render after auth state changes.
        const pendingLevel = pendingClassLevelRef.current || '';
        const pendingStream = pendingStreamRef.current || '';
        const pendingDept = pendingDepartmentRef.current || '';
        const pendingCourse = pendingCourseRef.current || '';

        setCurrentUser({
          uid: firebaseUser.uid,
          username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          classLevel: pendingLevel,
          stream: pendingStream,
          department: pendingDept,
          course: pendingCourse,
        });

        // Detect new user: sessionStorage tracks if we've synced this UID already
        const syncKey = `aura_synced_${firebaseUser.uid}`;
        const alreadySynced = sessionStorage.getItem(syncKey);
        if (!alreadySynced) {
          sessionStorage.setItem(syncKey, '1');
          // Check if account was created recently (within last 5 seconds = new signup)
          const createdAt = firebaseUser.metadata?.creationTime;
          const lastLogin = firebaseUser.metadata?.lastSignInTime;
          const isNewUser = createdAt && lastLogin && (new Date(lastLogin) - new Date(createdAt)) < 5000;

          // Notify backend (fires welcome email if new user, persists class level/course chosen at signup)
          fetch(`${API_BASE}/auth/firebase-sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              isNewUser: !!isNewUser,
              classLevel: pendingClassLevelRef.current || undefined,
              stream: pendingStreamRef.current || undefined,
              department: pendingDepartmentRef.current || undefined,
              course: pendingCourseRef.current || undefined,
            }),
          })
            .then(r => r.json())
            .then(data => {
              pendingClassLevelRef.current = '';
              pendingStreamRef.current = '';
              pendingDepartmentRef.current = '';
              pendingCourseRef.current = '';
              if (data?.profile) {
                setCurrentUser(prev => (prev ? { ...prev, classLevel: data.profile.classLevel, stream: data.profile.stream, department: data.profile.department, course: data.profile.course } : prev));
              }
            })
            .catch(err => console.warn('firebase-sync failed (backend may be offline):', err));
        } else {
          // Returning session in this tab: just fetch the stored class level / course.
          fetch(`${API_BASE}/users/${firebaseUser.uid}/profile`)
            .then(r => (r.ok ? r.json() : null))
            .then(profile => {
              if (profile) {
                setCurrentUser(prev => (prev ? { ...prev, classLevel: profile.classLevel, stream: profile.stream, department: profile.department, course: profile.course } : prev));
              }
            })
            .catch(() => {});
        }
      } else {
        setCurrentUser(null);
      }
      setAuthInitialized(true);
    });
    return () => unsubscribe();
  }, []);

  // Listen for foreground FCM messages
  useEffect(() => {
    if (!currentUser?.uid) return;
    const unsubscribe = onForegroundMessage((payload) => {
      console.log('[App] Foreground message received:', payload);
      const { title, body, icon } = payload.notification || {};
      if (Notification.permission === 'granted') {
        new Notification(title || 'AuraStudy', {
          body: body || 'You have a new notification',
          icon: icon || '/favicon.svg',
          tag: payload.data?.tag || 'aurastudy-foreground',
          data: payload.data,
        });
      }
      addToast(title || 'New Notification', 'info', 5000);
    });
    return () => unsubscribe?.();
  }, [currentUser?.uid]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      if (authMode === 'login') {
        await loginWithEmail(authEmail.trim(), authPassword);
      } else {
        const trimmedEmail = authEmail.trim();
        const trimmedName = authDisplayName.trim();

        if (!authClassLevel) {
          throw new Error('Please select your class level.');
        }

        if (isSSSLevel(authClassLevel) && !authStream) {
          throw new Error('Please select your stream (Science, Art, or Commercial).');
        }

        if (isHigherInstitutionLevel(authClassLevel) && !authDepartment) {
          throw new Error('Please select your department.');
        }

        if (isHigherInstitutionLevel(authClassLevel) && !authCourse) {
          throw new Error('Please select your course of study.');
        }

        pendingClassLevelRef.current = authClassLevel;
        pendingStreamRef.current = isSSSLevel(authClassLevel) ? authStream : '';
        pendingDepartmentRef.current = isHigherInstitutionLevel(authClassLevel) ? authDepartment : '';
        pendingCourseRef.current = isHigherInstitutionLevel(authClassLevel) ? authCourse : '';

        // Register directly with Firebase (no email verification step)
        await registerWithEmail(trimmedEmail, authPassword, trimmedName || undefined);

        setAuthEmail('');
        setAuthPassword('');
        setAuthDisplayName('');
        setAuthClassLevel('');
        setAuthStream('');
        setAuthDepartment('');
        setAuthCourse('');
        setAuthError('');
        return;
      }
    } catch (err) {
      console.error(err);
      const friendlyErrors = {
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/weak-password': 'Password must be at least 6 characters.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
        'auth/invalid-credential': 'Invalid email or password.',
      };
      setAuthError(friendlyErrors[err.code] || err.message || 'Authentication failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleSocialLogin = async (provider) => {
    setAuthError('');
    if (authMode === 'signup' && !authClassLevel) {
      setAuthError('Please select your class level before continuing.');
      return;
    }
    if (authMode === 'signup' && isSSSLevel(authClassLevel) && !authStream) {
      setAuthError('Please select your stream (Science, Art, or Commercial) before continuing.');
      return;
    }
    if (authMode === 'signup' && isHigherInstitutionLevel(authClassLevel) && !authDepartment) {
      setAuthError('Please select your department before continuing.');
      return;
    }
    if (authMode === 'signup' && isHigherInstitutionLevel(authClassLevel) && !authCourse) {
      setAuthError('Please select your course of study before continuing.');
      return;
    }
    setAuthLoading(true);
    try {
      if (authMode === 'signup') {
        pendingClassLevelRef.current = authClassLevel;
        pendingStreamRef.current = isSSSLevel(authClassLevel) ? authStream : '';
        pendingDepartmentRef.current = isHigherInstitutionLevel(authClassLevel) ? authDepartment : '';
        pendingCourseRef.current = isHigherInstitutionLevel(authClassLevel) ? authCourse : '';
      }
      try {
        if (provider === 'Google') {
          await signInWithGoogle();
        } else if (provider === 'Apple') {
          await signInWithApple();
        }
      } catch (err) {
        console.error('Social login error:', err);
        if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
          setAuthError(err.message || `${provider} sign-in failed. Please try again.`);
        }
      }
    } finally {
      setAuthLoading(false);
    }
  };

  // Fetch initial data
  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [decksRes, cardsRes, notesRes, tasksRes, pomodorosRes] = await Promise.all([
        fetch(`${API_BASE}/decks`).then(r => (r.ok ? r.json() : [])).catch(() => []),
        fetch(`${API_BASE}/cards`).then(r => (r.ok ? r.json() : [])).catch(() => []),
        fetch(`${API_BASE}/notes`).then(r => (r.ok ? r.json() : [])).catch(() => []),
        fetch(`${API_BASE}/tasks`).then(r => (r.ok ? r.json() : [])).catch(() => []),
        fetch(`${API_BASE}/pomodoros`).then(r => (r.ok ? r.json() : [])).catch(() => [])
      ]);

      setDecks(decksRes);
      setCards(cardsRes);
      setNotes(notesRes);
      setTasks(tasksRes);
      setPomodoros(pomodorosRes);
      setConnectionError(false);

      if (notesRes.length > 0) {
        selectNote(notesRes[0]);
      }

      // Generate dashboard activities list
      generateActivitiesList(pomodorosRes, cardsRes);
    } catch (error) {
      console.error('API connection failed, backend might not be running.', error);
      setConnectionError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Check notification permission on mount
  useEffect(() => {
    if (typeof Notification !== 'undefined') {
      // Force permission state sync
      console.log('[App] Notification permission:', Notification.permission);
    }
  }, []);

    // Poll /api/ai/status every 30s. Drives the header status pill and the
  // isSimulatedAI flag used by the AI panels. No fake chat messages
  // are sent — this is a lightweight, side-effect-free status check.
  useEffect(() => {
    let cancelled = false;
    const fetchStatus = async () => {
      try {
        const res = await fetch(`${API_BASE}/ai/status`);
        if (!res.ok) throw new Error('status not ok');
        const data = await res.json();
        if (cancelled) return;
        setAiStatus(data);
        setIsSimulatedAI(data.mode !== 'live');
      } catch (err) {
        if (cancelled) return;
        setAiStatus({ mode: 'unconfigured', reason: 'Backend unreachable', cooldownRemainingMs: 0 });
        setIsSimulatedAI(true);
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  // Service Worker registration & Foreground FCM messages
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    let unsubscribeForeground = () => {};

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
          scope: '/',
        });
        console.log('[SW] Registered:', registration.scope);

        // Set up foreground message listener after SW is ready
        if (messaging) {
          unsubscribeForeground = onForegroundMessage((payload) => {
            console.log('[FCM] Foreground message:', payload);
            const title = payload.notification?.title || 'AuraStudy';
            const body = payload.notification?.body || 'You have a new notification';
            
            // Show browser notification if permission granted
            if (Notification.permission === 'granted') {
              new Notification(title, {
                body,
                icon: '/favicon.svg',
                badge: '/favicon.svg',
                tag: payload.data?.tag || 'aurastudy-notification',
                data: payload.data || {},
                requireInteraction: false,
              });
            }
            
            // Also show in-app toast
            addToast(`${title}: ${body}`, 'info', 5000);
          });
        }
      } catch (err) {
        console.warn('[SW] Registration failed:', err);
      }
    };

    registerSW();

    return () => {
      unsubscribeForeground();
    };
  }, [messaging, addToast]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, chatLoading]);

  // Load conversations when user logs in
  useEffect(() => {
    if (currentUser?.uid && activeTab === 'ai') {
      loadConversations(currentUser.uid);
    }
  }, [currentUser?.uid, activeTab]);

  // Quiz timer
  useEffect(() => {
    if (!quizTimerActive || quizTimeLeft <= 0) {
      if (quizTimerActive && quizTimeLeft <= 0) {
        handleSubmitQuiz();
        setQuizTimerActive(false);
        addToast('Time\'s up! Quiz auto-submitted.', 'warning');
      }
      return;
    }
    const interval = setInterval(() => setQuizTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [quizTimerActive, quizTimeLeft]);

  // Load quiz history when quiz tab is opened
  useEffect(() => {
    if (activeTab === 'quiz' && currentUser?.uid) loadQuizHistory();
  }, [activeTab, currentUser?.uid]);

  // Flashcard keyboard shortcuts
  useEffect(() => {
    if (!isReviewMode || !activeDeck) return;
    const handleKey = (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setShowCardAnswer(prev => !prev);
      } else if (e.key === 'ArrowRight' || e.key === '1') {
        submitReviewScore(0);
      } else if (e.key === 'ArrowUp' || e.key === '2') {
        submitReviewScore(1);
      } else if (e.key === 'ArrowDown' || e.key === '3') {
        submitReviewScore(3);
      } else if (e.key === 'ArrowLeft' || e.key === '4') {
        submitReviewScore(5);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isReviewMode, activeDeck, showCardAnswer, currentReviewIndex]);

  // Generate activities list logic
  const generateActivitiesList = (pomos, cardsList) => {
    const list = [];
    pomos.forEach(p => {
      list.push({
        id: p.id,
        type: 'pomo',
        title: `Completed ${p.type === 'focus' ? 'Focus Session' : 'Break'} (${p.duration}m)`,
        details: p.notes ? `Focus: "${p.notes}"` : 'No details logged.',
        time: new Date(p.completedAt)
      });
    });
    // Add some default activities if empty
    if (list.length === 0) {
      list.push({
        id: 'init-act',
        type: 'system',
        title: 'Study Assistant initialized!',
        details: 'Welcome to your AuraStudy workspace.',
        time: new Date()
      });
    }
    list.sort((a, b) => b.time - a.time);
    setActivities(list.slice(0, 5));
  };

  // --- Decks & Flashcards Operations ---
  const handleCreateDeck = async (e) => {
    e.preventDefault();
    if (!newDeckTitle.trim()) return;

    try {
      const response = await fetch(`${API_BASE}/decks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newDeckTitle, description: newDeckDesc })
      });
      if (response.ok) {
        const added = await response.json();
        setDecks([...decks, added]);
        setNewDeckTitle('');
        setNewDeckDesc('');
        setShowDeckModal(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDeck = async (deckId) => {
    if (!confirm('Are you sure you want to delete this deck and all its flashcards?')) return;
    try {
      const response = await fetch(`${API_BASE}/decks/${deckId}`, { method: 'DELETE' });
      if (response.ok) {
        setDecks(decks.filter(d => d.id !== deckId));
        setCards(cards.filter(c => c.deckId !== deckId));
        if (activeDeck?.id === deckId) setActiveDeck(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCard = async (e) => {
    e.preventDefault();
    if (!newCardQ.trim() || !newCardA.trim() || !activeDeck) return;

    try {
      const response = await fetch(`${API_BASE}/cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deckId: activeDeck.id, question: newCardQ, answer: newCardA })
      });
      if (response.ok) {
        const added = await response.json();
        setCards([...cards, added]);
        setNewCardQ('');
        setNewCardA('');
        setShowCardModal(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      const response = await fetch(`${API_BASE}/cards/${cardId}`, { method: 'DELETE' });
      if (response.ok) {
        setCards(cards.filter(c => c.id !== cardId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Spaced Repetition Study Engine
  const startReviewSession = (deckId) => {
    // Filter cards in this deck
    const deckCards = cards.filter(c => c.deckId === deckId);
    
    // Sort cards so that those due (nextReview <= now) are shown first
    const now = new Date();
    const sorted = [...deckCards].sort((a, b) => new Date(a.nextReview) - new Date(b.nextReview));
    
    if (sorted.length === 0) {
      alert('This deck has no cards yet. Add some cards first!');
      return;
    }

    setReviewCardsList(sorted);
    setCurrentReviewIndex(0);
    setShowCardAnswer(false);
    setIsReviewMode(true);
  };

  const submitReviewScore = async (score) => {
    const currentCard = reviewCardsList[currentReviewIndex];
    try {
      const response = await fetch(`${API_BASE}/cards/${currentCard.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score })
      });
      if (response.ok) {
        const updated = await response.json();
        // Update cards list locally
        setCards(cards.map(c => c.id === updated.id ? updated : c));
        
        // Log activity
        const activityLog = {
          id: `act-${Date.now()}`,
          type: 'card',
          title: `Reviewed Card in "${decks.find(d => d.id === currentCard.deckId)?.title}"`,
          details: `Question: "${currentCard.question.substring(0, 30)}..." Rated: ${score}/5`,
          time: new Date()
        };
        setActivities([activityLog, ...activities.slice(0, 4)]);

        // Next card
        if (currentReviewIndex + 1 < reviewCardsList.length) {
          setCurrentReviewIndex(currentReviewIndex + 1);
          setShowCardAnswer(false);
        } else {
          alert('Review session complete! Spaced repetition intervals have been recalculated.');
          setIsReviewMode(false);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- Pomodoro Operations ---
  const changeTimerMode = (mode) => {
    setTimerActive(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    
    setTimerMode(mode);
    const duration = (customDurations[mode] || 25) * 60;

    setTimeLeft(duration);
    setTimerTotalDuration(duration);
  };

  const setNewDuration = (mode, minutes) => {
    setCustomDurations(prev => ({ ...prev, [mode]: minutes }));
    if (timerMode === mode && !timerActive) {
      const secs = minutes * 60;
      setTimeLeft(secs);
      setTimerTotalDuration(secs);
    }
  };

  const toggleTimer = () => {
    if (timerActive) {
      setTimerActive(false);
      clearInterval(timerIntervalRef.current);
    } else {
      setTimerActive(true);
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            setTimeout(() => handleTimerComplete(), 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const handleTimerComplete = async () => {
    setTimerActive(false);
    
    // Synthesize beep sound via Web Audio API (if enabled in preferences)
    if (focusPrefs.timerSound) {
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.8);
      } catch (e) {
        console.log('Audio playback not supported or interaction blocked');
      }
    }

    alert(`Pomodoro ${timerMode === 'focus' ? 'Focus Session' : 'Break'} finished!`);

    // Log Pomo Session to Backend
    const durationMins = Math.round(timerTotalDuration / 60);
    try {
      const response = await fetch(`${API_BASE}/pomodoros`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          duration: durationMins,
          type: timerMode,
          notes: timerMode === 'focus' ? pomoSessionNotes || 'Focus Session' : 'Break time',
          classLevel: currentUser?.classLevel || undefined,
          stream: currentUser?.stream || undefined,
          course: currentUser?.course || undefined,
        })
      });
      if (response.ok) {
        const logged = await response.json();
        setPomodoros([...pomodoros, logged]);
        generateActivitiesList([...pomodoros, logged], cards);

        if (timerMode === 'focus') {
          setCompletedPomosToday(prev => {
            const next = prev + 1;
            localStorage.setItem('pomo-completed-today', JSON.stringify({ count: next, date: new Date().toDateString() }));
            return next;
          });
        }

        // Update task progress if linked
        if (pomoTaskLink && timerMode === 'focus') {
          const linkedTask = tasks.find(t => t.id === pomoTaskLink);
          if (linkedTask) {
            const updatedTask = await fetch(`${API_BASE}/tasks/${pomoTaskLink}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ completedPomodoros: (linkedTask.completedPomodoros || 0) + 1 })
            }).then(r => r.json());
            setTasks(tasks.map(t => t.id === pomoTaskLink ? updatedTask : t));
          }
        }
      }
    } catch (err) {
      console.error(err);
    }

    setPomoSessionNotes('');
    // Auto toggle to break/focus with optional auto-start
    if (timerMode === 'focus') {
      changeTimerMode('shortBreak');
      if (focusPrefs.autoStartBreaks) {
        setTimeout(() => {
          setTimerActive(true);
          timerIntervalRef.current = setInterval(() => {
            setTimeLeft(prev => {
              if (prev <= 1) { clearInterval(timerIntervalRef.current); setTimeout(() => handleTimerComplete(), 0); return 0; }
              return prev - 1;
            });
          }, 1000);
        }, 500);
      }
    } else {
      changeTimerMode('focus');
      if (focusPrefs.autoStartFocus) {
        setTimeout(() => {
          setTimerActive(true);
          timerIntervalRef.current = setInterval(() => {
            setTimeLeft(prev => {
              if (prev <= 1) { clearInterval(timerIntervalRef.current); setTimeout(() => handleTimerComplete(), 0); return 0; }
              return prev - 1;
            });
          }, 1000);
        }, 500);
      }
    }
  };

  const resetTimer = () => {
    setTimerActive(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setTimeLeft(timerTotalDuration);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // --- Notes Operations ---
  const selectNote = (note) => {
    setActiveNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setAiNoteSuggestion('');
  };

  const handleCreateNote = async () => {
    try {
      const response = await fetch(`${API_BASE}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Note', content: 'Start typing here...' })
      });
      if (response.ok) {
        const added = await response.json();
        setNotes([...notes, added]);
        selectNote(added);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateNote = async () => {
    if (!activeNote) return;
    try {
      const response = await fetch(`${API_BASE}/notes/${activeNote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: noteTitle, content: noteContent })
      });
      if (response.ok) {
        const updated = await response.json();
        setNotes(notes.map(n => n.id === updated.id ? updated : n));
        setActiveNote(updated);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    try {
      const response = await fetch(`${API_BASE}/notes/${noteId}`, { method: 'DELETE' });
      if (response.ok) {
        const filtered = notes.filter(n => n.id !== noteId);
        setNotes(filtered);
        if (activeNote?.id === noteId) {
          if (filtered.length > 0) selectNote(filtered[0]);
          else {
            setActiveNote(null);
            setNoteTitle('');
            setNoteContent('');
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // AI Actions on Notes
  const handleAiSummarize = async () => {
    if (!noteContent.trim()) return;
    setIsAiProcessing(true);
    try {
      const response = await fetch(`${API_BASE}/ai/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: noteContent,
          classLevel: currentUser?.classLevel || undefined,
          stream: currentUser?.stream || undefined,
          department: currentUser?.department || undefined,
          course: currentUser?.course || undefined,
        })
      });
      if (response.ok) {
        const data = await response.json();
        setAiNoteSuggestion(data.summary);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handleAiGenerateCards = async () => {
    if (!noteContent.trim()) return;
    if (decks.length === 0) {
      alert('Create at least one flashcard deck first so cards can be assigned!');
      return;
    }

    const deckOptions = decks.map(d => `${d.title} (ID: ${d.id})`).join('\n');
    const selectedDeckIndexStr = prompt(`Select a deck index to place cards in (0 to ${decks.length - 1}):\n\n${decks.map((d, i) => `[${i}] ${d.title}`).join('\n')}`);
    
    // User clicked Cancel
    if (selectedDeckIndexStr === null) return;
    
    const deckIdx = parseInt(selectedDeckIndexStr);
    if (isNaN(deckIdx) || deckIdx < 0 || deckIdx >= decks.length) {
      alert('Invalid deck selection.');
      return;
    }
    const targetDeck = decks[deckIdx];

    setIsAiProcessing(true);
    try {
      const response = await fetch(`${API_BASE}/ai/generate-cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: noteContent,
          classLevel: currentUser?.classLevel || undefined,
          stream: currentUser?.stream || undefined,
          department: currentUser?.department || undefined,
          course: currentUser?.course || undefined,
        })
      });
      if (response.ok) {
        const data = await response.json();
        const generated = data.flashcards; // Array of {question, answer}
        
        // Post them to database
        const createdCards = [];
        for (const card of generated) {
          const createRes = await fetch(`${API_BASE}/cards`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deckId: targetDeck.id, question: card.question, answer: card.answer })
          });
          if (createRes.ok) {
            const added = await createRes.json();
            createdCards.push(added);
          }
        }
        setCards([...cards, ...createdCards]);
        alert(`Successfully generated and added ${createdCards.length} flashcards to deck "${targetDeck.title}"!`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiProcessing(false);
    }
  };

  const appendSummaryToNote = () => {
    if (!aiNoteSuggestion) return;
    const newContent = `${noteContent}\n\n${aiNoteSuggestion}`;
    setNoteContent(newContent);
    setAiNoteSuggestion('');
    // Auto save note
    fetch(`${API_BASE}/notes/${activeNote.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: noteTitle, content: newContent })
    }).then(() => {
      loadAllData();
    });
  };

  // Custom Markdown Parser (simple pure JavaScript solution)
  // Code preview state
  const [previewHtml, setPreviewHtml] = useState(null);

  // Connect global preview handler to React state
  useEffect(() => {
    window.__setPreviewHtml = setPreviewHtml;
    return () => { delete window.__setPreviewHtml; };
  }, []);

  const renderMarkdown = (text) => {
    if (!text) return '';
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Fenced code blocks (```lang\ncode\n```)
    html = html.replace(/```(\w*)\n([\s\S]*?)```/gim, (_, lang, code) => {
      const language = lang || 'code';
      const encoded = code.replace(/"/g, '&quot;').trim();
      const isPreviewable = /^(html|css|javascript|js)$/i.test(lang);
      const isRunnable = /^(javascript|js)$/i.test(lang);
      const previewBtn = isPreviewable
        ? `<button class="code-preview-btn" data-code="${encoded}" onclick="window.__previewCode(this)">Preview</button>`
        : '';
      const runBtn = isRunnable
        ? `<button class="code-run-btn" data-code="${encoded}" onclick="window.__runCode(this)">▶ Run</button>`
        : '';
      return `<div class="code-block"><div class="code-block-header"><span class="code-lang">${language}</span><div class="code-block-actions">${runBtn}${previewBtn}<button class="code-copy-btn" onclick="window.__copyCode(this)" data-code="${encoded}">Copy</button></div></div><pre><code>${code.trim()}</code></pre></div>`;
    });

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

    // Headings
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold & Italics
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
    html = html.replace(/_(.*?)_/gim, '<em>$1</em>');

    // Markdown tables
    html = html.replace(/(?:^|\n)((?:\|.+\|\n)+)/gim, (match) => {
      const rows = match.trim().split('\n').filter(r => r.trim());
      if (rows.length < 2) return match;

      const parseCells = (row) => row.split('|').map(c => c.trim()).filter((c, i, arr) => i > 0 && i < arr.length - 1);

      // Check if second row is a separator (---|---|---)
      const isSeparator = (row) => /^\|?[\s-:|]+\|?$/.test(row.trim());
      
      if (!isSeparator(rows[1])) return match;

      const headers = parseCells(rows[0]);
      const dataRows = rows.slice(2).map(parseCells);

      let table = '<table class="md-table"><thead><tr>';
      headers.forEach(h => { table += `<th>${h}</th>`; });
      table += '</tr></thead><tbody>';
      dataRows.forEach(cells => {
        table += '<tr>';
        cells.forEach(c => { table += `<td>${c}</td>`; });
        table += '</tr>';
      });
      table += '</tbody></table>';
      return '\n' + table + '\n';
    });

    // Lists — convert bullet points and wrap consecutive <li> items in <ul>
    html = html.replace(/^\s*[•*-]\s+(.*$)/gim, '<li>$1</li>');
    html = html.replace(/(?:^|\n)(<li>[\s\S]*?<\/li>)(?=\n[^\n<li>]|\n*$)/gi, (match) => {
      return `\n<ul>${match.trim()}</ul>`;
    });

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:#8b5cf6;text-decoration:underline;">$1</a>');

    // Paragraphs / Newlines
    html = html.split('\n').map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      if (/^<\/?(h[1-6]|ul|ol|li|div|pre|blockquote|table|tr|td|th|a)\b/i.test(trimmed)) {
        return line;
      }
      return `<p>${line}</p>`;
    }).join('\n');

    return html;
  };

  // --- Kanban Planner Operations ---
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const response = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTaskTitle,
          description: newTaskDesc,
          priority: newTaskPriority,
          dueDate: newTaskDueDate,
          estimatedPomodoros: parseInt(newTaskEstPomos),
          completedPomodoros: 0,
          status: 'todo'
        })
      });
      if (response.ok) {
        const added = await response.json();
        setTasks([...tasks, added]);
        setNewTaskTitle('');
        setNewTaskDesc('');
        setNewTaskPriority('medium');
        setNewTaskDueDate('');
        setNewTaskEstPomos(2);
        setShowTaskModal(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        const updated = await response.json();
        setTasks(tasks.map(t => t.id === taskId ? updated : t));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      const response = await fetch(`${API_BASE}/tasks/${taskId}`, { method: 'DELETE' });
      if (response.ok) {
        setTasks(tasks.filter(t => t.id !== taskId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- AI Chat Assistant Operations ---
  const getWelcomeMessage = () => {
    if (!currentUser?.classLevel) {
      return 'Hello! 👋 I am **Aura**, your personal AI Study Assistant. Ask me to explain a complex topic, quiz you, or solve practice problems!';
    }
    const level = currentUser.classLevel;
    const stream = currentUser.stream ? ` (${currentUser.stream})` : '';
    const course = currentUser.course ? ` studying ${currentUser.course}` : '';
    return `Hello! 👋 I see you're a **${level}${stream}${course}** student. I'm here to tailor explanations, study guides, code examples, and practice quizzes directly to your current level. What topic would you like to explore today?`;
  };

  const handleSendChatMessage = async (e, overrideMessage) => {
    if (e) e.preventDefault();
    const msgToSend = overrideMessage || chatMessage;
    if (!msgToSend.trim()) return;

    const userMsg = { role: 'user', content: msgToSend };
    
    const priorHistory = chatHistory.filter(
      (msg, idx) => !(idx === 0 && msg.role === 'assistant' && !msg.content)
    );

    setChatHistory(prev => [...prev, userMsg]);
    setChatMessage('');
    setChatLoading(true);

    // If there's a pending image, upload it first
    let imageData = null;
    if (pendingImage) {
      try {
        const formData = new FormData();
        formData.append('image', pendingImage);
        const uploadRes = await fetch(`${API_BASE}/ai/upload`, { method: 'POST', body: formData });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          imageData = uploadData.image;
        }
      } catch (err) {
        console.error('Image upload failed:', err);
      }
      setPendingImage(null);
    }

    try {
      let capturedReply = '';
      const response = await fetch(`${API_BASE}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.content,
          history: priorHistory,
          classLevel: currentUser?.classLevel || undefined,
          stream: currentUser?.stream || undefined,
          department: currentUser?.department || undefined,
          course: currentUser?.course || undefined,
          image: imageData || undefined,
        })
      });

      if (response.ok && response.headers.get('content-type')?.includes('text/event-stream')) {
        // SSE streaming response
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullReply = '';
        let buffer = '';

        // Add placeholder for assistant message
        setChatHistory(prev => [...prev, { role: 'assistant', content: '', isStreaming: true }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop();

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.type === 'chunk' && data.text) {
                  fullReply += data.text;
                  const capturedChunk = fullReply;
                  setChatHistory(prev => {
                    const updated = [...prev];
                    updated[updated.length - 1] = { role: 'assistant', content: capturedChunk, isStreaming: true };
                    return updated;
                  });
                } else if (data.type === 'done') {
                  fullReply = data.reply || fullReply;
                  setChatHistory(prev => {
                    const updated = [...prev];
                    updated[updated.length - 1] = { role: 'assistant', content: fullReply, isSimulated: data.isSimulated, isStreaming: false };
                    return updated;
                  });
                }
              } catch (parseErr) { /* skip malformed chunks */ }
            }
          }
        }
        capturedReply = fullReply;
      } else if (response.ok) {
        const data = await response.json();
        capturedReply = data.reply;
        setChatHistory(prev => [...prev, { role: 'assistant', content: data.reply, isSimulated: data.isSimulated }]);
      } else {
        setChatHistory(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error communicating with the AI engine. Please try again.' }]);
      }

      // Save conversation to session memory (pass messages directly — React state may not have flushed yet)
      if (currentUser?.uid) {
        const allMessages = [...priorHistory, userMsg, { role: 'assistant', content: capturedReply || 'No response.' }]
          .filter(m => m.content);
        saveConversationToHistory(currentUser.uid, allMessages);
      }
    } catch (err) {
      console.error(err);
      setChatHistory(prev => [...prev, { role: 'assistant', content: 'Connection timed out. Please verify your backend server is active.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleCurriculumTopicClick = (topic) => {
    const levelData = CURRICULUM_DATA[curriculumLevel];
    const levelName = levelData?.label || levelData?.title || curriculumLevel || '';
    let contextLabel = '';
    if (curriculumSubject?.type === 'university') {
      contextLabel = `a university student studying ${curriculumSubject.course} in the ${curriculumSubject.department} department`;
    } else if (curriculumSubject?.type === 'sss') {
      contextLabel = `an SSS ${curriculumSubject.stream} stream student`;
    } else if (levelName) {
      contextLabel = `a ${levelName} student`;
    } else {
      contextLabel = 'a secondary school student';
    }
    const userLevel = currentUser?.classLevel
      ? ` The student's registered level is ${currentUser.classLevel}${currentUser.stream ? ' (' + currentUser.stream + ')' : ''}${currentUser.course ? ', studying ' + currentUser.course : ''}.`
      : '';
    const prompt = `You are a study assistant. The topic I want to learn about is: "${topic}".

IMPORTANT: Generate study content STRICTLY about "${topic}" — do not switch to a different, related, or more popular topic.

I am ${contextLabel}.${userLevel}

For the topic "${topic}", provide:
1. **Definition** — What exactly is "${topic}"?
2. **Core Principles** — Key concepts and how it works
3. **Step-by-Step Breakdown** — Walk through the logic or process
4. **Worked Examples** — At least 2 concrete examples with full solutions
5. **Real-World Applications** — Where and how "${topic}" is used
6. **Common Mistakes** — Errors students make with this topic
7. **Practice Question** — One question for me to try on "${topic}"

Stay strictly on "${topic}" throughout your entire response.`;
    setActiveTab('ai');
    setMobileMenuOpen(false);
    setTimeout(() => handleSendChatMessage(null, prompt), 100);
  };

  // ── Session Memory Functions ────────────────────────────────────────────

  const loadConversations = async (uid) => {
    try {
      const res = await fetch(`${API_BASE}/conversations/${uid}`);
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (err) { console.error('Failed to load conversations:', err); }
  };

  const saveConversationToHistory = async (uid, messagesOverride) => {
    try {
      const messages = messagesOverride || chatHistory.filter(m => m.content).map(m => ({ role: m.role, content: m.content }));
      if (messages.length === 0) return;

      if (activeConversationId) {
        // Append only the last user+assistant pair to existing conversation
        const lastTwo = messages.slice(-2);
        for (const msg of lastTwo) {
          await fetch(`${API_BASE}/conversations/${activeConversationId}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: msg.role, content: msg.content })
          });
        }
        loadConversations(uid);
      } else {
        // Create new conversation with all messages
        const res = await fetch(`${API_BASE}/conversations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid, title: messages[0]?.content?.substring(0, 60) || 'New Chat' })
        });
        if (res.ok) {
          const conv = await res.json();
          setActiveConversationId(conv.id);
          // Add all messages to the new conversation
          for (const msg of messages) {
            await fetch(`${API_BASE}/conversations/${conv.id}/messages`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ role: msg.role, content: msg.content })
            });
          }
          loadConversations(uid);
        }
      }
    } catch (err) { console.error('Failed to save conversation:', err); }
  };

  const loadConversation = async (uid, convId) => {
    try {
      const res = await fetch(`${API_BASE}/conversations/${uid}/${convId}`);
      if (res.ok) {
        const conv = await res.json();
        setChatHistory([
          { role: 'assistant', content: '' },
          ...conv.messages.map(m => ({ role: m.role, content: m.content }))
        ]);
        setActiveConversationId(convId);
        setShowSidebar(false);
      }
    } catch (err) { console.error('Failed to load conversation:', err); }
  };

  const deleteConversation = async (convId) => {
    try {
      await fetch(`${API_BASE}/conversations/${convId}`, { method: 'DELETE' });
      if (activeConversationId === convId) {
        setActiveConversationId(null);
        setChatHistory([{ role: 'assistant', content: '' }]);
      }
      if (currentUser?.uid) loadConversations(currentUser.uid);
    } catch (err) { console.error('Failed to delete conversation:', err); }
  };

  const startNewChat = () => {
    setActiveConversationId(null);
    setChatHistory([{ role: 'assistant', content: '' }]);
    setShowSidebar(false);
  };

  // ── File Upload ─────────────────────────────────────────────────────────

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setPendingImage(file);
    }
  };

  const removePendingImage = () => setPendingImage(null);

  // ── Code Execution ──────────────────────────────────────────────────────

  const handleExecuteCode = async (code) => {
    setExecutingCode(true);
    try {
      const res = await fetch(`${API_BASE}/ai/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language: 'javascript' })
      });
      const data = await res.json();
      return data;
    } catch (err) {
      return { success: false, error: 'Failed to execute code', output: '' };
    } finally {
      setExecutingCode(false);
    }
  };

  const handleCopyMessageText = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      addToast('Message text copied to clipboard!', 'success');
    }).catch(() => {
      addToast('Failed to copy message', 'error');
    });
  };

  const handleSaveEditedMessage = async (index, newContent) => {
    if (!newContent.trim()) return;
    
    const messageToEdit = chatHistory[index];
    if (messageToEdit.role === 'assistant') {
      // Just save inline for assistant replies!
      setChatHistory(prev => {
        const updated = [...prev];
        updated[index] = { ...updated[index], content: newContent };
        return updated;
      });
      setEditingMessageIndex(null);
      addToast('AI response updated successfully!', 'success');
    } else {
      // Resubmit for user prompts!
      setEditingMessageIndex(null);
      setChatLoading(true);
      
      // Update history state up to this user message (truncating subsequent messages)
      const updatedHistory = [...chatHistory.slice(0, index)];
      const userMsg = { role: 'user', content: newContent };
      const newHistory = [...updatedHistory, userMsg];
      setChatHistory(newHistory);
      
      // Prior history goes to the API
      const priorHistory = updatedHistory.filter(
        (msg, idx) => !(idx === 0 && msg.role === 'assistant' && !msg.content)
      );
      
      try {
        const response = await fetch(`${API_BASE}/ai/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userMsg.content,
            history: priorHistory,
            classLevel: currentUser?.classLevel || undefined,
            stream: currentUser?.stream || undefined,
            department: currentUser?.department || undefined,
            course: currentUser?.course || undefined,
          })
        });

        if (response.ok && response.headers.get('content-type')?.includes('text/event-stream')) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let fullReply = '';
          let buffer = '';
          setChatHistory(prev => [...prev, { role: 'assistant', content: '', isStreaming: true }]);
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop();
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6));
                  if (data.type === 'chunk' && data.text) {
                    fullReply += data.text;
                    const capturedReply = fullReply;
                    setChatHistory(prev => { const u = [...prev]; u[u.length - 1] = { role: 'assistant', content: capturedReply, isStreaming: true }; return u; });
                  } else if (data.type === 'done') {
                    fullReply = data.reply || fullReply;
                    setChatHistory(prev => { const u = [...prev]; u[u.length - 1] = { role: 'assistant', content: fullReply, isSimulated: data.isSimulated, isStreaming: false }; return u; });
                  }
                } catch (e) {}
              }
            }
          }
        } else if (response.ok) {
          const data = await response.json();
          setChatHistory(prev => [...prev, { role: 'assistant', content: data.reply, isSimulated: data.isSimulated }]);
        } else {
          setChatHistory(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error communicating with the AI engine. Please try again.' }]);
        }
      } catch (err) {
        console.error(err);
        setChatHistory(prev => [...prev, { role: 'assistant', content: 'Connection timed out. Please verify your backend server is active.' }]);
      } finally {
        setChatLoading(false);
      }
    }
  };

  const handleReplyToMessage = (text) => {
    const cleanText = text.replace(/[#*_-]/g, '').trim();
    const snippet = cleanText.length > 60 ? cleanText.substring(0, 57) + '...' : cleanText;
    
    setChatMessage(`Replying to: "${snippet}"\n> `);
    const inputEl = document.querySelector('.chat-input-area textarea, .chat-input-area input');
    if (inputEl) {
      inputEl.focus();
    }
  };

  const handleGenerateQuizFromChat = (topicText) => {
    const cleanTopic = topicText.replace(/[#*_-]/g, '').trim().substring(0, 100);
    setQuizInput(cleanTopic);
    setActiveTab('quiz');
    addToast(`Topic set to "${cleanTopic.substring(0, 30)}..." — click Generate Quiz!`, 'info');
  };

  const handleLearnTopicClick = (topic) => {
    const levelContext = currentUser?.classLevel
      ? ` The student's registered level is ${currentUser.classLevel}${currentUser.stream ? ' (' + currentUser.stream + ' stream)' : ''}${currentUser.course ? ', studying ' + currentUser.course : ''}.`
      : '';
    const teachMsg = `You are a study assistant. The topic I want to learn about is: "${topic.name}".

IMPORTANT: Generate study content STRICTLY about "${topic.name}" — do not switch to a different, related, or more popular topic.
${levelContext ? `\n${levelContext}` : ''}
Topic description for context: ${topic.desc}

For the topic "${topic.name}", provide:
1. **Definition** — What exactly is "${topic.name}"?
2. **Core Principles** — Key concepts and how it works
3. **Step-by-Step Breakdown** — Walk through the logic or process
4. **Worked Examples** — At least 2 concrete examples with full solutions
5. **Real-World Applications** — Where and how "${topic.name}" is used
6. **Common Mistakes** — Errors students make with this topic
7. **Practice Question** — One question for me to try on "${topic.name}"

Stay strictly on "${topic.name}" throughout your entire response.`;
    setActiveTab('ai');
    handleSendChatMessage(null, teachMsg);
  };

  // --- AI Quiz Generator Operations ---
  const handleGenerateQuiz = async () => {
    const content = quizInput.trim();
    if (!content) {
      addToast('Please enter a topic or paste notes first!', 'warning');
      return;
    }
    setQuizLoading(true);
    setQuizQuestions([]);
    setQuizAnswers({});
    setQuizBookmarked({});
    setQuizSubmitted(false);
    setQuizScore(0);
    setQuizCurrentQuestionIndex(0);
    setQuizTimeLeft(0);
    setQuizTimerActive(false);

    try {
      const response = await fetch(`${API_BASE}/ai/generate-quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          questionCount: quizCount,
          difficulty: quizDifficulty,
          classLevel: currentUser?.classLevel || undefined,
          stream: currentUser?.stream || undefined,
          department: currentUser?.department || undefined,
          course: currentUser?.course || undefined,
        })
      });
      if (response.ok) {
        const data = await response.json();
        const questions = data.quiz || [];
        if (questions.length > 0) {
          setQuizQuestions(questions);
          if (data.isSimulated) {
            addToast(data.message || 'Questions generated using internal study knowledge engine.', 'info');
          } else {
            addToast(`Generated ${questions.length} ${quizDifficulty} questions!`, 'success');
          }
          if (quizMode === 'timed') {
            const timerSeconds = Math.min(Math.max(questions.length * 60, 60), 1200);
            setQuizTimeLeft(timerSeconds);
            setQuizTimerActive(true);
          }
        } else {
          addToast('No questions could be generated for this topic. Try adding more detail.', 'warning');
        }
      } else {
        addToast('Failed to generate quiz. Please check server logs.', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('Connection error. Ensure backend server is running.', 'error');
    } finally {
      setQuizLoading(false);
    }
  };

  const handleQuizAnswer = (qIndex, option) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [qIndex]: option }));
  };

  const handleToggleBookmark = (qIndex) => {
    setQuizBookmarked(prev => ({ ...prev, [qIndex]: !prev[qIndex] }));
    addToast(quizBookmarked[qIndex] ? 'Bookmark removed' : 'Question bookmarked for review', 'info');
  };

  const handleSubmitQuiz = async (autoSubmit = false) => {
    if (!quizQuestions.length) return;
    const answeredCount = Object.keys(quizAnswers).length;

    if (!autoSubmit && answeredCount < quizQuestions.length) {
      const unanswered = quizQuestions.length - answeredCount;
      if (!confirm(`You have ${unanswered} unanswered question${unanswered > 1 ? 's' : ''}. Are you sure you want to submit your quiz?`)) {
        return;
      }
    }

    let score = 0;
    quizQuestions.forEach((q, i) => {
      if (quizAnswers[i] && quizAnswers[i] === q.correct) score++;
    });
    setQuizScore(score);
    setQuizSubmitted(true);
    setQuizTimerActive(false);

    if (currentUser?.uid) {
      try {
        await fetch(`${API_BASE}/quiz-history`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid: currentUser.uid,
            topic: quizInput.trim() || 'General Quiz',
            subject: quizInput.trim() || 'General',
            difficulty: quizDifficulty,
            questionCount: quizQuestions.length,
            score,
            total: quizQuestions.length,
            percentage: quizQuestions.length > 0 ? Math.round((score / quizQuestions.length) * 100) : 0,
            questions: quizQuestions,
            answers: quizAnswers,
            classLevel: currentUser.classLevel || '',
            stream: currentUser.stream || '',
            course: currentUser.course || '',
          })
        });
        loadQuizHistory();
      } catch (err) {
        console.error('Failed to save quiz result:', err);
      }
    }
  };

  const handleConvertWrongAnswersToFlashcards = async () => {
    if (!quizSubmitted || !quizQuestions.length) return;
    const incorrectQuestions = quizQuestions.filter((q, idx) => quizAnswers[idx] !== q.correct);
    if (incorrectQuestions.length === 0) {
      addToast('Perfect score! No incorrect answers to convert.', 'success');
      return;
    }

    try {
      // Create new deck for these missed questions
      const deckTitle = `Quiz Review: ${quizInput.trim().substring(0, 30) || 'Study Notes'}`;
      const deckRes = await fetch(`${API_BASE}/decks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: deckTitle,
          description: `Auto-generated flashcards from missed questions on ${quizDifficulty} quiz (${new Date().toLocaleDateString()}).`
        })
      });

      if (!deckRes.ok) throw new Error('Failed to create deck');
      const newDeck = await deckRes.json();

      // Add each incorrect question as a card
      for (const q of incorrectQuestions) {
        const correctOptLetter = q.correct;
        const correctOptText = q.options[correctOptLetter] || '';
        await fetch(`${API_BASE}/cards`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            deckId: newDeck.id,
            question: q.question,
            answer: `${correctOptLetter}: ${correctOptText}\n\nExplanation: ${q.explanation || 'Review material.'}`,
            difficulty: 3
          })
        });
      }

      // Refresh decks list
      const decksRes = await fetch(`${API_BASE}/decks`);
      if (decksRes.ok) {
        const updatedDecks = await decksRes.json();
        setDecks(updatedDecks);
      }

      addToast(`Created deck "${deckTitle}" with ${incorrectQuestions.length} cards!`, 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to create flashcards deck.', 'error');
    }
  };

  const handleRetakeQuiz = () => {
    setQuizAnswers({});
    setQuizBookmarked({});
    setQuizSubmitted(false);
    setQuizScore(0);
    setQuizCurrentQuestionIndex(0);
    if (quizMode === 'timed') {
      setQuizTimeLeft(Math.min(Math.max(quizQuestions.length * 60, 60), 1200));
      setQuizTimerActive(true);
    }
  };

  const handleResetQuiz = () => {
    setQuizQuestions([]);
    setQuizAnswers({});
    setQuizBookmarked({});
    setQuizSubmitted(false);
    setQuizScore(0);
    setQuizCurrentQuestionIndex(0);
    setQuizInput('');
    setQuizTimeLeft(0);
    setQuizTimerActive(false);
  };

  const loadQuizHistory = async () => {
    if (!currentUser?.uid) return;
    try {
      const [histRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/quiz-history/${currentUser.uid}?limit=20`),
        fetch(`${API_BASE}/quiz-stats/${currentUser.uid}`)
      ]);
      if (histRes.ok) {
        const { history } = await histRes.json();
        setQuizHistory(history || []);
      }
      if (statsRes.ok) {
        const stats = await statsRes.json();
        setQuizStats(stats);
      }
    } catch (err) {
      console.error('Failed to load quiz history:', err);
    }
  };

  // Show Firebase initializing spinner (prevents auth flicker)
  if (!authInitialized) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--bg-main)', fontFamily: 'var(--font-body)' }}>
        <div style={{ width: '36px', height: '36px', border: '3px solid var(--accent-primary-light)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 0.8s infinite linear' }}></div>
        <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>Initializing...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (isLoading && !connectionError) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--bg-main)', fontFamily: 'var(--font-body)' }}>
        <div style={{ width: '36px', height: '36px', border: '3px solid var(--accent-primary-light)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 0.8s infinite linear' }}></div>
        <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>Connecting to server...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!currentUser && !showAuth) {
    return (
      <div className="landing-page">
        <nav className={`landing-nav${landingScrolled ? ' landing-nav-scrolled' : ''}`}>
          <button className="landing-brand" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="landing-brand-mark">
              <img src={logoImage} alt="" aria-hidden="true" />
            </span>
            <span>AuraStudy</span>
          </button>
          <div className="landing-nav-links">
            <a href="#features">Features</a>
            <a href="#curriculum">Curriculum</a>
            <a href="#workflow">How It Works</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#faq">FAQ</a>
          </div>
          <div className="landing-nav-actions">
            <button className="landing-nav-cta-ghost" type="button" onClick={() => { setAuthMode('login'); setShowAuth(true); }}>
              Sign in
            </button>
            <button className="landing-nav-cta" type="button" onClick={() => { setAuthMode('signup'); setShowAuth(true); }}>
              Get Started Free
            </button>
          </div>
        </nav>

        <main>
          <section className="landing-hero">
            <div className="landing-hero-bg-glow"></div>
            <div className="landing-hero-content">
              <span className="landing-badge" data-reveal>
                <span className="landing-badge-dot"></span>
                Now covering WAEC &amp; Nigerian curriculum
              </span>
              <h1 className="landing-hero-title" data-reveal>
                Study Smarter.<br />
                <span className="landing-hero-accent">Level Up Your Learning.</span>
              </h1>
              <p className="landing-hero-copy" data-reveal>
                From Basic 1 to University, and for developers learning to code &mdash; AuraStudy is your AI-powered study companion that adapts to your exact level. Ask questions, generate flashcards, take quizzes, and retain more with spaced repetition.
              </p>
              <div className="landing-hero-actions" data-reveal>
                <button className="landing-primary-btn" type="button" onClick={() => { setAuthMode('signup'); setShowAuth(true); }}>
                  Start Learning Free
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </button>
                <button className="landing-secondary-btn" type="button" onClick={() => { setAuthMode('login'); setShowAuth(true); }}>
                  Sign in to Account
                </button>
              </div>
              <div className="landing-hero-proof" data-reveal>
                <span className="landing-hero-proof-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  Free forever
                </span>
                <span className="landing-hero-proof-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  No credit card
                </span>
                <span className="landing-hero-proof-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  All school levels
                </span>
              </div>
            </div>
            <div className="landing-hero-visual" data-reveal>
              <div className="landing-hero-card-stack">
                <div className="landing-float-card landing-float-card-1">
                  <span className="landing-float-icon">
                    <AIIcon />
                  </span>
                  <div>
                    <strong>Ask Aura anything</strong>
                    <p>"Explain Newton's laws with examples"</p>
                  </div>
                </div>
                <div className="landing-float-card landing-float-card-2">
                  <span className="landing-float-icon">
                    <CardsIcon />
                  </span>
                  <div>
                    <strong>Auto-generate flashcards</strong>
                    <p>SM-2 spaced repetition built in</p>
                  </div>
                </div>
                <div className="landing-float-card landing-float-card-3">
                  <span className="landing-float-icon">
                    <QuizIcon />
                  </span>
                  <div>
                    <strong>Test your knowledge</strong>
                    <p>AI quizzes matched to your level</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="landing-section landing-proof" id="results">
            <div className="landing-proof-grid">
              <div data-reveal style={{ transitionDelay: '0ms' }}>
                <span className="landing-metric-num">6+</span>
                <span className="landing-metric-label">School Levels Covered</span>
                <p>Basic, JSS, SSS, University &amp; Developer</p>
              </div>
              <div data-reveal style={{ transitionDelay: '80ms' }}>
                <span className="landing-metric-num">50+</span>
                <span className="landing-metric-label">Subjects &amp; Topics</span>
                <p>WAEC curriculum, university courses, coding</p>
              </div>
              <div data-reveal style={{ transitionDelay: '160ms' }}>
                <span className="landing-metric-num">24/7</span>
                <span className="landing-metric-label">AI Tutor Access</span>
                <p>Your personal tutor, available anytime</p>
              </div>
              <div data-reveal style={{ transitionDelay: '240ms' }}>
                <span className="landing-metric-num">SM-2</span>
                <span className="landing-metric-label">Spaced Repetition</span>
                <p>Science-backed memory retention system</p>
              </div>
            </div>
          </section>

          <section className="landing-section" id="features">
            <div className="landing-section-heading" data-reveal>
              <span className="landing-eyebrow">Features</span>
              <h2>Everything you need to ace your studies</h2>
              <p className="landing-section-sub">One platform to learn, practice, and remember &mdash; tailored to your exact academic level.</p>
            </div>
            <div className="landing-feature-grid">
              <article className="landing-feature-card" data-reveal style={{ transitionDelay: '0ms' }}>
                <div className="landing-feature-icon-wrap">
                  <AIIcon />
                </div>
                <h3>AI Study Assistant</h3>
                <p>Ask any question and get clear, level-adapted explanations with examples and practice problems.</p>
              </article>
              <article className="landing-feature-card" data-reveal style={{ transitionDelay: '80ms' }}>
                <div className="landing-feature-icon-wrap">
                  <CardsIcon />
                </div>
                <h3>Smart Flashcards</h3>
                <p>Auto-generate flashcards from notes or topics. Review with SM-2 spaced repetition to never forget.</p>
              </article>
              <article className="landing-feature-card" data-reveal style={{ transitionDelay: '160ms' }}>
                <div className="landing-feature-icon-wrap">
                  <NotesIcon />
                </div>
                <h3>Study Notes &amp; Summaries</h3>
                <p>Write, organize, and let AI turn dense material into concise summaries and key takeaways.</p>
              </article>
              <article className="landing-feature-card" data-reveal style={{ transitionDelay: '240ms' }}>
                <div className="landing-feature-icon-wrap">
                  <QuizIcon />
                </div>
                <h3>AI Quizzes</h3>
                <p>Test yourself on any topic with AI-generated questions and track your mastery over time.</p>
              </article>
              <article className="landing-feature-card" data-reveal style={{ transitionDelay: '320ms' }}>
                <div className="landing-feature-icon-wrap">
                  <TimerIcon />
                </div>
                <h3>Pomodoro Timer</h3>
                <p>Stay focused with timed study sessions and track your productive hours across subjects.</p>
              </article>
              <article className="landing-feature-card" data-reveal style={{ transitionDelay: '400ms' }}>
                <div className="landing-feature-icon-wrap">
                  <CurriculumIcon />
                </div>
                <h3>Full Curriculum Browser</h3>
                <p>Browse the complete Nigerian curriculum by level, stream, and subject &mdash; every topic at your fingertips.</p>
              </article>
            </div>
          </section>

          <section className="landing-section landing-curriculum-preview" id="curriculum" data-reveal>
            <div className="landing-section-heading">
              <span className="landing-eyebrow">Curriculum</span>
              <h2>Built for the Nigerian education system</h2>
              <p className="landing-section-sub">From primary school to university &mdash; fully aligned with WAEC, NECO, and JAMB standards.</p>
            </div>
            <div className="landing-curriculum-levels">
              <div className="landing-curriculum-level-card" style={{ '--lc': '#22c55e' }} data-reveal>
                <div className="landing-clc-header">
                  <span className="landing-clc-icon">📚</span>
                  <h3>Basic (Primary)</h3>
                </div>
                <p>Basic 1 through Basic 6</p>
                <ul>
                  <li>Mathematics</li>
                  <li>English Language</li>
                  <li>Science &amp; Technology</li>
                  <li>Social Studies</li>
                </ul>
              </div>
              <div className="landing-curriculum-level-card" style={{ '--lc': '#3b82f6' }} data-reveal>
                <div className="landing-clc-header">
                  <span className="landing-clc-icon">🏫</span>
                  <h3>JSS (Junior Secondary)</h3>
                </div>
                <p>JSS 1 through JSS 3</p>
                <ul>
                  <li>Mathematics</li>
                  <li>English Language</li>
                  <li>Basic Science &amp; Tech</li>
                  <li>Civic Education</li>
                </ul>
              </div>
              <div className="landing-curriculum-level-card" style={{ '--lc': '#f59e0b' }} data-reveal>
                <div className="landing-clc-header">
                  <span className="landing-clc-icon">🎓</span>
                  <h3>SSS (Senior Secondary)</h3>
                </div>
                <p>Science, Art &amp; Commercial streams</p>
                <ul>
                  <li>Physics, Chemistry, Biology</li>
                  <li>Literature, Government</li>
                  <li>Accounting, Commerce</li>
                  <li>WAEC &amp; JAMB prep</li>
                </ul>
              </div>
              <div className="landing-curriculum-level-card" style={{ '--lc': '#a855f7' }} data-reveal>
                <div className="landing-clc-header">
                  <span className="landing-clc-icon">🏛️</span>
                  <h3>University</h3>
                </div>
                <p>20+ departments &amp; courses</p>
                <ul>
                  <li>Computer Science</li>
                  <li>Medicine &amp; Surgery</li>
                  <li>Law, Engineering</li>
                  <li>Business &amp; Management</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="landing-section landing-workflow" id="workflow">
            <div className="landing-section-heading" data-reveal>
              <span className="landing-eyebrow">How it works</span>
              <h2>Start studying in three simple steps</h2>
            </div>
            <div className="landing-steps">
              <div className="landing-step" data-reveal style={{ transitionDelay: '0ms' }}>
                <div className="landing-step-num">01</div>
                <h3>Pick your level &amp; topic</h3>
                <p>Select your class level, stream, and any subject or topic you want to study.</p>
              </div>
              <div className="landing-step-connector" data-reveal></div>
              <div className="landing-step" data-reveal style={{ transitionDelay: '110ms' }}>
                <div className="landing-step-num">02</div>
                <h3>Learn with AI</h3>
                <p>Get clear explanations, examples, and walkthroughs from your personal AI tutor.</p>
              </div>
              <div className="landing-step-connector" data-reveal></div>
              <div className="landing-step" data-reveal style={{ transitionDelay: '220ms' }}>
                <div className="landing-step-num">03</div>
                <h3>Practice &amp; retain</h3>
                <p>Generate flashcards and quizzes, then review with spaced repetition to lock it in.</p>
              </div>
            </div>
          </section>

          <section className="landing-section landing-testimonials" id="testimonials">
            <div className="landing-section-heading" data-reveal>
              <span className="landing-eyebrow">Testimonials</span>
              <h2>Students love AuraStudy</h2>
              <p className="landing-section-sub">Join students across Nigeria who are studying smarter, not harder.</p>
            </div>
            <div className="landing-testimonial-grid">
              <div className="landing-testimonial-card" data-reveal style={{ transitionDelay: '0ms' }}>
                <div className="landing-testimonial-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                <p>"AuraStudy helped me understand organic chemistry better than my textbook. The AI explains things exactly at my SSS 3 level."</p>
                <div className="landing-testimonial-author">
                  <div className="landing-testimonial-avatar">A</div>
                  <div>
                    <strong>Adaeze N.</strong>
                    <span>SSS 3 &bull; Science</span>
                  </div>
                </div>
              </div>
              <div className="landing-testimonial-card" data-reveal style={{ transitionDelay: '100ms' }}>
                <div className="landing-testimonial-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                <p>"The flashcards are a game-changer. I use them during breaks and my scores in Mathematics have improved a lot."</p>
                <div className="landing-testimonial-author">
                  <div className="landing-testimonial-avatar">O</div>
                  <div>
                    <strong>Oluwaseun A.</strong>
                    <span>JSS 2 &bull; Junior Secondary</span>
                  </div>
                </div>
              </div>
              <div className="landing-testimonial-card" data-reveal style={{ transitionDelay: '200ms' }}>
                <div className="landing-testimonial-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                <p>"As a final year CS student, I use it to review data structures and algorithms. The AI-generated quizzes really test your understanding."</p>
                <div className="landing-testimonial-author">
                  <div className="landing-testimonial-avatar">I</div>
                  <div>
                    <strong>Ibrahim K.</strong>
                    <span>University &bull; Computer Science</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="landing-section landing-faq" id="faq">
            <div className="landing-section-heading" data-reveal>
              <span className="landing-eyebrow">FAQ</span>
              <h2>Frequently asked questions</h2>
            </div>
            <div className="landing-faq-list">
              {[
                { q: 'Is AuraStudy really free?', a: 'Yes! AuraStudy is completely free to use. No hidden fees, no premium tier, no credit card required.' },
                { q: 'What school levels does it support?', a: 'We cover Basic 1-6 (Primary), JSS 1-3 (Junior Secondary), SSS 1-3 (Senior Secondary with Science/Art/Commercial streams), and University level across 20+ departments and courses.' },
                { q: 'How does the AI tutor work?', a: 'Our AI tutor adapts to your class level, stream, and subjects. When you ask a question, it provides explanations, examples, and step-by-step solutions tailored to your exact academic level.' },
                { q: 'Is it aligned with the Nigerian curriculum?', a: 'Absolutely. Our curriculum data is aligned with the WAEC, NECO, and JAMB standards. We cover all core subjects and elective courses across every level.' },
                { q: 'Can I use it on my phone?', a: 'Yes! AuraStudy works on any device with a web browser — phones, tablets, and desktops. It is fully responsive and optimized for mobile use.' },
              ].map((item, i) => (
                <details key={i} className="landing-faq-item" data-reveal style={{ transitionDelay: `${i * 60}ms` }}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="landing-final-cta" data-reveal>
            <div className="landing-final-cta-content">
              <h2>Ready to study smarter?</h2>
              <p>Join thousands of students across Nigeria using AI to learn faster and remember more.</p>
            </div>
            <button className="landing-primary-btn landing-primary-btn-lg" type="button" onClick={() => { setAuthMode('signup'); setShowAuth(true); }}>
              Get Started &mdash; It's Free
            </button>
          </section>

          <footer className="landing-footer">
            <div className="landing-footer-inner">
              <div className="landing-footer-brand">
                <span className="landing-brand-mark">
                  <img src={logoImage} alt="" aria-hidden="true" />
                </span>
                <span>AuraStudy</span>
              </div>
              <p className="landing-footer-copy">&copy; {new Date().getFullYear()} AuraStudy. AI-Powered Learning for Every Student.</p>
            </div>
          </footer>
      </main>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <button className="auth-back-btn" type="button" onClick={() => setShowAuth(false)}>
            Back to landing
          </button>
          <div className="auth-header">
            <div className="auth-logo">✨</div>
            <h1 className="auth-title">AuraStudy</h1>
            <p className="auth-subtitle">Elevate your study intelligence</p>
          </div>

          <div className="auth-tabs">
            <button 
              className={`auth-tab ${authMode === 'login' ? 'active' : ''}`}
              onClick={() => { setAuthMode('login'); setAuthError(''); }}
            >
              Sign In
            </button>
            <button 
              className={`auth-tab ${authMode === 'signup' ? 'active' : ''}`}
              onClick={() => { setAuthMode('signup'); setAuthError(''); }}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="auth-form">
            {authMode === 'signup' && (
              <div className="auth-input-group">
                <label htmlFor="displayName">Display Name</label>
                <input
                  id="displayName"
                  type="text"
                  value={authDisplayName}
                  onChange={(e) => setAuthDisplayName(e.target.value)}
                  placeholder="e.g. Alex Study"
                />
              </div>
            )}

            {authMode === 'signup' && (
              <div className="auth-input-group">
                <label htmlFor="classLevel">Class / Level</label>
                <select
                  id="classLevel"
                  className="input-field"
                  value={authClassLevel}
                  onChange={(e) => {
                    const value = e.target.value;
                    setAuthClassLevel(value);
                    if (!isSSSLevel(value)) {
                      setAuthStream('');
                    }
                    if (!isHigherInstitutionLevel(value)) {
                      setAuthDepartment('');
                      setAuthCourse('');
                    }
                  }}
                  required
                >
                  <option value="" disabled>Select your class...</option>
                  {CLASS_LEVEL_GROUPS.map((group) => (
                    <optgroup key={group.label} label={group.label}>
                      {group.options.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            )}

            {authMode === 'signup' && isSSSLevel(authClassLevel) && (
              <div className="auth-input-group">
                <label htmlFor="stream">Stream</label>
                <select
                  id="stream"
                  className="input-field"
                  value={authStream}
                  onChange={(e) => setAuthStream(e.target.value)}
                  required
                >
                  <option value="" disabled>Select Science, Art, or Commercial...</option>
                  {SSS_STREAMS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            )}

            {authMode === 'signup' && isHigherInstitutionLevel(authClassLevel) && (
              <div className="auth-input-group">
                <label htmlFor="department">Department</label>
                <select
                  id="department"
                  className="input-field"
                  value={authDepartment}
                  onChange={(e) => {
                    setAuthDepartment(e.target.value);
                    setAuthCourse('');
                  }}
                  required
                >
                  <option value="" disabled>Select your department...</option>
                  {DEPARTMENTS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            )}

            {authMode === 'signup' && isHigherInstitutionLevel(authClassLevel) && authDepartment && (
              <div className="auth-input-group">
                <label htmlFor="course">Course of Study</label>
                <select
                  id="course"
                  className="input-field"
                  value={authCourse}
                  onChange={(e) => setAuthCourse(e.target.value)}
                  required
                >
                  <option value="" disabled>Select your course...</option>
                  {getCoursesForDepartment(authDepartment).map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            )}

            {authMode === 'signup' && authClassLevel && (() => {
              const subjects = getSubjectsForClass(authClassLevel, authStream, authDepartment);
              if (subjects.length === 0) return null;
              return (
                <div className="auth-input-group">
                  <label>Your Subjects</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {subjects.map((subject) => (
                      <span key={subject} className="badge badge-purple" style={{ fontWeight: 500 }}>{subject}</span>
                    ))}
                  </div>
                </div>
              );
            })()}

            <div className="auth-input-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={authEmail}
                onChange={(e) => {
                  setAuthEmail(e.target.value);
                }}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="auth-input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            {authError && <div className="auth-error">{authError}</div>}

            <button type="submit" className="auth-submit-btn" disabled={authLoading}>
              {authLoading ? (
                <>
                  <span className="auth-spinner"></span>
                  Please wait...
                </>
              ) : (
                authMode === 'login' ? 'Access Workspace' : 'Create Account'
              )}
            </button>

            {authMode === 'login' || authMode === 'signup' ? (
              <>
            <div className="auth-separator">
              <span className="auth-separator-text">or continue with</span>
            </div>

            <div className="auth-social-buttons">
              <button type="button" className="auth-social-btn google-btn" onClick={() => handleSocialLogin('Google')} disabled={authLoading}>
                <GoogleIcon /> Google
              </button>
              <button type="button" className="auth-social-btn apple-btn" onClick={() => handleSocialLogin('Apple')} disabled={authLoading}>
                <AppleIcon /> Apple
              </button>
            </div>
              </>
            ) : null}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Hamburger button — only visible on mobile */}
      <button
        className="mobile-hamburger"
        type="button"
        onClick={() => setMobileMenuOpen(prev => !prev)}
        aria-label="Toggle navigation"
      >
        <span className={`hamburger-line${mobileMenuOpen ? ' open' : ''}`}></span>
        <span className={`hamburger-line${mobileMenuOpen ? ' open' : ''}`}></span>
        <span className={`hamburger-line${mobileMenuOpen ? ' open' : ''}`}></span>
      </button>

      {/* --- Sidebar Navigation --- */}
      <aside className={`sidebar${mobileMenuOpen ? ' sidebar-open' : ''}`}>
        <div className="logo-container">
          <div className="logo-icon">
            <img src={logoImage} alt="" aria-hidden="true" style={{ width: '100%', height: '100%', borderRadius: '8px', objectFit: 'cover' }} />
          </div>
          <span className="logo-text">AuraStudy</span>
        </div>

        <nav style={{ flexGrow: 1 }}>
          <ul className="nav-links">
            <li className={`nav-item ${activeTab === 'learn' ? 'active' : ''}`}>
              <button onClick={() => { setActiveTab('learn'); setActiveDeck(null); setIsReviewMode(false); setMobileMenuOpen(false); }} id="nav-learn">
                <LearnIcon /> Learn
              </button>
            </li>
            <li className={`nav-item ${activeTab === 'curriculum' ? 'active' : ''}`}>
              <button onClick={() => { setActiveTab('curriculum'); setActiveDeck(null); setIsReviewMode(false); setCurriculumLevel(null); setCurriculumSubject(null); setMobileMenuOpen(false); }} id="nav-curriculum">
                <CurriculumIcon /> Curriculum
              </button>
            </li>
            <li className={`nav-item ${activeTab === 'flashcards' ? 'active' : ''}`}>
              <button onClick={() => { setActiveTab('flashcards'); setMobileMenuOpen(false); }} id="nav-cards">
                <CardsIcon /> Flashcards
              </button>
            </li>
            <li className={`nav-item ${activeTab === 'pomodoro' ? 'active' : ''}`}>
              <button onClick={() => { setActiveTab('pomodoro'); setActiveDeck(null); setIsReviewMode(false); setMobileMenuOpen(false); }} id="nav-timer">
                <TimerIcon /> Pomodoro Timer
              </button>
            </li>
            <li className={`nav-item ${activeTab === 'notes' ? 'active' : ''}`}>
              <button onClick={() => { setActiveTab('notes'); setActiveDeck(null); setIsReviewMode(false); setMobileMenuOpen(false); }} id="nav-notes">
                <NotesIcon /> Study Notes
              </button>
            </li>
            <li className={`nav-item ${activeTab === 'quiz' ? 'active' : ''}`}>
              <button onClick={() => { setActiveTab('quiz'); setActiveDeck(null); setIsReviewMode(false); setMobileMenuOpen(false); }} id="nav-quiz">
                <QuizIcon /> Quiz
              </button>
            </li>
            <li className={`nav-item ${activeTab === 'planner' ? 'active' : ''}`}>
              <button onClick={() => { setActiveTab('planner'); setActiveDeck(null); setIsReviewMode(false); setMobileMenuOpen(false); }} id="nav-planner">
                <PlannerIcon /> Study Planner
              </button>
            </li>
              <li className={`nav-item ${activeTab === 'ai' ? 'active' : ''}`}>
                <button onClick={() => { setActiveTab('ai'); setActiveDeck(null); setIsReviewMode(false); setMobileMenuOpen(false); }} id="nav-ai">
                  <AIIcon /> AI Assistant
                </button>
              </li>
              <li className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}>
                <button onClick={() => { setActiveTab('settings'); setActiveDeck(null); setIsReviewMode(false); setMobileMenuOpen(false); }} id="nav-settings">
                  <SettingsIcon /> Settings
                </button>
              </li>
          </ul>
        </nav>

        {currentUser && (
          <div className="user-profile-widget">
            {currentUser.photoURL ? (
              <img src={currentUser.photoURL} alt="avatar" className="user-avatar" style={{ padding: 0, objectFit: 'cover' }} referrerPolicy="no-referrer" />
            ) : (
              <div className="user-avatar">{currentUser.username[0].toUpperCase()}</div>
            )}
            <div className="user-info">
              <span className="user-name">{currentUser.username}</span>
              {currentUser.classLevel && (
                <span className="user-class-level">
                  {currentUser.classLevel}
                  {currentUser.stream ? ` (${currentUser.stream})` : ''}
                  {currentUser.course ? ` · ${currentUser.course}` : ''}
                  {currentUser.department && !currentUser.course ? ` · ${currentUser.department}` : ''}
                </span>
              )}
              <button className="logout-btn" onClick={handleLogout}>Log Out</button>
            </div>
          </div>
        )}

        <div className="sidebar-footer">
            <button
              onClick={toggleTheme}
              className="theme-toggle-btn"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
                padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-light)',
                background: 'var(--surface-ghost)', color: 'var(--text-muted)', cursor: 'pointer',
                fontSize: '0.82rem', fontWeight: 500, marginBottom: '6px'
              }}
            >
              <span style={{ fontSize: '1rem' }}>{theme === 'light' ? '🌙' : '☀️'}</span>
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>
            <div className="ai-status-pill" title={aiStatus.reason || "AI service status"}><span className={"ai-status-dot " + (aiStatus.mode === "live" ? "live" : "down")}></span><span className="ai-status-text">{aiStatus.mode === "live" ? ("AI: " + (aiStatus.model || "Gemini")) : aiStatus.mode === "cooling_down" ? ("AI: Paused (" + Math.ceil(aiStatus.cooldownRemainingMs / 1000) + "s)") : "AI: Offline fallback"}</span></div>
          {connectionError && (
            <div style={{ color: 'var(--danger)', fontSize: '0.8rem', background: 'var(--danger-bg)', padding: '8px', borderRadius: '6px', border: '1px solid var(--danger-border, rgba(220, 38, 38, 0.2))' }}>
              ⚠️ Server Disconnected
            </div>
          )}
        </div>
      </aside>

      {/* --- Main Contents Panels --- */}
      <main className="main-content">
        
        {/* ==================== LEARN TAB ==================== */}
        {activeTab === 'learn' && (
          <div className="tab-panel">

            {!activeLearnCategory ? (
              <>
                {/* ── Greeting Banner ── */}
                <div className="dash-greeting stagger-in" style={{ animationDelay: '0ms' }}>
                  <div className="dash-greeting-text">
                    <h1>
                      {currentUser
                        ? `Welcome back, ${currentUser.username?.split(' ')[0] || 'Student'} 👋`
                        : 'What do you want to learn? 👋'}
                    </h1>
                    <p>
                      {currentUser?.classLevel
                        ? `${currentUser.classLevel}${currentUser.stream ? ' · ' + currentUser.stream : ''}${currentUser.course ? ' · ' + currentUser.course : ''} — pick a topic and your AI tutor will teach it.`
                        : 'Pick a category, choose a topic, and your AI tutor will teach it to you.'}
                    </p>
                  </div>
                  <div className="dash-greeting-glow" aria-hidden="true" />
                </div>

                {/* ── Stat Cards ── */}
                <div className="dash-stats-grid">
                  <div className="dash-stat-card dash-stat-purple stagger-in" style={{ animationDelay: '40ms' }}>
                    <div className="dash-stat-icon">⏱️</div>
                    <div className="dash-stat-body">
                      <span className="dash-stat-value">
                        {pomodoros.filter(p => p.type === 'focus').reduce((acc, curr) => acc + curr.duration, 0)}
                        <span className="dash-stat-unit">m</span>
                      </span>
                      <span className="dash-stat-label">Focused Study</span>
                    </div>
                  </div>
                  <div className="dash-stat-card dash-stat-blue stagger-in" style={{ animationDelay: '80ms' }}>
                    <div className="dash-stat-icon">🗂️</div>
                    <div className="dash-stat-body">
                      <span className="dash-stat-value">{cards.length}</span>
                      <span className="dash-stat-label">Flashcards</span>
                    </div>
                  </div>
                  <div className="dash-stat-card dash-stat-green stagger-in" style={{ animationDelay: '120ms' }}>
                    <div className="dash-stat-icon">📝</div>
                    <div className="dash-stat-body">
                      <span className="dash-stat-value">{notes.length}</span>
                      <span className="dash-stat-label">Study Notes</span>
                    </div>
                  </div>
                  <div className="dash-stat-card dash-stat-orange stagger-in" style={{ animationDelay: '160ms' }}>
                    <div className="dash-stat-icon">✅</div>
                    <div className="dash-stat-body">
                      <span className="dash-stat-value">
                        {tasks.filter(t => t.status === 'completed').length}
                        <span className="dash-stat-unit">/{tasks.length}</span>
                      </span>
                      <span className="dash-stat-label">Tasks Done</span>
                    </div>
                  </div>
                </div>

                {/* ── Search ── */}
                <div className="dash-search-wrap stagger-in" style={{ animationDelay: '200ms' }}>
                  <span className="dash-search-icon" aria-hidden="true">🔍</span>
                  <input
                    className="dash-search-input"
                    placeholder="Search topics... e.g. 'JavaScript', 'photosynthesis', 'algebra'"
                    value={learnSearch}
                    onChange={(e) => setLearnSearch(e.target.value)}
                  />
                </div>

                {/* ── Category Grid ── */}
                <p className="dash-section-label">
                  {learnSearch.trim() ? 'Search Results' : 'Study Categories'}
                </p>
                <div className="dash-category-grid">
                  {(() => {
                    const levelInfo = getCategoryForLevel(currentUser?.classLevel, currentUser?.stream);
                    let cats = LEARNING_CATEGORIES.filter(cat => {
                      if (!learnSearch.trim()) return true;
                      const q = learnSearch.toLowerCase();
                      return cat.title.toLowerCase().includes(q) || cat.topics.some(t => t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q));
                    });
                    if (levelInfo.primary && !learnSearch.trim()) {
                      cats = cats.filter(cat => levelInfo.related.includes(cat.id));
                    }
                    if (levelInfo.primary) {
                      cats.sort((a, b) => (a.id === levelInfo.primary ? -1 : b.id === levelInfo.primary ? 1 : 0));
                    }
                    return cats.map((cat, i) => {
                      const filteredTopics = learnSearch.trim()
                        ? cat.topics.filter(t => t.name.toLowerCase().includes(learnSearch.toLowerCase()) || t.desc.toLowerCase().includes(learnSearch.toLowerCase()))
                        : cat.topics;
                      const isRecommended = levelInfo.primary === cat.id;
                      return (
                        <button
                          key={cat.id}
                          className="dash-cat-card stagger-in"
                          style={{ '--cat-color': cat.color, animationDelay: `${240 + i * 50}ms` }}
                          onClick={() => setActiveLearnCategory(cat.id)}
                        >
                          <div className="dash-cat-bar" style={{ background: cat.color }} />
                          <div className="dash-cat-body">
                            <div className="dash-cat-top">
                              <span className="dash-cat-title">{cat.title}</span>
                              {isRecommended && <span className="dash-cat-badge">Your Level</span>}
                            </div>
                            <span className="dash-cat-sub">{cat.subtitle}</span>
                            <span className="dash-cat-count">
                              {learnSearch.trim() ? filteredTopics.length + ' matching' : cat.topics.length + ' topics'} →
                            </span>
                          </div>
                        </button>
                      );
                    });
                  })()}
                </div>
              </>
            ) : (
              <>
                <div className="page-header">
                  <div className="page-title">
                    <button className="learn-back-btn" onClick={() => setActiveLearnCategory(null)}>← All Categories</button>
                    <h1>{LEARNING_CATEGORIES.find(c => c.id === activeLearnCategory)?.title || 'Learn'}</h1>
                    <p>{LEARNING_CATEGORIES.find(c => c.id === activeLearnCategory)?.subtitle || ''}</p>
                  </div>
                </div>
                <div className="learn-topic-grid">
                  {LEARNING_CATEGORIES.find(c => c.id === activeLearnCategory)?.topics.map((topic, i) => (
                    <button
                      key={topic.id}
                      className="learn-topic-card stagger-in"
                      style={{ animationDelay: `${i * 60}ms` }}
                      onClick={() => handleLearnTopicClick(topic)}
                    >
                      <h3>{topic.name}</h3>
                      <p>{topic.desc}</p>
                      <span className="learn-topic-cta">Start Learning →</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ==================== CURRICULUM TAB ==================== */}
        {activeTab === 'curriculum' && (
          <div className="tab-panel">
            <div className="page-header">
              <div className="page-title">
                <h1>Nigerian Curriculum</h1>
                <p>Explore the complete WAEC/Nigerian school curriculum organised by level, subject, and topic.</p>
              </div>
            </div>

            {/* Search */}
            <div style={{ maxWidth: '500px', marginBottom: '28px' }}>
              <input
                className="input-field"
                placeholder="Search curriculum... e.g. 'algebra', 'photosynthesis', 'accounting'"
                value={curriculumSearch}
                onChange={(e) => setCurriculumSearch(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            {/* Level Selection */}
            {!curriculumLevel && (
              <>
                {currentUser?.classLevel && (
                  <div className="curriculum-recommended">
                    <div className="curriculum-recommended-badge">
                      <span>🎓</span>
                      <span>Your Level: <strong>{currentUser.classLevel}{currentUser.stream ? ` (${currentUser.stream})` : ''}{currentUser.course ? ` — ${currentUser.course}` : ''}</strong></span>
                    </div>
                    <p>Showing curriculum matched to your profile.</p>
                  </div>
                )}
                <div className="curriculum-level-grid">
                  {Object.entries(CURRICULUM_DATA).map(([key, level], i) => (
                    <button
                      key={key}
                      className="curriculum-level-card stagger-in"
                      style={{ animationDelay: `${i * 80}ms`, '--level-color': level.color }}
                      onClick={() => { setCurriculumLevel(key); setCurriculumSubject(null); }}
                    >
                      <div className="curriculum-level-accent" style={{ background: level.color }}></div>
                      <div className="curriculum-level-icon">{level.icon}</div>
                      <h3>{level.label}</h3>
                      <p>{level.subtitle}</p>
                      {level.description && <p className="curriculum-level-desc">{level.description}</p>}
                      <div className="curriculum-level-meta">
                        {key === 'basic' && <span>{Object.keys(level.levels).length} grades</span>}
                        {key === 'jss' && <span>{Object.keys(level.levels).length} classes</span>}
                        {key === 'sss' && <span>{Object.keys(level.levels).length} classes · {level.streams?.length} streams</span>}
                        {key === 'university' && <span>{level.departments?.length} departments</span>}
                        {level.examBoards && <span className="curriculum-level-boards">{level.examBoards.join(' · ')}</span>}
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Subject View for Basic/JSS */}
            {curriculumLevel && curriculumLevel !== 'sss' && curriculumLevel !== 'university' && !curriculumSubject && (
              <>
                <button className="learn-back-btn" onClick={() => { setCurriculumLevel(null); setCurriculumSubject(null); }}>
                  ← All Levels
                </button>
                <div className="curriculum-subject-header">
                  <h2 style={{ color: CURRICULUM_DATA[curriculumLevel]?.color }}>{CURRICULUM_DATA[curriculumLevel]?.icon} {CURRICULUM_DATA[curriculumLevel]?.label}</h2>
                  <p>Select a class to view its curriculum:</p>
                </div>
                <div className="curriculum-level-tabs">
                  {Object.entries(CURRICULUM_DATA[curriculumLevel]?.levels || {}).map(([levelKey, levelData]) => (
                    <button
                      key={levelKey}
                      className="curriculum-level-tab"
                      style={{ '--level-color': CURRICULUM_DATA[curriculumLevel]?.color }}
                      onClick={() => setCurriculumSubject({ type: 'standard', level: levelKey, data: levelData })}
                    >
                      <span className="curriculum-level-tab-name">{levelKey}</span>
                      <span className="curriculum-level-tab-count">{levelData.subjects.length} subjects</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* SSS Stream Selection */}
            {curriculumLevel === 'sss' && !curriculumSubject && (
              <>
                <button className="learn-back-btn" onClick={() => { setCurriculumLevel(null); setCurriculumSubject(null); }}>
                  ← All Levels
                </button>
                <div className="curriculum-subject-header">
                  <h2 style={{ color: CURRICULUM_DATA.sss.color }}>{CURRICULUM_DATA.sss.icon} {CURRICULUM_DATA.sss.label}</h2>
                  {CURRICULUM_DATA.sss.description && <p className="curriculum-section-desc">{CURRICULUM_DATA.sss.description}</p>}
                  {CURRICULUM_DATA.sss.examBoards && (
                    <div className="curriculum-exam-boards">
                      {CURRICULUM_DATA.sss.examBoards.map(b => (
                        <span key={b} className="curriculum-exam-badge">{b}</span>
                      ))}
                    </div>
                  )}
                  <p>Select a stream and class to view the curriculum:</p>
                </div>
                {Object.entries(CURRICULUM_DATA.sss.levels).map(([levelKey, levelData]) => (
                  <div key={levelKey} className="curriculum-sss-level-section">
                    <h3 className="curriculum-sss-level-title">{levelKey}</h3>
                    <div className="curriculum-sss-stream-grid">
                      {CURRICULUM_DATA.sss.streams.map(stream => (
                        <button
                          key={stream}
                          className="curriculum-sss-stream-card"
                          style={{ '--level-color': CURRICULUM_DATA.sss.color }}
                          onClick={() => setCurriculumSubject({ type: 'sss', level: levelKey, stream, data: levelData })}
                        >
                          <span className="curriculum-stream-icon">
                            {stream === 'Science' ? '🔬' : stream === 'Art' ? '🎨' : '💼'}
                          </span>
                          <span className="curriculum-stream-name">{stream}</span>
                          <span className="curriculum-stream-count">
                            {levelData[stream]?.length || 0} subjects
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* University Department/Course Selection */}
            {curriculumLevel === 'university' && !curriculumSubject && (
              <>
                <button className="learn-back-btn" onClick={() => { setCurriculumLevel(null); setCurriculumSubject(null); }}>
                  ← All Levels
                </button>
                <div className="curriculum-subject-header">
                  <h2 style={{ color: CURRICULUM_DATA.university.color }}>{CURRICULUM_DATA.university.icon} {CURRICULUM_DATA.university.label}</h2>
                  <p>Select a department and course to view the curriculum:</p>
                </div>
                {CURRICULUM_DATA.university.departments.map(dept => (
                  <div key={dept.name} className="curriculum-dept-section">
                    <h3 className="curriculum-dept-title">
                      {dept.icon && <span>{dept.icon} </span>}
                      {dept.name}
                    </h3>
                    <div className="curriculum-dept-courses">
                      {dept.courses.map(course => {
                        const topicList = course.topics || course.courses || [];
                        return (
                          <button
                            key={course.name}
                            className="curriculum-course-card"
                            style={{ '--level-color': CURRICULUM_DATA.university.color }}
                            onClick={() => setCurriculumSubject({ type: 'university', department: dept.name, course: course.name, data: course })}
                          >
                            <span className="curriculum-course-icon">{course.icon}</span>
                            <span className="curriculum-course-name">{course.name}</span>
                            {course.desc && <span className="curriculum-course-desc">{course.desc}</span>}
                            <span className="curriculum-course-count">{topicList.length} topics{course.duration ? ` · ${course.duration}` : ''}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Subject Detail View */}
            {curriculumSubject && (
              <>
                <button className="learn-back-btn" onClick={() => setCurriculumSubject(null)}>
                  ← Back to {curriculumLevel === 'sss' ? 'Streams' : curriculumLevel === 'university' ? 'Departments' : 'Levels'}
                </button>

                <div className="curriculum-detail-header" style={{ borderColor: CURRICULUM_DATA[curriculumLevel]?.color }}>
                  <div className="curriculum-detail-level-badge" style={{ background: CURRICULUM_DATA[curriculumLevel]?.color + '20', color: CURRICULUM_DATA[curriculumLevel]?.color }}>
                    {CURRICULUM_DATA[curriculumLevel]?.icon} {curriculumSubject.level}
                    {curriculumSubject.stream ? ` — ${curriculumSubject.stream}` : ''}
                    {curriculumSubject.course ? ` — ${curriculumSubject.course}` : ''}
                  </div>
                </div>

                {/* Core subjects (SSS) */}
                {curriculumSubject.type === 'sss' && curriculumSubject.data.core && (
                  <div className="curriculum-core-section">
                    <h3>📋 Core Subjects (All Streams)</h3>
                    <div className="curriculum-subject-grid">
                      {curriculumSubject.data.core.map(subjectName => {
                        const subject = curriculumSubject.data[curriculumSubject.stream]?.find(s => s.name === subjectName) ||
                          { name: subjectName, icon: '📖', topics: [] };
                        return (
                          <div key={subjectName} className="curriculum-subject-card" style={{ '--level-color': CURRICULUM_DATA[curriculumLevel]?.color }}>
                            <div className="curriculum-subject-card-header">
                              <span className="curriculum-subject-icon">{subject.icon}</span>
                              <h4>{subject.name}</h4>
                            </div>
                            {subject.topics.length > 0 && (
                              <ul className="curriculum-topic-list">
                                {subject.topics.filter(t => !curriculumSearch || t.toLowerCase().includes(curriculumSearch.toLowerCase())).map((topic, i) => (
                                  <li key={i} className="curriculum-topic-item" onClick={() => handleCurriculumTopicClick(topic)}>
                                    <span className="curriculum-topic-number">{i + 1}</span>
                                    <span>{topic}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Stream subjects (SSS) */}
                {curriculumSubject.type === 'sss' && curriculumSubject.stream && (
                  <div className="curriculum-stream-section">
                    {curriculumSubject.data.yearDesc && <p className="curriculum-year-desc">{curriculumSubject.data.yearDesc}</p>}
                    <h3>{curriculumSubject.stream === 'Science' ? '🔬' : curriculumSubject.stream === 'Art' ? '🎨' : '💼'} {curriculumSubject.stream} Stream Subjects</h3>
                    <div className="curriculum-subject-grid">
                      {(curriculumSubject.data[curriculumSubject.stream] || []).filter(s => !curriculumSearch ||
                        s.name.toLowerCase().includes(curriculumSearch.toLowerCase()) ||
                        s.topics.some(t => t.toLowerCase().includes(curriculumSearch.toLowerCase()))
                      ).map(subject => (
                        <div key={subject.name} className="curriculum-subject-card" style={{ '--level-color': CURRICULUM_DATA[curriculumLevel]?.color }}>
                          <div className="curriculum-subject-card-header">
                            <span className="curriculum-subject-icon">{subject.icon}</span>
                            <div>
                              <h4>{subject.name}</h4>
                              {subject.desc && <p className="curriculum-subject-desc">{subject.desc}</p>}
                            </div>
                            {subject.boards && (
                              <div className="curriculum-subject-boards">
                                {subject.boards.map(b => <span key={b} className="curriculum-board-tag">{b}</span>)}
                              </div>
                            )}
                          </div>
                          <div className="curriculum-topic-count">{subject.topics.length} topics</div>
                          <ul className="curriculum-topic-list">
                            {subject.topics.map((topic, i) => (
                              <li key={i} className="curriculum-topic-item" onClick={() => handleCurriculumTopicClick(topic)}>
                                <span className="curriculum-topic-number">{i + 1}</span>
                                <span>{topic}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Standard subjects (Basic, JSS, University course) */}
                {curriculumSubject.type === 'standard' && (
                  <>
                    {curriculumSubject.data.yearDesc && <p className="curriculum-year-desc">{curriculumSubject.data.yearDesc}</p>}
                    <div className="curriculum-subject-grid">
                    {curriculumSubject.data.subjects.filter(s => !curriculumSearch ||
                      s.name.toLowerCase().includes(curriculumSearch.toLowerCase()) ||
                      s.topics.some(t => t.toLowerCase().includes(curriculumSearch.toLowerCase()))
                    ).map(subject => (
                      <div key={subject.name} className="curriculum-subject-card" style={{ '--level-color': CURRICULUM_DATA[curriculumLevel]?.color }}>
                        <div className="curriculum-subject-card-header">
                          <span className="curriculum-subject-icon">{subject.icon}</span>
                          <div>
                            <h4>{subject.name}</h4>
                            {subject.desc && <p className="curriculum-subject-desc">{subject.desc}</p>}
                          </div>
                          {subject.boards && (
                            <div className="curriculum-subject-boards">
                              {subject.boards.map(b => <span key={b} className="curriculum-board-tag">{b}</span>)}
                            </div>
                          )}
                        </div>
                        <div className="curriculum-topic-count">{subject.topics.length} topics</div>
                        <ul className="curriculum-topic-list">
                          {subject.topics.map((topic, i) => (
                            <li key={i} className="curriculum-topic-item" onClick={() => handleCurriculumTopicClick(topic)}>
                              <span className="curriculum-topic-number">{i + 1}</span>
                              <span>{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  </>
                )}

                {/* University course topics */}
                {curriculumSubject.type === 'university' && (
                  <div className="curriculum-subject-grid">
                    <div className="curriculum-subject-card curriculum-course-detail" style={{ '--level-color': CURRICULUM_DATA[curriculumLevel]?.color }}>
                      <div className="curriculum-subject-card-header">
                        <span className="curriculum-subject-icon">{curriculumSubject.data.icon}</span>
                        <div>
                          <h4>{curriculumSubject.course}</h4>
                          {curriculumSubject.data.desc && <p className="curriculum-subject-desc">{curriculumSubject.data.desc}</p>}
                        </div>
                      </div>
                      <p className="curriculum-course-dept">Department of {curriculumSubject.department}{curriculumSubject.data.duration ? ` · ${curriculumSubject.data.duration}` : ''}</p>
                      <div className="curriculum-topic-count">{(curriculumSubject.data.topics || curriculumSubject.data.courses || []).length} topics</div>
                      <ul className="curriculum-topic-list">
                        {(curriculumSubject.data.topics || curriculumSubject.data.courses || []).filter(t => !curriculumSearch || t.toLowerCase().includes(curriculumSearch.toLowerCase())).map((topic, i) => (
                          <li key={i} className="curriculum-topic-item" onClick={() => handleCurriculumTopicClick(topic)}>
                            <span className="curriculum-topic-number">{i + 1}</span>
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ==================== FLASHCARDS TAB ==================== */}
        {activeTab === 'flashcards' && !activeDeck && (
          <div className="tab-panel">
            <div className="page-header">
              <div className="page-title">
                <h1>Flashcard Decks</h1>
                <p>{currentUser?.classLevel ? `Study tools for ${currentUser.classLevel}${currentUser.stream ? ' ' + currentUser.stream : ''}${currentUser.course ? ' — ' + currentUser.course : ''}` : 'Study using our advanced active recall spaced repetition trainer.'}</p>
              </div>
              <button className="btn btn-primary" onClick={() => setShowDeckModal(true)}>
                ➕ Create New Deck
              </button>
            </div>

            {decks.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                <h3 style={{ marginBottom: '10px' }}>No decks available</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Create your first flashcard deck to begin studying.</p>
                {currentUser?.classLevel && (() => {
                  const subjects = getSubjectsForClass(currentUser.classLevel, currentUser.stream, currentUser.department);
                  if (subjects.length === 0) return null;
                  return (
                    <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                      <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Suggested decks for {currentUser.classLevel}:</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {subjects.slice(0, 6).map(s => (
                          <span key={s} className="badge badge-purple" style={{ cursor: 'pointer' }} onClick={() => { setNewDeckTitle(s); setShowDeckModal(true); }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  );
                })()}
                <button className="btn btn-primary" onClick={() => setShowDeckModal(true)}>Add Deck</button>
              </div>
            ) : (
              <div className="grid-3">
                {decks.map(deck => {
                  const deckCardsCount = cards.filter(c => c.deckId === deck.id).length;
                  return (
                    <div key={deck.id} className="card deck-card card-hover" onClick={() => setActiveDeck(deck)}>
                      <div>
                        <h3 style={{ marginBottom: '8px' }}>{deck.title}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {deck.description || 'No description provided.'}
                        </p>
                      </div>
                      <div className="deck-meta">
                        <span>🗂️ {deckCardsCount} flashcards</span>
                        <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Review Deck →</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Deck Details & Cards Management */}
        {activeTab === 'flashcards' && activeDeck && !isReviewMode && (
          <div className="tab-panel">
            <div className="page-header">
              <div className="page-title">
                <button onClick={() => setActiveDeck(null)} style={{ background: 'none', border: 'none', color: 'var(--accent-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 600, marginBottom: '12px' }}>
                  ← Back to Decks
                </button>
                <h1>{activeDeck.title}</h1>
                <p>{activeDeck.description}</p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn-danger" onClick={() => handleDeleteDeck(activeDeck.id)}>
                  Delete Deck
                </button>
                <button className="btn btn-secondary" onClick={() => setShowCardModal(true)}>
                  ➕ Add Card
                </button>
                <button className="btn btn-primary" onClick={() => startReviewSession(activeDeck.id)}>
                  ⚡ Smart Study Mode
                </button>
              </div>
            </div>

            {/* List of cards inside selected deck */}
            <div className="card">
              <h3 style={{ marginBottom: '20px' }}>Cards List ({cards.filter(c => c.deckId === activeDeck.id).length})</h3>
              {cards.filter(c => c.deckId === activeDeck.id).length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '30px' }}>No flashcards inside this deck. Click "Add Card" to create one.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {cards.filter(c => c.deckId === activeDeck.id).map(card => (
                    <div key={card.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '16px', background: 'var(--surface-card)', border: '1px solid var(--border-light)', borderRadius: '12px' }}>
                      <div style={{ flexGrow: 1, marginRight: '20px' }}>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                          <span className="badge badge-purple">Q</span>
                          <span style={{ fontWeight: 600 }}>{card.question}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <span className="badge badge-cyan">A</span>
                          <span style={{ color: 'var(--text-muted)' }}>{card.answer}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '12px', fontSize: '0.75rem', color: 'var(--text-dark)' }}>
                          <span>Interval: {card.interval} days</span>
                          <span>Repetitions: {card.repetitions}</span>
                          <span>Next Review: {new Date(card.nextReview).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => handleDeleteCard(card.id)}>
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Study Mode Active Screen */}
        {activeTab === 'flashcards' && isReviewMode && (
          <div className="study-area tab-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontWeight: 600 }}>Reviewing: {decks.find(d => d.id === activeDeck?.id)?.title}</span>
              <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => setIsReviewMode(false)}>Exit Study</button>
            </div>

            <div className="study-progress-bar">
              <div className="study-progress-fill" style={{ width: `${((currentReviewIndex + 1) / reviewCardsList.length) * 100}%` }}></div>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '12px' }}>Card {currentReviewIndex + 1} of {reviewCardsList.length}</p>

            {/* Flippable 3D Card */}
            <div className={`flashcard-wrapper ${showCardAnswer ? 'flipped' : ''}`} onClick={() => setShowCardAnswer(!showCardAnswer)}>
              <div className="flashcard-inner">
                {/* Front Side */}
                <div className="flashcard-front">
                  <span className="badge badge-purple" style={{ marginBottom: '20px' }}>Question</span>
                  <div className="flashcard-content-text">
                    {reviewCardsList[currentReviewIndex]?.question}
                  </div>
                  <div className="card-hint">Click card to reveal answer</div>
                </div>
                {/* Back Side */}
                <div className="flashcard-back">
                  <span className="badge badge-cyan" style={{ marginBottom: '20px' }}>Answer</span>
                  <div className="flashcard-content-text">
                    {reviewCardsList[currentReviewIndex]?.answer}
                  </div>
                  <div className="card-hint">Click card to view question</div>
                </div>
              </div>
            </div>

            {/* SM-2 Rating Buttons */}
            {showCardAnswer && (
              <div className="review-actions">
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Rate your recall difficulty to schedule next review:</p>
                <div className="score-buttons">
                  <button className="btn-score score-0" onClick={() => submitReviewScore(0)}>Forgot (0)</button>
                  <button className="btn-score score-1" onClick={() => submitReviewScore(1)}>Hard (1)</button>
                  <button className="btn-score score-2" onClick={() => submitReviewScore(2)}>Vague (2)</button>
                  <button className="btn-score score-3" onClick={() => submitReviewScore(3)}>Good (3)</button>
                  <button className="btn-score score-4" onClick={() => submitReviewScore(4)}>Easy (4)</button>
                  <button className="btn-score score-5" onClick={() => submitReviewScore(5)}>Perfect (5)</button>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '10px', textAlign: 'center' }}>
                  Keyboard: Space = flip · 1-6 = rate difficulty
                </p>
              </div>
            )}
          </div>
        )}

        {/* ==================== POMODORO TAB ==================== */}
        {activeTab === 'pomodoro' && (
          <PomodoroTab
            currentUser={currentUser}
            timerMode={timerMode}
            timeLeft={timeLeft}
            timerActive={timerActive}
            timerTotalDuration={timerTotalDuration}
            pomoTaskLink={pomoTaskLink}
            setPomoTaskLink={setPomoTaskLink}
            pomoSessionNotes={pomoSessionNotes}
            setPomoSessionNotes={setPomoSessionNotes}
            tasks={tasks}
            changeTimerMode={changeTimerMode}
            toggleTimer={toggleTimer}
            handleTimerComplete={handleTimerComplete}
            resetTimer={resetTimer}
            formatTime={formatTime}
            completedPomosToday={completedPomosToday}
            customDurations={customDurations}
            setCustomDurations={setCustomDurations}
            setNewDuration={setNewDuration}
          />
        )}

        {/* ==================== NOTES TAB ==================== */}
        {activeTab === 'notes' && (
          <div className="tab-panel">
            <div className="page-header">
              <div className="page-title">
                <h1>Study Notes</h1>
                <p>{currentUser?.classLevel ? `Notes for ${currentUser.classLevel}${currentUser.stream ? ' ' + currentUser.stream : ''}` : 'Record notes and generate flashcards or summaries using AI.'}</p>
              </div>
              <button className="btn btn-primary" onClick={handleCreateNote}>
                ➕ Create Note
              </button>
            </div>

            <div className="notes-container">
              {/* Note Selection Sidebar */}
              <div className="notes-sidebar">
                <div className="notes-list">
                  {notes.map(n => (
                    <div key={n.id} className={`note-item ${activeNote?.id === n.id ? 'active' : ''}`} onClick={() => selectNote(n)}>
                      <div className="note-item-title">{n.title}</div>
                      <div className="note-item-preview">{n.content.replace(/[#*_-]/g, '').substring(0, 40)}...</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Note Editor */}
              {activeNote ? (
                <div className="note-editor">
                  <div className="note-editor-header">
                    <input
                      type="text"
                      className="input-field"
                      style={{ fontSize: '1.2rem', fontWeight: 700, background: 'none', border: 'none', padding: 0 }}
                      value={noteTitle}
                      onChange={(e) => { setNoteTitle(e.target.value); }}
                      onBlur={handleUpdateNote}
                    />
                    <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => handleDeleteNote(activeNote.id)}>
                      Delete Note
                    </button>
                  </div>

                  <div className="note-editor-body">
                    {/* Raw Markdown Input */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Markdown Content</span>
                      <textarea
                        className="input-field"
                        style={{ flexGrow: 1, fontFamily: 'monospace', height: '100%', minHeight: '300px' }}
                        value={noteContent}
                        onChange={(e) => { setNoteContent(e.target.value); }}
                        onBlur={handleUpdateNote}
                      />
                    </div>

                    {/* Preview panel */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Structured Preview</span>
                      <div className="note-preview-pane" dangerouslySetInnerHTML={{ __html: renderMarkdown(noteContent) }} />
                    </div>
                  </div>

                  {/* AI Assistance Actions */}
                  <div className="ai-notes-sidebar">
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>✨ AI Study Booster</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Generate learning resources directly from your text.</p>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                      <button className="btn btn-secondary" style={{ flex: 1, fontSize: '0.8rem', padding: '8px 12px' }} onClick={handleAiSummarize} disabled={isAiProcessing}>
                        {isAiProcessing ? 'Thinking...' : '📝 Summarize Note'}
                      </button>
                      <button className="btn btn-primary" style={{ flex: 1, fontSize: '0.8rem', padding: '8px 12px' }} onClick={handleAiGenerateCards} disabled={isAiProcessing}>
                        {isAiProcessing ? 'Thinking...' : '🗂️ Generate Flashcards'}
                      </button>
                    </div>

                    {/* Display Summary output if present */}
                    {aiNoteSuggestion && (
                      <div style={{ marginTop: '14px', padding: '12px', background: 'var(--surface-card)', border: '1px dashed var(--border-glow)', borderRadius: '10px' }}>
                        <div dangerouslySetInnerHTML={{ __html: renderMarkdown(aiNoteSuggestion) }} style={{ fontSize: '0.85rem' }} />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                          <button className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '4px 8px' }} onClick={() => setAiNoteSuggestion('')}>Dismiss</button>
                          <button className="btn btn-primary" style={{ fontSize: '0.75rem', padding: '4px 8px' }} onClick={appendSummaryToNote}>Append to Note</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1, color: 'var(--text-muted)' }}>
                  Create or select a note to begin editing.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== QUIZ TAB ==================== */}
        {activeTab === 'quiz' && (
          <div className="tab-panel">
            <div className="page-header">
              <div className="page-title">
                <h1>AI Quiz Generator</h1>
                <p>Generate topic quizzes, test your recall, or review past performance.</p>
              </div>
              {quizQuestions.length > 0 && (
                <button className="btn btn-secondary" onClick={handleResetQuiz}>
                  ✨ New Quiz
                </button>
              )}
            </div>

            {!quizQuestions.length ? (
              <div className="quiz-setup">
                <div className="card" style={{ padding: '28px', maxWidth: '750px', width: '100%' }}>
                  {currentUser?.classLevel && (
                    <div style={{ marginBottom: '16px', padding: '10px 14px', background: 'var(--accent-primary-light)', border: '1px solid var(--border-glow)', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>🎓</span>
                      <span>Quiz tailored for: <strong style={{ color: 'var(--accent-primary)' }}>{currentUser.classLevel}{currentUser.stream ? ` (${currentUser.stream})` : ''}{currentUser.course ? ` — ${currentUser.course}` : ''}</strong></span>
                    </div>
                  )}

                  {/* Mode Selection */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.88rem' }}>
                      Select Quiz Mode:
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <button
                        type="button"
                        className={`quiz-mode-card ${quizMode === 'timed' ? 'active' : ''}`}
                        onClick={() => setQuizMode('timed')}
                        style={{
                          padding: '14px', borderRadius: '10px', border: quizMode === 'timed' ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)',
                          background: quizMode === 'timed' ? 'var(--accent-primary-medium)' : 'var(--surface-card)',
                          color: 'var(--text-main)', cursor: 'pointer', textAlign: 'left'
                        }}
                      >
                        <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '4px' }}>⏱️ Timed Exam Mode</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Countdown timer with overall score submission.</div>
                      </button>
                      <button
                        type="button"
                        className={`quiz-mode-card ${quizMode === 'practice' ? 'active' : ''}`}
                        onClick={() => setQuizMode('practice')}
                        style={{
                          padding: '14px', borderRadius: '10px', border: quizMode === 'practice' ? '2px solid var(--accent-secondary)' : '1px solid var(--border-light)',
                          background: quizMode === 'practice' ? 'var(--info-bg)' : 'var(--surface-card)',
                          color: 'var(--text-main)', cursor: 'pointer', textAlign: 'left'
                        }}
                      >
                        <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '4px' }}>🎯 Practice Mode</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Self-paced learning with instant answer explanations.</div>
                      </button>
                    </div>
                  </div>

                  {/* Subject quick picks */}
                  {currentUser?.classLevel && (() => {
                    const subjects = getSubjectsForClass(currentUser.classLevel, currentUser.stream, currentUser.department);
                    if (!subjects.length) return null;
                    return (
                      <div style={{ marginBottom: '18px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                          Quick pick a subject:
                        </label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {subjects.slice(0, 10).map(s => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setQuizInput(s)}
                              style={{
                                padding: '6px 14px', borderRadius: '18px', border: '1px solid var(--border-light)',
                                background: quizInput === s ? 'var(--accent-primary)' : 'var(--surface-subtle)',
                                color: quizInput === s ? '#fff' : 'var(--text-main)',
                                cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500, transition: 'all 0.15s'
                              }}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.88rem' }}>
                    Or enter notes / study topic:
                  </label>
                  <textarea
                    className="input-field"
                    rows={4}
                    placeholder="Paste your notes here, or type a topic like 'Photosynthesis light reactions', 'JavaScript closures', 'Quadratic formula', 'Newton laws'..."
                    value={quizInput}
                    onChange={(e) => setQuizInput(e.target.value)}
                    style={{ width: '100%', resize: 'vertical', marginBottom: '18px', fontFamily: 'inherit' }}
                  />

                  {/* Difficulty & Count row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '22px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.85rem', marginBottom: '6px' }}>
                        Difficulty:
                      </label>
                      <div className="quiz-count-options">
                        {['Easy', 'Medium', 'Hard'].map(d => (
                          <button
                            key={d}
                            className={`quiz-count-btn ${quizDifficulty === d ? 'active' : ''}`}
                            onClick={() => setQuizDifficulty(d)}
                            type="button"
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.85rem', marginBottom: '6px' }}>
                        Questions:
                      </label>
                      <div className="quiz-count-options">
                        {[3, 5, 10, 15, 20].map(n => (
                          <button
                            key={n}
                            className={`quiz-count-btn ${quizCount === n ? 'active' : ''}`}
                            onClick={() => setQuizCount(n)}
                            type="button"
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    className="btn btn-primary"
                    onClick={handleGenerateQuiz}
                    disabled={quizLoading || !quizInput.trim()}
                    style={{ width: '100%', padding: '12px', fontSize: '1rem', fontWeight: 700 }}
                  >
                    {quizLoading ? (
                      <><span className="btn-spinner"></span> Generating {quizCount} Questions...</>
                    ) : (
                      <><QuizIcon /> Generate Quiz ({quizCount} Questions)</>
                    )}
                  </button>
                </div>

                {/* Quiz History Dashboard */}
                {quizHistory.length > 0 && (
                  <div className="card" style={{ padding: '24px', maxWidth: '750px', width: '100%', marginTop: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>📜 Performance History</h3>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Last {quizHistory.length} Quizzes</span>
                    </div>

                    {quizStats && quizStats.total > 0 && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ padding: '12px', background: 'var(--surface-card)', borderRadius: '8px', border: '1px solid var(--border-light)', textAlign: 'center' }}>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Quizzes Taken</div>
                          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>{quizStats.total}</div>
                        </div>
                        <div style={{ padding: '12px', background: 'var(--surface-card)', borderRadius: '8px', border: '1px solid var(--border-light)', textAlign: 'center' }}>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Average Score</div>
                          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: quizStats.avgScore >= 70 ? 'var(--success)' : quizStats.avgScore >= 50 ? '#f59e0b' : 'var(--danger)' }}>
                            {quizStats.avgScore}%
                          </div>
                        </div>
                        <div style={{ padding: '12px', background: 'var(--surface-card)', borderRadius: '8px', border: '1px solid var(--border-light)', textAlign: 'center' }}>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Highest Score</div>
                          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                            {Math.max(...quizHistory.map(h => h.percentage || 0), 0)}%
                          </div>
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
                      {quizHistory.map((record, i) => (
                        <div key={record.id || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--surface-card)', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.85rem' }}>
                          <div style={{ flex: 1, minWidth: 0, paddingRight: '12px' }}>
                            <div style={{ fontWeight: 600, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{record.topic || 'General Quiz'}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '2px' }}>
                              {record.difficulty} · {record.score}/{record.total} correct · {new Date(record.completedAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{
                              padding: '3px 10px', borderRadius: '12px', fontWeight: 700, fontSize: '0.78rem',
                              background: record.percentage >= 70 ? 'rgba(52,211,153,0.12)' : record.percentage >= 50 ? 'rgba(245,158,11,0.12)' : 'rgba(248,113,113,0.12)',
                              color: record.percentage >= 70 ? 'var(--success)' : record.percentage >= 50 ? '#f59e0b' : 'var(--danger)'
                            }}>
                              {record.percentage}%
                            </span>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                              onClick={() => setSelectedHistoryRecord(record)}
                            >
                              Review
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="quiz-active" style={{ maxWidth: '750px', margin: '0 auto' }}>
                {!quizSubmitted ? (
                  <>
                    {/* Top Progress & Navigation Controls */}
                    <div className="quiz-progress" style={{ marginBottom: '20px' }}>
                      <div className="quiz-progress-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                          Question {quizCurrentQuestionIndex + 1} of {quizQuestions.length} ({Object.keys(quizAnswers).length} answered)
                        </span>
                        {quizMode === 'timed' && quizTimerActive && (
                          <span className={`quiz-timer ${quizTimeLeft < 30 ? 'quiz-timer-warning' : ''}`} style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                            ⏱ {Math.floor(quizTimeLeft / 60)}:{String(quizTimeLeft % 60).padStart(2, '0')}
                          </span>
                        )}
                        {quizMode === 'practice' && (
                          <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>🎯 Self-Paced Practice</span>
                        )}
                      </div>
                      <div className="quiz-progress-bar" style={{ height: '6px', borderRadius: '3px' }}>
                        <div className="quiz-progress-fill" style={{ width: `${((quizCurrentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}></div>
                      </div>

                      {/* Question Navigation Numbers Bar */}
                      <div style={{ display: 'flex', gap: '6px', marginTop: '12px', flexWrap: 'wrap' }}>
                        {quizQuestions.map((_, idx) => {
                          const isCurrent = idx === quizCurrentQuestionIndex;
                          const isAnswered = quizAnswers[idx] !== undefined;
                          const isBookmarked = quizBookmarked[idx];
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setQuizCurrentQuestionIndex(idx)}
                              style={{
                                width: '32px', height: '32px', borderRadius: '6px', border: isCurrent ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)',
                                background: isCurrent ? 'var(--accent-primary)' : isAnswered ? 'var(--accent-primary-medium)' : 'var(--surface-subtle)',
                                color: isCurrent ? '#fff' : isAnswered ? 'var(--accent-primary)' : 'var(--text-muted)',
                                fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', position: 'relative'
                              }}
                            >
                              {idx + 1}
                              {isBookmarked && <span style={{ position: 'absolute', top: -3, right: -2, fontSize: '0.65rem' }}>⭐</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Single Focused Question Card */}
                    {(() => {
                      const q = quizQuestions[quizCurrentQuestionIndex];
                      if (!q) return null;
                      const qIdx = quizCurrentQuestionIndex;
                      const isBookmarked = quizBookmarked[qIdx];
                      const selectedOpt = quizAnswers[qIdx];

                      return (
                        <div className="card quiz-question-card" style={{ padding: '24px', marginBottom: '20px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                            <span className="quiz-question-number" style={{ fontSize: '0.8rem' }}>Question {qIdx + 1} of {quizQuestions.length}</span>
                            <button
                              type="button"
                              onClick={() => handleToggleBookmark(qIdx)}
                              style={{ background: 'none', border: 'none', color: isBookmarked ? '#f59e0b' : 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              {isBookmarked ? '⭐ Bookmarked' : '☆ Bookmark'}
                            </button>
                          </div>

                          <h3 className="quiz-question-text" style={{ fontSize: '1.05rem', lineHeight: 1.5, marginBottom: '18px' }}>{q.question}</h3>

                          <div className="quiz-options" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {['A', 'B', 'C', 'D'].map(opt => (
                              <button
                                key={opt}
                                className={`quiz-option ${selectedOpt === opt ? 'selected' : ''}`}
                                onClick={() => handleQuizAnswer(qIdx, opt)}
                                style={{ padding: '12px 16px', fontSize: '0.9rem' }}
                              >
                                <span className="quiz-option-letter">{opt}</span>
                                <span>{q.options[opt]}</span>
                              </button>
                            ))}
                          </div>

                          {/* Instant Explanation in Practice Mode */}
                          {quizMode === 'practice' && selectedOpt && q.explanation && (
                            <div className="quiz-explanation" style={{ marginTop: '16px' }}>
                              <strong>{selectedOpt === q.correct ? '✓ Correct!' : `✗ Incorrect (Correct answer: ${q.correct})`}</strong>
                              <p style={{ marginTop: '4px', margin: 0 }}>{q.explanation}</p>
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* Navigation Actions */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                      <button
                        className="btn btn-secondary"
                        disabled={quizCurrentQuestionIndex === 0}
                        onClick={() => setQuizCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                      >
                        ← Previous
                      </button>

                      {quizCurrentQuestionIndex < quizQuestions.length - 1 ? (
                        <button
                          className="btn btn-primary"
                          onClick={() => setQuizCurrentQuestionIndex(prev => Math.min(quizQuestions.length - 1, prev + 1))}
                        >
                          Next Question →
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary"
                          onClick={() => handleSubmitQuiz(false)}
                          disabled={Object.keys(quizAnswers).length === 0}
                          style={{ background: 'var(--success)' }}
                        >
                          Submit Quiz ({Object.keys(quizAnswers).length}/{quizQuestions.length})
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  /* ==================== QUIZ RESULTS & REVIEW ==================== */
                  <div className="quiz-results">
                    <div className="card quiz-score-card" style={{ padding: '32px 20px' }}>
                      <div className="quiz-score-circle">
                        <span className="quiz-score-number">{quizScore}</span>
                        <span className="quiz-score-divider">/</span>
                        <span className="quiz-score-total">{quizQuestions.length}</span>
                      </div>
                      <h2 style={{ fontSize: '1.4rem', marginTop: '8px' }}>Quiz Complete!</h2>
                      <p className="quiz-score-percent" style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                        {Math.round((quizScore / quizQuestions.length) * 100)}% Correct
                      </p>
                      <p className="quiz-score-msg" style={{ marginTop: '6px' }}>
                        {quizScore === quizQuestions.length ? '🎉 Outstanding perfection! You have thoroughly mastered this topic!' :
                         quizScore >= quizQuestions.length * 0.7 ? '👏 Great performance! You have a solid grasp of key concepts.' :
                         '📚 Keep studying! Review the detailed explanations below to build your recall.'}
                      </p>

                      {/* Action Bar */}
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
                        {quizQuestions.some((q, idx) => quizAnswers[idx] !== q.correct) && (
                          <button className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '8px 14px' }} onClick={handleConvertWrongAnswersToFlashcards}>
                            🗂️ Save Incorrect to Flashcards
                          </button>
                        )}
                        <button className="btn btn-secondary" style={{ fontSize: '0.85rem', padding: '8px 14px' }} onClick={handleRetakeQuiz}>
                          🔄 Retake Quiz
                        </button>
                        <button className="btn btn-secondary" style={{ fontSize: '0.85rem', padding: '8px 14px' }} onClick={handleResetQuiz}>
                          ✨ New Quiz
                        </button>
                      </div>
                    </div>

                    {/* Filter Tabs for Review */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                      <button
                        className={`quiz-count-btn ${quizReviewFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setQuizReviewFilter('all')}
                      >
                        All ({quizQuestions.length})
                      </button>
                      <button
                        className={`quiz-count-btn ${quizReviewFilter === 'incorrect' ? 'active' : ''}`}
                        onClick={() => setQuizReviewFilter('incorrect')}
                      >
                        Incorrect Only ({quizQuestions.filter((q, i) => quizAnswers[i] !== q.correct).length})
                      </button>
                      {Object.keys(quizBookmarked).some(k => quizBookmarked[k]) && (
                        <button
                          className={`quiz-count-btn ${quizReviewFilter === 'bookmarked' ? 'active' : ''}`}
                          onClick={() => setQuizReviewFilter('bookmarked')}
                        >
                          Bookmarked ⭐ ({Object.keys(quizBookmarked).filter(k => quizBookmarked[k]).length})
                        </button>
                      )}
                    </div>

                    {/* Detailed Review Cards */}
                    {quizQuestions.map((q, qIdx) => {
                      const isCorrect = quizAnswers[qIdx] === q.correct;
                      const isBookmarked = quizBookmarked[qIdx];

                      if (quizReviewFilter === 'incorrect' && isCorrect) return null;
                      if (quizReviewFilter === 'bookmarked' && !isBookmarked) return null;

                      return (
                        <div key={qIdx} className={`card quiz-review-card ${isCorrect ? 'correct' : 'incorrect'}`} style={{ padding: '20px' }}>
                          <div className="quiz-review-header">
                            <span className={`quiz-review-badge ${isCorrect ? 'correct' : 'incorrect'}`}>
                              {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                            </span>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              {isBookmarked && <span style={{ fontSize: '0.8rem' }}>⭐ Bookmarked</span>}
                              <span className="quiz-review-qnum">Question {qIdx + 1}</span>
                            </div>
                          </div>

                          <p className="quiz-question-text" style={{ fontSize: '1rem', marginTop: '6px' }}>{q.question}</p>

                          <div className="quiz-options review" style={{ marginTop: '12px' }}>
                            {['A', 'B', 'C', 'D'].map(opt => {
                              const isAnswer = opt === q.correct;
                              const wasSelected = quizAnswers[qIdx] === opt;
                              return (
                                <div
                                  key={opt}
                                  className={`quiz-option review ${isAnswer ? 'correct-answer' : ''} ${wasSelected && !isAnswer ? 'wrong-answer' : ''}`}
                                >
                                  <span className="quiz-option-letter">{opt}</span>
                                  <span>{q.options[opt]}</span>
                                  {isAnswer && <span className="quiz-option-check">✓</span>}
                                  {wasSelected && !isAnswer && <span className="quiz-option-x">✗</span>}
                                </div>
                              );
                            })}
                          </div>

                          {q.explanation && (
                            <div className="quiz-explanation" style={{ marginTop: '14px' }}>
                              <strong>Explanation:</strong> {q.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ==================== PLANNER TAB ==================== */}
        {activeTab === 'planner' && (
          <PlannerTab
            currentUser={currentUser}
            tasks={tasks}
            showTaskModal={showTaskModal}
            setShowTaskModal={setShowTaskModal}
            newTaskTitle={newTaskTitle}
            setNewTaskTitle={setNewTaskTitle}
            newTaskDesc={newTaskDesc}
            setNewTaskDesc={setNewTaskDesc}
            newTaskPriority={newTaskPriority}
            setNewTaskPriority={setNewTaskPriority}
            newTaskDueDate={newTaskDueDate}
            setNewTaskDueDate={setNewTaskDueDate}
            newTaskEstPomos={newTaskEstPomos}
            setNewTaskEstPomos={setNewTaskEstPomos}
            handleCreateTask={handleCreateTask}
            updateTaskStatus={updateTaskStatus}
            handleDeleteTask={handleDeleteTask}
          />
        )}

        {/* ==================== AI ASSISTANT TAB ==================== */}
        {activeTab === 'ai' && (
          <div className="tab-panel">
            <div className="page-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {currentUser?.uid && (
                  <button
                    className="btn btn-secondary"
                    style={{ padding: '6px 10px', fontSize: '0.85rem', minWidth: 'auto' }}
                    onClick={() => setShowSidebar(!showSidebar)}
                    title="Chat History"
                  >
                    ☰
                  </button>
                )}
                <div className="page-title">
                  <h1>AI Study Companion</h1>
                  <p>{currentUser?.classLevel ? `Personalized ${currentUser.classLevel} AI tutor` : 'Ask anything — concept explanations, code, practice problems, or study plans.'}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {currentUser?.uid && (
                  <button className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.85rem' }} onClick={startNewChat}>
                    + New Chat
                  </button>
                )}
                {chatHistory.length > 1 && (
                  <button className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.85rem' }} onClick={() => {
                    if (confirm('Clear current chat history?')) {
                      setChatHistory([{ role: 'assistant', content: '' }]);
                      setActiveConversationId(null);
                      addToast('Chat cleared', 'info');
                    }
                  }}>
                    Clear Chat
                  </button>
                )}
              </div>
            </div>

            <div className="chat-container">
              {/* Session Sidebar */}
              {showSidebar && currentUser?.uid && (
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0, width: '260px',
                  background: 'var(--surface-main)', borderRight: '1px solid var(--border-light)',
                  zIndex: 10, display: 'flex', flexDirection: 'column', borderRadius: '12px 0 0 12px',
                  overflow: 'hidden'
                }}>
                  <div style={{ padding: '14px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>Chat History</span>
                    <button onClick={() => setShowSidebar(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
                  </div>
                  <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
                    {conversations.length === 0 ? (
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '20px 8px' }}>No conversations yet. Start chatting!</p>
                    ) : conversations.map(conv => (
                      <div
                        key={conv.id}
                        onClick={() => loadConversation(currentUser.uid, conv.id)}
                        style={{
                          padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', marginBottom: '4px',
                          background: activeConversationId === conv.id ? 'var(--accent-primary-light)' : 'transparent',
                          border: activeConversationId === conv.id ? '1px solid var(--accent-primary)' : '1px solid transparent',
                          transition: 'all 0.15s'
                        }}
                        onMouseEnter={(e) => { if (activeConversationId !== conv.id) e.currentTarget.style.background = 'var(--surface-hover)'; }}
                        onMouseLeave={(e) => { if (activeConversationId !== conv.id) e.currentTarget.style.background = 'transparent'; }}
                      >
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{conv.title}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{conv.messageCount || 0} messages</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id); }}
                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.7rem', padding: '2px 4px' }}
                            title="Delete"
                          >🗑</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', padding: '0 12px', flexWrap: 'wrap' }}>
                {[
                  { id: 'all', label: 'All Prompts' },
                  { id: 'stem', label: '📐 STEM & Math' },
                  { id: 'coding', label: '💻 Coding & Tech' },
                  { id: 'humanities', label: '📚 Humanities' },
                  { id: 'study', label: '⚡ Study Strategy' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setChatCategoryFilter(cat.id)}
                    style={{
                      padding: '4px 10px', borderRadius: '14px', border: '1px solid var(--border-light)',
                      background: chatCategoryFilter === cat.id ? 'var(--accent-primary)' : 'var(--surface-card)',
                      color: chatCategoryFilter === cat.id ? '#fff' : 'var(--text-muted)',
                      fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer'
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Chat history */}
              <div className="chat-history">
                {chatHistory.length === 1 && !chatLoading && (
                  <div className="chat-suggestions">
                    <p className="chat-suggestions-label">Try asking Aura:</p>
                    <div className="chat-suggestions-grid">
                      {(() => {
                        const levelPrompts = currentUser?.classLevel ? [
                          { icon: '📚', text: `Teach me the fundamentals of ${getSubjectsForClass(currentUser.classLevel, currentUser.stream, currentUser.department)[0] || ' Mathematics'}` },
                          { icon: '📝', text: 'Quiz me on my current class level material' },
                          { icon: '📊', text: 'Create an optimal 7-day study plan for my exams' },
                          { icon: '💡', text: 'Give me 3 practice problems with step-by-step solutions' },
                          { icon: '🔍', text: 'Explain the core principles and formulas simply' },
                          { icon: '📋', text: 'How do I take effective study notes using active recall?' },
                        ] : [
                          { icon: '📐', text: 'Explain the quadratic formula with step-by-step examples' },
                          { icon: '💻', text: 'Explain JavaScript closures with a clear code example' },
                          { icon: '🧬', text: 'Explain photosynthesis chemical equation and light reactions' },
                          { icon: '📊', text: 'Create a 5-day study plan using the Pomodoro technique' },
                          { icon: '🔬', text: 'Explain Newton\'s three laws of motion with real-world examples' },
                          { icon: '📝', text: 'How do I write a high-scoring academic essay thesis statement?' },
                        ];
                        return levelPrompts.map((s, i) => (
                          <button key={i} className="chat-suggestion-chip" onClick={() => handleSendChatMessage(null, s.text)}>
                            <span className="chat-suggestion-icon">{s.icon}</span>
                            <span>{s.text}</span>
                          </button>
                        ));
                      })()}
                    </div>
                  </div>
                )}

                {chatHistory.map((msg, index) => {
                  const content = (index === 0 && msg.role === 'assistant' && !msg.content) ? getWelcomeMessage() : msg.content;
                  return (
                    <div key={index} className={`chat-message ${msg.role}`}>
                      <div className="chat-avatar">
                        {msg.role === 'user' ? '👤' : '✨'}
                      </div>
                      <div className="chat-bubble" style={{ position: 'relative', width: '100%', maxWidth: msg.role === 'user' ? '70%' : '100%' }}>
                        {editingMessageIndex === index ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                            <textarea
                              className="input-field"
                              style={{
                                width: '100%',
                                minHeight: '120px',
                                background: 'rgba(0, 0, 0, 0.2)',
                                color: 'var(--text-main)',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid var(--accent-primary)',
                                fontSize: '0.88rem',
                                fontFamily: 'inherit',
                                resize: 'vertical'
                              }}
                              value={editingMessageText}
                              onChange={(e) => setEditingMessageText(e.target.value)}
                            />
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => handleSaveEditedMessage(index, editingMessageText)}
                                style={{ padding: '6px 14px', fontSize: '0.78rem', height: 'auto' }}
                              >
                                {msg.role === 'user' ? 'Save & Resubmit' : 'Save'}
                              </button>
                              <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setEditingMessageIndex(null)}
                                style={{ padding: '6px 14px', fontSize: '0.78rem', height: 'auto' }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
                            
                            {/* Assistant Message Action Toolbar */}
                            {msg.role === 'assistant' && content && (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '12px', paddingTop: '8px', borderTop: '1px solid var(--border-light)', fontSize: '0.75rem' }}>
                                <button
                                  type="button"
                                  onClick={() => handleCopyMessageText(content)}
                                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}
                                >
                                  📋 Copy
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingMessageIndex(index);
                                    setEditingMessageText(content);
                                  }}
                                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}
                                >
                                  ✏️ Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleReplyToMessage(content)}
                                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}
                                >
                                  💬 Reply
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleGenerateQuizFromChat(content.split('\n')[0])}
                                  style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}
                                >
                                  ❓ Quiz Me On This
                                </button>
                                {content.includes('```js') || content.includes('```javascript') || content.includes('```python') ? (
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      const codeMatch = content.match(/```(?:js|javascript|python)?\n([\s\S]*?)```/);
                                      if (codeMatch) {
                                        const result = await handleExecuteCode(codeMatch[1]);
                                        addToast(result.success ? `Output: ${result.output.substring(0, 200)}` : `Error: ${result.error}`, result.success ? 'success' : 'error');
                                      }
                                    }}
                                    disabled={executingCode}
                                    style={{ background: 'none', border: 'none', color: 'var(--success)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}
                                  >
                                    {executingCode ? '⏳ Running...' : '▶️ Run Code'}
                                  </button>
                                ) : null}
                              </div>
                            )}

                            {/* User Message Action Toolbar */}
                            {msg.role === 'user' && (
                              <div style={{ display: 'flex', gap: '12px', marginTop: '8px', paddingTop: '6px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.72rem' }}>
                                <button
                                  type="button"
                                  onClick={() => handleCopyMessageText(content)}
                                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}
                                >
                                  📋 Copy
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingMessageIndex(index);
                                    setEditingMessageText(content);
                                  }}
                                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}
                                >
                                  ✏️ Edit
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
                {chatLoading && (
                  <div className="chat-message assistant">
                    <div className="chat-avatar">✨</div>
                    <div className="chat-bubble">
                      <div className="typing-indicator">
                        <span className="typing-dot"></span>
                        <span className="typing-dot"></span>
                        <span className="typing-dot"></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <form className="chat-input-area" onSubmit={handleSendChatMessage}>
                {/* Image Preview */}
                {pendingImage && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', background: 'var(--surface-ghost)', borderRadius: '8px', marginBottom: '6px', border: '1px solid var(--border-light)' }}>
                    <img
                      src={URL.createObjectURL(pendingImage)}
                      alt="Upload preview"
                      style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }}
                    />
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pendingImage.name}</span>
                    <button type="button" onClick={removePendingImage} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.85rem' }}>✕</button>
                  </div>
                )}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {/* File Upload Button */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ padding: '8px 10px', minWidth: 'auto', fontSize: '0.9rem' }}
                    onClick={() => fileInputRef.current?.click()}
                    title="Attach image"
                  >
                    📎
                  </button>
                  <input
                    type="text"
                    placeholder={pendingImage ? "Ask about this image..." : "Ask Aura anything: e.g. 'Explain closure scope in JavaScript'"}
                    className="input-field"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    disabled={chatLoading}
                    style={{ flex: 1 }}
                  />
                  <button type="submit" className="btn btn-primary" disabled={chatLoading || (!chatMessage.trim() && !pendingImage)}>
                    {chatLoading ? '...' : 'Send'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================== SETTINGS TAB ==================== */}
        {activeTab === 'settings' && (
          <SettingsTab
            currentUser={currentUser}
            theme={theme}
            setTheme={setTheme}
            isSimulatedAI={isSimulatedAI}
            handleLogout={handleLogout}
            addToast={addToast}
            API_BASE={API_BASE}
            setCurrentUser={setCurrentUser}
            focusPrefs={focusPrefs}
            setFocusPrefs={setFocusPrefs}
          />
        )}
      </main>

      {previewHtml && (
        <div className="modal-overlay" onClick={() => setPreviewHtml(null)}>
          <div className="modal-content code-preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="code-preview-header">
              <h3>Code Preview</h3>
              <button className="btn btn-sm" onClick={() => setPreviewHtml(null)} style={{ padding: '4px 12px', fontSize: '0.8rem' }}>✕ Close</button>
            </div>
            <iframe
              srcDoc={`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;padding:16px;font-family:sans-serif;}</style></head><body>${previewHtml}</body></html>`}
              className="code-preview-iframe"
              sandbox="allow-scripts"
              title="Code Preview"
            />
          </div>
        </div>
      )}

      {/* Create Deck Modal */}
      {showDeckModal && (
        <div className="modal-overlay" onClick={() => setShowDeckModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: '20px' }}>Create Flashcard Deck</h2>
            <form onSubmit={handleCreateDeck}>
              <div className="input-group">
                <label htmlFor="deckTitle">Deck Title</label>
                <input
                  id="deckTitle"
                  type="text"
                  className="input-field"
                  placeholder="e.g. JavaScript Advanced, Modern Biology"
                  value={newDeckTitle}
                  onChange={(e) => setNewDeckTitle(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="deckDesc">Description</label>
                <textarea
                  id="deckDesc"
                  className="input-field"
                  placeholder="What is this deck about?"
                  value={newDeckDesc}
                  onChange={(e) => setNewDeckDesc(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowDeckModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Deck</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Card Modal */}
      {showCardModal && (
        <div className="modal-overlay" onClick={() => setShowCardModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: '20px' }}>Add Flashcard</h2>
            <form onSubmit={handleCreateCard}>
              <div className="input-group">
                <label htmlFor="cardQ">Question / Prompt</label>
                <input
                  id="cardQ"
                  type="text"
                  className="input-field"
                  placeholder="e.g. What does API stand for?"
                  value={newCardQ}
                  onChange={(e) => setNewCardQ(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="cardA">Answer / Explanation</label>
                <textarea
                  id="cardA"
                  className="input-field"
                  placeholder="e.g. Application Programming Interface..."
                  value={newCardA}
                  onChange={(e) => setNewCardA(e.target.value)}
                  required
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowCardModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Card</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {showTaskModal && (
        <div className="modal-overlay" onClick={() => setShowTaskModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: '20px' }}>Create Study Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="input-group">
                <label htmlFor="taskTitle">Task Name</label>
                <input
                  id="taskTitle"
                  type="text"
                  className="input-field"
                  placeholder="e.g. Read Chapter 4 of Science Textbook"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="taskDesc">Description</label>
                <textarea
                  id="taskDesc"
                  className="input-field"
                  placeholder="What details are involved in this task?"
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                />
              </div>
              <div className="grid-2" style={{ gap: '12px', marginBottom: '16px' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="taskPriority">Priority</label>
                  <select id="taskPriority" className="input-field" value={newTaskPriority} onChange={(e) => setNewTaskPriority(e.target.value)}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="taskPomos">Est. Pomodoros</label>
                  <input
                    id="taskPomos"
                    type="number"
                    min="1"
                    max="10"
                    className="input-field"
                    value={newTaskEstPomos}
                    onChange={(e) => setNewTaskEstPomos(e.target.value)}
                  />
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="taskDue">Due Date</label>
                <input
                  id="taskDue"
                  type="date"
                  className="input-field"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowTaskModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Past Quiz History Review Modal */}
      {selectedHistoryRecord && (
        <div className="modal-overlay" onClick={() => setSelectedHistoryRecord(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '750px', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {selectedHistoryRecord.topic || 'Quiz Breakdown'}
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Completed on {new Date(selectedHistoryRecord.completedAt).toLocaleDateString()} · {selectedHistoryRecord.difficulty}
                </span>
              </div>
              <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.8rem' }} onClick={() => setSelectedHistoryRecord(null)}>✕ Close</button>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', background: 'var(--surface-card)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Score</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>{selectedHistoryRecord.score} / {selectedHistoryRecord.total}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Percentage</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: selectedHistoryRecord.percentage >= 70 ? 'var(--success)' : selectedHistoryRecord.percentage >= 50 ? '#f59e0b' : 'var(--danger)' }}>
                  {selectedHistoryRecord.percentage}%
                </span>
              </div>
            </div>

            {selectedHistoryRecord.questions && selectedHistoryRecord.questions.map((q, idx) => {
              const userAns = selectedHistoryRecord.answers ? selectedHistoryRecord.answers[idx] : null;
              const isCorrect = userAns === q.correct;
              return (
                <div key={idx} className={`card quiz-review-card ${isCorrect ? 'correct' : 'incorrect'}`} style={{ padding: '16px', marginBottom: '12px' }}>
                  <div className="quiz-review-header">
                    <span className={`quiz-review-badge ${isCorrect ? 'correct' : 'incorrect'}`}>
                      {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                    <span className="quiz-review-qnum">Q{idx + 1}</span>
                  </div>
                  <p style={{ fontWeight: 600, fontSize: '0.95rem', margin: '8px 0' }}>{q.question}</p>
                  <div className="quiz-options review">
                    {['A', 'B', 'C', 'D'].map(opt => {
                      const isAnswer = opt === q.correct;
                      const wasSelected = userAns === opt;
                      return (
                        <div key={opt} className={`quiz-option review ${isAnswer ? 'correct-answer' : ''} ${wasSelected && !isAnswer ? 'wrong-answer' : ''}`}>
                          <span className="quiz-option-letter">{opt}</span>
                          <span>{q.options[opt]}</span>
                          {isAnswer && <span className="quiz-option-check">✓</span>}
                          {wasSelected && !isAnswer && <span className="quiz-option-x">✗</span>}
                        </div>
                      );
                    })}
                  </div>
                  {q.explanation && (
                    <div className="quiz-explanation" style={{ marginTop: '10px', fontSize: '0.82rem' }}>
                      <strong>Explanation:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <span className="toast-icon">
              {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : toast.type === 'warning' ? '⚠' : 'ℹ'}
            </span>
            <span className="toast-message">{toast.message}</span>
          </div>
        ))}
      </div>

    </div>
  );
}

function AppWrapper() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}

export default AppWrapper;
