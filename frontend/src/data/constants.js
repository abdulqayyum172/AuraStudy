export const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000/api'
  : 'https://aurastudy-znwp.onrender.com/api';

// Class levels offered at signup, grouped to mirror the Nigerian school
// system: Basic (Primary), JSS, SSS, and Higher Institution.
export const HIGHER_INSTITUTION_LABEL = 'Higher Institution';
export const CLASS_LEVEL_GROUPS = [
  { label: 'Basic', options: ['Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5', 'Basic 6'] },
  { label: 'JSS (Junior Secondary School)', options: ['JSS 1', 'JSS 2', 'JSS 3'] },
  { label: 'SSS (Senior Secondary School)', options: ['SSS 1', 'SSS 2', 'SSS 3'] },
  { label: HIGHER_INSTITUTION_LABEL, options: ['100 Level', '200 Level', '300 Level', '400 Level', '500 Level', 'Higher Institution (Other)'] },
];

// A level string belongs to the Higher Institution group if it appears in
// that group's options list above.
export const isHigherInstitutionLevel = (level) =>
  CLASS_LEVEL_GROUPS.find(g => g.label === HIGHER_INSTITUTION_LABEL)?.options.includes(level) || false;

export const SSS_GROUP_LABEL = 'SSS (Senior Secondary School)';

// A level string belongs to the SSS group if it appears in that group's
// options list above.
export const isSSSLevel = (level) =>
  CLASS_LEVEL_GROUPS.find(g => g.label === SSS_GROUP_LABEL)?.options.includes(level) || false;

// SSS students choose a stream, which (together with the shared core
// subjects) determines their subject layout.
export const SSS_STREAMS = ['Science', 'Art', 'Commercial'];

// Fixed subject layout for Basic and JSS classes — the same subjects apply
// across every grade in the group. SSS pairs a shared core with subjects
// specific to the chosen stream.
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

// Returns the subject layout for a class level (and SSS stream or Higher
// Institution department, where relevant). Higher Institution uses the
// department's course list as its subject layout so the AI and UI can show
// what courses are available in that department.
export const getSubjectsForClass = (level, stream, department) => {
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
export const getCategoryForLevel = (level, stream) => {
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
export const getCoursesForDepartment = (department) =>
  DEPARTMENTS_WITH_COURSES.find(d => d.department === department)?.courses || [];

export const LEARNING_CATEGORIES = [
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
export const CURRICULUM_DATA = {
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
