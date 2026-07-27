const KNOWLEDGE_BASE = [
  // ===== DEVELOPER / PROGRAMMING =====
  { keywords: ['html', 'hypertext markup'], answer: `## What is HTML?\n\n**HTML (HyperText Markup Language)** is the standard language for creating web pages. It defines the **structure** and **content** of a webpage using elements called **tags**.\n\n### Key Concepts\n- **Tags** — HTML uses angle brackets: \`<tagname>content</tagname>\`\n- **Elements** — A tag + its content = an element (e.g., \`<p>Hello</p>\`)\n- **Attributes** — Extra info on tags: \`<a href="https://example.com">Link</a>\`\n- **Document Structure**:\n\`\`\`html\n<!DOCTYPE html>\n<html>\n  <head><title>My Page</title></head>\n  <body>\n    <h1>Hello World</h1>\n    <p>This is a paragraph.</p>\n  </body>\n</html>\n\`\`\`\n\n### Common Tags\n| Tag | Purpose |\n|-----|---------|\n| \`<h1>-<h6>\` | Headings (h1 = biggest) |\n| \`<p>\` | Paragraph |\n| \`<a>\` | Link |\n| \`<img>\` | Image |\n| \`<div>\` | Generic container |\n| \`<ul>/<ol>/<li>\` | Lists |\n| \`<form>\` | Form for user input |\n| \`<input>\` | Form input field |\n\n### Why It Matters\nHTML is the foundation of every website. CSS styles it, JavaScript makes it interactive, but HTML is always the starting point.\n\nWould you like me to explain CSS or JavaScript next?` },

  { keywords: ['css', 'cascading style'], answer: `## What is CSS?\n\n**CSS (Cascading Style Sheets)** controls the **visual appearance** of HTML elements — colors, layouts, fonts, spacing, and responsive design.\n\n### How CSS Works\nCSS uses **selectors** to target HTML elements and apply **properties**:\n\`\`\`css\nh1 {\n  color: #8b5cf6;\n  font-size: 2rem;\n  text-align: center;\n}\n\`\`\`\n\n### Three Ways to Add CSS\n1. **Inline**: \`<p style="color: red;">text</p>\`\n2. **Internal**: \`<style>\` tag in \`<head>\`\n3. **External**: Link a \`.css\` file (best practice)\n\n### Key Concepts\n- **Box Model** — Every element is a box: content → padding → border → margin\n- **Flexbox** — One-dimensional layout (row or column): \`display: flex\`\n- **Grid** — Two-dimensional layout: \`display: grid\`\n- **Responsive** — Use \`@media\` queries to adapt to screen sizes\n- **Specificity** — Inline > ID > Class > Element selector\n\n### Flexbox Example\n\`\`\`css\n.container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 16px;\n}\n\`\`\`\n\n### Why It Matters\nWithout CSS, every website would look like plain text. CSS makes the web beautiful and responsive.\n\nWant to learn about Flexbox/Grid layouts in more detail?` },

  { keywords: ['javascript', 'js ', ' js'], answer: `## What is JavaScript?\n\n**JavaScript (JS)** is a programming language that makes web pages **interactive** and **dynamic**. It runs in the browser and on servers (via Node.js).\n\n### Key Concepts\n\n**Variables:**\n\`\`\`js\nlet name = "Alice";      // can be reassigned\nconst age = 20;          // cannot be reassigned\n\`\`\`\n\n**Functions:**\n\`\`\`js\nfunction greet(name) {\n  return \`Hello, \${name}!\`;\n}\n// Arrow function version:\nconst greet = (name) => \`Hello, \${name}!\`;\n\`\`\`\n\n**Arrays & Objects:**\n\`\`\`js\nconst fruits = ["apple", "banana", "cherry"];\nconst user = { name: "Alice", age: 20 };\n\`\`\`\n\n**DOM Manipulation:**\n\`\`\`js\ndocument.getElementById("btn").addEventListener("click", () => {\n  document.querySelector("h1").textContent = "Clicked!";\n});\n\`\`\`\n\n**Async/Await:**\n\`\`\`js\nasync function fetchData() {\n  const response = await fetch("/api/data");\n  const data = await response.json();\n  return data;\n}\n\`\`\`\n\n### Why It Matters\nJS is the only language that runs natively in browsers. It powers every interactive website, and with Node.js, it runs on servers too.\n\nWant me to explain a specific concept like closures, promises, or ES6 features?` },

  { keywords: ['react ', 'reactjs', 'react.js', 'jsx'], answer: `## What is React?\n\n**React** is a JavaScript library for building **user interfaces** (UIs). Created by Meta (Facebook), it's the most popular frontend framework.\n\n### Core Concepts\n\n**1. Components** — Reusable UI building blocks:\n\`\`\`jsx\nfunction Welcome({ name }) {\n  return <h1>Hello, {name}!</h1>;\n}\n\`\`\`\n\n**2. JSX** — HTML-like syntax in JavaScript:\n\`\`\`jsx\nconst element = <h1 className="title">Hello World</h1>;\n\`\`\`\n\n**3. State** — Data that changes over time:\n\`\`\`jsx\nconst [count, setCount] = useState(0);\n\n<button onClick={() => setCount(count + 1)}>\n  Count: {count}\n</button>\n\`\`\`\n\n**4. Props** — Data passed from parent to child:\n\`\`\`jsx\n<Welcome name="Alice" />  // passes "Alice" as prop\n\`\`\`\n\n**5. Effects** — Side effects (API calls, timers):\n\`\`\`jsx\nuseEffect(() => {\n  fetchData().then(data => setUsers(data));\n}, []);  // runs once on mount\n\`\`\`\n\n### Why React?\n- **Component-based** — Build complex UIs from simple pieces\n- **Virtual DOM** — Fast updates without reloading the page\n- **Huge ecosystem** — Thousands of libraries and tools\n- **React Native** — Use the same skills for mobile apps\n\nWant me to explain hooks, routing, or state management?` },

  { keywords: ['python ', 'python.', ' python'], answer: `## What is Python?\n\n**Python** is a high-level, versatile programming language known for its **simple, readable syntax**. It's used in web development, data science, AI, automation, and more.\n\n### Key Features\n- **Readable syntax** — Uses indentation instead of braces\n- **Dynamically typed** — No need to declare variable types\n- **Huge standard library** — "Batteries included" philosophy\n\n### Basic Syntax\n\`\`\`python\n# Variables\nname = "Alice"\nage = 20\npi = 3.14\n\n# Lists\nfruits = ["apple", "banana", "cherry"]\nfruits.append("date")\n\n# Dictionaries\nperson = {"name": "Alice", "age": 20}\n\n# Functions\ndef greet(name):\n    return f"Hello, {name}!"\n\n# Loops\nfor fruit in fruits:\n    print(fruit)\n\n# List comprehension\nsquares = [x**2 for x in range(10)]\n\`\`\`\n\n### Popular Uses\n| Use Case | Libraries |\n|----------|-----------|\n| Web Dev | Django, Flask, FastAPI |\n| Data Science | pandas, numpy, matplotlib |\n| Machine Learning | scikit-learn, TensorFlow, PyTorch |\n| Automation | selenium, requests, beautifulsoup |\n\n### Why Python?\n- Easy to learn (great first language)\n- Works in almost every tech domain\n- Massive community and job market\n\nWant to learn about a specific Python topic?` },

  { keywords: ['closure', 'closures'], answer: `## Closures in JavaScript\n\nA **closure** is when a function "remembers" the variables from its outer scope, even after the outer function has finished executing.\n\n### How It Works\n\`\`\`js\nfunction createCounter() {\n  let count = 0;  // this variable is "closed over"\n  return function() {\n    count++;\n    return count;\n  };\n}\n\nconst counter = createCounter();\nconsole.log(counter()); // 1\nconsole.log(counter()); // 2\nconsole.log(counter()); // 3\n// 'count' is still accessible even though createCounter() finished!\n\`\`\`\n\n### Why It Matters\n- **Data privacy** — Variables inside closures can't be accessed from outside\n- **Function factories** — Create functions with preset behavior\n- **Event handlers & callbacks** — Remember state in async code\n- **React hooks** — useState and useEffect rely on closures\n\n### Common Interview Example\n\`\`\`js\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100);\n}\n// Prints: 3, 3, 3 (not 0, 1, 2!)\n// Because 'var' has function scope, not block scope.\n// Fix: use 'let' instead of 'var'\n\`\`\`\n\n### Real-World Example\n\`\`\`js\nfunction createMultiplier(factor) {\n  return (number) => number * factor;\n}\nconst double = createMultiplier(2);\nconst triple = createMultiplier(3);\nconsole.log(double(5));  // 10\nconsole.log(triple(5));  // 15\n\`\`\`\n\nThink of it like a backpack: every function packs up the variables it needs and carries them along.` },

  { keywords: ['node.js', 'nodejs', 'node js', 'node '], answer: `## What is Node.js?\n\n**Node.js** is a JavaScript runtime that lets you run JS **outside the browser** — on servers, desktops, and even embedded devices.\n\n### Key Concepts\n- **Event-driven, non-blocking I/O** — Handles thousands of connections efficiently\n- **npm** — The world's largest package registry (1M+ packages)\n- **Same language as frontend** — Use JS for both client and server\n\n### Basic Server Example\n\`\`\`js\nconst express = require('express');\nconst app = express();\n\napp.get('/', (req, res) => {\n  res.send('Hello World!');\n});\n\napp.listen(3000, () => {\n  console.log('Server running on port 3000');\n});\n\`\`\`\n\n### Common Use Cases\n| Use Case | Tools |\n|----------|-------|\n| Web APIs | Express.js, Fastify, NestJS |\n| Real-time apps | Socket.io |\n| CLI tools | Commander.js |\n| Task automation | Grunt, Gulp |\n\n### Why Node.js?\n- Full-stack JavaScript (one language everywhere)\n- Excellent for APIs and microservices\n- Huge ecosystem via npm\n- Great for real-time applications\n\nWant to learn about Express.js, REST APIs, or database integration?` },

  { keywords: ['database', 'sql', 'mysql', 'postgresql', 'mongodb', 'nosql'], answer: `## Databases\n\nA **database** is an organized collection of data that can be easily accessed, managed, and updated.\n\n### Two Main Types\n\n**1. SQL (Relational)** — Structured data in tables with rows and columns:\n- MySQL, PostgreSQL, SQLite\n- Best for: structured data, complex queries, transactions\n\`\`\`sql\nSELECT name, email FROM users WHERE age > 18 ORDER BY name;\n\`\`\`\n\n**2. NoSQL (Non-relational)** — Flexible document/key-value/graph storage:\n- MongoDB, Redis, DynamoDB\n- Best for: unstructured data, rapid prototyping, scaling\n\`\`\`json\n{ "name": "Alice", "age": 20, "courses": ["Math", "Physics"] }\n\`\`\`\n\n### Key Concepts\n- **CRUD** — Create, Read, Update, Delete (basic operations)\n- **Primary Key** — Unique identifier for each record\n- **Foreign Key** — Links records across tables\n- **Index** — Speeds up queries on specific columns\n- **Normalization** — Organizing tables to reduce redundancy\n\n### When to Use What?\n| Scenario | Best Choice |\n|----------|-------------|\n| E-commerce, banking | SQL (PostgreSQL) |\n| Social media feeds | NoSQL (MongoDB) |\n| Caching/sessions | Redis |\n| Mobile apps | SQLite |\n\nWant to learn about a specific database or SQL queries?` },

  { keywords: ['git ', ' github', 'gitlab', 'version control'], answer: `## Git & Version Control\n\n**Git** is a **distributed version control system** that tracks changes in code over time. **GitHub** is a platform for hosting Git repositories online.\n\n### Essential Commands\n\`\`\`bash\ngit init                    # Start a new repo\ngit clone <url>             # Copy a remote repo\ngit add .                   # Stage all changes\ngit commit -m "message"     # Save changes\ngit push                    # Upload to remote\ngit pull                    # Download from remote\ngit branch feature-x        # Create a branch\ngit checkout feature-x      # Switch to branch\ngit merge feature-x         # Merge branch into current\ngit log --oneline           # View history\n\`\`\`\n\n### Key Concepts\n- **Repository (repo)** — Project folder tracked by Git\n- **Commit** — A snapshot of your code at a point in time\n- **Branch** — A parallel line of development\n- **Merge** — Combining branches together\n- **Pull Request** — Request to merge code (on GitHub)\n- **.gitignore** — Files Git should NOT track\n\n### Workflow\n1. Create a branch: \`git checkout -b feature\`\n2. Make changes and commit: \`git commit -m "Add feature"\`\n3. Push: \`git push origin feature\`\n4. Open a Pull Request on GitHub\n5. Code review → Merge to main\n\nWant to learn about branching strategies, Git workflow, or GitHub Actions?` },

  { keywords: ['api ', 'rest api', 'restful', 'endpoint'], answer: `## What is an API?\n\nAn **API (Application Programming Interface)** is a set of rules that allows different software systems to **communicate** with each other.\n\n### REST API\n**REST (Representational State Transfer)** is the most common API architecture:\n\n| Method | Purpose | Example |\n|--------|---------|--------|\n| GET | Read data | \`GET /api/users\` |\n| POST | Create data | \`POST /api/users\` |\n| PUT | Update data | \`PUT /api/users/1\` |\n| DELETE | Remove data | \`DELETE /api/users/1\` |\n\n### Example Request (JavaScript)\n\`\`\`js\n// GET request\nconst response = await fetch('https://api.example.com/users');\nconst users = await response.json();\n\n// POST request\nconst response = await fetch('https://api.example.com/users', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ name: 'Alice', email: 'alice@example.com' })\n});\n\`\`\`\n\n### Key Concepts\n- **Endpoint** — A specific URL you send requests to\n- **HTTP Methods** — GET, POST, PUT, DELETE\n- **Status Codes** — 200 (OK), 404 (Not Found), 500 (Server Error)\n- **JSON** — Most common data format for APIs\n- **Authentication** — API keys, JWT tokens, OAuth\n\nWant to learn about building APIs with Express.js or consuming APIs?` },

  // ===== MATH =====
  { keywords: ['algebra', 'equation', 'solve for', 'linear equation'], answer: `## Algebra Basics\n\n**Algebra** uses letters (variables) to represent unknown numbers in mathematical expressions and equations.\n\n### Key Concepts\n\n**Variables & Constants:**\n- Variable: a letter representing an unknown (x, y, z)\n- Constant: a fixed number (5, 3.14, -7)\n\n**Solving Linear Equations:**\nThe goal is to isolate the variable on one side.\n\`\`\`\n3x + 7 = 22\n3x = 22 - 7     (subtract 7 from both sides)\n3x = 15\nx = 15 ÷ 3      (divide both sides by 3)\nx = 5\n\`\`\`\n\n**Important Rules:**\n- Whatever you do to one side, you must do to the other\n- Order of operations (PEMDAS/BODMAS): Parentheses → Exponents → Multiply/Divide → Add/Subtract\n\n**Quadratic Formula** (for ax² + bx + c = 0):\n\`\`\`\nx = (-b ± √(b²-4ac)) / 2a\n\`\`\`\n\n**Example:** Solve x² + 5x + 6 = 0\n- a=1, b=5, c=6\n- discriminant = 25 - 24 = 1\n- x = (-5 ± 1) / 2\n- x = -2 or x = -3\n\n### Practice\nTry solving: 2x - 4 = 10. What is x?` },

  { keywords: ['quadratic', 'quadratic equation', 'quadratic formula'], answer: `## Quadratic Equations\n\nA **quadratic equation** is any equation in the form: **ax² + bx + c = 0** (where a ≠ 0)\n\n### Three Methods to Solve\n\n**1. Factoring:**\n\`\`\`\nx² + 5x + 6 = 0\n(x + 2)(x + 3) = 0\nx = -2 or x = -3\n\`\`\`\n\n**2. Quadratic Formula:** (works for ALL quadratics)\n\`\`\`\nx = (-b ± √(b²-4ac)) / 2a\n\`\`\`\n\n**3. Completing the Square:**\n\`\`\`\nx² + 6x = 7\nx² + 6x + 9 = 7 + 9\n(x + 3)² = 16\nx + 3 = ±4\nx = 1 or x = -7\n\`\`\`\n\n### The Discriminant (b²-4ac)\n- If **> 0**: Two real solutions\n- If **= 0**: One repeated solution\n- If **< 0**: No real solutions (two complex solutions)\n\n### Example Using the Formula\nSolve: 2x² - 4x - 6 = 0\n- a=2, b=-4, c=-6\n- discriminant = 16 - 4(2)(-6) = 16 + 48 = 64\n- x = (4 ± 8) / 4\n- x = 3 or x = -1\n\nWant me to walk through more examples?` },

  { keywords: ['geometry', 'triangle', 'angle', 'circle'], answer: `## Geometry Fundamentals\n\n**Geometry** is the branch of math dealing with shapes, sizes, positions, and properties of space.\n\n### Key Formulas\n\n**Triangles:**\n- Area = ½ × base × height\n- Perimeter = sum of all sides\n- Angle sum = 180°\n- Pythagorean theorem: a² + b² = c² (right-angled triangles)\n\n**Circles:**\n- Area = πr²\n- Circumference = 2πr\n- 1 full rotation = 360° = 2π radians\n\n**Rectangles:**\n- Area = length × width\n- Perimeter = 2(length + width)\n\n**Special Triangles:**\n| Type | Properties |\n|------|------------|\n| Right | One 90° angle |\n| Equilateral | All sides equal, all angles 60° |\n| Isosceles | Two sides equal, two angles equal |\n\n### Example Problem\nA right triangle has legs of 3cm and 4cm. What is the hypotenuse?\n\`\`\`\nc² = a² + b²\nc² = 3² + 4²\nc² = 9 + 16 = 25\nc = √25 = 5cm\n\`\`\`\n\nWould you like practice problems or a deeper dive into any shape?` },

  { keywords: ['trigonometry', 'trig', 'sine', 'cosine', 'tangent', 'sin ', 'cos ', 'tan '], answer: `## Trigonometry\n\n**Trigonometry** studies the relationships between **angles and sides** of triangles.\n\n### The Three Basic Ratios (SOH CAH TOA)\n\nFor a right-angled triangle:\n\`\`\`\nsin(θ) = Opposite / Hypotenuse\n\ncos(θ) = Adjacent / Hypotenuse\n\ntan(θ) = Opposite / Adjacent\n\`\`\`\n\n### Key Values\n| Angle | sin | cos | tan |\n|-------|-----|-----|-----|\n| 0° | 0 | 1 | 0 |\n| 30° | ½ | √3/2 | 1/√3 |\n| 45° | √2/2 | √2/2 | 1 |\n| 60° | √3/2 | ½ | √3 |\n| 90° | 1 | 0 | undefined |\n\n### Important Identities\n- sin²θ + cos²θ = 1\n- tanθ = sinθ / cosθ\n\n### Example\nA ladder 5m long leans against a wall at 60° to the ground.\n- Height = 5 × sin(60°) = 5 × (√3/2) ≈ 4.33m\n- Distance from wall = 5 × cos(60°) = 5 × 0.5 = 2.5m\n\nWant me to explain the unit circle or more advanced trig identities?` },

  { keywords: ['calculus', 'derivative', 'differentiation', 'integral', 'integration'], answer: `## Calculus Introduction\n\n**Calculus** is the mathematical study of **change** and **motion**. It has two main branches:\n\n### 1. Derivatives (Differentiation)\nA derivative measures the **rate of change** of a function — essentially, the slope of the curve at any point.\n\`\`\`\nIf f(x) = x², then f'(x) = 2x\nIf f(x) = 3x³, then f'(x) = 9x²\nIf f(x) = sin(x), then f'(x) = cos(x)\n\`\`\`\n\n**Power Rule:** d/dx(xⁿ) = nxⁿ⁻¹\n\n**Example:** Find the derivative of f(x) = 4x³ - 2x + 7\nf'(x) = 12x² - 2\n\n### 2. Integrals (Integration)\nAn integral finds the **total accumulation** — the area under a curve.\n\`\`\`\n∫ x² dx = x³/3 + C\n∫ 3x² dx = x³ + C\n\`\`\`\n\n**Fundamental Theorem:** Integration and differentiation are inverse operations.\n\n### When Is It Used?\n- **Physics**: Velocity, acceleration, force\n- **Economics**: Marginal cost, consumer surplus\n- **Engineering**: Area, volume, optimization\n- **Machine Learning**: Gradient descent (minimizing loss)\n\nWant me to work through some derivative or integral examples?` },

  { keywords: ['statistics', 'mean', 'median', 'mode', 'standard deviation', 'probability'], answer: `## Statistics Basics\n\n**Statistics** is the science of collecting, analyzing, and interpreting data.\n\n### Measures of Central Tendency\n- **Mean** — Average: sum all values ÷ count\n  Example: (2+4+6+8+10)/5 = 6\n- **Median** — Middle value when sorted\n  Example: 1, 3, 5, 7, 9 → median = 5\n- **Mode** — Most frequent value\n  Example: 2, 3, 3, 5, 7 → mode = 3\n\n### Measures of Spread\n- **Range** — Difference between max and min\n- **Variance** — Average of squared differences from mean\n- **Standard Deviation** — Square root of variance (same units as data)\n\n### Probability Basics\n- **Probability** = Number of favorable outcomes / Total outcomes\n- P(event) ranges from 0 (impossible) to 1 (certain)\n- **Independent events**: P(A and B) = P(A) × P(B)\n- **Mutually exclusive**: P(A or B) = P(A) + P(B)\n\n### Example\nData: 4, 7, 9, 10, 15, 20\n- Mean = (4+7+9+10+15+20)/6 = 10.83\n- Median = (9+10)/2 = 9.5\n- Range = 20 - 4 = 16\n\nWant to learn about normal distribution, hypothesis testing, or regression?` },

  // ===== SCIENCE =====
  { keywords: ['photosynthesis', 'plant', 'chlorophyll'], answer: `## Photosynthesis\n\n**Photosynthesis** is the process by which plants convert **light energy** into **chemical energy** (glucose) using carbon dioxide and water.\n\n### The Equation\n\`\`\`\n6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂\nCarbon dioxide + Water + Sunlight → Glucose + Oxygen\n\`\`\`\n\n### Two Stages\n\n**1. Light-dependent reactions** (in thylakoid membranes):\n- Chlorophyll absorbs sunlight\n- Water is split: H₂O → 2H⁺ + ½O₂\n- Produces ATP and NADPH (energy carriers)\n\n**2. Calvin Cycle** (in stroma):\n- Uses ATP and NADPH from stage 1\n- CO₂ is fixed into glucose (C₆H₁₂O₆)\n- Does NOT require light directly\n\n### Why It Matters\n- Produces the **oxygen** we breathe\n- Creates **food** (glucose) for the plant\n- Foundation of almost all **food chains**\n- Removes **CO₂** from the atmosphere\n\n### Factors Affecting Rate\n| Factor | Effect |\n|--------|--------|\n| Light intensity | More light = faster (up to a point) |\n| Temperature | Optimal at ~25-35°C |\n| CO₂ concentration | More CO₂ = faster (up to saturation) |\n\nWant to learn about cellular respiration or plant biology?` },

  { keywords: ['gravity', 'newton', 'force', 'motion', 'physics'], answer: `## Newton's Laws of Motion\n\n**Sir Isaac Newton** formulated three fundamental laws that describe how objects move.\n\n### First Law (Inertia)\n> An object at rest stays at rest, and an object in motion stays in motion at constant velocity, **unless acted upon by an external force**.\n\nExample: A book on a table stays still until you push it.\n\n### Second Law (F = ma)\n> **Force = Mass × Acceleration**\n\nThe more force you apply, the faster it accelerates. The heavier the object, the more force needed.\n\nExample: To accelerate a 10 kg box at 2 m/s²:\nF = 10 × 2 = 20 Newtons\n\n### Third Law (Action-Reaction)\n> For every action, there is an **equal and opposite reaction**.\n\nExample: When you push against a wall, the wall pushes back with equal force.\n\n### Gravity (Newton's Law of Gravitation)\n\`\`\`\nF = G × (m₁ × m₂) / r²\n\`\`\`\n- Every mass attracts every other mass\n- Force increases with mass, decreases with distance\n- G = 6.674 × 10⁻¹¹ N⋅m²/kg²\n\nWant me to solve some physics problems or explain energy and momentum?` },

  { keywords: ['atom', 'atomic', 'electron', 'proton', 'neutron', 'element'], answer: `## Atomic Structure\n\nEverything is made of **atoms** — the basic units of matter.\n\n### Parts of an Atom\n| Particle | Charge | Location |\n|----------|--------|----------|\n| Proton (+) | Positive | Nucleus |\n| Neutron (0) | Neutral | Nucleus |\n| Electron (-) | Negative | Electron cloud (orbitals) |\n\n### Key Numbers\n- **Atomic number** = number of protons (determines the element)\n- **Mass number** = protons + neutrons\n- **Isotopes** = same element, different number of neutrons\n\n### Electron Configuration\nElectrons fill energy levels (shells) in order:\n- 1st shell: max 2 electrons\n- 2nd shell: max 8 electrons\n- 3rd shell: max 18 electrons\n\nExample: Carbon (atomic number 6)\n- 2 electrons in 1st shell, 4 in 2nd shell\n- Configuration: 2, 4\n\n### Chemical Bonds\n- **Ionic bond** — Transfer of electrons (metal + nonmetal)\n- **Covalent bond** — Sharing of electrons (nonmetal + nonmetal)\n- **Metallic bond** — Sea of shared electrons (metals)\n\n### The Periodic Table\n- Rows = periods (energy levels)\n- Columns = groups (similar properties)\n- Group 1: Alkali metals (reactive)\n- Group 17: Halogens (reactive nonmetals)\n- Group 18: Noble gases (stable, unreactive)\n\nWant to learn about chemical reactions, bonding, or the periodic table?` },

  // ===== SCHOOL SUBJECTS =====
  { keywords: ['fraction', 'fractions', 'add fractions'], answer: `## Working with Fractions\n\nA **fraction** represents a part of a whole: **numerator / denominator**\n\n### Key Operations\n\n**Adding fractions** (same denominator):\n\`\`\`\n3/8 + 2/8 = 5/8\n\`\`\`\n\n**Adding fractions** (different denominators) — find LCD:\n\`\`\`\n1/3 + 1/4 = 4/12 + 3/12 = 7/12\n\`\`\`\n\n**Subtracting:**\n\`\`\`\n5/6 - 1/4 = 10/12 - 3/12 = 7/12\n\`\`\`\n\n**Multiplying:**\n\`\`\`\n2/3 × 4/5 = 8/15  (multiply across)\n\`\`\`\n\n**Dividing:**\n\`\`\`\n3/4 ÷ 2/5 = 3/4 × 5/2 = 15/8  (flip and multiply)\n\`\`\`\n\n### Simplifying\nDivide numerator and denominator by their GCF:\n\`\`\`\n12/18 → divide both by 6 → 2/3\n\`\`\`\n\n### Mixed Numbers\n\`\`\`\n2 ¾ = (2×3 + 4)/4 = 10/4\n\`\`\`\n\n### Tips\n- Always simplify your final answer\n- When adding/subtracting, denominators must match\n- When multiplying, you can cross-cancel first\n\nWant some practice problems?` },

  { keywords: ['ecology', 'ecosystem', 'food chain', 'food web', 'environment'], answer: `## Ecology & Ecosystems\n\n**Ecology** is the study of how living organisms interact with each other and their environment.\n\n### Levels of Organization\n1. **Organism** → Individual living thing\n2. **Population** → Same species in an area\n3. **Community** → All populations in an area\n4. **Ecosystem** → Community + non-living factors\n5. **Biosphere** → All ecosystems on Earth\n\n### Food Chains & Webs\n\`\`\`\nSun → Grass → Zebra → Lion\n(Producer) (Primary consumer) (Secondary consumer)\n\`\`\`\n\n- **Producers** (autotrophs) — Make their own food (plants)\n- **Consumers** — Eat other organisms\n- **Decomposers** — Break down dead matter (bacteria, fungi)\n\n### Energy Flow\n- Energy decreases at each level (10% rule)\n- Only ~10% of energy transfers to the next level\n- This is why food chains rarely have more than 4-5 levels\n\n### Biomes\n| Biome | Characteristics |\n|-------|----------------|\n| Tropical rainforest | Hot, wet, most biodiverse |\n| Desert | Hot/cold, very dry |\n| Grassland | Moderate rain, mostly grass |\n| Tundra | Very cold, permafrost |\n| Marine | Salt water, coral reefs |\n\n### Human Impact\n- Deforestation, pollution, climate change\n- Loss of biodiversity\n- Need for conservation and sustainability\n\nWant to learn about a specific ecosystem or environmental issue?` },

  { keywords: ['democracy', 'government', 'constitution', 'nigerian government', 'political'], answer: `## Democracy & Government\n\n**Democracy** is a system of government where power is held by the **people**, either directly or through elected representatives.\n\n### Types of Democracy\n- **Direct democracy** — Citizens vote on laws themselves\n- **Representative democracy** — Citizens elect leaders to make laws\n- **Presidential system** — President is head of state AND government (e.g., USA, Nigeria)\n- **Parliamentary system** — PM is head of government, separate head of state (e.g., UK)\n\n### Nigerian Government Structure\nNigeria operates a **federal presidential republic** with three branches:\n\n**1. Executive:**\n- President (head of state and government)\n- Vice President\n- Federal and State Ministers/Commissioners\n\n**2. Legislature:**\n- National Assembly (Senate + House of Representatives)\n- State Houses of Assembly\n\n**3. Judiciary:**\n- Supreme Court → Court of Appeal → High Courts\n- Independent of the other branches\n\n### Key Principles\n- **Separation of powers** — No single branch controls everything\n- **Rule of law** — Everyone is subject to the law\n- **Fundamental rights** — Guaranteed by the constitution\n- **Federalism** — Power shared between federal and state governments\n\n### Nigerian Independence\n- Gained independence: October 1, 1960\n- Constitution: 1999 Constitution (as amended)\n- 36 states + FCT Abuja\n\nWant to learn about a specific aspect of Nigerian or world government?` },

  { keywords: ['essay', 'writing', 'composition', 'creative writing', 'paragraph'], answer: `## Essay Writing Guide\n\nAn **essay** is a structured piece of writing that presents an argument, explains a topic, or tells a story.\n\n### Essay Structure\n\`\`\`\n1. INTRODUCTION (1 paragraph)\n   - Hook (attention-grabber)\n   - Background context\n   - Thesis statement (main argument)\n\n2. BODY (3+ paragraphs)\n   - Topic sentence\n   - Evidence/examples\n   - Analysis\n   - Transition to next point\n\n3. CONCLUSION (1 paragraph)\n   - Restate thesis (different words)\n   - Summarize key points\n   - Final thought / call to action\n\`\`\`\n\n### Types of Essays\n| Type | Purpose |\n|------|--------|\n| Narrative | Tell a story |\n| Descriptive | Paint a picture with words |\n| Expository | Explain a topic |\n| Argumentative | Persuade with evidence |\n\n### Writing Tips\n- **Plan first** — Outline your points before writing\n- **Clear thesis** — State your main argument in the introduction\n- **One idea per paragraph** — Each paragraph = one supporting point\n- **Use evidence** — Facts, quotes, examples to support claims\n- **Proofread** — Check grammar, spelling, and flow\n\n### Transition Words\n- Addition: furthermore, moreover, also\n- Contrast: however, but, on the other hand\n- Cause: therefore, consequently, as a result\n- Example: for instance, specifically, to illustrate\n\nWant me to help you write or review an essay on a specific topic?` },

  // ===== ENGLISH GRAMMAR =====
  { keywords: ['noun', 'nouns', 'common noun', 'proper noun', 'types of noun'], answer: `## What is a Noun?\n\nA **noun** is a word used to name a **person, place, thing, animal, or idea**. Nouns are one of the most fundamental parts of speech in English grammar.\n\n---\n\n### Definition\n> A noun is a naming word. It identifies who or what we are talking about.\n\n**Examples:**\n- Person: *teacher, doctor, Amina, James*\n- Place: *Lagos, school, market, Nigeria*\n- Thing: *book, table, phone, car*\n- Animal: *dog, lion, bird, fish*\n- Idea/Concept: *love, freedom, courage, happiness*\n\n---\n\n### Types of Nouns\n\n| Type | Definition | Examples |\n|------|-----------|----------|\n| **Common Noun** | General name for any person, place, or thing | dog, city, teacher |\n| **Proper Noun** | Specific name of a particular person, place, or thing (always capitalized) | Lagos, Emeka, Google |\n| **Abstract Noun** | Name of an idea, quality, or feeling (cannot be touched) | love, justice, freedom |\n| **Concrete Noun** | Name of something you can see, touch, or feel | chair, water, book |\n| **Collective Noun** | Name for a group of things | team, flock, army, class |\n| **Countable Noun** | Can be counted (has singular/plural) | apple/apples, child/children |\n| **Uncountable Noun** | Cannot be counted (no plural form) | water, music, rice, air |\n\n---\n\n### How to Identify a Noun\nAsk yourself: *"Is this word the name of something?"*\n\n- "The **dog** barked loudly." → dog = noun (animal)\n- "**Love** is a beautiful feeling." → love = noun (abstract idea)\n- "We live in **Nigeria**." → Nigeria = noun (proper noun, place)\n\n---\n\n### Nouns in Sentences\nNouns can function as:\n1. **Subject** — The noun performs the action: *"The **boy** ran home."\n2. **Object** — The noun receives the action: *"She ate the **apple**."\n3. **Object of a preposition** — *"He sat on the **chair**.*"\n\n---\n\n### Plural Forms of Nouns\n| Rule | Example |\n|------|---------|\n| Add -s | book → books |\n| Add -es (ends in s, x, z, ch, sh) | box → boxes |\n| Change -y to -ies | baby → babies |\n| Irregular | child → children, man → men, mouse → mice |\n| Same in plural | sheep → sheep, fish → fish |\n\n---\n\n### Quick Practice\n1. Identify the nouns: *"The clever **student** wrote a long **essay** in the **library**."*\n   - Nouns: student, essay, library\n\n2. Classify: *happiness* → **Abstract noun** | *Lagos* → **Proper noun** | *herd* → **Collective noun**\n\nWould you like to learn about **pronouns**, **verbs**, or other parts of speech?` },

  { keywords: ['verb', 'verbs', 'types of verb', 'action word', 'auxiliary verb', 'tense'], answer: `## What is a Verb?\n\nA **verb** is a word that expresses an **action, occurrence, or state of being**. Every sentence must have a verb — it is the most essential part of speech.\n\n---\n\n### Definition\n> A verb tells us what the subject **does**, **is**, or **experiences**.\n\n**Examples:**\n- *She **runs** every morning.* (action)\n- *He **is** a doctor.* (state of being)\n- *The baby **sleeps** quietly.* (action)\n\n---\n\n### Types of Verbs\n\n| Type | Definition | Examples |\n|------|-----------|----------|\n| **Action Verb** | Shows physical or mental action | run, jump, think, write |\n| **Linking Verb** | Connects subject to a description | is, are, was, seem, become |\n| **Auxiliary Verb** | Helps the main verb | have, has, will, can, should, must |\n| **Transitive Verb** | Takes a direct object | "She **kicked** the ball" |\n| **Intransitive Verb** | Does not need an object | "He **slept**" |\n| **Modal Verb** | Expresses possibility, permission, obligation | can, could, may, might, must, shall, will |\n\n---\n\n### Verb Tenses (Time)\n\n| Tense | Form | Example |\n|-------|------|---------|\n| Simple Present | verb / verb+s | I eat / She eats |\n| Simple Past | verb+ed / irregular | I ate / She ran |\n| Simple Future | will + verb | I will eat |\n| Present Continuous | am/is/are + verb+ing | I am eating |\n| Past Continuous | was/were + verb+ing | I was eating |\n| Present Perfect | have/has + past participle | I have eaten |\n| Past Perfect | had + past participle | I had eaten |\n\n---\n\n### Subject-Verb Agreement\n- Singular subject → add **-s** to verb: *"She **runs**."*\n- Plural subject → no -s: *"They **run**."*\n\n---\n\n### Examples in Sentences\n- *"The children **play** football every evening."* → play = action verb\n- *"She **has finished** her homework."* → has = auxiliary, finished = main verb\n- *"He **could** not answer the question."* → could = modal verb\n\n---\n\n### Quick Quiz\nIdentify the verbs: *"The students **studied** hard and **passed** their exams."*\n- Verbs: **studied**, **passed**\n\nWould you like to learn about verb tenses in detail, adjectives, or nouns?` },

  { keywords: ['adjective', 'adjectives', 'types of adjective', 'describing word'], answer: `## What is an Adjective?\n\nAn **adjective** is a word that **describes or modifies a noun or pronoun**. It tells us more about the qualities, quantities, or characteristics of something.\n\n---\n\n### Definition\n> An adjective answers questions like: *What kind? How many? Which one? How much?*\n\n**Examples:**\n- *She is a **beautiful** girl.* (what kind?)\n- *There are **five** students.* (how many?)\n- *I want **that** book.* (which one?)\n\n---\n\n### Types of Adjectives\n\n| Type | Definition | Examples |\n|------|-----------|----------|\n| **Descriptive** | Describes quality or characteristic | tall, happy, blue, fast |\n| **Quantitative** | Indicates quantity or amount | some, many, few, much |\n| **Numeral** | Indicates number | one, two, first, second |\n| **Demonstrative** | Points to a specific noun | this, that, these, those |\n| **Possessive** | Shows ownership | my, your, his, her, their |\n| **Interrogative** | Used in questions | which, what, whose |\n| **Proper** | Formed from a proper noun | Nigerian, African, French |\n\n---\n\n### Degrees of Comparison\n\n| Degree | Form | Example |\n|--------|------|---------|\n| Positive | base form | tall |\n| Comparative | adjective + -er / more + adj | taller / more beautiful |\n| Superlative | adjective + -est / most + adj | tallest / most beautiful |\n\n**Examples:**\n- *Emeka is **tall**.* → positive\n- *Emeka is **taller** than James.* → comparative\n- *Emeka is the **tallest** in the class.* → superlative\n\n---\n\n### Position in a Sentence\n1. **Before the noun** (attributive): *"The **clever** student passed."\n2. **After a linking verb** (predicative): *"The student is **clever**."\n\n---\n\n### Quick Practice\nIdentify the adjectives: *"The **young** boy wore a **red** shirt and carried a **heavy** bag."*\n- Adjectives: **young**, **red**, **heavy**\n\nWould you like to learn about adverbs, nouns, or other parts of speech?` },

  { keywords: ['adverb', 'adverbs', 'types of adverb'], answer: `## What is an Adverb?\n\nAn **adverb** is a word that **modifies a verb, adjective, or another adverb**. It provides more information about how, when, where, why, or to what extent something happens.\n\n---\n\n### Definition\n> An adverb answers questions like: *How? When? Where? How often? To what degree?*\n\n**Examples:**\n- *She sings **beautifully**.* (how?)\n- *He arrived **yesterday**.* (when?)\n- *They play **outside**.* (where?)\n- *She **never** lies.* (how often?)\n\n---\n\n### Types of Adverbs\n\n| Type | Question Answered | Examples |\n|------|------------------|----------|\n| **Manner** | How? | quickly, slowly, well, badly |\n| **Time** | When? | now, soon, yesterday, tomorrow |\n| **Place** | Where? | here, there, outside, everywhere |\n| **Frequency** | How often? | always, never, often, sometimes |\n| **Degree** | To what extent? | very, quite, almost, too |\n| **Reason** | Why? | therefore, hence, thus |\n\n---\n\n### Forming Adverbs\nMost adverbs are formed by adding **-ly** to an adjective:\n- quick → **quickly**\n- careful → **carefully**\n- happy → **happily**\n- beautiful → **beautifully**\n\n*Exceptions:* fast, hard, late, well (these don't change)\n\n---\n\n### Examples in Sentences\n- *"The student **quickly** finished the test."* → modifies the verb "finished"\n- *"She is **very** intelligent."* → modifies the adjective "intelligent"\n- *"He runs **extremely** fast."* → modifies the adverb "fast"\n\n---\n\n### Adjective vs Adverb\n| Adjective | Adverb |\n|-----------|--------|\n| Modifies a **noun** | Modifies a **verb, adjective, or adverb** |\n| *She is a **careful** driver.* | *She drives **carefully**.* |\n\nWould you like to learn about prepositions, conjunctions, or other parts of speech?` },

  { keywords: ['pronoun', 'pronouns', 'types of pronoun', 'personal pronoun'], answer: `## What is a Pronoun?\n\nA **pronoun** is a word that **replaces a noun** to avoid repetition and make sentences flow more naturally.\n\n---\n\n### Definition\n> Instead of repeating a noun, we use a pronoun to refer to it.\n\n**Example without pronoun:**\n*"Amina went to school. Amina studied hard. Amina passed her exam."*\n\n**Example with pronouns:**\n*"Amina went to school. **She** studied hard. **She** passed **her** exam."*\n\n---\n\n### Types of Pronouns\n\n| Type | Definition | Examples |\n|------|-----------|----------|\n| **Personal** | Refers to persons or things | I, you, he, she, it, we, they |\n| **Possessive** | Shows ownership | mine, yours, his, hers, ours, theirs |\n| **Reflexive** | Refers back to the subject | myself, yourself, himself, herself |\n| **Demonstrative** | Points to something | this, that, these, those |\n| **Interrogative** | Used in questions | who, whom, which, what, whose |\n| **Relative** | Connects clauses | who, which, that, whom, whose |\n| **Indefinite** | Refers to non-specific persons/things | everyone, someone, nothing, all |\n\n---\n\n### Personal Pronouns Table\n\n| Person | Subject | Object | Possessive |\n|--------|---------|--------|------------|\n| 1st singular | I | me | my/mine |\n| 2nd singular | you | you | your/yours |\n| 3rd singular (m) | he | him | his |\n| 3rd singular (f) | she | her | her/hers |\n| 3rd singular (n) | it | it | its |\n| 1st plural | we | us | our/ours |\n| 2nd plural | you | you | your/yours |\n| 3rd plural | they | them | their/theirs |\n\n---\n\n### Quick Practice\nReplace the nouns with pronouns: *"John gave John's book to Mary so Mary could read Mary's assignment."\n- *"John gave **his** book to Mary so **she** could read **her** assignment."*\n\nWould you like to learn about verbs, adjectives, or other parts of speech?` },

  { keywords: ['preposition', 'prepositions', 'types of preposition'], answer: `## What is a Preposition?\n\nA **preposition** is a word that shows the **relationship between a noun (or pronoun) and other words in a sentence**. It often indicates position, direction, time, or manner.\n\n---\n\n### Definition\n> A preposition links nouns, pronouns, and phrases to other words, indicating *where, when, how, or why*.\n\n**Examples:**\n- *The book is **on** the table.* (position)\n- *She arrived **before** noon.* (time)\n- *He walked **through** the forest.* (direction)\n\n---\n\n### Types of Prepositions\n\n| Type | Purpose | Examples |\n|------|---------|----------|\n| **Place/Position** | Where something is | in, on, at, under, above, behind |\n| **Time** | When something happens | at, on, in, before, after, during |\n| **Direction/Movement** | Where something moves | to, into, through, towards, across |\n| **Manner** | How something is done | by, with, like |\n| **Cause/Reason** | Why something happens | because of, due to, owing to |\n\n---\n\n### Common Prepositions with Examples\n- **in**: *She lives **in** Lagos.* / *We meet **in** the morning.*\n- **on**: *The book is **on** the table.* / *We go **on** Mondays.*\n- **at**: *She is **at** school.* / *The class starts **at** 8am.*\n- **for**: *I studied **for** two hours.*\n- **with**: *She came **with** her friends.*\n- **between**: *He sat **between** James and Emeka.*\n\n---\n\n### Preposition + Noun = Prepositional Phrase\n*"She sat **under the tree**."* → "under the tree" is a prepositional phrase\n\n---\n\n### Common Mistakes\n- ❌ *"She is good **in** maths."* → ✅ *"She is good **at** maths."*\n- ❌ *"We arrived **on** time **to** 3pm."* → ✅ *"We arrived **at** 3pm."*\n\nWould you like to learn about conjunctions, nouns, or other parts of speech?` },

  { keywords: ['conjunction', 'conjunctions', 'types of conjunction', 'connective'], answer: `## What is a Conjunction?\n\nA **conjunction** is a word that **connects words, phrases, or clauses** in a sentence.\n\n---\n\n### Definition\n> Conjunctions are "joining words" — they link ideas together to form longer, more complex sentences.\n\n**Examples:**\n- *I like tea **and** coffee.* (joins two words)\n- *She was tired **but** she kept studying.* (joins two clauses)\n\n---\n\n### Types of Conjunctions\n\n**1. Coordinating Conjunctions** — Join equal elements (FANBOYS)\n| Conjunction | Use | Example |\n|------------|-----|----------|\n| For | Reason | I stayed home, **for** I was sick. |\n| And | Addition | She studied **and** passed. |\n| Nor | Negative addition | He can't read **nor** write. |\n| But | Contrast | I tried **but** failed. |\n| Or | Alternative | Tea **or** coffee? |\n| Yet | Contrast | It is cold **yet** sunny. |\n| So | Result | It rained, **so** we stayed home. |\n\n**2. Subordinating Conjunctions** — Join a dependent clause to a main clause\n- *because, although, while, when, if, since, unless, before, after, until*\n- *"She passed **because** she studied hard."*\n- *"**Although** it was raining, they played outside."*\n\n**3. Correlative Conjunctions** — Used in pairs\n| Pair | Example |\n|------|---------|\n| both...and | **Both** James **and** Emeka passed. |\n| either...or | **Either** you study **or** you fail. |\n| neither...nor | **Neither** rain **nor** cold stopped them. |\n| not only...but also | She is **not only** smart **but also** hardworking. |\n\n---\n\n### Quick Practice\nFill in the correct conjunction:\n*"She was hungry ____ she had not eaten."* → **because**\n*"He is clever ____ lazy."* → **but**\n\nWould you like to learn about prepositions, nouns, or other grammar topics?` },

  { keywords: ['parts of speech', 'part of speech', 'grammar', 'english grammar', 'word class'], answer: `## Parts of Speech in English Grammar\n\n**Parts of speech** are the categories into which words are classified based on their **function in a sentence**. There are **8 main parts of speech** in English.\n\n---\n\n### The 8 Parts of Speech\n\n| Part of Speech | Function | Examples |\n|---------------|----------|----------|\n| **Noun** | Names a person, place, thing, or idea | dog, Lagos, book, love |\n| **Pronoun** | Replaces a noun | I, he, she, they, it |\n| **Verb** | Expresses action or state of being | run, eat, is, think |\n| **Adjective** | Describes a noun or pronoun | beautiful, tall, three |\n| **Adverb** | Modifies a verb, adjective, or adverb | quickly, very, never |\n| **Preposition** | Shows relationship between words | in, on, at, by, with |\n| **Conjunction** | Joins words, phrases, or clauses | and, but, or, because |\n| **Interjection** | Expresses emotion (exclamation) | Oh! Wow! Ouch! Hey! |\n\n---\n\n### Memory Tip\n> **"Every sentence needs at minimum a noun and a verb."**\n\n---\n\n### Example Sentence — All Parts Labeled\n*"**Wow!** The **clever** student **quickly** finished **his** homework **and** went **outside**."*\n\n| Word | Part of Speech |\n|------|----------------|\n| Wow! | Interjection |\n| The | Article (adjective) |\n| clever | Adjective |\n| student | Noun |\n| quickly | Adverb |\n| finished | Verb |\n| his | Pronoun (possessive) |\n| homework | Noun |\n| and | Conjunction |\n| went | Verb |\n| outside | Adverb |\n\n---\n\n### How the Same Word Can Be Different Parts of Speech\nThe **same word** can be different parts of speech depending on its use:\n- *"He **runs** every day."* → verb\n- *"He goes for morning **runs**."* → noun\n\n- *"She has a **well** in her compound."* → noun\n- *"She is **well** today."* → adjective\n- *"She speaks **well**."* → adverb\n\n---\n\nWhich part of speech would you like to explore in more detail?` },

  { keywords: ['sentence', 'types of sentence', 'simple sentence', 'compound sentence', 'complex sentence'], answer: `## Types of Sentences in English\n\nA **sentence** is a group of words that expresses a **complete thought**. Every sentence must have a **subject** (who/what) and a **predicate** (what they do or are).\n\n---\n\n### 4 Types Based on Structure\n\n**1. Simple Sentence** — One independent clause\n> *"The boy kicked the ball."*\n\n**2. Compound Sentence** — Two or more independent clauses joined by a conjunction\n> *"The boy kicked the ball, **and** he scored a goal."*\n\n**3. Complex Sentence** — One independent clause + one (or more) dependent clauses\n> *"**Although** it was raining, the match continued."*\n\n**4. Compound-Complex Sentence** — Two independent clauses + one dependent clause\n> *"She studied hard **because** she wanted to pass, **and** she did pass."*\n\n---\n\n### 4 Types Based on Purpose\n\n| Type | Purpose | Punctuation | Example |\n|------|---------|-------------|----------|\n| **Declarative** | States a fact | Full stop (.) | The sun rises in the east. |\n| **Interrogative** | Asks a question | Question mark (?) | Where do you live? |\n| **Imperative** | Gives a command | Full stop or ! | Close the door. / Stop! |\n| **Exclamatory** | Expresses strong emotion | Exclamation mark (!) | What a beautiful day! |\n\n---\n\n### Subject and Predicate\n- **Subject** — Who or what the sentence is about\n- **Predicate** — What the subject does or is\n\n*"The **students** | studied very hard."*\n- Subject: The students\n- Predicate: studied very hard\n\n---\n\n### Quick Practice\nIdentify the type: *"Even though he was tired, he finished his homework."*\n→ **Complex sentence** (dependent clause + independent clause)\n\nWould you like to learn about punctuation, direct/indirect speech, or other grammar topics?` },

  // ===== MORE PROGRAMMING =====
  { keywords: ['typescript', 'type script', '.ts'], answer: `## What is TypeScript?\n\n**TypeScript** is a superset of JavaScript that adds **static typing** — you declare variable types upfront, and the compiler catches type errors before your code runs.\n\n### Key Concepts\n\n**Basic Types:**\n\`\`\`typescript\nlet name: string = "Alice";\nlet age: number = 20;\nlet isStudent: boolean = true;\nlet scores: number[] = [90, 85, 92];\n\`\`\`\n\n**Interfaces** — Define object shapes:\n\`\`\`typescript\ninterface User {\n  name: string;\n  age: number;\n  email?: string; // optional\n}\nconst user: User = { name: "Alice", age: 20 };\n\`\`\`\n\n**Functions:**\n\`\`\`typescript\nfunction greet(name: string): string {\n  return \`Hello, \${name}!\`;\n}\nconst add = (a: number, b: number): number => a + b;\n\`\`\`\n\n### Why TypeScript?\n- **Catches bugs at compile time** — not at runtime\n- **Better IDE support** — autocomplete, refactoring, documentation\n- **Self-documenting** — types serve as inline documentation\n- **Industry standard** — Used by Angular, Next.js, and most large codebases\n\nWant to learn about interfaces, generics, or TS with React?` },

  { keywords: ['sql ', 'select', 'database query', 'join'], answer: `## SQL Fundamentals\n\n**SQL (Structured Query Language)** is the standard language for querying and managing relational databases.\n\n### Core Commands\n\n**SELECT** — Read data:\n\`\`\`sql\nSELECT name, email FROM users WHERE age > 18 ORDER BY name;\nSELECT COUNT(*) FROM orders WHERE status = 'completed';\n\`\`\`\n\n**INSERT** — Add data:\n\`\`\`sql\nINSERT INTO users (name, email, age) VALUES ('Alice', 'alice@example.com', 20);\n\`\`\`\n\n**UPDATE** — Modify data:\n\`\`\`sql\nUPDATE users SET age = 21 WHERE name = 'Alice';\n\`\`\`\n\n**DELETE** — Remove data:\n\`\`\`sql\nDELETE FROM users WHERE id = 5;\n\`\`\`\n\n### JOINs — Combine tables:\n\`\`\`sql\n-- Inner join: only matching rows\nSELECT users.name, orders.total\nFROM users INNER JOIN orders ON users.id = orders.user_id;\n\n-- Left join: all users, even without orders\nSELECT users.name, COALESCE(SUM(orders.total), 0) AS total_spent\nFROM users LEFT JOIN orders ON users.id = orders.user_id\nGROUP BY users.id;\n\`\`\`\n\n### Key Concepts\n- **WHERE** — Filter rows\n- **GROUP BY** — Group rows for aggregation\n- **HAVING** — Filter groups (post-aggregation)\n- **ORDER BY** — Sort results\n- **LIMIT/OFFSET** — Pagination\n\nWant to learn about subqueries, normalization, or database design?` },

  { keywords: ['algorithm', 'algorithms', 'big o', 'time complexity', 'sorting'], answer: `## Algorithms & Complexity\n\nAn **algorithm** is a step-by-step procedure for solving a problem. **Big-O notation** describes how an algorithm scales with input size.\n\n### Common Time Complexities\n| Big-O | Name | Example |\n|-------|------|---------|\n| O(1) | Constant | Array index access |\n| O(log n) | Logarithmic | Binary search |\n| O(n) | Linear | Array traversal |\n| O(n log n) | Linearithmic | Merge sort |\n| O(n²) | Quadratic | Bubble sort, nested loops |\n\n### Essential Sorting Algorithms\n\n**Bubble Sort** — O(n²):\n\`\`\`js\nfunction bubbleSort(arr) {\n  for (let i = 0; i < arr.length; i++)\n    for (let j = 0; j < arr.length - i - 1; j++)\n      if (arr[j] > arr[j+1]) [arr[j], arr[j+1]] = [arr[j+1], arr[j]];\n  return arr;\n}\n\`\`\`\n\n**Binary Search** — O(log n) on sorted array:\n\`\`\`js\nfunction binarySearch(arr, target) {\n  let lo = 0, hi = arr.length - 1;\n  while (lo <= hi) {\n    const mid = Math.floor((lo + hi) / 2);\n    if (arr[mid] === target) return mid;\n    arr[mid] < target ? lo = mid + 1 : hi = mid - 1;\n  }\n  return -1;\n}\n\`\`\`\n\nWant me to explain dynamic programming, graph algorithms, or recursion?` },

  { keywords: ['data structure', 'data structures', 'linked list', 'binary tree', 'hash map', 'stack', 'queue'], answer: `## Data Structures\n\nA **data structure** is a way of organizing and storing data for efficient access.\n\n### Core Data Structures\n\n**Arrays** — Contiguous memory, O(1) index access:\n\`\`\`js\nconst arr = [10, 20, 30];\narr[1]; // O(1) access\n\`\`\`\n\n**Stacks** — Last In, First Out (LIFO):\n\`\`\`js\nconst stack = [];\nstack.push(1); stack.push(2);\nstack.pop(); // returns 2\n\`\`\`\n\n**Queues** — First In, First Out (FIFO):\n\`\`\`js\nconst queue = [];\nqueue.push(1); queue.push(2);\nqueue.shift(); // returns 1\n\`\`\`\n\n**Hash Maps** — Key-value pairs, O(1) lookup:\n\`\`\`js\nconst map = new Map();\nmap.set("name", "Alice");\nmap.get("name"); // "Alice"\n\`\`\`\n\n### When to Use What?\n| Need | Use |\n|------|-----|\n| Fast lookup by key | Hash Map |\n| Fast index access | Array |\n| Fast insert/delete at ends | Stack/Queue |\n| Sorted data + fast search | BST |\n\nWant me to explain trees, graphs, or hash collisions?` },

  { keywords: ['flexbox', 'css flex', 'flex layout', 'css grid'], answer: `## CSS Flexbox & Grid\n\n### Flexbox — One-dimensional layouts:\n\n\`\`\`css\n.container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 16px;\n}\n\`\`\`\n\n**Key Properties:**\n| Property | Effect |\n|----------|--------|\n| justify-content | Main axis alignment |\n| align-items | Cross axis alignment |\n| flex-direction | Row or column |\n| gap | Space between items |\n\n### Grid — Two-dimensional layouts:\n\n\`\`\`css\n.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 20px;\n}\n\`\`\`\n\n**Grid vs Flexbox:**\n- **Flexbox**: Best for nav bars, card rows, centering\n- **Grid**: Best for page layouts, dashboards, image galleries\n\nWant me to explain responsive layouts or CSS positioning?` },

  { keywords: ['dom', 'document object model', 'queryselector'], answer: `## The DOM (Document Object Model)\n\nThe **DOM** is a tree-like representation of your HTML that JavaScript can read and modify.\n\n### Selecting Elements\n\`\`\`js\nconst el = document.getElementById('myId');\nconst el = document.querySelector('.myClass');\nconst els = document.querySelectorAll('div.card');\n\`\`\`\n\n### Modifying Elements\n\`\`\`js\nel.textContent = 'New text';\nel.style.color = 'red';\nel.classList.add('active');\nel.classList.toggle('visible');\n\`\`\`\n\n### Event Handling\n\`\`\`js\nel.addEventListener('click', (event) => {\n  event.preventDefault();\n  console.log('Clicked!', event.target);\n});\n\`\`\`\n\nWant me to explain event delegation or Virtual DOM?` },

  { keywords: ['oop', 'object oriented', 'class ', 'classes', 'inheritance'], answer: `## Object-Oriented Programming (OOP)\n\n### Four Pillars\n\n**1. Encapsulation** — Bundle data + methods, hide internals:\n\`\`\`js\nclass BankAccount {\n  #balance = 0;\n  constructor(owner) { this.owner = owner; }\n  deposit(amount) { this.#balance += amount; }\n}\n\`\`\`\n\n**2. Inheritance** — Child classes inherit from parent:\n\`\`\`js\nclass Animal { speak() { return "..."; } }\nclass Dog extends Animal { speak() { return "Woof!"; } }\n\`\`\`\n\n**3. Polymorphism** — Same method, different behavior\n\n**4. Abstraction** — Hide complex implementation details\n\nWant me to explain design patterns or SOLID principles?` },

  { keywords: ['express', 'expressjs', 'express.js', 'middleware'], answer: `## Express.js\n\n**Express.js** is the most popular Node.js web framework for building REST APIs.\n\n### Basic Server\n\`\`\`js\nconst express = require('express');\nconst app = express();\napp.use(express.json());\n\napp.get('/api/users', (req, res) => {\n  res.json([{ name: 'Alice' }]);\n});\n\napp.post('/api/users', (req, res) => {\n  res.status(201).json(req.body);\n});\n\napp.listen(3000);\n\`\`\`\n\n### Middleware\n\`\`\`js\nconst auth = (req, res, next) => {\n  if (!req.headers.authorization)\n    return res.status(401).json({ error: 'Unauthorized' });\n  next();\n};\napp.get('/api/profile', auth, (req, res) => { ... });\n\`\`\`\n\nWant me to explain routing, error handling, or auth systems?` },

  { keywords: ['animation', 'css animation', 'transition', 'keyframe', 'transform'], answer: `## CSS Animations & Transitions\n\n### Transitions\n\`\`\`css\n.button {\n  background: #7c5cfc;\n  transition: all 0.3s ease;\n}\n.button:hover {\n  transform: translateY(-2px);\n}\n\`\`\`\n\n### Keyframe Animations\n\`\`\`css\n@keyframes fadeInUp {\n  from { opacity: 0; transform: translateY(20px); }\n  to { opacity: 1; transform: translateY(0); }\n}\n.card { animation: fadeInUp 0.5s ease forwards; }\n\`\`\`\n\n### Transform Functions\n\`\`\`css\ntransform: rotate(45deg);\ntransform: scale(1.5);\ntransform: translateX(20px);\n\`\`\`\n\nWant me to explain performance optimization or JavaScript animations?` },

  // ===== MORE MATH =====
  { keywords: ['logarithm', 'log', 'exponent', 'exponential'], answer: `## Logarithms & Exponents\n\n### Exponents\n\`\`\`\naⁿ = a × a × a × ... (n times)\n2³ = 8, 10² = 100, 5⁰ = 1\n\`\`\`\n\n**Rules:**\n- aᵐ × aⁿ = aᵐ⁺ⁿ\n- aᵐ ÷ aⁿ = aᵐ⁻ⁿ\n- (aᵐ)ⁿ = aᵐˣⁿ\n\n### Logarithms\nIf **aⁿ = b**, then **logₐ(b) = n**\n\n**Common logs:**\n- log₂(8) = 3 (because 2³ = 8)\n- log₁₀(1000) = 3\n- ln(e) = 1\n\n**Properties:**\n- logₐ(b × c) = logₐ(b) + logₐ(c)\n- logₐ(bⁿ) = n × logₐ(b)\n\n### Why It Matters\n- Earthquake magnitude, sound volume (decibels)\n- Algorithm complexity: binary search is O(log n)\n- Compound interest\n\nWant me to work through logarithm problems?` },

  { keywords: ['matrix', 'matrices', 'determinant', 'linear algebra'], answer: `## Matrices (Linear Algebra)\n\nA **matrix** is a rectangular array of numbers in rows and columns.\n\n### Basic Operations\n\n**Addition:**\n\`\`\`\n[1, 2] + [5, 6] = [6, 8]\n[3, 4]   [7, 8]   [10, 12]\n\`\`\`\n\n**Matrix Multiplication** (columns of A = rows of B):\n\`\`\`\n[1, 2] × [5, 6] = [19, 22]\n[3, 4]   [7, 8]   [43, 50]\n\`\`\`\n\n**Determinant (2×2):**\n\`\`\`\n|a  b| = ad - bc\n|c  d|\n\`\`\`\n\n### Why It Matters\n- Computer Graphics — rotation, scaling\n- Machine Learning — neural networks\n- Physics — quantum mechanics\n\nWant me to explain matrix inversion or eigenvalues?` },

  { keywords: ['vector', 'vectors', 'dot product', 'cross product'], answer: `## Vectors\n\nA **vector** has both magnitude (size) and direction.\n\n### Operations\n\n**Addition:** (1,2) + (3,4) = (4,6)\n\n**Dot Product:** (1,2,3) · (4,5,6) = 4 + 10 + 18 = 32\n\n**Magnitude:** |3, 4| = √(9 + 16) = 5\n\n**Unit Vector:** (3, 4) ÷ 5 = (0.6, 0.8)\n\n### Why It Matters\n- Physics — Force, velocity, acceleration\n- 3D Graphics — Position, lighting\n- Machine Learning — Feature vectors\n\nWant me to explain vector projections or applications in physics?` },

  { keywords: ['permutation', 'combination', 'factorial'], answer: `## Permutations & Combinations\n\n### Factorial\n\`\`\`\nn! = n × (n-1) × ... × 1\n5! = 120, 0! = 1\n\`\`\`\n\n### Permutations — ORDER matters\n\`\`\`\nP(n, r) = n! / (n-r)!\nP(5, 3) = 60\n\`\`\`\n\n### Combinations — Order does NOT matter\n\`\`\`\nC(n, r) = n! / (r! × (n-r)!)\nC(5, 3) = 10\n\`\`\`\n\n### Key Rule\n- **Arranging / ranking** → Permutation\n- **Selecting / choosing** → Combination\n\nWant me to work through probability problems?` },

  { keywords: ['set theory', 'sets', 'union', 'intersection', 'venn diagram'], answer: `## Set Theory\n\nA **set** is a collection of distinct objects.\n\n### Operations\n- **Union (A ∪ B)** — Elements in either set\n- **Intersection (A ∩ B)** — Elements in both\n- **Difference (A - B)** — In A but not B\n- **Complement (A')** — Not in A\n\n### Venn Diagram Formula\n\`\`\`\nn(A ∪ B) = n(A) + n(B) - n(A ∩ B)\n\`\`\`\n\n### Why It Matters\n- Database queries (SQL JOIN = intersection)\n- Probability calculations\n- Logic and Boolean algebra\n\nWant me to work through set theory problems?` },

  { keywords: ['sequence', 'series', 'arithmetic progression', 'geometric progression'], answer: `## Sequences & Series\n\n### Arithmetic Progression (AP)\nEach term increases by **common difference (d)**:\n\`\`\`\naₙ = a₁ + (n-1)d\nSₙ = n/2 × [2a₁ + (n-1)d]\n\`\`\`\n\n### Geometric Progression (GP)\nEach term is multiplied by **common ratio (r)**:\n\`\`\`\naₙ = a₁ × rⁿ⁻¹\nSₙ = a₁ × (rⁿ - 1) / (r - 1)\n\`\`\`\n\n### Quick Comparison\n| Property | AP | GP |\n|----------|----|----|\n| Pattern | Add constant | Multiply constant |\n| Real example | Saving ₦500/month | 3% compound interest |\n\nWant me to solve sequence problems?` },

  // ===== MORE SCIENCE =====
  { keywords: ['chemical equation', 'balancing', 'mole', 'molar mass', 'stoichiometry'], answer: `## Chemical Equations & Balancing\n\n### Balancing Equations\nEnsure same number of each atom on both sides:\n\`\`\`\nUnbalanced:   H₂ + O₂ → H₂O\nBalanced:     2H₂ + O₂ → 2H₂O\n\`\`\`\n\n### The Mole\n- 1 mole = 6.022 × 10²³ particles (Avogadro's number)\n- H₂O: 2(1) + 16 = 18 g/mol\n\n### Types of Reactions\n| Type | Example |\n|------|---------|\n| Synthesis | A + B → AB |\n| Decomposition | AB → A + B |\n| Single Replacement | A + BC → AC + B |\n| Combustion | Fuel + O₂ → CO₂ + H₂O |\n\nWant me to practice balancing equations?` },

  { keywords: ['cell', 'cells', 'mitosis', 'meiosis', 'dna', 'genetics'], answer: `## Cells & Cell Division\n\n### Cell Structure\n| Part | Function |\n|------|----------|\n| Nucleus | Contains DNA |\n| Mitochondria | Makes ATP energy |\n| Ribosome | Makes proteins |\n| Cell membrane | Controls what enters/exits |\n\n### Mitosis vs Meiosis\n| Feature | Mitosis | Meiosis |\n|---------|---------|--------|\n| Result | 2 identical cells | 4 unique cells |\n| Purpose | Growth/repair | Reproduction |\n| Genetic variation | No | Yes |\n\n### DNA\n- Double helix, bases: A-T, G-C\n- Genes = segments coding for traits\n\nWant me to explain genetics or inheritance patterns?` },

  { keywords: ['motion', 'velocity', 'acceleration', 'kinematics', 'projectile'], answer: `## Motion & Kinematics\n\n### Equations of Motion\n\`\`\`\nv = u + at\ns = ut + ½at²\nv² = u² + 2as\n\`\`\`\nWhere: u = initial velocity, v = final, a = accel, s = displacement\n\n### Example Problem\nCar accelerates from 0 to 30 m/s in 6 seconds:\n\`\`\`\na = (30 - 0) / 6 = 5 m/s²\ns = 0 + ½(5)(36) = 90 m\n\`\`\`\n\n### Projectile Motion\n\`\`\`\nRange = v²sin(2θ) / g\n\`\`\`\n\nWant me to solve kinematics problems?` },

  { keywords: ['energy', 'work', 'power', 'kinetic energy', 'potential energy'], answer: `## Energy, Work & Power\n\n### Energy Types\n\`\`\`\nKinetic: KE = ½mv²\nPotential: PE = mgh\n\`\`\`\n\n### Work & Power\n\`\`\`\nWork = F × d × cos(θ)\nPower = Work / time\n\`\`\`\n\n### Conservation of Energy\nEnergy cannot be created or destroyed, only converted:\n\`\`\`\nmgh = ½mv² → v = √(2gh)\n\`\`\`\n\nWant me to solve energy problems?` },

  { keywords: ['acid', 'base', 'ph', 'alkaline', 'neutralization'], answer: `## Acids, Bases & pH\n\n| Property | Acid | Base |\n|----------|------|------|\n| pH | < 7 | > 7 |\n| Taste | Sour | Bitter |\n| Examples | HCl, vinegar | NaOH, soap |\n\n### Neutralization\n\`\`\`\nAcid + Base → Salt + Water\nHCl + NaOH → NaCl + H₂O\n\`\`\`\n\n### pH Scale\n\`\`\`\npH = -log[H⁺]\nBattery acid: 1 | Water: 7 | Bleach: 13\n\`\`\`\n\nWant me to explain titrations or buffer solutions?` },

  { keywords: ['wave', 'waves', 'frequency', 'wavelength', 'sound'], answer: `## Waves\n\n### Wave Equation\n\`\`\`\nv = f × λ  (velocity = frequency × wavelength)\n\`\`\`\n\n### Types\n- **Transverse** — Light, electromagnetic waves\n- **Longitudinal** — Sound waves\n\n### Sound\n- Speed in air ≈ 343 m/s\n- Higher frequency = higher pitch\n\n### Light (EM Spectrum)\n\`\`\`\nRadio → Microwave → Infrared → Visible → UV → X-ray → Gamma\nSpeed: c = 3 × 10⁸ m/s\n\`\`\`\n\nWant me to explain interference or diffraction?` },

  { keywords: ['organic chemistry', 'hydrocarbon', 'alkane', 'alkene', 'functional group'], answer: `## Organic Chemistry Basics\n\n### Hydrocarbons\n**Alkanes** (single bonds, CₙH₂ₙ₊₂): CH₄, C₂H₆, C₃H₈\n**Alkenes** (double bond, CₙH₂ₙ): C₂H₄, C₃H₆\n\n### Functional Groups\n| Group | Formula | Example |\n|-------|---------|---------|\n| Hydroxyl | -OH | Ethanol |\n| Carboxyl | -COOH | Vinegar |\n| Amino | -NH₂ | Amino acids |\n\n### Why It Matters\n- Fuels, plastics, medicines, DNA — all organic\n\nWant me to explain naming or specific reactions?` },

  // ===== MORE SCHOOL SUBJECTS =====
  { keywords: ['geography', 'climate', 'latitude', 'longitude', 'plate tectonic'], answer: `## Geography Fundamentals\n\n### Coordinates\n- **Latitude** — Distance N/S from Equator (0°–90°)\n- **Longitude** — Distance E/W from Greenwich (0°–180°)\n\n### Climate Zones\n| Zone | Latitude | Temperature |\n|------|----------|-------------|\n| Tropical | 0°–23.5° | Hot year-round |\n| Temperate | 23.5°–66.5° | Mild, seasonal |\n| Frigid | 66.5°–90° | Cold year-round |\n\n### Plate Tectonics\n- **Convergent** — Mountains, earthquakes\n- **Divergent** — New crust, ocean ridges\n- **Transform** — Earthquakes\n\n### Nigerian Geography\n- West Africa, 4°N to 14°N latitude\n- 36 states + FCT Abuja\n- Major rivers: Niger, Benue\n\nWant me to explain a specific geographic concept?` },

  { keywords: ['economics', 'demand', 'supply', 'inflation', 'gdp'], answer: `## Economics Basics\n\n### Demand & Supply\n- **Demand**: Lower price → more buyers\n- **Supply**: Higher price → more sellers\n- **Equilibrium**: Where demand = supply\n\n### Key Concepts\n- **Opportunity Cost** — Value of next best alternative\n- **GDP** — Total goods/services produced\n- **Inflation** — General rise in prices\n\n### Nigerian Economy\n- Largest in Africa, major exports: oil & gas\n- Currency: Naira (₦)\n\nWant me to explain supply/demand curves or Nigerian economic policy?` },

  { keywords: ['literature', 'poetry', 'novel', 'figurative language', 'literary device', 'drama'], answer: `## Literature & Literary Devices\n\n### Types\n| Type | Examples |\n|------|----------|\n| Prose | Novels, short stories |\n| Poetry | Sonnets, haiku |\n| Drama | Plays, scripts |\n\n### Figurative Language\n- **Metaphor** — "Time is money"\n- **Simile** — "Brave as a lion"\n- **Personification** — "The wind whispered"\n- **Hyperbole** — "I've told you a million times"\n\n### Nigerian Literature\n- Wole Soyinka, Chinua Achebe, Chimamanda Ngozi Adichie\n\nWant me to analyze a specific poem or novel?` },

  { keywords: ['nigerian history', 'colonialism', 'independence', 'civil war'], answer: `## Nigerian History\n\n### Key Events\n- 1914: Amalgamation of Northern and Southern Nigeria\n- Oct 1, 1960: Independence from Britain\n- 1963: Became a Republic\n- 1967–1970: Nigerian Civil War (Biafran War)\n- 1999: Return to democracy (Fourth Republic)\n\n### Constitution\n- 1999 Constitution (as amended)\n- Federal system: 36 states + FCT\n- Three branches: Executive, Legislature, Judiciary\n\nWant me to explain a specific period or event?` },

  // ===== STUDY SKILLS =====
  { keywords: ['study tips', 'study habits', 'effective studying', 'spaced repetition', 'active recall'], answer: `## Effective Study Strategies\n\n### Active Recall\n- Test yourself instead of re-reading\n- Use flashcards with spaced repetition\n- Explain concepts out loud (Feynman Technique)\n\n### Spaced Repetition\n\`\`\`\nDay 1: Learn → Day 2: Review → Day 4: → Day 7: → Day 14:\n\`\`\`\n\n### The Feynman Technique\n1. Pick a concept\n2. Explain it simply\n3. Identify gaps\n4. Relearn and simplify\n\n### General Tips\n- Study in a quiet, well-lit environment\n- Get enough sleep\n- Exercise regularly\n- Teach others\n\nWant me to create a personalized study plan?` },

  { keywords: ['time management', 'productivity', 'procrastination', 'schedule'], answer: `## Time Management & Productivity\n\n### Eisenhower Matrix\n| | Urgent | Not Urgent |\n|---|--------|------------|\n| **Important** | DO now | SCHEDULE |\n| **Not Important** | DELEGATE | ELIMINATE |\n\n### Beat Procrastination\n1. **2-Minute Rule** — If < 2 min, do it now\n2. **Eat the Frog** — Hardest task first\n3. **Break it down** — Split big tasks into small steps\n\n### Study Schedule Example\n| Time | Activity |\n|------|----------|\n| 7:00–9:00 | Deep study (hardest subject) |\n| 9:15–11:15 | Study session 2 |\n| 11:15–12:00 | Review/flashcards |\n\nWant me to create a personalized study schedule?` },

  { keywords: ['exam', 'exam preparation', 'test taking', 'exam tips'], answer: `## Exam Preparation\n\n### Before the Exam\n1. Start early (2-3 weeks before)\n2. Review the syllabus\n3. Practice past questions\n4. Use active recall\n\n### During the Exam\n1. Read all questions first\n2. Start with easy questions\n3. Show all working\n4. Skip and return if stuck > 3 min\n5. Review answers\n\n### Time Management\n\`\`\`\n3-hour exam, 60 marks → 3 minutes per mark\n\`\`\`\n\nWant me to create an exam revision timetable?` },

  { keywords: ['career', 'career path', 'job', 'skills', 'professional development'], answer: `## Career Guidance\n\n### In-Demand Skills\n**Technical:** Programming, Data analysis, Cloud computing, AI basics\n**Soft:** Communication, Problem-solving, Teamwork, Time management\n\n### Building Your Career\n1. Learn continuously\n2. Build a portfolio\n3. Network with professionals\n4. Get internships\n5. Earn certifications (Google, AWS, Microsoft)\n\n### Nigerian Opportunities\n- Tech hubs: Co-Creation Hub, Andela\n- Remote work: Upwork, Fiverr, Toptal\n\nWant me to help you explore a specific career path?` },

  // ===== NIGERIAN EDUCATION =====
  { keywords: ['waec', 'jamb', 'neco', 'post utme', 'nigerian education', 'ssce', 'o level'], answer: `## Nigerian Education System — Guide\n\n### SSCE Exams (WAEC/NECO/GCE)\n| Subject | Requirement |\n|---------|-------------|\n| English | Compulsory (Credit) |\n| Mathematics | Compulsory (Credit) |\n| Core subjects | 3-4 relevant to your course |\n\n**Typical requirement: 5 credits including English + Maths**\n\n### JAMB (UTME)\n- 4 subjects: English + 3 related subjects\n- Maximum score: 400\n- Typical university cut-off: 180-250 (varies)\n- Subject combination depends on course\n\n### Common Subject Combinations\n| Course | JAMB Subjects |\n|--------|--------------|\n| Medicine | English, Biology, Chemistry, Physics |\n| Law | English, Literature, Government, CRK |\n| Engineering | English, Mathematics, Physics, Chemistry |\n| Computer Science | English, Mathematics, Physics, Chemistry |\n| Business Admin | English, Mathematics, Economics, Govt |\n\n### Post-UTME\n- Conducted by individual universities\n- Tests similar subjects as JAMB\n- Often includes current affairs and reasoning\n\nNeed help preparing for any specific exam?` },

  // ===== RESEARCH METHODS =====
  { keywords: ['research', 'methodology', 'hypothesis', 'experiment', 'data analysis'], answer: `## Research Methods — Quick Guide\n\n### Steps in Research\n1. **Identify** the problem\n2. **Review** literature\n3. **Formulate** hypothesis\n4. **Design** methodology\n5. **Collect** data\n6. **Analyze** results\n7. **Draw** conclusions\n\n### Types of Research\n| Type | Method | Example |\n|------|--------|---------|\n| Quantitative | Numbers, surveys, experiments | Poll results |\n| Qualitative | Interviews, observations | Focus groups |\n| Mixed | Both methods combined | Case studies |\n\n### Hypothesis\n- **H₀ (Null):** No significant difference\n- **H₁ (Alternative):** There is a significant difference\n\n### Sampling Methods\n- **Random:** Every member has equal chance\n- **Stratified:** Divide into groups, sample from each\n- **Convenience:** Easiest to reach\n\n### Research Ethics\n- Obtain informed consent\n- Ensure confidentiality\n- Avoid harm to participants\n- Report findings honestly\n\nNeed help designing a research study?` },

  // ===== CRITICAL THINKING =====
  { keywords: ['critical thinking', 'logic', 'argument', 'fallacy', 'reasoning'], answer: `## Critical Thinking — Quick Guide\n\n### What is Critical Thinking?\nThe ability to analyze information objectively and make reasoned judgments.\n\n### Steps\n1. **Identify** the claim\n2. **Evaluate** the evidence\n3. **Consider** alternative explanations\n4. **Draw** a conclusion\n\n### Common Logical Fallacies\n| Fallacy | Description | Example |\n|---------|-------------|---------|\n| Ad Hominem | Attacking the person, not the argument | "You're young, so your opinion doesn't count" |\n| Straw Man | Misrepresenting someone's argument | "You want less government? So you want anarchy?" |\n| Appeal to Authority | Using authority as evidence | "Einstein believed X, so it must be true" |\n| Bandwagon | Everyone's doing it | "Millions can't be wrong" |\n\n### Evaluating Sources\n1. Who wrote it? (authority)\n2. When was it published? (currency)\n3. What's the evidence? (accuracy)\n4. Is there bias? (objectivity)\n\nWant to practice critical thinking with examples?` },

  // ===== PROJECT MANAGEMENT =====
  { keywords: ['project management', 'agile', 'scrum', 'kanban', 'sprint'], answer: `## Project Management — Quick Guide\n\n### PM Methodologies\n| Method | Best For |\n|--------|----------|\n| Waterfall | Clear requirements, sequential |\n| Agile | Iterative, flexible |\n| Scrum | Sprint-based Agile |\n| Kanban | Visual workflow management |\n\n### Scrum Roles\n- **Product Owner:** Defines what to build\n- **Scrum Master:** Facilitates process\n- **Development Team:** Builds the product\n\n### Kanban Board\n\`\`\`\nTo Do → In Progress → Review → Done\n\n  ○       ○            ○        ○\n  ○                           ○\n\`\`\`\n\n### Agile Principles\n1. Deliver working software frequently\n2. Welcome changing requirements\n3. Collaborate daily with stakeholders\n4. Build around motivated individuals\n5. Measure progress in working software\n\n### Tools\n- Jira, Trello, Asana, Monday.com\n\nNeed help managing a specific project?` },

  // ===== DATA SCIENCE =====
  { keywords: ['data science', 'machine learning', 'ai', 'artificial intelligence', 'data analysis', 'statistics'], answer: `## Data Science & AI — Quick Guide\n\n### Data Science Pipeline\n\`\`\`\nCollect → Clean → Explore → Model → Evaluate → Deploy\n\`\`\`\n\n### Key Statistics\n| Concept | Formula | Use |\n|---------|---------|-----|\n| Mean | Σx/n | Average |\n| Median | Middle value | Center of data |\n| Std Dev | √(Σ(x-μ)²/n) | Spread of data |\n| Correlation | r = Σ(xi-x̄)(yi-ȳ)/... | Relationship strength |\n\n### Machine Learning Types\n| Type | Task | Example |\n|------|------|---------|\n| Supervised | Predict from labeled data | Spam detection |\n| Unsupervised | Find patterns in unlabeled data | Customer clustering |\n| Reinforcement | Learn from rewards/penalties | Game AI |\n\n### Common Algorithms\n- **Linear Regression** — Predict continuous values\n- **Decision Trees** — Classification with rules\n- **Neural Networks** — Deep learning, pattern recognition\n- **K-Means** — Cluster similar data points\n\n### Tools\nPython (pandas, scikit-learn, TensorFlow), R, SQL\n\nWant to learn about a specific AI/ML topic?` },

  // ===== FINANCE =====
  { keywords: ['finance', 'budget', 'investment', 'savings', 'money', 'financial literacy'], answer: `## Financial Literacy — Quick Guide\n\n### Budgeting Rule (50/30/20)\n| Category | % of Income | Examples |\n|----------|-------------|----------|\n| Needs | 50% | Rent, food, transport |\n| Wants | 30% | Entertainment, dining |\n| Savings/Debt | 20% | Emergency fund, loans |\n\n### Key Concepts\n- **Emergency Fund:** 3-6 months of expenses\n- **Compound Interest:** A = P(1 + r/n)^(nt)\n- **Inflation:** Money loses value over time\n\n### Investment Options\n| Risk Level | Options |\n|------------|----------|\n| Low | Savings account, Treasury bills |\n| Medium | Mutual funds, Bonds |\n| High | Stocks, Crypto, Real estate |\n\n### Nigerian Banking Tips\n- Use mobile banking apps (GTBank, Access, etc.)\n- Open a dollar account for foreign savings\n- Consider Treasury bills for low-risk investment\n- Be wary of "get rich quick" schemes\n\nNeed help creating a personal budget?` },

  // ===== NUTRITION =====
  { keywords: ['nutrition', 'diet', 'healthy eating', 'food', 'vitamins'], answer: `## Nutrition — Quick Guide\n\n### Macronutrients\n| Macro | Function | Sources |\n|-------|----------|---------|\n| Carbs | Energy | Rice, bread, yam, potatoes |\n| Protein | Muscle repair | Beans, eggs, fish, chicken |\n| Fats | Brain health | Avocado, nuts, olive oil |\n\n### Micronutrients\n| Vitamin | Function | Sources |\n|---------|----------|----------|\n| A | Vision | Carrots, liver |\n| C | Immunity | Oranges, peppers |\n| D | Bones | Sunlight, milk |\n| Iron | Blood | Spinach, red meat |\n\n### Hydration\n- Drink 8 glasses (2L) of water daily\n- More during exercise or hot weather\n\n### Healthy Plate Model\n\`\`\`\n┌─────────────────────────┐\n│  Vegetables/Fruits (50%) │\n├────────────┬────────────┤\n│ Carbs (25%)│Protein(25%)│\n└────────────┴────────────┘\n\`\`\`\n\nWant a personalized meal plan?` },

  // ===== MOTIVATION =====
  { keywords: ['motivation', 'inspiration', 'discipline', 'mindset', 'success', 'goals'], answer: `## Motivation & Goal Setting\n\n### SMART Goals\n| Letter | Meaning | Example |\n|--------|---------|----------|\n| S | Specific | "Study 2 hours daily" |\n| M | Measurable | "Complete 5 chapters" |\n| A | Achievable | "Pass exam with B" |\n| R | Relevant | "Aligned with career" |\n| T | Time-bound | "By end of semester" |\n\n### Building Discipline\n1. Start small (2 minutes rule)\n2. Create a routine\n3. Track your progress\n4. Reward yourself\n5. Find an accountability partner\n\n### Daily Productivity Habits\n- Wake up early\n- Plan your day the night before\n- Do hardest task first\n- Take regular breaks (Pomodoro)\n- Review achievements before sleep\n\n### Remember\n> "The secret of getting ahead is getting started." — Mark Twain\n\nNeed help setting specific academic goals?` }

];

