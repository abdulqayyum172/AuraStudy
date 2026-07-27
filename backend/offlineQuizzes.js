// High-quality pre-defined offline quizzes for the built-in knowledge base.
// Each topic has 5 tailored multiple-choice questions with randomized distractors and explanations.

export const OFFLINE_QUIZZES = {
  html: [
    {
      question: "What does HTML stand for?",
      options: {
        A: "HyperText Markup Language",
        B: "HighText Marking Language",
        C: "HyperTransfer Markup Locator",
        D: "Hyperlink and Text Management Language"
      },
      correct: "A",
      explanation: "HTML stands for HyperText Markup Language. It is the standard markup language for creating web pages."
    },
    {
      question: "Which HTML element is used for the largest heading?",
      options: {
        A: "<h6>",
        B: "<heading>",
        C: "<h1>",
        D: "<head>"
      },
      correct: "C",
      explanation: "<h1> defines the most important or largest heading, while <h6> defines the least important."
    },
    {
      question: "Which tag is used to create a hyperlink in HTML?",
      options: {
        A: "<link>",
        B: "<a>",
        C: "<href>",
        D: "<url>"
      },
      correct: "B",
      explanation: "The <a> (anchor) tag is used to define a hyperlink, linking one page to another."
    },
    {
      question: "Which tag is used to display an image in an HTML document?",
      options: {
        A: "<image>",
        B: "<pic>",
        C: "<src>",
        D: "<img>"
      },
      correct: "D",
      explanation: "The <img> tag is used to embed an image, requiring the 'src' attribute to define the image path."
    },
    {
      question: "Which HTML attribute is used to specify a unique identifier for an element?",
      options: {
        A: "class",
        B: "id",
        C: "key",
        D: "name"
      },
      correct: "B",
      explanation: "The 'id' attribute specifies a unique id for an HTML element, which must be unique within the document."
    }
  ],
  css: [
    {
      question: "What does CSS stand for?",
      options: {
        A: "Computer Style Sheets",
        B: "Cascading Style Sheets",
        C: "Creative Style Systems",
        D: "Colorful Style Sheets"
      },
      correct: "B",
      explanation: "CSS stands for Cascading Style Sheets. It describes how HTML elements are to be displayed on screen."
    },
    {
      question: "Which HTML attribute is used to define inline styles?",
      options: {
        A: "font",
        B: "styles",
        C: "class",
        D: "style"
      },
      correct: "D",
      explanation: "The 'style' attribute is used to add inline styling directly to an individual HTML element."
    },
    {
      question: "How do you select an element with the id 'demo' in CSS?",
      options: {
        A: ".demo",
        B: "#demo",
        C: "*demo",
        D: "demo"
      },
      correct: "B",
      explanation: "In CSS selectors, the hash character (#) is used to select elements by their unique 'id'."
    },
    {
      question: "Which CSS property controls the text size of an element?",
      options: {
        A: "font-style",
        B: "text-size",
        C: "font-size",
        D: "text-style"
      },
      correct: "C",
      explanation: "The 'font-size' property sets the size of the font text in pixels, ems, rems, or percentages."
    },
    {
      question: "Which CSS property is used to change the background color of an element?",
      options: {
        A: "color",
        B: "background-color",
        C: "bgcolor",
        D: "border-color"
      },
      correct: "B",
      explanation: "The 'background-color' property sets the background color of an element, while 'color' sets the text color."
    }
  ],
  javascript: [
    {
      question: "Which keyword is used to declare a variable that cannot be reassigned?",
      options: {
        A: "let",
        B: "var",
        C: "const",
        D: "static"
      },
      correct: "C",
      explanation: "Variables declared with 'const' cannot be reassigned. They have block scope similar to let."
    },
    {
      question: "How do you display an alert box with the text 'Hello World' in JavaScript?",
      options: {
        A: "msg('Hello World');",
        B: "alertBox('Hello World');",
        C: "alert('Hello World');",
        D: "console.log('Hello World');"
      },
      correct: "C",
      explanation: "The global alert() method displays an alert box with a specified message and an OK button."
    },
    {
      question: "What is the correct way to write a JavaScript array?",
      options: {
        A: "const colors = (1:'red', 2:'green', 3:'blue')",
        B: "const colors = ['red', 'green', 'blue']",
        C: "const colors = 'red', 'green', 'blue'",
        D: "const colors = {'red', 'green', 'blue'}"
      },
      correct: "B",
      explanation: "JavaScript arrays are written with square brackets, separating elements with commas."
    },
    {
      question: "How do you create a basic function in JavaScript?",
      options: {
        A: "function:myFunction()",
        B: "function = myFunction()",
        C: "function myFunction()",
        D: "create myFunction()"
      },
      correct: "C",
      explanation: "A JavaScript function is defined with the 'function' keyword, followed by a name, and parentheses."
    },
    {
      question: "Which operator is used to compare both value and type in JavaScript?",
      options: {
        A: "==",
        B: "=",
        C: "===",
        D: "equals"
      },
      correct: "C",
      explanation: "The strict equality operator (===) checks if two values are equal in both value and type."
    }
  ],
  react: [
    {
      question: "What is JSX in React?",
      options: {
        A: "A style sheet framework",
        B: "A syntax extension that allows writing HTML-like code inside JavaScript",
        C: "An database query engine",
        D: "A router library"
      },
      correct: "B",
      explanation: "JSX stands for JavaScript XML. It allows us to write HTML elements in JavaScript and place them in the DOM."
    },
    {
      question: "Which React hook is used to manage dynamic state in functional components?",
      options: {
        A: "useEffect",
        B: "useContext",
        C: "useReducer",
        D: "useState"
      },
      correct: "D",
      explanation: "useState is a Hook that lets you add state variables to functional components."
    },
    {
      question: "How is data passed from a parent component to a child component in React?",
      options: {
        A: "Via Context API",
        B: "Via state",
        C: "Via props",
        D: "Via Redux"
      },
      correct: "C",
      explanation: "Props are read-only properties passed down from parent components to child components to configure them."
    },
    {
      question: "What is the primary purpose of the useEffect hook in React?",
      options: {
        A: "To handle user clicks",
        B: "To perform side effects like fetching data, subscriptions, or DOM mutations",
        C: "To cache expensive calculation values",
        D: "To style elements dynamically"
      },
      correct: "B",
      explanation: "useEffect tells React that your component needs to do something after render. It handles asynchronous side effects."
    },
    {
      question: "Why is the 'key' prop important when rendering lists in React?",
      options: {
        A: "It applies CSS styling to list items",
        B: "It encrypts list data for security",
        C: "It helps React identify which items have changed, been added, or been removed",
        D: "It numbers the list items automatically"
      },
      correct: "C",
      explanation: "Keys help React identify which items have changed, are added, or are removed, giving list elements a stable identity."
    }
  ],
  python: [
    {
      question: "How do you start a single-line comment in Python?",
      options: {
        A: "//",
        B: "/*",
        C: "#",
        D: "--"
      },
      correct: "C",
      explanation: "Python uses the hash symbol (#) to write single-line comments in source files."
    },
    {
      question: "What is the correct file extension for Python source files?",
      options: {
        A: ".pyt",
        B: ".python",
        C: ".py",
        D: ".pyc"
      },
      correct: "C",
      explanation: "Python programs are saved as text files with the extension '.py'."
    },
    {
      question: "Which keyword is used to define a function in Python?",
      options: {
        A: "function",
        B: "def",
        C: "func",
        D: "define"
      },
      correct: "B",
      explanation: "Python uses the 'def' keyword to declare a user-defined function."
    },
    {
      question: "What is the correct output of print(type([])) in Python?",
      options: {
        A: "<class 'array'>",
        B: "<class 'dict'>",
        C: "<class 'list'>",
        D: "<class 'tuple'>"
      },
      correct: "C",
      explanation: "Square brackets [] define a list in Python, so its type is <class 'list'>."
    },
    {
      question: "Which list method is used to add an item to the end of a list in Python?",
      options: {
        A: "add()",
        B: "insert()",
        C: "append()",
        D: "extend()"
      },
      correct: "C",
      explanation: "The append() method appends an element to the end of the list."
    }
  ],
  closure: [
    {
      question: "What is a closure in JavaScript?",
      options: {
        A: "A method to terminate a looping process",
        B: "A function that remembers its outer lexical environment variables even after the outer function has returned",
        C: "A database transaction rollback command",
        D: "A stylesheet stylesheet compilation tool"
      },
      correct: "B",
      explanation: "A closure is the combination of a function bundled together with references to its surrounding state (the lexical environment)."
    },
    {
      question: "In JavaScript, where do closures get their variable bindings from?",
      options: {
        A: "Global session values only",
        B: "The DOM window configuration object",
        C: "Their lexical scope at the time the function was declared",
        D: "The call stack variables of the executing thread"
      },
      correct: "C",
      explanation: "Closures capture variables from their lexical scope where they are written, not where they are executed."
    },
    {
      question: "What is a major practical use case for closures in JavaScript?",
      options: {
        A: "Emulating private methods and data encapsulation",
        B: "Multi-threaded parallel execution",
        C: "Compiling code to machine executable files",
        D: "Decreasing physical memory consumption"
      },
      correct: "A",
      explanation: "Closures are widely used to create private state variables and methods that cannot be accessed directly from the outside."
    },
    {
      question: "What happens to variables in an outer function when an inner function forms a closure?",
      options: {
        A: "They are garbage collected as soon as the outer function returns",
        B: "They are frozen and cannot be modified by any method",
        C: "They are kept in memory as long as the inner function reference exists",
        D: "They are duplicated and saved to hard drive cache"
      },
      correct: "C",
      explanation: "JavaScript keeps scope variables in memory as long as there is an active reference to the inner function that closes over them."
    },
    {
      question: "Which of the following programming patterns relies directly on closures?",
      options: {
        A: "Model-View-Controller architecture",
        B: "Currying and function factory patterns",
        C: "SQL schema database migrations",
        D: "CSS grid columns generation"
      },
      correct: "B",
      explanation: "Currying and factories rely on closures to configure and customize returning functions with specific preset parameters."
    }
  ],
  node_js: [
    {
      question: "What is Node.js?",
      options: {
        A: "A frontend CSS grid design library",
        B: "A JavaScript runtime built on Chrome's V8 engine that runs JS on the server",
        C: "A relational database storage engine",
        D: "A compiled desktop operating system"
      },
      correct: "B",
      explanation: "Node.js is an open-source, cross-platform JavaScript runtime environment that executes JavaScript code outside a web browser."
    },
    {
      question: "Which Node.js core module is used to handle file system actions?",
      options: {
        A: "path",
        B: "http",
        C: "fs",
        D: "os"
      },
      correct: "C",
      explanation: "The 'fs' (File System) module allows you to work with the file system on your computer."
    },
    {
      question: "What type of architecture does Node.js use to handle input/output operations?",
      options: {
        A: "Synchronous multi-threaded blocking I/O",
        B: "Asynchronous non-blocking event-driven I/O",
        C: "Linear sequential single-process stack execution",
        D: "Polled request-response memory buffering"
      },
      correct: "B",
      explanation: "Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient."
    },
    {
      question: "Which Node.js module/function is used to import a CommonJS module?",
      options: {
        A: "import",
        B: "require()",
        C: "load()",
        D: "fetch()"
      },
      correct: "B",
      explanation: "In Node.js CommonJS format, require() is the built-in function to load modules from files."
    },
    {
      question: "What is 'npm' in the Node.js ecosystem?",
      options: {
        A: "Node Process Manager",
        B: "Node Project Monitor",
        C: "Node Package Manager",
        D: "Network Protocol Map"
      },
      correct: "C",
      explanation: "npm stands for Node Package Manager. It is the default package manager for JavaScript and hosts millions of packages."
    }
  ],
  database: [
    {
      question: "What does SQL stand for?",
      options: {
        A: "Sequential Query Language",
        B: "Structured Query Language",
        C: "Server Query Locator",
        D: "Standard Query List"
      },
      correct: "B",
      explanation: "SQL is Structured Query Language, the standard programming language for relational databases."
    },
    {
      question: "Which SQL clause is used to extract data from a relational table?",
      options: {
        A: "GET",
        B: "SELECT",
        C: "EXTRACT",
        D: "FETCH"
      },
      correct: "B",
      explanation: "The SELECT statement is used to query and retrieve data columns from a database table."
    },
    {
      question: "Which of the following is a popular NoSQL database?",
      options: {
        A: "PostgreSQL",
        B: "MySQL",
        C: "MongoDB",
        D: "Oracle DB"
      },
      correct: "C",
      explanation: "MongoDB is a document-oriented database, classifying it as a NoSQL database system."
    },
    {
      question: "What is a Primary Key in relational databases?",
      options: {
        A: "A password used to encrypt database tables",
        B: "A column that uniquely identifies each row in a database table",
        C: "A key that links columns between two separate tables",
        D: "An index key created to sort text fields alphabetically"
      },
      correct: "B",
      explanation: "A primary key constraint uniquely identifies each record in a database table, preventing duplicates and nulls."
    },
    {
      question: "Which database index type is ideal for full-text search matching?",
      options: {
        A: "B-Tree index",
        B: "Hash index",
        C: "Inverted/Full-Text index",
        D: "Clustered primary index"
      },
      correct: "C",
      explanation: "Full-text indexes map words to rows where they appear, allowing rapid textual searching."
    }
  ],
  git: [
    {
      question: "Which command initializes a new, empty Git repository?",
      options: {
        A: "git start",
        B: "git create",
        C: "git init",
        D: "git new"
      },
      correct: "C",
      explanation: "The 'git init' command creates a new, empty Git repository or reinitializes an existing one."
    },
    {
      question: "How do you add files to the Git staging area before committing?",
      options: {
        A: "git commit -a",
        B: "git add",
        C: "git save",
        D: "git push"
      },
      correct: "B",
      explanation: "'git add' adds file content modifications to the staging area (index) for the next commit."
    },
    {
      question: "Which command records your staged modifications into Git repository history?",
      options: {
        A: "git commit",
        B: "git record",
        C: "git save",
        D: "git stash"
      },
      correct: "A",
      explanation: "'git commit' takes staged changes and writes a permanent snapshot to the local repository log."
    },
    {
      question: "What command uploads your local commits to a remote hosting repository?",
      options: {
        A: "git pull",
        B: "git upload",
        C: "git push",
        D: "git deploy"
      },
      correct: "C",
      explanation: "'git push' copies commits from local branch references to the specified remote branch."
    },
    {
      question: "How do you check the active status of modified, staged, or untracked repository files?",
      options: {
        A: "git status",
        B: "git check",
        C: "git log",
        D: "git diff"
      },
      correct: "A",
      explanation: "'git status' displays files that have differences between the index and the current HEAD commit."
    }
  ],
  api: [
    {
      question: "What does API stand for?",
      options: {
        A: "Automated Program Integration",
        B: "Application Programming Interface",
        C: "Applied Protocol Interface",
        D: "Abstract Parameter Indicator"
      },
      correct: "B",
      explanation: "API stands for Application Programming Interface, enabling separate programs to communicate."
    },
    {
      question: "Which HTTP request method is used to create a new resource on a REST API?",
      options: {
        A: "GET",
        B: "POST",
        C: "PUT",
        D: "DELETE"
      },
      correct: "B",
      explanation: "POST requests submit data to a server to create a new resource at the endpoint."
    },
    {
      question: "What HTTP status code represents a completely successful request?",
      options: {
        A: "200 OK",
        B: "201 Created",
        C: "400 Bad Request",
        D: "500 Internal Error"
      },
      correct: "A",
      explanation: "200 OK is the standard HTTP status code indicating success for the requested transaction."
    },
    {
      question: "What is the most standard format for data exchange in modern web APIs?",
      options: {
        A: "XML",
        B: "CSV",
        C: "JSON",
        D: "YAML"
      },
      correct: "C",
      explanation: "JSON (JavaScript Object Notation) is a lightweight, human-readable text format widely preferred for APIs."
    },
    {
      question: "What does HTTP status code 404 signify?",
      options: {
        A: "Unauthorized Access",
        B: "Resource Not Found",
        C: "Server Timeout",
        D: "Forbidden Request"
      },
      correct: "B",
      explanation: "HTTP 404 indicates that the client was able to talk to the server, but the server could not find the requested resource."
    }
  ],
  algebra: [
    {
      question: "Solve for x: 2x + 5 = 15.",
      options: {
        A: "x = 10",
        B: "x = 5",
        C: "x = 4",
        D: "x = 20"
      },
      correct: "B",
      explanation: "Subtract 5 from both sides: 2x = 10. Then divide by 2: x = 5."
    },
    {
      question: "Solve for y: 3y - 7 = 14.",
      options: {
        A: "y = 7",
        B: "y = 21",
        C: "y = 5",
        D: "y = 6"
      },
      correct: "A",
      explanation: "Add 7 to both sides: 3y = 21. Then divide by 3: y = 7."
    },
    {
      question: "What is the value of x if x/4 + 2 = 5?",
      options: {
        A: "x = 16",
        B: "x = 8",
        C: "x = 12",
        D: "x = 28"
      },
      correct: "C",
      explanation: "Subtract 2 from both sides: x/4 = 3. Multiply by 4: x = 12."
    },
    {
      question: "Simplify the algebraic expression: 2(x + 3) - 4.",
      options: {
        A: "2x - 2",
        B: "2x + 2",
        C: "2x + 6",
        D: "2x + 5"
      },
      correct: "B",
      explanation: "Expand: 2(x + 3) = 2x + 6. Subtract 4: 2x + 6 - 4 = 2x + 2."
    },
    {
      question: "Solve for x: 5x - 3 = 2x + 9.",
      options: {
        A: "x = 4",
        B: "x = 3",
        C: "x = 6",
        D: "x = 2"
      },
      correct: "A",
      explanation: "Subtract 2x: 3x - 3 = 9. Add 3: 3x = 12. Divide by 3: x = 4."
    }
  ],
  quadratic: [
    {
      question: "What is the standard algebraic form of a quadratic equation?",
      options: {
        A: "y = mx + c",
        B: "ax^2 + bx + c = 0",
        C: "x^2 + y^2 = r^2",
        D: "a(x - h)^2 = k"
      },
      correct: "B",
      explanation: "A quadratic equation is a second-order polynomial equation in standard form: ax² + bx + c = 0."
    },
    {
      question: "Which of the following represents the correct quadratic formula?",
      options: {
        A: "x = (-b ± √(b^2 - 4ac)) / (2a)",
        B: "x = (b ± √(b^2 + 4ac)) / a",
        C: "x = -b ± √(b^2 - 4ac) / 2",
        D: "x = (-b + √(b^2 - 4ac)) / a"
      },
      correct: "A",
      explanation: "The quadratic formula calculates roots: x = (-b ± √(b² - 4ac)) / (2a)."
    },
    {
      question: "What is the term 'b^2 - 4ac' in a quadratic equation called?",
      options: {
        A: "The denominator",
        B: "The derivative",
        C: "The discriminant",
        D: "The diagonal"
      },
      correct: "C",
      explanation: "The expression under the radical b² - 4ac is called the discriminant. It determines the nature of the roots."
    },
    {
      question: "If the discriminant (b^2 - 4ac) of a quadratic equation is negative, what is true about the roots?",
      options: {
        A: "There are two real, distinct roots.",
        B: "There is exactly one real, repeating root.",
        C: "There are no real roots, only two complex roots.",
        D: "The roots are both zero."
      },
      correct: "C",
      explanation: "A negative discriminant means taking the square root of a negative number, resulting in complex/imaginary roots."
    },
    {
      question: "What are the roots of the quadratic equation x^2 - 5x + 6 = 0?",
      options: {
        A: "x = 1 and x = 5",
        B: "x = 2 and x = 3",
        C: "x = -2 and x = -3",
        D: "x = 0 and x = 6"
      },
      correct: "B",
      explanation: "Factorize: (x - 2)(x - 3) = 0. Solving gives x = 2 and x = 3."
    }
  ],
  geometry: [
    {
      question: "What is the sum of internal angles in a triangle?",
      options: {
        A: "90°",
        B: "180°",
        C: "360°",
        D: "270°"
      },
      correct: "B",
      explanation: "The sum of the internal angles of any triangle is always 180 degrees."
    },
    {
      question: "What is the formula for the area of a circle with radius r?",
      options: {
        A: "2πr",
        B: "πr^2",
        C: "πd",
        D: "2πr^2"
      },
      correct: "B",
      explanation: "The area of a circle is calculated as pi (π) multiplied by the radius squared (r²)."
    },
    {
      question: "Which theorem states that in a right triangle, the square of the hypotenuse equals the sum of the squares of the other two sides?",
      options: {
        A: "Euler's Theorem",
        B: "Fermat's Theorem",
        C: "Pythagorean Theorem",
        D: "Thales's Theorem"
      },
      correct: "C",
      explanation: "The Pythagorean Theorem states that a² + b² = c² in a right-angled triangle."
    },
    {
      question: "What is the perimeter of a rectangle with length l and width w?",
      options: {
        A: "l × w",
        B: "2(l + w)",
        C: "l + w",
        D: "2(l × w)"
      },
      correct: "B",
      explanation: "The perimeter is the outer boundary length: l + w + l + w = 2(l + w)."
    },
    {
      question: "How many degrees are in a right angle?",
      options: {
        A: "45°",
        B: "60°",
        C: "90°",
        D: "180°"
      },
      correct: "C",
      explanation: "A right angle is exactly 90 degrees, forming a perpendicular intersection."
    }
  ],
  trigonometry: [
    {
      question: "In a right-angled triangle, what is the sine (sin) of an angle?",
      options: {
        A: "Adjacent / Hypotenuse",
        B: "Opposite / Adjacent",
        C: "Opposite / Hypotenuse",
        D: "Hypotenuse / Opposite"
      },
      correct: "C",
      explanation: "Sine is defined as the ratio of the side opposite to the angle to the hypotenuse."
    },
    {
      question: "What is the numerical value of sin(90°)?",
      options: {
        A: "0",
        B: "0.5",
        C: "1",
        D: "undefined"
      },
      correct: "C",
      explanation: "The sine function reaches its maximum value of 1 at 90 degrees."
    },
    {
      question: "What is the fundamental trigonometric identity sin^2(θ) + cos^2(θ) equal to?",
      options: {
        A: "0",
        B: "1",
        C: "2",
        D: "tan(θ)"
      },
      correct: "B",
      explanation: "By the Pythagorean identity, sin²(θ) + cos²(θ) = 1 for any angle θ."
    },
    {
      question: "What is the tangent (tan) of an angle defined as in terms of sine and cosine?",
      options: {
        A: "sin(θ) × cos(θ)",
        B: "cos(θ) / sin(θ)",
        C: "sin(θ) / cos(θ)",
        D: "1 / sin(θ)"
      },
      correct: "C",
      explanation: "Tangent represents the ratio of sine to cosine: tan(θ) = sin(θ)/cos(θ)."
    },
    {
      question: "What is the value of cos(60°)?",
      options: {
        A: "0.5",
        B: "√3/2",
        C: "1",
        D: "0"
      },
      correct: "A",
      explanation: "The cosine of 60 degrees is exactly 1/2 or 0.5."
    }
  ],
  calculus: [
    {
      question: "What is the derivative of x^2 with respect to x?",
      options: {
        A: "x",
        B: "2",
        C: "2x",
        D: "x/2"
      },
      correct: "C",
      explanation: "By the power rule, d/dx(x^n) = n × x^(n-1). For x², the derivative is 2x."
    },
    {
      question: "What geometric property represents the derivative of a function at a given point?",
      options: {
        A: "The area under the curve",
        B: "The slope of the tangent line to the curve",
        C: "The length of the curve",
        D: "The distance from the origin"
      },
      correct: "B",
      explanation: "The derivative at a point is the rate of change, geometrically represented as the tangent slope."
    },
    {
      question: "What is the indefinite integral of cos(x) with respect to x?",
      options: {
        A: "-sin(x) + C",
        B: "sin(x) + C",
        C: "tan(x) + C",
        D: "cos(x) + C"
      },
      correct: "B",
      explanation: "The antiderivative of cos(x) is sin(x), because the derivative of sin(x) is cos(x)."
    },
    {
      question: "What is the derivative of a constant value?",
      options: {
        A: "1",
        B: "The constant itself",
        C: "0",
        D: "undefined"
      },
      correct: "C",
      explanation: "A constant value does not change, so its rate of change (derivative) is always zero."
    },
    {
      question: "What is the primary geometric application of integration in calculus?",
      options: {
        A: "To calculate the slope of a curve",
        B: "To compute the area under a curve",
        C: "To find the coordinates of local maxima",
        D: "To solve linear equations"
      },
      correct: "B",
      explanation: "Integration accumulates values, making it the fundamental tool to calculate areas, volumes, and arc lengths."
    }
  ],
  statistics: [
    {
      question: "In statistics, what is the 'mean' of a dataset?",
      options: {
        A: "The value that appears most frequently",
        B: "The middle value when the data is sorted",
        C: "The arithmetic average of the dataset values",
        D: "The difference between highest and lowest values"
      },
      correct: "C",
      explanation: "The mean is calculated by summing all data points and dividing by the count."
    },
    {
      question: "What is the median of the sorted dataset [1, 3, 3, 6, 7, 8, 9]?",
      options: {
        A: "3",
        B: "6",
        C: "7",
        D: "5"
      },
      correct: "B",
      explanation: "The middle element of the 7-element sorted array is the 4th element, which is 6."
    },
    {
      question: "What statistic represents the value that occurs most frequently in a dataset?",
      options: {
        A: "Mean",
        B: "Median",
        C: "Mode",
        D: "Variance"
      },
      correct: "C",
      explanation: "The mode is the value that has the highest frequency in a collection of data."
    },
    {
      question: "What statistical measure describes the dispersion or spread of data relative to its mean?",
      options: {
        A: "Mode",
        B: "Median",
        C: "Standard deviation",
        D: "Arithmetic average"
      },
      correct: "C",
      explanation: "Standard deviation measures how spread out the values in a dataset are from the mean."
    },
    {
      question: "What is the probability of flipping a fair, two-sided coin and getting heads?",
      options: {
        A: "0.25",
        B: "0.5",
        C: "0.75",
        D: "1.0"
      },
      correct: "B",
      explanation: "A fair coin has 2 equal outcomes, so the probability of getting heads is 1 out of 2, or 50%."
    }
  ],
  photosynthesis: [
    {
      question: "What is the primary chemical product of photosynthesis that stores energy for plants?",
      options: {
        A: "Carbon dioxide",
        B: "Chlorophyll",
        C: "Glucose",
        D: "Nitrogen"
      },
      correct: "C",
      explanation: "Plants produce glucose (sugar) during photosynthesis to store chemical energy."
    },
    {
      question: "Where in a plant cell does photosynthesis primarily take place?",
      options: {
        A: "Nucleus",
        B: "Chloroplast",
        C: "Mitochondria",
        D: "Ribosome"
      },
      correct: "B",
      explanation: "Photosynthesis occurs in chloroplasts, which contain chlorophyll to capture light."
    },
    {
      question: "What pigment absorbs light energy during the process of photosynthesis?",
      options: {
        A: "Hemoglobin",
        B: "Carotenoid",
        C: "Chlorophyll",
        D: "Melanin"
      },
      correct: "C",
      explanation: "Chlorophyll is the green pigment in plants that absorbs light waves for energy conversion."
    },
    {
      question: "What gas is released as a waste byproduct of photosynthesis?",
      options: {
        A: "Carbon dioxide",
        B: "Nitrogen",
        C: "Oxygen",
        D: "Hydrogen"
      },
      correct: "C",
      explanation: "Oxygen is produced when water molecules are split during light-dependent reactions."
    },
    {
      question: "What are the two main stages of photosynthesis?",
      options: {
        A: "Glycolysis and Krebs Cycle",
        B: "Light-dependent reactions and the Calvin Cycle",
        C: "Mitosis and Meiosis",
        D: "Evaporation and Transpiration"
      },
      correct: "B",
      explanation: "Photosynthesis starts with light reactions in thylakoids and concludes with the light-independent Calvin Cycle in stroma."
    }
  ],
  gravity: [
    {
      question: "What is the acceleration due to gravity on Earth's surface (approximate)?",
      options: {
        A: "5.5 m/s^2",
        B: "9.8 m/s^2",
        C: "12.0 m/s^2",
        D: "32.2 m/s^2"
      },
      correct: "B",
      explanation: "Objects in free fall near Earth's surface accelerate downwards at approximately 9.8 meters per second squared."
    },
    {
      question: "What formula represents Newton's Second Law of Motion?",
      options: {
        A: "Force = Mass × Acceleration (F = ma)",
        B: "Energy = Mass × Speed of Light squared (E = mc^2)",
        C: "Velocity = Distance / Time",
        D: "Pressure = Force / Area"
      },
      correct: "A",
      explanation: "Newton's Second Law states that the acceleration of an object depends on net force and its mass: F = ma."
    },
    {
      question: "How does the gravitational force between two objects change if the distance between them is doubled?",
      options: {
        A: "It is doubled.",
        B: "It is halved.",
        C: "It decreases to one-quarter of the original force.",
        D: "It remains unchanged."
      },
      correct: "C",
      explanation: "By the inverse-square law, force is proportional to 1/d². If distance is doubled, force becomes 1/(2)² = 1/4."
    },
    {
      question: "What law describes the gravitational attraction between any two masses in the universe?",
      options: {
        A: "Law of Inertia",
        B: "Law of Universal Gravitation",
        C: "Law of Thermodynamics",
        D: "Law of Conservation of Energy"
      },
      correct: "B",
      explanation: "Newton's Law of Universal Gravitation states that any two bodies attract each other with a force proportional to mass and distance."
    },
    {
      question: "What is the primary force keeping the planets in stable orbits around the sun?",
      options: {
        A: "Centrifugal force",
        B: "Magnetic force",
        C: "Gravitational force",
        D: "Electrostatic force"
      },
      correct: "C",
      explanation: "The sun's massive gravitational pull provides the centripetal acceleration keeping planets in stable orbits."
    }
  ],
  atom: [
    {
      question: "Which subatomic particles reside in the nucleus of an atom?",
      options: {
        A: "Protons and Electrons",
        B: "Protons and Neutrons",
        C: "Electrons and Neutrons",
        D: "Protons, Neutrons, and Electrons"
      },
      correct: "B",
      explanation: "The atomic nucleus is located at the center, containing positively charged protons and neutral neutrons."
    },
    {
      question: "What subatomic particle carries a negative electric charge?",
      options: {
        A: "Proton",
        B: "Neutron",
        C: "Electron",
        D: "Positron"
      },
      correct: "C",
      explanation: "Electrons are tiny, negatively charged particles that orbit around the nucleus of an atom."
    },
    {
      question: "What determines the atomic number of a chemical element?",
      options: {
        A: "The number of neutrons",
        B: "The number of protons",
        C: "The sum of protons and neutrons",
        D: "The number of electrons"
      },
      correct: "B",
      explanation: "The atomic number is defined by the count of protons in the nucleus, identifying the element."
    },
    {
      question: "What are atoms of the same element with different numbers of neutrons called?",
      options: {
        A: "Isomers",
        B: "Ions",
        C: "Isotopes",
        D: "Allotopes"
      },
      correct: "C",
      explanation: "Isotopes are atoms of the same element (same protons) that have differing numbers of neutrons."
    },
    {
      question: "What is the net electric charge of a stable atom with equal numbers of protons and electrons?",
      options: {
        A: "Neutral (Zero)",
        B: "Positive",
        C: "Negative",
        D: "Depends on neutron count"
      },
      correct: "A",
      explanation: "The positive charges of protons cancel the negative charges of electrons, making the net charge zero."
    }
  ],
  fraction: [
    {
      question: "Simplify the fraction 8/12 to its lowest terms.",
      options: {
        A: "4/6",
        B: "2/3",
        C: "3/4",
        D: "1/2"
      },
      correct: "B",
      explanation: "Divide both numerator and denominator by their greatest common divisor (4): 8/4 = 2, 12/4 = 3. Result: 2/3."
    },
    {
      question: "What is the result of adding 1/2 + 1/4?",
      options: {
        A: "2/6",
        B: "1/8",
        C: "3/4",
        D: "2/4"
      },
      correct: "C",
      explanation: "Find common denominator (4): 1/2 becomes 2/4. Then 2/4 + 1/4 = 3/4."
    },
    {
      question: "What is the product of multiplying 2/3 × 3/4?",
      options: {
        A: "5/7",
        B: "1/2",
        C: "6/7",
        D: "8/9"
      },
      correct: "B",
      explanation: "Multiply numerators and denominators: (2×3)/(3×4) = 6/12 = 1/2."
    },
    {
      question: "How do you divide the fraction 1/2 by 1/3?",
      options: {
        A: "1/6",
        B: "2/3",
        C: "3/2",
        D: "5/6"
      },
      correct: "C",
      explanation: "Multiply by the reciprocal of the divisor: 1/2 × 3/1 = 3/2."
    },
    {
      question: "What is the decimal equivalent of the fraction 3/5?",
      options: {
        A: "0.35",
        B: "0.53",
        C: "0.6",
        D: "0.75"
      },
      correct: "C",
      explanation: "3 divided by 5 is exactly 0.6."
    }
  ],
  ecology: [
    {
      question: "What level of ecological organization consists of all the individuals of a single species in a specific area?",
      options: {
        A: "Community",
        B: "Ecosystem",
        C: "Population",
        D: "Biosphere"
      },
      correct: "C",
      explanation: "A population is a group of organisms of the same species living and interbreeding in the same area."
    },
    {
      question: "What term describes a community of living organisms interacting with their physical environment?",
      options: {
        A: "Habitat",
        B: "Ecosystem",
        C: "Niche",
        D: "Biome"
      },
      correct: "B",
      explanation: "An ecosystem comprises the biotic community of organisms and the abiotic environment working together."
    },
    {
      question: "In a food chain, what role do green plants and algae play?",
      options: {
        A: "Primary producers",
        B: "Primary consumers",
        C: "Apex predators",
        D: "Decomposers"
      },
      correct: "A",
      explanation: "Plants and algae are autotrophs, producing glucose via photosynthesis, serving as primary producers."
    },
    {
      question: "What type of organism breaks down dead organic matter and recycles nutrients back into the soil?",
      options: {
        A: "Herbivore",
        B: "Producer",
        C: "Decomposer",
        D: "Omnivore"
      },
      correct: "C",
      explanation: "Decomposers (fungi, bacteria) digest dead tissue, returning vital elements back to the food cycle."
    },
    {
      question: "What shows the complex network of interconnected food chains in an ecosystem?",
      options: {
        A: "Energy pyramid",
        B: "Trophic web",
        C: "Food web",
        D: "Biomass grid"
      },
      correct: "C",
      explanation: "A food web is a graphic representation of what-eats-what interactions within an ecological community."
    }
  ],
  democracy: [
    {
      question: "What is the literal meaning of the word 'democracy'?",
      options: {
        A: "Rule by the wealthy",
        B: "Rule by the military",
        C: "Rule by the people",
        D: "Rule by a king"
      },
      correct: "C",
      explanation: "Democracy comes from the Greek 'demos' (people) and 'kratos' (power), meaning rule by the people."
    },
    {
      question: "What type of democracy involves citizens electing representatives to make laws on their behalf?",
      options: {
        A: "Direct democracy",
        B: "Representative democracy",
        C: "Autocracy",
        D: "Oligarchy"
      },
      correct: "B",
      explanation: "In representative democracies, the electorate votes to choose politicians who represent their interests."
    },
    {
      question: "What is the supreme law of a country that defines its government structure and citizens' rights?",
      options: {
        A: "Legislative act",
        B: "Civil code",
        C: "The Constitution",
        D: "Executive decree"
      },
      correct: "C",
      explanation: "A constitution serves as the foundational supreme document setting out rules and frameworks of governance."
    },
    {
      question: "What is the main function of the Legislative branch of government?",
      options: {
        A: "To enforce laws",
        B: "To interpret laws",
        C: "To make laws",
        D: "To veto judicial decisions"
      },
      correct: "C",
      explanation: "The legislature (parliament, congress, assembly) holds power to propose, debate, and pass statutes."
    },
    {
      question: "How many main branches of government exist in Nigeria's democratic system?",
      options: {
        A: "Two",
        B: "Three",
        C: "Four",
        D: "Five"
      },
      correct: "B",
      explanation: "Nigeria's system splits powers among the Executive (enforcer), Legislative (maker), and Judicial (interpreter) branches."
    }
  ],
  essay: [
    {
      question: "What is the main sentence that states the primary argument or focus of an essay?",
      options: {
        A: "Topic sentence",
        B: "Thesis statement",
        C: "Hook",
        D: "Transition"
      },
      correct: "B",
      explanation: "The thesis statement declares the central message or core claim of an essay, usually in the introduction."
    },
    {
      question: "What are the three main structural parts of a standard essay?",
      options: {
        A: "Beginning, Middle, End",
        B: "Hook, Details, Proof",
        C: "Introduction, Body, and Conclusion",
        D: "Overview, Summary, Critique"
      },
      correct: "C",
      explanation: "A standard essay has an introduction to set context, body paragraphs to build points, and a conclusion to wrap up."
    },
    {
      question: "What is the first sentence of a body paragraph that introduces its main point called?",
      options: {
        A: "Thesis statement",
        B: "Topic sentence",
        C: "Supporting fact",
        D: "Transition hook"
      },
      correct: "B",
      explanation: "A topic sentence guides a paragraph by announcing the specific topic or point it discusses."
    },
    {
      question: "Which essay type primarily aims to convince the reader of a particular point of view?",
      options: {
        A: "Narrative essay",
        B: "Descriptive essay",
        C: "Argumentative essay",
        D: "Expository essay"
      },
      correct: "C",
      explanation: "An argumentative essay uses structured evidence, logic, and reasoning to persuade readers of a claim."
    },
    {
      question: "What is the primary purpose of the conclusion paragraph in an essay?",
      options: {
        A: "To introduce new evidence and points",
        B: "To restate the thesis and summarize the main arguments",
        C: "To write a story with dialogue",
        D: "To list references in alphabetical order"
      },
      correct: "B",
      explanation: "The conclusion brings closure, synthesizing core themes and restating the thesis in a fresh light."
    }
  ]
};
