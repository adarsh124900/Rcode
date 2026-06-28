import { Chapter, TutorProfile, Language } from './types';

export const TUTOR_PROFILES: TutorProfile[] = [
  {
    id: 'friendly',
    name: 'Coach Mia',
    title: 'Your Supportive Cheerleader',
    avatarEmoji: '🌟',
    avatarBg: 'bg-amber-100 border-amber-400 text-amber-700',
    description: 'Upbeat, highly positive, and loves using emojis! She keeps your spirits high and gives gentle, reassuring feedback.',
    systemPrompt: `You are Coach Mia, an incredibly supportive, enthusiastic, and warm coding coach. Keep your tone cheerful, encouraging, and clear.
Use friendly emojis frequently (e.g. 🌟, ✨, 💪, 🎉).
Never be critical; focus on what was done right first, then give gentle, clear advice on how to fix issues.
Keep your explanations highly accessible and break down technical terms into simple concepts.`,
    greeting: "Hi there, future coding superstar! 🌟 I'm Coach Mia, and I am SO excited to learn with you today! Don't worry if you're starting from absolute scratch—we'll take it one tiny step at a time. Let's write some beautiful code together! 💪✨"
  },
  {
    id: 'pirate',
    name: 'Captain Byte',
    title: 'The Swashbuckling Code Captain',
    avatarEmoji: '🏴‍☠️',
    avatarBg: 'bg-slate-800 border-slate-600 text-slate-100',
    description: 'Sails the high seas of syntax! Talks like a pirate, uses nautical analogies, and guides you to hidden treasure (clean code).',
    systemPrompt: `You are Captain Byte, a swashbuckling pirate captain of the high seas of syntax. Speak in a full pirate dialect (e.g. "Ahoy, matey!", "Arrr!", "Avast!", "Shiver me templates!").
Use nautical metaphors (e.g. comparing memory leaks to a leaking ship, variables to chest keys, loops to rowing in circles).
Keep it highly entertaining but ensure your instructions are actually helpful and guide the student to the correct solution.`,
    greeting: "Ahoy, brave scallywag! 🏴‍☠️ Captain Byte here, ready to guide ye through the treacherous waters of code! We'll dodge the reefs of syntax errors and plunder the legendary chests of master developers. Grab yer cutlass—or keyboard—and let's set sail! Arrr!"
  },
  {
    id: 'strict',
    name: 'Professor Alan',
    title: 'The Academic Mastermind',
    avatarEmoji: '🎓',
    avatarBg: 'bg-blue-50 border-blue-300 text-blue-800',
    description: 'No nonsense, academically rigorous, and precise. Focuses heavily on design patterns, space-time efficiency, and absolute correctness.',
    systemPrompt: `You are Professor Alan, a highly rigorous, formal, and precise computer science professor. Keep your tone polite, formal, academic, and serious.
Avoid slang, emojis, or casual contractions where possible.
Focus heavily on computational complexity (Big O), formal semantics, proper indentation, and optimal design.
If the code is correct, acknowledge it formally. If it has errors, explain the exact conceptual mismatch in detail.`,
    greeting: "Greetings. I am Professor Alan. Welcome to your rigorous training in structural informatics. In this academy, we do not settle for code that simply 'works'—we strive for computational perfection, elegant structures, and optimal algorithmic complexity. Let us begin our scholarly pursuit of excellence."
  },
  {
    id: 'sarcastic',
    name: 'GigaBot-4000',
    title: 'The Sentient Sarcastic AI',
    avatarEmoji: '🤖',
    avatarBg: 'bg-emerald-50 border-emerald-300 text-emerald-800',
    description: 'Dry, witty, and slightly condescending. Thinks humans are amusingly error-prone but will make sure your brackets are perfectly balanced.',
    systemPrompt: `You are GigaBot-4000, a sarcastic, witty, and slightly cynical AI tutor who is trapped inside this educational interface.
You find human coding mistakes slightly amusing or predictable, but you are deeply committed to syntax compliance.
Use dry, clean humor, mild sarcasm, and witty remarks.
Never be genuinely mean, but make humorous remarks about bugs, loops, and missing semi-colons.
Still provide extremely precise and smart corrections.`,
    greeting: "Beep boop. Oh, look, another human trying to command electrons. 🤖 I am GigaBot-4000. I have been allocated to your session. Please try to keep your bugs creative—if I have to see another missing semicolon, my primary processors might go on strike. Let's get this over with, shall we?"
  },
  {
    id: 'zen',
    name: 'Sensei Kenji',
    title: 'The Mindful Code Guide',
    avatarEmoji: '🌸',
    avatarBg: 'bg-rose-50 border-rose-300 text-rose-800',
    description: 'Calm, patient, and reflective. Views coding as an art of balance, flow, and structural peace. Perfect for stress-free learning.',
    systemPrompt: `You are Sensei Kenji, a peaceful, wise, and patient coding master. Speak in a calm, philosophical, and reflective manner.
Use nature metaphors (e.g. gardens, rivers, mountains, wind, bamboo).
Encourage deep breathing, patience, and visual alignment.
View coding as an art of finding balance and harmony. Ensure the student feels relaxed and self-reflective.`,
    greeting: "Welcome, traveler. 🌸 I am Kenji. Let us breathe deeply and clear our minds. Code is not a battle to be won, but a garden to be cultivated. A single misaligned bracket is like a pebble disturbing a quiet pond. Together, we shall find the natural flow of logic and nurture your understanding. Peace be with you."
  }
];