// Build a fast keyword lookup index
const knowledgeIndex = new Map();
KNOWLEDGE_BASE.forEach((entry, idx) => {
  entry.keywords.forEach(kw => {
    const key = kw.toLowerCase().trim();
    if (!knowledgeIndex.has(key)) knowledgeIndex.set(key, []);
    knowledgeIndex.get(key).push(idx);
  });
});

// Generate a detailed answer for topics not in the knowledge base
function generateDetailedAnswer(topic, classLevel, course, stream) {
  const title = topic.charAt(0).toUpperCase() + topic.slice(1);
  const levelContext = classLevel
    ? `\n\n*Note: This explanation is tailored for a ${classLevel}${course ? ' ' + course : stream ? ' ' + stream + ' stream' : ''} student.*`
    : '';

  // Categorize the topic
  const mathKeywords = ['equation', 'formula', 'solve', 'calculate', 'math', 'number', 'algebra', 'geometry', 'trigonometry', 'calculus', 'statistics', 'probability', 'fraction', 'decimal', 'percent', 'ratio', 'area', 'volume', 'perimeter', 'angle', 'graph', 'function', 'derivative', 'integral', 'matrix', 'vector'];
  const scienceKeywords = ['science', 'biology', 'chemistry', 'physics', 'energy', 'force', 'atom', 'molecule', 'cell', 'organism', 'photosynthesis', 'evolution', 'ecosystem', 'reaction', 'element', 'compound', 'gravity', 'electricity', 'magnet', 'wave', 'light', 'heat', 'temperature', 'experiment'];
  const programmingKeywords = ['programming', 'code', 'coding', 'software', 'algorithm', 'function', 'variable', 'loop', 'array', 'string', 'class', 'object', 'api', 'database', 'html', 'css', 'javascript', 'python', 'java', 'react', 'node', 'web', 'app', 'frontend', 'backend', 'server', 'database', 'sql', 'git'];
  const writingKeywords = ['essay', 'writing', 'paragraph', 'thesis', 'argument', 'essay', 'composition', 'creative', 'literature', 'poetry', 'novel', 'drama', 'analysis', 'review', 'summary'];
  const historyKeywords = ['history', 'war', 'revolution', 'empire', 'civilization', 'independence', 'colonial', 'democracy', 'government', 'constitution', 'political', 'election', 'nigeria', 'africa', 'world'];

  const topicLower = topic.toLowerCase();
  const isMath = mathKeywords.some(k => topicLower.includes(k));
  const isScience = scienceKeywords.some(k => topicLower.includes(k));
  const isProgramming = programmingKeywords.some(k => topicLower.includes(k));
  const isWriting = writingKeywords.some(k => topicLower.includes(k));
  const isHistory = historyKeywords.some(k => topicLower.includes(k));

  if (isMath) {
    return `## ${title}\n\n### Definition — What is ${title}?\n\n**${title}** is a fundamental concept in mathematics that deals with quantitative relationships, structures, and patterns.${levelContext ? levelContext.split('*Note:')[0] : ''}\n\n---\n\n### Core Principles\n\n1. **Definition** — ${title} involves mathematical operations, formulas, or relationships that help us solve problems and understand patterns in numbers and shapes.\n\n2. **Why It Matters** — It builds the foundation for advanced mathematical topics and appears in physics, engineering, economics, and everyday problem-solving.\n\n3. **Key Properties**\n   - Follows established mathematical laws and axioms\n   - Can be verified using logical reasoning and proof\n   - Connects to other mathematical concepts you already know\n\n---\n\n### Step-by-Step Breakdown\n\n\`\`\`\nStep 1: Read the problem carefully — identify what is given and what is asked.\nStep 2: Write down all known values and label unknowns with variables (x, y, z).\nStep 3: Identify the relevant formula or theorem that connects the knowns and unknowns.\nStep 4: Substitute the known values into the formula, paying attention to signs and units.\nStep 5: Simplify the equation step by step — do not skip intermediate steps.\nStep 6: Solve for the unknown by isolating the variable.\nStep 7: Check your answer — substitute it back into the original equation to verify.\n\`\`\`\n\n---\n\n### Worked Example\n\n**Problem:** Solve for x: 3x + 7 = 22\n\n**Solution:**\n\n| Step | Action | Working |\n|------|--------|---------|\n| 1 | Write the equation | 3x + 7 = 22 |\n| 2 | Subtract 7 from both sides | 3x = 22 − 7 = 15 |\n| 3 | Divide both sides by 3 | x = 15 ÷ 3 |\n| 4 | **Answer** | **x = 5** |\n\n**Verification:** 3(5) + 7 = 15 + 7 = 22 ✓\n\n---\n\n### Real-World Applications\n\n- **Architecture & Engineering** — Calculating dimensions, angles, and material quantities\n- **Finance** — Interest calculations, budgeting, and investment planning\n- **Technology** — Algorithms, data analysis, and computer graphics\n- **Science** — Modeling natural phenomena and experimental data\n\n---\n\n### Study Tips\n\n1. **Practice regularly** — Math improves with consistent practice\n2. **Show all work** — Don't skip steps, especially when learning\n3. **Check your answers** — Substitute back to verify\n4. **Learn the formulas** — Understand when and how to apply each one\n5. **Connect concepts** — See how ${title} relates to other math topics\n\n---\n\n### Quick Reference\n\n\`\`\`\nKey formulas and rules for ${title}:\n- Understand the basic definition and properties\n- Know the relevant formulas\n- Practice with progressively harder problems\n- Review and verify your solutions\n\`\`\`\n\nWould you like me to solve specific ${title} problems or explain any part in more detail?${levelContext}`;
  }

  if (isScience) {
    return `## ${title}\n\n### Definition — What is ${title}?\n\n**${title}** is an important concept in the natural sciences that helps us understand the world around us.${levelContext ? levelContext.split('*Note:')[0] : ''}\n\n---\n\n### Core Principles\n\n1. **Definition** — ${title} refers to a natural phenomenon, process, or structure that scientists study to understand how the physical, chemical, or biological world works.\n\n2. **Why It Matters** — Understanding ${title} explains everyday phenomena, connects to technology, medicine, environmental science, and engineering.\n\n3. **Key Facts**\n   - Everything in science follows natural laws and can be tested through experiments\n   - Scientific concepts are interconnected — understanding one helps with others\n   - Observations lead to hypotheses, which are tested through experiments\n\n---\n\n### How It Works\n\n- The underlying mechanism involves interactions between matter, energy, or living organisms\n- These interactions follow established scientific principles\n- Changes can be measured and predicted using scientific methods\n- The concept can be demonstrated through controlled experiments\n\n---\n\n### The Scientific Method\n\n\`\`\`\n1. Observation — What do you notice?\n2. Question — What do you want to know?\n3. Hypothesis — What do you think will happen?\n4. Experiment — Test your hypothesis under controlled conditions\n5. Analysis — What do the results show? Look for patterns and trends\n6. Conclusion — Was your hypothesis correct? What did you learn?\n7. Communication — Share your findings with others\n\`\`\`\n\n---\n\n### Worked Example\n\n**Topic:** ${title}\n\n**What happens:** When we observe ${title} in the natural world, we can identify the key principles at work. By applying the scientific method, we can investigate why it occurs and how it affects other systems.\n\n**Analysis:** The phenomenon involves specific factors that can be measured and tested. By controlling variables, we can determine cause-and-effect relationships.\n\n**Key takeaway:** Understanding ${title} helps us predict, explain, and apply scientific knowledge in practical situations.\n\n---\n\n### Real-World Applications\n\n- **Medicine** — Understanding biological processes for treatment and prevention\n- **Technology** — Applying physical and chemical principles for innovation\n- **Environment** — Studying ecological systems for conservation\n- **Industry** — Using scientific knowledge for manufacturing and development\n\n---\n\n### Study Tips\n\n1. **Visualize** — Draw diagrams, models, or charts to understand concepts\n2. **Connect** — Link ${title} to real-world examples you've observed\n3. **Experiment** — Try simple experiments to see concepts in action\n4. **Review** — Revisit key facts and principles regularly\n5. **Ask why** — Understanding the "why" helps remember the "what"\n\n---\n\n### Quick Reference\n\n\`\`\`\nKey facts about ${title}:\n- It follows established natural laws\n- It can be observed, measured, and tested\n- It connects to other scientific concepts\n- It has practical applications in everyday life\n\`\`\`\n\nWould you like me to explain specific aspects of ${title} or provide practice questions?${levelContext}`;
  }

  if (isProgramming) {
    return `## ${title}\n\n### Definition — What is ${title}?\n\n**${title}** is an important concept in programming and software development.${levelContext ? levelContext.split('*Note:')[0] : ''}\n\n---\n\n### Core Concepts\n\n1. **Definition** — ${title} is a fundamental building block in software development that enables developers to solve specific problems efficiently.\n\n2. **Why It Matters** — Understanding ${title} helps you write cleaner, faster, and more maintainable code. It is used daily by professional developers.\n\n3. **How It Works**\n   - Programming concepts are tools that help organize and process information\n   - Each concept has a specific purpose and use case\n   - Understanding the basics makes advanced concepts easier\n   - Mastering this concept unlocks more powerful programming patterns\n\n---\n\n### Step-by-Step Breakdown\n\n\`\`\`\nStep 1: Understand what the concept does and why it exists\nStep 2: Study the syntax — how do you write it in your language?\nStep 3: Look at simple, working examples\nStep 4: Modify the example to see what changes\nStep 5: Build your own mini-project using this concept\nStep 6: Review how other developers use it in real codebases\n\`\`\`\n\n---\n\n### Worked Example\n\n\`\`\`javascript\n// Demonstrating ${title} in practice:\nfunction demonstrate${title.replace(/[^a-zA-Z]/g, '')}(input) {\n  // Step 1: Validate input — always handle edge cases first\n  if (!input) throw new Error('Input required');\n  \n  // Step 2: Process the data — apply the core logic\n  const result = process(input);\n  \n  // Step 3: Return the output — ensure correct format\n  return result;\n}\n\n// How to use it:\nconst output = demonstrate${title.replace(/[^a-zA-Z]/g, '')}('example data');\nconsole.log(output);\n\`\`\`\n\n**Line-by-line explanation:**\n- The function takes input and validates it first (defensive programming)\n- It processes the data using the core logic of ${title}\n- Returns a result in the expected format\n- Always validate inputs and handle errors gracefully\n\n---\n\n### Common Use Cases\n\n- **Web Development** — Building interactive user interfaces and APIs\n- **Data Processing** — Transforming and analyzing data\n- **Automation** — Scripting repetitive tasks\n- **Application Logic** — Implementing business rules and workflows\n\n---\n\n### Best Practices\n\n1. **Start simple** — Begin with basic examples before complex ones\n2. **Read the docs** — Official documentation is your best friend\n3. **Practice** — Build small projects to solidify understanding\n4. **Debug** — Use console.log, breakpoints, or debugger tools\n5. **Refactor** — Improve your code after it works\n\n---\n\n### Quick Reference\n\n\`\`\`\nKey points about ${title}:\n- It's a fundamental concept in programming\n- Understanding it improves code quality\n- Practice with real examples\n- Connect it to other concepts you know\n\`\`\`\n\nWould you like me to explain specific aspects of ${title} or show more examples?${levelContext}`;
  }

  // Generic fallback
  return `## ${title}\n\n### Definition — What is ${title}?\n\n**${title}** is an important concept that is widely studied and applied.${levelContext ? levelContext.split('*Note:')[0] : ''}\n\n---\n\n### Core Principles\n\n1. **Definition** — ${title} refers to a concept, process, or system that is important in its field of study. It involves specific principles and rules that govern how it works.\n\n2. **Why It Matters**\n   - It forms a foundation for more advanced topics in the same field\n   - It has practical applications in everyday life\n   - Understanding it helps develop critical thinking skills\n\n3. **How to Understand It**\n   - Start with the basic definition and core principles\n   - Look at real-world examples and applications\n   - Practice applying the concept to solve problems\n   - Connect it to related concepts you already know\n\n---\n\n### How It Works\n\n- The concept operates through established principles and rules\n- It connects to other important ideas in the same field\n- Understanding the mechanism helps you apply it correctly\n- Real-world examples make abstract ideas concrete\n\n---\n\n### Worked Example\n\n**Scenario:** Imagine applying ${title} in a practical situation.\n\n**Breakdown:**\n1. Identify the key elements involved\n2. Understand how they interact with each other\n3. Apply the relevant principles or rules\n4. Observe the outcome and verify it matches expectations\n\n---\n\n### Real-World Applications\n\n- Used in academic study across multiple disciplines\n- Has practical applications in professional fields\n- Helps develop analytical and critical thinking skills\n- Forms the basis for more advanced learning\n\n---\n\n### Study Framework\n\n\`\`\`\n1. WHAT is it? → Get the clear definition\n2. WHY does it matter? → Understand its importance\n3. HOW does it work? → Learn the mechanism\n4. WHERE is it used? → See real applications\n5. WHEN to apply it? → Know the context\n\`\`\`\n\n---\n\n### Tips for Mastering This Topic\n\n1. **Start with basics** — Master the fundamental definition before moving to advanced aspects\n2. **Use examples** — Real-world examples make abstract concepts concrete\n3. **Practice regularly** — Apply the concept to different scenarios\n4. **Connect to prior knowledge** — Link ${title} to things you already understand\n5. **Teach someone else** — Explaining forces you to truly understand\n6. **Review periodically** — Space out your review sessions for better retention\n\n---\n\n### Quick Reference\n\n\`\`\`\nKey points about ${title}:\n- It is an important concept in its field\n- It follows established principles and rules\n- It has practical applications\n- Understanding it builds a foundation for advanced topics\n\`\`\`\n\nWould you like me to go deeper into any specific aspect of ${title}?${levelContext}`;
}