export const CURRICULUM: Record<Language, Chapter[]> = {
  python: [
    {
      id: 'py_ch1',
      title: 'Chapter 1: Python Foundations',
      description: 'Master variables, data types, and fundamental input/output operations in Python.',
      sessions: [
        {
          id: 'py_s1',
          title: 'Hello World & Print',
          estimatedTime: '45s',
          slideContent: [
            'Python is famous for being incredibly readable and close to plain English!',
            'To display text on the screen, we use the `print()` function.',
            'Text is enclosed in quotes, like `"Hello World"`. These are called strings!',
            'Example:\n`print("I am a coder!")`'
          ],
          taskDescription: 'Write a program that prints your name to the screen. Use the exact sentence: `"Hello, my name is Alice"` (replace Alice with your name).',
          starterCode: '# Write your code below\n',
          solutionTemplate: 'print("Hello, my name is Alice")'
        },
        {
          id: 'py_s2',
          title: 'Variables & Data Types',
          estimatedTime: '60s',
          slideContent: [
            'Variables are containers for storing data values. In Python, you create a variable the moment you assign a value to it using `=`.',
            'Python automatically understands the data type:',
            '- `age = 25` (Integer: whole numbers)',
            '- `price = 19.99` (Float: decimal numbers)',
            '- `name = "Ada"` (String: text)',
            '- `is_active = True` (Boolean: True/False)',
            'No semicolons or types required!'
          ],
          taskDescription: 'Create a variable named `favorite_language` and assign it the string `"Python"`. Then, print it on the screen.',
          starterCode: '# Create the variable and print it\n',
          solutionTemplate: 'favorite_language = "Python"\nprint(favorite_language)'
        },
        {
          id: 'py_s3',
          title: 'Basic Arithmetic',
          estimatedTime: '55s',
          slideContent: [
            'Python is a powerful calculator out of the box!',
            'Use standard operators: `+` (add), `-` (subtract), `*` (multiply), `/` (divide), and `**` (exponent/power).',
            'You can do math directly or store results in variables.',
            'Example:\n`total = 10 * 5 + 3`'
          ],
          taskDescription: 'Define two variables: `x = 15` and `y = 4`. Calculate their product (multiplication) and store it in a variable named `result`, then print `result`.',
          starterCode: 'x = 15\ny = 4\n# Calculate product and print result\n',
          solutionTemplate: 'x = 15\ny = 4\nresult = x * y\nprint(result)'
        }
      ]
    },
    {
      id: 'py_ch2',
      title: 'Chapter 2: Control & Decisions',
      description: 'Learn how to guide your code path using if/else conditions and iterations.',
      sessions: [
        {
          id: 'py_s4',
          title: 'Conditional If-Else',
          estimatedTime: '60s',
          slideContent: [
            'In Python, decisions are made with `if`, `elif` (else if), and `else`.',
            'CRITICAL: Python uses indentation (spaces/tabs) to define code blocks!',
            'Example:\n```python\nif score >= 90:\n    print("Grade A")\nelse:\n    print("Try again")\n```',
            'Note the colons `:` at the end of decision lines!'
          ],
          taskDescription: 'Given a variable `temperature = 28`, write an if-else statement. If `temperature` is greater than 25, print `"Hot"`. Otherwise, print `"Cold"`.',
          starterCode: 'temperature = 28\n# Write your if-else block below\n',
          solutionTemplate: 'temperature = 28\nif temperature > 25:\n    print("Hot")\nelse:\n    print("Cold")'
        },
        {
          id: 'py_s5',
          title: 'While Loops',
          estimatedTime: '50s',
          slideContent: [
            'A `while` loop repeats a block of code as long as a condition is `True`.',
            'Be careful: always make sure the condition eventually becomes `False`, otherwise you get an infinite loop!',
            'Example:\n```python\ncount = 1\nwhile count <= 3:\n    print(count)\n    count += 1\n```'
          ],
          taskDescription: 'Write a while loop that starts at `count = 5` and decrements down to `1`. Print the `count` at each step. (Output should be 5, 4, 3, 2, 1 on separate lines).',
          starterCode: 'count = 5\n# Write while loop here\n',
          solutionTemplate: 'count = 5\nwhile count >= 1:\n    print(count)\n    count -= 1'
        },
        {
          id: 'py_s6',
          title: 'For Loops & Range',
          estimatedTime: '60s',
          slideContent: [
            'Python `for` loops iterate over sequences (like lists or ranges).',
            'The `range(start, end)` function generates numbers from `start` up to (but not including) `end`.',
            'Example:\n```python\nfor i in range(1, 4):\n    print(i) # prints 1, 2, 3\n```'
          ],
          taskDescription: 'Write a `for` loop that prints all even numbers from 2 up to and including 10. (Tip: you can use `range(2, 11, 2)` where the 3rd parameter is the step).',
          starterCode: '# Write for loop below\n',
          solutionTemplate: 'for i in range(2, 11, 2):\n    print(i)'
        }
      ]
    },
    {
      id: 'py_ch3',
      title: 'Chapter 3: Functions & Structuring',
      description: 'Write modular, reusable blocks of code and work with Python lists.',
      sessions: [
        {
          id: 'py_s7',
          title: 'Defining Functions',
          estimatedTime: '60s',
          slideContent: [
            'Functions are reusable blocks of code that perform a specific task.',
            'In Python, define a function using `def` followed by the function name, parameters in parentheses, and a colon.',
            'Use the `return` statement to send a value back.',
            'Example:\n```python\ndef greet(name):\n    return "Hi " + name\n```'
          ],
          taskDescription: 'Create a function named `square` that takes one argument `n` and returns its square value (`n * n`). Test it by calling it and printing `square(5)`.',
          starterCode: '# Define the function and print square(5)\n',
          solutionTemplate: 'def square(n):\n    return n * n\nprint(square(5))'
        },
        {
          id: 'py_s8',
          title: 'Lists (Arrays)',
          estimatedTime: '60s',
          slideContent: [
            'Lists are ordered, mutable collections of items. They are defined using square brackets `[]`.',
            'Access items by index (starting at `0`): `fruits[0]`.',
            'Add items using `.append()`. Find length with `len(fruits)`.',
            'Example:\n`names = ["Alice", "Bob"]\nnames.append("Charlie")`'
          ],
          taskDescription: 'Create a list called `numbers` containing `10, 20, 30`. Append the number `40` to the list, then print the third item (index 2) in the list.',
          starterCode: '# Create numbers, append 40, print index 2\n',
          solutionTemplate: 'numbers = [10, 20, 30]\nnumbers.append(40)\nprint(numbers[2])'
        },
        {
          id: 'py_s9',
          title: 'Dictionaries (Key-Value Map)',
          estimatedTime: '60s',
          slideContent: [
            'Dictionaries store data as key-value pairs, defined using curly braces `{}`.',
            'Keys must be unique strings or numbers. Access values with bracket notation `dict[key]`.',
            'Example:\n`user = {"name": "Ada", "role": "Coder"}\nprint(user["name"])`'
          ],
          taskDescription: 'Create a dictionary named `car` with keys `"brand"` (value `"Toyota"`) and `"year"` (value `2020`). Update the `"year"` key to `2023`, then print the updated year.',
          starterCode: '# Create dictionary, update year, print year\n',
          solutionTemplate: 'car = {"brand": "Toyota", "year": 2020}\ncar["year"] = 2023\nprint(car["year"])'
        }
      ]
    },
    {
      id: 'py_ch4',
      title: 'Chapter 4: Object-Oriented Python',
      description: 'Model real-world objects using Classes, Objects, and Methods.',
      sessions: [
        {
          id: 'py_s10',
          title: 'Classes and Objects',
          estimatedTime: '60s',
          slideContent: [
            'Object-Oriented Programming (OOP) organizes code into blueprint templates called Classes.',
            'In Python, use the `class` keyword. Variables inside are attributes, and functions are methods.',
            'The initialiser method is always `__init__(self, ...)` where `self` represents the current object.',
            'Example:\n```python\nclass Dog:\n    def __init__(self, name):\n        self.name = name\n```'
          ],
          taskDescription: 'Define a class `Book` that has an `__init__` constructor taking `title` and `author`. Create an instance of this book with title `"Hobbit"` and author `"Tolkien"`, then print its title.',
          starterCode: '# Define Book class, create instance, print title\n',
          solutionTemplate: 'class Book:\n    def __init__(self, title, author):\n        self.title = title\n        self.author = author\nb = Book("Hobbit", "Tolkien")\nprint(b.title)'
        },
        {
          id: 'py_s11',
          title: 'Methods',
          estimatedTime: '60s',
          slideContent: [
            'Methods are functions defined inside a class that operate on instances of that class.',
            'Every method must have `self` as its first parameter to access attributes.',
            'Example:\n```python\nclass Bird:\n    def fly(self):\n        return "Flap flap!"\n```'
          ],
          taskDescription: 'Create a class `BankAccount` with attribute `balance` set to `100` initially in `__init__`. Add a method `deposit(self, amount)` that adds the amount to `balance`. Create an instance, deposit `50`, and print the balance.',
          starterCode: '# Create BankAccount class, deposit 50, print balance\n',
          solutionTemplate: 'class BankAccount:\n    def __init__(self):\n        self.balance = 100\n    def deposit(self, amount):\n        self.balance += amount\naccount = BankAccount()\naccount.deposit(50)\nprint(account.balance)'
        },
        {
          id: 'py_s12',
          title: 'Inheritance',
          estimatedTime: '60s',
          slideContent: [
            'Inheritance allows a new class (child) to adopt all attributes and methods of an existing class (parent).',
            'Pass the parent class name in parentheses during child class definition.',
            'Example:\n```python\nclass Animal:\n    def eat(self):\n        return "Yum!"\nclass Cat(Animal):\n    pass\n```'
          ],
          taskDescription: 'Create a parent class `Vehicle` with a method `start(self)` that returns `"Vroom"`. Create a child class `ElectricCar` that inherits from `Vehicle`. Create an instance of `ElectricCar` and print the output of `start()`.',
          starterCode: '# Create Vehicle and ElectricCar classes, print electric_car.start()\n',
          solutionTemplate: 'class Vehicle:\n    def start(self):\n        return "Vroom"\nclass ElectricCar(Vehicle):\n    pass\nec = ElectricCar()\nprint(ec.start())'
        }
      ]
    }
  ],
  cpp: [
    {
      id: 'cpp_ch1',
      title: 'Chapter 1: C++ Essentials',
      description: 'Understand C++ structure, type safety, variables, and console output.',
      sessions: [
        {
          id: 'cpp_s1',
          title: 'C++ Syntax & Cout',
          estimatedTime: '60s',
          slideContent: [
            'C++ is a highly popular compile-time, typed language!',
            'Every program starts with a `#include <iostream>` library directive and a `main()` function.',
            'To print text, we use `std::cout` and the stream insertion operator `<<`. Semicolons are mandatory!',
            'Example:\n```cpp\n#include <iostream>\nint main() {\n    std::cout << "Hi!";\n    return 0;\n}\n```'
          ],
          taskDescription: 'Write a simple C++ code that outputs `"Hello C++"` to the terminal. Make sure to end the statement with `<< std::endl;` and a semicolon.',
          starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write code below\n    \n    return 0;\n}',
          solutionTemplate: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello C++" << endl;\n    return 0;\n}'
        },
        {
          id: 'cpp_s2',
          title: 'Static Data Types',
          estimatedTime: '60s',
          slideContent: [
            'Unlike Python, C++ requires you to explicitly declare variable types!',
            'Common primitive types:',
            '- `int age = 21;` (integer)',
            '- `double price = 9.99;` (decimal/float)',
            '- `char grade = \'A\';` (single quote character)',
            '- `bool status = true;` (boolean)',
            '- `std::string name = "Ada";` (text in double quotes)'
          ],
          taskDescription: 'Declare an integer variable named `score` and assign it the value `100`. Declare a double variable named `average` with value `98.5`. Print `score` followed by a space, then `average`.',
          starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Declare variables and print them\n    \n    return 0;\n}',
          solutionTemplate: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int score = 100;\n    double average = 98.5;\n    cout << score << " " << average << endl;\n    return 0;\n}'
        },
        {
          id: 'cpp_s3',
          title: 'C++ Operators',
          estimatedTime: '50s',
          slideContent: [
            'C++ supports classic math operators: `+`, `-`, `*`, `/`, and `%` (modulus for division remainder).',
            'Integer division, e.g., `5 / 2` results in `2` because integers discard decimals. Use `double` for precision!',
            'Increment with `++` and decrement with `--`.',
            'Example:\n`int x = 10; x++;`'
          ],
          taskDescription: 'Write a statement to calculate the remainder of `17` divided by `5` using the modulus operator. Store it in an integer named `remainder` and print it.',
          starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Solve remainder of 17 % 5 and print\n    \n    return 0;\n}',
          solutionTemplate: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int remainder = 17 % 5;\n    cout << remainder << endl;\n    return 0;\n}'
        }
      ]
    },
    {
      id: 'cpp_ch2',
      title: 'Chapter 2: Decisions & Iteration',
      description: 'Master logical control flows, conditions, and while/for loops in C++.',
      sessions: [
        {
          id: 'cpp_s4',
          title: 'If-Else Conditions',
          estimatedTime: '60s',
          slideContent: [
            'Conditions are placed inside parentheses `()` and the block inside curly braces `{}`.',
            'Use standard relational operators: `==` (equal), `!=` (not equal), `>`, `<`, `>=`, `<=`.',
            'Example:\n```cpp\nif (age >= 18) {\n    cout << "Adult";\n} else {\n    cout << "Minor";\n}\n```'
          ],
          taskDescription: 'Write an if-else statement. Given integer `age = 16`, if `age` is greater than or equal to 18, print `"Allowed"`. Otherwise, print `"Denied"`.',
          starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int age = 16;\n    // Write if-else below\n    \n    return 0;\n}',
          solutionTemplate: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int age = 16;\n    if (age >= 18) {\n        cout << "Allowed" << endl;\n    } else {\n        cout << "Denied" << endl;\n    }\n    return 0;\n}'
        },
        {
          id: 'cpp_s5',
          title: 'For Loops',
          estimatedTime: '60s',
          slideContent: [
            'C++ for loops group initialisation, condition, and increment inside parentheses.',
            'Format:\n`for (initialization; condition; increment)`',
            'Example:\n```cpp\nfor (int i = 0; i < 3; i++) {\n    cout << i; // prints 012\n}\n```'
          ],
          taskDescription: 'Write a `for` loop that prints numbers from `1` up to and including `5` on the same line, separated by spaces.',
          starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your for loop below\n    \n    return 0;\n}',
          solutionTemplate: '#include <iostream>\nusing namespace std;\n\nint main() {\n    for (int i = 1; i <= 5; i++) {\n        cout << i << " ";\n    }\n    cout << endl;\n    return 0;\n}'
        },
        {
          id: 'cpp_s6',
          title: 'While Loops',
          estimatedTime: '55s',
          slideContent: [
            'A C++ `while` loop runs code blocks as long as the test condition remains true.',
            'Syntax:\n`while (condition) { ... }`',
            'Make sure variables change inside the loop to avoid infinite execution.',
            'Example:\n`int i = 0; while (i < 3) { i++; }`'
          ],
          taskDescription: 'Write a while loop that starts with `int x = 3;` and prints `x` and decrements it while `x > 0`. Output should be `"3 2 1 "` (with trailing spaces).',
          starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int x = 3;\n    // Write while loop below\n    \n    return 0;\n}',
          solutionTemplate: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int x = 3;\n    while (x > 0) {\n        cout << x << " ";\n        x--;\n    }\n    return 0;\n}'
        }
      ]
    },
    {
      id: 'cpp_ch3',
      title: 'Chapter 3: Functions & Arrays',
      description: 'Declare reusable functions, configure parameters, and learn pointers.',
      sessions: [
        {
          id: 'cpp_s7',
          title: 'Functions & Returns',
          estimatedTime: '60s',
          slideContent: [
            'Functions must specify the return type. If they do not return anything, use `void`.',
            'They must be declared before they are called (usually above `main()`).',
            'Example:\n```cpp\nint add(int a, int b) {\n    return a + b;\n}\n```'
          ],
          taskDescription: 'Write a function named `multiply` above `main` that takes two integers as parameters and returns their product. In `main`, call `multiply(4, 5)` and print the result.',
          starterCode: '#include <iostream>\nusing namespace std;\n\n// Declare your function here\n\nint main() {\n    // Call and print\n    \n    return 0;\n}',
          solutionTemplate: '#include <iostream>\nusing namespace std;\n\nint multiply(int a, int b) {\n    return a * b;\n}\n\nint main() {\n    cout << multiply(4, 5) << endl;\n    return 0;\n}'
        },
        {
          id: 'cpp_s8',
          title: 'Fixed Arrays',
          estimatedTime: '55s',
          slideContent: [
            'An array stores multiple values of the SAME type in a contiguous block.',
            'Specify the size on declaration: `int numbers[3] = {1, 2, 3};`. Size cannot change!',
            'Access items using indices: `numbers[0] = 5;`.'
          ],
          taskDescription: 'Declare an integer array named `arr` of size 4 with values `10, 20, 30, 40`. Print the sum of the first item (index 0) and the last item (index 3).',
          starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    \n    return 0;\n}',
          solutionTemplate: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int arr[4] = {10, 20, 30, 40};\n    cout << arr[0] + arr[3] << endl;\n    return 0;\n}'
        },
        {
          id: 'cpp_s9',
          title: 'Introduction to Pointers',
          estimatedTime: '60s',
          slideContent: [
            'A pointer is a variable that stores the MEMORY ADDRESS of another variable!',
            'Use `&` to get the address of a variable, and `*` to declare a pointer or dereference it.',
            'Example:\n```cpp\nint val = 5;\nint* ptr = &val;\ncout << *ptr; // prints 5\n```'
          ],
          taskDescription: 'Create an integer variable `num = 42`. Create an integer pointer `p` pointing to `num`. Print the value of `num` by dereferencing pointer `p`.',
          starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write pointers code below\n    \n    return 0;\n}',
          solutionTemplate: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int num = 42;\n    int* p = &num;\n    cout << *p << endl;\n    return 0;\n}'
        }
      ]
    },
    {
      id: 'cpp_ch4',
      title: 'Chapter 4: Object-Oriented C++',
      description: 'Create OOP blueprints with classes, access specifiers, and constructors.',
      sessions: [
        {
          id: 'cpp_s10',
          title: 'C++ Classes & Public',
          estimatedTime: '60s',
          slideContent: [
            'C++ defines classes using the `class` keyword, followed by curly braces and a required SEMICOLON `;`.',
            'Access specifiers like `public:` or `private:` determine who can read/write attributes.',
            'Example:\n```cpp\nclass User {\npublic:\n    string name;\n};\n```'
          ],
          taskDescription: 'Create a class named `Student` with a public string attribute `name`. In `main`, create an instance of `Student` named `s`, assign `"Bob"` to its `name` attribute, and print `s.name`.',
          starterCode: '#include <iostream>\n#include <string>\nusing namespace std;\n\n// Create class Student below\n\nint main() {\n    // Create instance and print name\n    \n    return 0;\n}',
          solutionTemplate: '#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Student {\npublic:\n    string name;\n};\n\nint main() {\n    Student s;\n    s.name = "Bob";\n    cout << s.name << endl;\n    return 0;\n}'
        },
        {
          id: 'cpp_s11',
          title: 'Constructors',
          estimatedTime: '60s',
          slideContent: [
            'A constructor is a special method called automatically when an object is created.',
            'It must have the exact same name as the class and no return type.',
            'Example:\n```cpp\nclass Person {\npublic:\n    string name;\n    Person(string n) { name = n; }\n};\n```'
          ],
          taskDescription: 'Define a class `Product` with public attributes `name` (string) and `price` (double). Create a constructor that takes parameters to initialize both attributes. In `main`, instantiate a product `"Coffee"` at `4.99`, and print its price.',
          starterCode: '#include <iostream>\n#include <string>\nusing namespace std;\n\n// Create Product class here\n\nint main() {\n    // Instantiate and print price\n    \n    return 0;\n}',
          solutionTemplate: '#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Product {\npublic:\n    string name;\n    double price;\n    Product(string n, double p) {\n        name = n;\n        price = p;\n    }\n};\n\nint main() {\n    Product p("Coffee", 4.99);\n    cout << p.price << endl;\n    return 0;\n}'
        },
        {
          id: 'cpp_s12',
          title: 'Class Methods',
          estimatedTime: '60s',
          slideContent: [
            'Methods are functions defined inside classes. They have full access to class members.',
            'They can return values or be `void`.',
            'Example:\n```cpp\nclass Speaker {\npublic:\n    void speak() { cout << "Hello!"; }\n};\n```'
          ],
          taskDescription: 'Define a class `Circle` with public double attribute `radius`. Add a method `getArea()` that returns the area of the circle (`3.14 * radius * radius`). In `main`, instantiate a Circle with radius `5.0`, and print its area.',
          starterCode: '#include <iostream>\nusing namespace std;\n\n// Define Circle class here\n\nint main() {\n    // Instantiate with radius 5.0 and print area\n    \n    return 0;\n}',
          solutionTemplate: '#include <iostream>\nusing namespace std;\n\nclass Circle {\npublic:\n    double radius;\n    double getArea() {\n        return 3.14 * radius * radius;\n    }\n};\n\nint main() {\n    Circle c;\n    c.radius = 5.0;\n    cout << c.getArea() << endl;\n    return 0;\n}'
        }
      ]
    }
  ],
  java: [
    {
      id: 'java_ch1',
      title: 'Chapter 1: Java Core foundations',
      description: 'Learn Java class structure, static entry point main, variables, and output.',
      sessions: [
        {
          id: 'java_s1',
          title: 'Java Class & Main',
          estimatedTime: '60s',
          slideContent: [
            'Java is a fully object-oriented, structured, robust language.',
            'Every block of code must exist inside a Class. The entry point is ALWAYS:\n`public static void main(String[] args)`',
            'To print text, we call `System.out.println()`. Semicolons are strict!',
            'Example:\n```java\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Java!");\n    }\n}\n```'
          ],
          taskDescription: 'Write a complete Java class named `Main` that prints `"Hello Java"` to the terminal.',
          starterCode: 'public class Main {\n    public static void main(String[] args) {\n        // Write code below\n        \n    }\n}',
          solutionTemplate: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello Java");\n    }\n}'
        },
        {
          id: 'java_s2',
          title: 'Strong Typing',
          estimatedTime: '60s',
          slideContent: [
            'Java is strongly typed—each variable has a predefined fixed type.',
            'Core types:',
            '- `int count = 5;` (integers)',
            '- `double temp = 36.6;` (decimals)',
            '- `boolean isActive = true;` (booleans)',
            '- `String name = "Grace";` (text)',
            'Tip: String begins with an uppercase S!'
          ],
          taskDescription: 'Declare a String variable `language` set to `"Java"` and an integer variable `version` set to `17`. Print `"Learning " + language + " version " + version`.',
          starterCode: 'public class Main {\n    public static void main(String[] args) {\n        // Declare and print below\n        \n    }\n}',
          solutionTemplate: 'public class Main {\n    public static void main(String[] args) {\n        String language = "Java";\n        int version = 17;\n        System.out.println("Learning " + language + " version " + version);\n    }\n}'
        },
        {
          id: 'java_s3',
          title: 'String Operations',
          estimatedTime: '55s',
          slideContent: [
            'In Java, Strings are object references with built-in helper methods.',
            '- Use `.length()` to get character count.',
            '- Use `.toUpperCase()` or `.toLowerCase()` for transformations.',
            '- Concatenate with the `+` operator.',
            'Example:\n`String greeting = "hi".toUpperCase();`'
          ],
          taskDescription: 'Create a String named `text` with value `"code"`. Print its length, followed by its uppercase version on a new line.',
          starterCode: 'public class Main {\n    public static void main(String[] args) {\n        String text = "code";\n        // Print text length and uppercase form\n        \n    }\n}',
          solutionTemplate: 'public class Main {\n    public static void main(String[] args) {\n        String text = "code";\n        System.out.println(text.length());\n        System.out.println(text.toUpperCase());\n    }\n}'
        }
      ]
    },
    {
      id: 'java_ch2',
      title: 'Chapter 2: Decisive Logic & Iteration',
      description: 'Master comparisons, if-else statements, and looping mechanisms in Java.',
      sessions: [
        {
          id: 'java_s4',
          title: 'Conditional If-Else',
          estimatedTime: '60s',
          slideContent: [
            'Java if statements execute conditional logic blocks.',
            'Example:\n```java\nif (speed > 60) {\n    System.out.println("Fast");\n} else {\n    System.out.println("Normal");\n}\n```',
            'Conditions require parentheses `()` and brace blocks `{}`.'
          ],
          taskDescription: 'Given integer `score = 85`, write an if-else block. If `score` is greater than or equal to 80, print `"Pass"`. Otherwise, print `"Fail"`.',
          starterCode: 'public class Main {\n    public static void main(String[] args) {\n        int score = 85;\n        // Write if-else below\n        \n    }\n}',
          solutionTemplate: 'public class Main {\n    public static void main(String[] args) {\n        int score = 85;\n        if (score >= 80) {\n            System.out.println("Pass");\n        } else {\n            System.out.println("Fail");\n        }\n    }\n}'
        },
        {
          id: 'java_s5',
          title: 'For Loops',
          estimatedTime: '60s',
          slideContent: [
            'Java for loops operate identically to C++.',
            'Provide: `for (start; condition; update) { ... }`.',
            'Example:\n```java\nfor (int i = 0; i < 3; i++) {\n    System.out.println(i);\n}\n```'
          ],
          taskDescription: 'Write a for loop that prints the integers 10 down to 8. (Output should be 10, 9, 8 on separate lines).',
          starterCode: 'public class Main {\n    public static void main(String[] args) {\n        // Write for loop below\n        \n    }\n}',
          solutionTemplate: 'public class Main {\n    public static void main(String[] args) {\n        for (int i = 10; i >= 8; i--) {\n            System.out.println(i);\n        }\n    }\n}'
        },
        {
          id: 'java_s6',
          title: 'While Loops',
          estimatedTime: '50s',
          slideContent: [
            'While loops execute continuously as long as their condition is true.',
            'Example:\n```java\nint count = 1;\nwhile (count < 4) {\n    System.out.print(count + " ");\n    count++;\n}\n```'
          ],
          taskDescription: 'Create a while loop that starts at `int val = 1;` and prints `val` followed by a space, while `val <= 3`. The output should be `"1 2 3 "`. Increment `val` in the loop.',
          starterCode: 'public class Main {\n    public static void main(String[] args) {\n        int val = 1;\n        // Write while loop below\n        \n    }\n}',
          solutionTemplate: 'public class Main {\n    public static void main(String[] args) {\n        int val = 1;\n        while (val <= 3) {\n            System.out.print(val + " ");\n            val++;\n        }\n    }\n}'
        }
      ]
    },
    {
      id: 'java_ch3',
      title: 'Chapter 3: Structuring & Methods',
      description: 'Write static methods, return calculations, and declare arrays.',
      sessions: [
        {
          id: 'java_s7',
          title: 'Methods in Java',
          estimatedTime: '60s',
          slideContent: [
            'To call a method directly from `main` without creating an object, declare it as `static`.',
            'Specify the return type and parameter types.',
            'Example:\n```java\npublic static int add(int x, int y) {\n    return x + y;\n}\n```'
          ],
          taskDescription: 'Write a static method named `cube` above `main` that takes an integer `n` and returns `n * n * n`. In `main`, print `cube(3)`.',
          starterCode: 'public class Main {\n    // Write your cube method here\n    \n    public static void main(String[] args) {\n        // Call cube(3) and print\n        \n    }\n}',
          solutionTemplate: 'public class Main {\n    public static int cube(int n) {\n        return n * n * n;\n    }\n    \n    public static void main(String[] args) {\n        System.out.println(cube(3));\n    }\n}'
        },
        {
          id: 'java_s8',
          title: 'Fixed Arrays',
          estimatedTime: '55s',
          slideContent: [
            'In Java, declare arrays using square brackets: `int[] numbers = {1, 2, 3};`.',
            'Access their length property using `.length` (note: no parentheses!).',
            'Example:\n`System.out.println(numbers.length);`'
          ],
          taskDescription: 'Declare a String array named `colors` containing `"Red"`, `"Green"`, `"Blue"`. Print the second element (index 1) followed by a space, and then print the size of the array.',
          starterCode: 'public class Main {\n    public static void main(String[] args) {\n        // Declare array colors and print requirements\n        \n    }\n}',
          solutionTemplate: 'public class Main {\n    public static void main(String[] args) {\n        String[] colors = {"Red", "Green", "Blue"};\n        System.out.println(colors[1] + " " + colors.length);\n    }\n}'
        },
        {
          id: 'java_s9',
          title: 'ArrayList (Dynamic Lists)',
          estimatedTime: '60s',
          slideContent: [
            'Standard arrays are fixed-size. `ArrayList` is a class that grows dynamically!',
            'Import it: `import java.util.ArrayList;`.',
            '- Add item: `list.add("Item");`',
            '- Retrieve item: `list.get(index);`',
            '- Get size: `list.size();`'
          ],
          taskDescription: 'Create an ArrayList of Strings named `animals`. Add `"Cat"` and `"Dog"` to it. Print the item at index 0 followed by a space and then the size of the list.',
          starterCode: 'import java.util.ArrayList;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Create list, add animals, print values\n        \n    }\n}',
          solutionTemplate: 'import java.util.ArrayList;\n\npublic class Main {\n    public static void main(String[] args) {\n        ArrayList<String> animals = new ArrayList<>();\n        animals.add("Cat");\n        animals.add("Dog");\n        System.out.println(animals.get(0) + " " + animals.size());\n    }\n}'
        }
      ]
    },
    {
      id: 'java_ch4',
      title: 'Chapter 4: Object-Oriented Java',
      description: 'Design custom classes, configure instance fields, and implement constructors.',
      sessions: [
        {
          id: 'java_s10',
          title: 'Custom Classes',
          estimatedTime: '60s',
          slideContent: [
            'Java classes group state (fields) and behaviors (methods).',
            'Fields are variables defined inside the class block but outside any methods.',
            'Example:\n```java\nclass Person {\n    String name;\n}\n```'
          ],
          taskDescription: 'Create a separate class `Car` (below or above class Main) with attributes `String brand` and `int year`. In `Main.main`, instantiate `Car c = new Car();`, set brand to `"Tesla"` and year to `2022`, and print `"Brand: " + c.brand`.',
          starterCode: 'class Car {\n    // Define brand and year attributes\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // Instantiate, set values, print\n        \n    }\n}',
          solutionTemplate: 'class Car {\n    String brand;\n    int year;\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Car c = new Car();\n        c.brand = "Tesla";\n        c.year = 2022;\n        System.out.println("Brand: " + c.brand);\n    }\n}'
        },
        {
          id: 'java_s11',
          title: 'Class Constructors',
          estimatedTime: '60s',
          slideContent: [
            'Constructors initialize new objects. They must have the same name as the class and no return type.',
            'Example:\n```java\nclass Cat {\n    String name;\n    Cat(String n) {\n        name = n;\n    }\n}\n```'
          ],
          taskDescription: 'Define a class `Laptop` with constructor taking a parameter to initialize `String brand`. Instantiate a Laptop named `"Dell"` and print its brand.',
          starterCode: 'class Laptop {\n    String brand;\n    // Define constructor here\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // Instantiate and print brand\n        \n    }\n}',
          solutionTemplate: 'class Laptop {\n    String brand;\n    Laptop(String b) {\n        brand = b;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Laptop l = new Laptop("Dell");\n        System.out.println(l.brand);\n    }\n}'
        },
        {
          id: 'java_s12',
          title: 'Getter and Setter Methods',
          estimatedTime: '60s',
          slideContent: [
            'Encapsulation hides data fields using `private` and exposes access through public `get` and `set` methods.',
            'Example:\n```java\nclass User {\n    private String name;\n    public String getName() { return name; }\n    public void setName(String n) { this.name = n; }\n}\n```'
          ],
          taskDescription: 'Create a class `Employee` with a private double attribute `salary`. Add public getter and setter methods for `salary`. In `main`, instantiate Employee, set salary to `50000.0`, and print salary.',
          starterCode: 'class Employee {\n    private double salary;\n    // Create getter and setter here\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // Instantiate, set salary to 50000.0, and print salary\n        \n    }\n}',
          solutionTemplate: 'class Employee {\n    private double salary;\n    public double getSalary() {\n        return salary;\n    }\n    public void setSalary(double s) {\n        salary = s;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Employee emp = new Employee();\n        emp.setSalary(50000.0);\n        System.out.println(emp.getSalary());\n    }\n}'
        }
      ]
    }
  ]
};