function findKnowledgeAnswer(query) {
  const q = query.toLowerCase().replace(/[?!.,;:'"]/g, ' ').replace(/\s+/g, ' ').trim();
  // Try exact keyword match first — keyword must appear as a whole word or phrase
  let bestMatch = null;
  let bestScore = 0;
  for (const [keyword, indices] of knowledgeIndex) {
    // Use word-boundary check: keyword must not be a substring of a larger word
    const kw = keyword.trim();
    const kwRegex = new RegExp('(^|\\s)' + kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(\\s|$)');
    if (kwRegex.test(q) || q.includes(kw)) {
      // Extra check: if keyword ends with space (e.g. 'node '), the space is a word boundary guard
      // Reject if the keyword is very short and only partially inside a longer word
      const score = kw.length;
      if (score > bestScore) {
        bestScore = score;
        bestMatch = KNOWLEDGE_BASE[indices[0]];
      }
    }
  }
  // Only return a match if the keyword is at least 5 chars long (prevents 'node' matching 'noun')
  if (bestMatch && bestScore >= 5) return bestMatch.answer;

  // Fuzzy match: only for longer words (>4 chars) with strict score threshold
  const queryWords = q.split(/\s+/).filter(w => w.length > 3);
  let fuzzyBest = null;
  let fuzzyBestScore = 0;
  for (const entry of KNOWLEDGE_BASE) {
    let matchScore = 0;
    for (const kw of entry.keywords) {
      const kwWords = kw.toLowerCase().split(/\s+/).filter(w => w.length > 4);
      for (const qw of queryWords) {
        for (const kwW of kwWords) {
          // Only exact matches or very-close matches on longer words
          if (qw === kwW) {
            matchScore += kwW.length * 2; // reward exact matches more
          } else if (kwW.length > 5 && qw.length > 5 && levenshtein(qw, kwW) <= 1) {
            matchScore += kwW.length;
          }
        }
      }
    }
    if (matchScore > fuzzyBestScore) {
      fuzzyBestScore = matchScore;
      fuzzyBest = entry;
    }
  }
  // High threshold to avoid wrong matches
  if (fuzzyBest && fuzzyBestScore >= 10) return fuzzyBest.answer;

  return null;
}

// Levenshtein distance for fuzzy matching
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return dp[m][n];
}

function simulateAIResponse(promptType, content, chatHistory = [], studentInfo = {}) {
  const { classLevel, course, stream } = studentInfo;
  const levelNote = classLevel
    ? ` (tailored for a ${classLevel}${course ? ' ' + course : stream ? ' ' + stream + ' stream' : ''} student)`
    : '';
  const studentTailor = classLevel ? `\n\n*Note: This explanation is tailored for a ${classLevel}${course ? ' ' + course : stream ? ' ' + stream + ' stream' : ''} student.*` : '';

  // Helper: extract topic from reply context (quoted text starting with >)
  function extractTopicFromReply(text) {
    // Match quoted/replied text patterns like "> vectors are..." or "Replying to: 'Vectors...'"
    const replyMatch = text.match(/(?:>|"|')(.*?)(?:"|'|$)/);
    if (replyMatch) {
      let quoted = replyMatch[1].replace(/^Replying to:\s*/i, '').trim();
      // Clean up - take first meaningful word(s)
      quoted = quoted.replace(/[?!.,;:'"]/g, '').trim();
      if (quoted.length > 2) return quoted;
    }
    return null;
  }

  // Helper: strip filler/modifier phrases to get actual topic
  const FILLER_PHRASES = ['in detail', 'in depth', 'more about', 'more on', 'more info', 'more information', 'please', 'can you', 'could you', 'would you', 'i want to know', 'i need to know', 'tell me', 'i want you to', 'i need you to', 'for me', 'right now', 'quickly', 'briefly', 'concisely'];
  function stripFillers(text) {
    let cleaned = text;
    for (const filler of FILLER_PHRASES) {
      const regex = new RegExp(`\\b${filler.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      cleaned = cleaned.replace(regex, '');
    }
    return cleaned.replace(/\s+/g, ' ').trim();
  }

  if (promptType === 'chat') {
    let q = content.toLowerCase().trim();

    // Greeting detection
    if (/^(hi|hello|hey|good morning|good afternoon|good evening|how are you|what'?s up)/.test(q)) {
      const levelGreeting = classLevel ? ` I see you're a **${classLevel}${course ? ' ' + course : stream ? ' ' + stream + ' stream' : ''}** student. ` : ' ';
      return `Hello! I'm Aura, your AI study tutor.${levelGreeting}I can help you with:\n\n- **School subjects** — Math, Science, English, Social Studies, and more\n- **University courses** — Computer Science, Engineering, Law, Medicine, Business\n- **Programming** — HTML, CSS, JavaScript, React, Python, databases, and more\n- **Study skills** — Essay writing, note-taking, time management\n\nJust ask me anything! For example:\n- "Explain photosynthesis"\n- "What is a closure in JavaScript?"\n- "Help me solve quadratic equations"\n- "How do I write a good essay?"`;
    }

    if (/^(thank|thanks|thx)/.test(q)) {
      return `You're welcome! Feel free to ask if you have more questions. I'm here to help you learn.`;
    }

    // Check if this is a reply to a quoted message — extract topic from reply context
    let replyTopic = extractTopicFromReply(content);

    // Detect modifier-only messages: "in detail", "more", "deeper", "elaborate", etc.
    const strippedMessage = stripFillers(q);
    const isModifierOnly = /^(in detail|in depth|more|deeper|elaborate|explain|continue|go on|tell me more|further|deeper|detailed|detailed version|full detail|complete|full|thorough)$/i.test(strippedMessage) ||
      /^(?:in|go|tell|give|show|make)\s+(?:it\s+)?(?:more|detailed|deeper|full|thorough|complete|better|clear|simple|easy)$/i.test(strippedMessage);

    // If it's a modifier-only message, use reply topic or recent chat history
    if (isModifierOnly && !replyTopic) {
      // Find the last substantive user question from chat history
      const reversedHistory = [...(chatHistory || [])].reverse();
      for (const msg of reversedHistory) {
        if (msg.role === 'user' && msg.content) {
          const historyClean = msg.content.replace(/[?!.,;:'"<>]/g, ' ').trim();
          if (historyClean.length > 3) {
            replyTopic = historyClean;
            break;
          }
        }
      }
    }

    // Check conversation history for context
    const recentTopics = (chatHistory || []).slice(-6).map(m => m.content?.toLowerCase() || '').join(' ');

    // Try to find the topic: from reply context, then from the message itself
    let topicToSearch = replyTopic || strippedMessage;

    // Teach-me pattern — extract the topic
    const teachMatch = q.match(/(?:teach me|explain|what is|what are|tell me about|how (?:does|do)|how to|define|describe|meaning of|what does)\s+(.+)/);
    if (teachMatch) {
      let topic = teachMatch[1].replace(/[?!.,]+$/, '').trim();
      topic = stripFillers(topic);

      // If topic is too short or just filler, try reply context
      if (topic.length < 3 && replyTopic) {
        topic = replyTopic;
      }

      // If still too short, try from chat history
      if (topic.length < 3) {
        const reversedHistory = [...(chatHistory || [])].reverse();
        for (const msg of reversedHistory) {
          if (msg.role === 'user' && msg.content && msg.content.length > 3) {
            topic = msg.content.replace(/[?!.,;:'"<>]/g, ' ').trim();
            break;
          }
        }
      }

      const topicAnswer = findKnowledgeAnswer(topic);
      if (topicAnswer) return topicAnswer + studentTailor;

      // Also try with just the extracted keyword
      const keywords = topic.split(/\s+/).filter(w => w.length > 3);
      for (const kw of keywords) {
        const kwAnswer = findKnowledgeAnswer(kw);
        if (kwAnswer) return `## ${topic.charAt(0).toUpperCase() + topic.slice(1)}\n\n${kwAnswer}${studentTailor}`;
      }

      // Generate a substantive answer for unknown topics
      const topicTitle = topic.charAt(0).toUpperCase() + topic.slice(1);
      return generateDetailedAnswer(topicTitle, classLevel, course, stream);
    }

    // Pattern: "help me with X" / "I need help with X"
    const helpMatch = q.match(/(?:help me (?:with|on|understand|solve)|i need help (?:with|on)|can you help)\s+(.+)/);
    if (helpMatch) {
      let topic = helpMatch[1].replace(/[?!.,]+$/, '').trim();
      topic = stripFillers(topic);
      if (topic.length < 3 && replyTopic) topic = replyTopic;
      const topicAnswer = findKnowledgeAnswer(topic);
      if (topicAnswer) return topicAnswer + studentTailor;
      const topicTitle = topic.charAt(0).toUpperCase() + topic.slice(1);
      return generateDetailedAnswer(topicTitle, classLevel, course, stream);
    }

    // Pattern: "give me" / "create" / "generate" / "make"
    const genMatch = q.match(/(?:give me|create|generate|make|write|provide|show me)\s+(.+)/);
    if (genMatch) {
      let topic = genMatch[1].replace(/[?!.,]+$/, '').trim();
      topic = stripFillers(topic);
      if (topic.length < 3 && replyTopic) topic = replyTopic;
      const topicAnswer = findKnowledgeAnswer(topic);
      if (topicAnswer) return topicAnswer + studentTailor;
      return generateDetailedAnswer(topic.charAt(0).toUpperCase() + topic.slice(1), classLevel, course, stream);
    }

    // Pattern: question words — "why", "when", "where", "who", "which"
    const questionMatch = q.match(/^(?:why|when|where|who|which|can|could|would|should|is|are|do|does|did|has|have)\s+(.+)/);
    if (questionMatch) {
      const topic = questionMatch[1].replace(/[?!.,]+$/, '').trim();
      let topicAnswer = findKnowledgeAnswer(content);
      if (!topicAnswer) topicAnswer = findKnowledgeAnswer(topic);
      if (topicAnswer) return topicAnswer + studentTailor;
      // Try with reply topic
      if (replyTopic) {
        topicAnswer = findKnowledgeAnswer(replyTopic);
        if (topicAnswer) return `## ${topic.charAt(0).toUpperCase() + topic.slice(1)}\n\n${topicAnswer}${studentTailor}`;
      }
      return generateDetailedAnswer(content, classLevel, course, stream);
    }

    // Pattern: "study" / "revise" / "practice" / "quiz"
    const studyMatch = q.match(/(?:study|revise|practice|quiz me|test me|exam|revision)\s*(?:on|about|for|me)?\s*(.*)/);
    if (studyMatch) {
      let topic = studyMatch[1].trim();
      if (topic.length < 3 && replyTopic) topic = replyTopic;
      if (topic) {
        const topicAnswer = findKnowledgeAnswer(topic);
        if (topicAnswer) return topicAnswer + studentTailor;
      }
      return `## Study Mode\n\n${classLevel ? `Here's a study plan tailored for your **${classLevel}** level${course ? ' in ' + course : stream ? ' (' + stream + ' stream)' : ''}.` : 'Here are some effective study strategies:'}\n\n### Active Recall Technique\n1. Read a section of your material\n2. Close the book and write down everything you remember\n3. Open the book and fill in gaps\n4. Repeat until you can recall everything perfectly\n\n### Spaced Repetition Schedule\n- **Day 1:** Learn new material\n- **Day 2:** Review (10 min)\n- **Day 4:** Review (5 min)\n- **Day 7:** Review (5 min)\n- **Day 14:** Final review (3 min)\n\n### Practice Tips\n- Explain concepts in your own words (Feynman Technique)\n- Create flashcards for key terms\n- Teach someone else what you've learned\n- Do practice problems without looking at solutions first\n\nWould you like me to quiz you on a specific topic? Just say "quiz me on [topic]"`;
    }

    // Pattern: "what about" / "tell me more" / follow-up questions
    if (q.startsWith('what about') || q.startsWith('tell me more') || q.startsWith('and ') || q.startsWith('also ')) {
      const topicAnswer = findKnowledgeAnswer(recentTopics);
      if (topicAnswer) return topicAnswer + studentTailor;
      if (replyTopic) {
        const replyAnswer = findKnowledgeAnswer(replyTopic);
        if (replyAnswer) return replyAnswer + studentTailor;
        return generateDetailedAnswer(replyTopic.charAt(0).toUpperCase() + replyTopic.slice(1), classLevel, course, stream);
      }
      return `I'd like to help you explore that further! Could you be more specific about what aspect you'd like to know more about?\n\n${levelNote}`;
    }

    // Try knowledge base with full question
    let kbAnswer = findKnowledgeAnswer(content);
    if (kbAnswer) return kbAnswer + studentTailor;

    // Try with reply topic
    if (replyTopic) {
      kbAnswer = findKnowledgeAnswer(replyTopic);
      if (kbAnswer) return kbAnswer + studentTailor;
    }

    // Extract nouns/keywords from the question and try knowledge base
    const stopWords = new Set(['what', 'does', 'about', 'with', 'your', 'this', 'that', 'have', 'been', 'from', 'they', 'their', 'would', 'could', 'should', 'which', 'where', 'there', 'these', 'those', 'tell', 'explain', 'teach', 'help', 'give', 'show', 'make', 'create', 'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'was', 'one', 'our', 'out', 'its', 'how', 'said', 'each', 'she', 'which', 'do', 'their', 'time', 'if', 'will', 'way', 'about', 'many', 'then', 'them', 'write', 'would', 'like', 'so', 'these', 'her', 'long', 'make', 'thing', 'see', 'him', 'two', 'has', 'look', 'more', 'day', 'could', 'go', 'come', 'did', 'number', 'sound', 'no', 'most', 'people', 'my', 'over', 'know', 'water', 'call', 'first', 'who', 'may', 'down', 'side', 'been', 'now', 'find']);
    const keywords = q.split(/\s+/).filter(w => w.length > 3 && !stopWords.has(w));

    // Try with the full content first (includes reply context)
    const fullContentClean = content.replace(/[?!.,;:'"<>]/g, ' ').trim();
    const fullKeywords = fullContentClean.split(/\s+/).filter(w => w.length > 3 && !stopWords.has(w));

    for (const kw of [...fullKeywords, ...keywords]) {
      const kwAnswer = findKnowledgeAnswer(kw);
      if (kwAnswer) return `Regarding **${kw}**:\n\n${kwAnswer}${studentTailor}`;
    }

    // Last resort: generate a helpful topic-specific answer using all available context
    const topicSource = replyTopic || content;
    const topicFromQuestion = topicSource.replace(/^(hi|hello|hey|can you|please|i want to|i need to|help me|teach me|explain|what is|what are|how to|how does|how do|tell me about|define|describe)\s*/i, '').replace(/[?!.,;:'"<>]/g, ' ').trim();
    if (topicFromQuestion.length > 2) {
      return generateDetailedAnswer(topicFromQuestion.charAt(0).toUpperCase() + topicFromQuestion.slice(1), classLevel, course, stream);
    }

    return `I'm here to help you learn! I can explain concepts, solve problems, and create study materials.\n\nTry asking about a specific topic:\n- "Explain [concept]"\n- "What is [topic]?"\n- "How does [thing] work?"\n- "Help me understand [subject]"\n- "Quiz me on [topic]"\n\n**I cover:** Math, Science, Programming, English, Social Studies, and many more subjects.${levelNote}`;
  }

  if (promptType === 'summarize') {
    const lines = content.split('\n').filter(l => l.trim().length > 0);
    if (lines.length === 0) return 'Please provide some notes to summarize.';

    // Extract key terms from the notes
    const allText = lines.join(' ');
    const words = allText.split(/\s+/).filter(w => w.length > 4 && !['that', 'this', 'with', 'from', 'they', 'their', 'which', 'about', 'have', 'been', 'were', 'will', 'would', 'could', 'should', 'also', 'than', 'when', 'what', 'some', 'more', 'other', 'only'].includes(w.toLowerCase()));
    const keyTerms = [...new Set(words)].slice(0, 8);

    const bullets = lines
      .slice(0, 8)
      .map(line => `• **${line.replace(/[#*_-]/g, '').trim().substring(0, 80)}**${line.length > 80 ? '...' : ''}`);

    const termList = keyTerms.length > 0
      ? `\n\n### Key Terms to Review\n${keyTerms.map(t => `- **${t.replace(/[#*_-]/g, '')}**`).join('\n')}`
      : '';

    return `## Summary\n\n### Key Takeaways\n${bullets.join('\n')}${termList}\n\n### Study Suggestions\n1. **Active Recall** — Close this summary and try to recall the key points from memory\n2. **Flashcards** — Create flashcards for the key terms listed above\n3. **Teach It** — Explain each bullet point to someone else (or out loud to yourself)\n4. **Connect the Dots** — How do these points relate to each other?\n\n### Self-Test Questions\n1. What is the main idea of this material?\n2. Can you list 3 important facts or concepts?\n3. How would you explain this topic to a classmate?\n\n---\n\n💡 *Tip: Review this summary again tomorrow using spaced repetition for better retention!*`;
  }

  if (promptType === 'generate-cards') {
    const lines = content.split(/[.!?\n]+/).map(s => s.trim()).filter(s => s.length > 15);
    const words = content.split(/\s+/).filter(w => w.length > 4);
    const keyTerms = [...new Set(words.slice(0, 10))];
    const title = content.split('\n')[0].replace(/[#*_-]/g, '').trim().substring(0, 50) || 'the study material';

    if (keyTerms.length === 0 && lines.length === 0) {
      return [
        { question: 'What is the main topic of this note?', answer: 'Refer to: ' + content.substring(0, 50) }
      ];
    }

    const cards = [];

    // Generate cards from sentences
    for (const line of lines.slice(0, 5)) {
      const clean = line.replace(/[#*_-]/g, '').trim();
      if (clean.length > 20 && clean.length < 200) {
        cards.push({
          question: `According to the study material on "${title}", which of the following is correct?`,
          answer: clean
        });
      }
    }

    // Generate cards from key terms
    for (const term of keyTerms.slice(0, 5)) {
      const cleanTerm = term.replace(/[#*_-]/g, '');
      cards.push({
        question: `Define "${cleanTerm}" and explain its significance in the context of ${title}.`,
        answer: `"${cleanTerm}" is a key concept in the study material. It plays an important role in understanding ${title}. Review your notes for the specific definition and context of this term.`
      });
    }

    // Add meta-study cards
    cards.push({
      question: `What is the main topic or theme of these notes?`,
      answer: `The main topic is "${title}". All the other concepts in your notes relate to this central theme.`
    });

    cards.push({
      question: `How would you explain ${title} to a classmate who hasn't studied it?`,
      answer: `Start with the basic definition, then give a real-world example. Connect it to something they already know. Use simple language and avoid jargon.`
    });

    return cards.slice(0, 7);
  }

  return 'I can help you with that! Could you provide more details about what specifically you\'d like to know?';
}

export { KNOWLEDGE_BASE, knowledgeIndex, findKnowledgeAnswer, levenshtein, generateDetailedAnswer, simulateAIResponse };
