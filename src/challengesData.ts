import { Language } from './types';

export interface Challenge {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  xpReward: number;
  description: string;
  starterCode: string;
  solutionTemplate: string;
}

export const CHALLENGES: Record<Language, Challenge[]> = {
  python: [
    {
      id: 'py_chal1',
      title: 'String Reverser',
      difficulty: 'Easy',
      xpReward: 150,
      description: 'Write a python function `reverse_string(text)` that takes a string input and returns the reversed string.\n\nExample:\n`reverse_string("hello")` should return `"olleh"`.',
      starterCode: 'def reverse_string(text):\n    # Write your code here\n    pass\n',
      solutionTemplate: 'def reverse_string(text):\n    return text[::-1]'
    },
    {
      id: 'py_chal2',
      title: 'FizzBuzz List generator',
      difficulty: 'Medium',
      xpReward: 250,
      description: 'Write a python function `fizzbuzz_list(n)` that returns a list of strings from 1 to n.\n- For multiples of 3, add "Fizz"\n- For multiples of 5, add "Buzz"\n- For multiples of both, add "FizzBuzz"\n- Otherwise, add the number as a string.\n\nExample:\n`fizzbuzz_list(5)` should return `["1", "2", "Fizz", "4", "Buzz"]`.',
      starterCode: 'def fizzbuzz_list(n):\n    # Write your code here\n    pass\n',
      solutionTemplate: 'def fizzbuzz_list(n):\n    result = []\n    for i in range(1, n + 1):\n        if i % 3 == 0 and i % 5 == 0:\n            result.append("FizzBuzz")\n        elif i % 3 == 0:\n            result.append("Fizz")\n        elif i % 5 == 0:\n            result.append("Buzz")\n        else:\n            result.append(str(i))\n    return result'
    },
    {
      id: 'py_chal3',
      title: 'Dictionary Word Counter',
      difficulty: 'Hard',
      xpReward: 400,
      description: 'Write a python function `count_words(sentence)` that takes a sentence string and returns a dictionary of word frequencies. Convert all words to lowercase. Ignore punctuation.\n\nExample:\n`count_words("Hello world! Hello.")` should return `{"hello": 2, "world": 1}`.',
      starterCode: 'def count_words(sentence):\n    # Write your code here\n    pass\n',
      solutionTemplate: 'def count_words(sentence):\n    import re\n    words = re.findall(r\'\\w+\', sentence.lower())\n    freq = {}\n    for word in words:\n        freq[word] = freq.get(word, 0) + 1\n    return freq'
    }
  ],
  cpp: [
    {
      id: 'cpp_chal1',
      title: 'Sum Array Elements',
      difficulty: 'Easy',
      xpReward: 150,
      description: 'Write a C++ function `int sumArray(int arr[], int size)` that calculates and returns the sum of all elements in an integer array of a given size.\n\nExample:\n`sumArray({1, 2, 3}, 3)` should return `6`.',
      starterCode: 'int sumArray(int arr[], int size) {\n    // Write your code here\n    \n}\n',
      solutionTemplate: 'int sumArray(int arr[], int size) {\n    int sum = 0;\n    for(int i = 0; i < size; ++i) {\n        sum += arr[i];\n    }\n    return sum;\n}'
    },
    {
      id: 'cpp_chal2',
      title: 'Find Maximum Value',
      difficulty: 'Medium',
      xpReward: 250,
      description: 'Write a C++ function `int findMax(const std::vector<int>& vec)` that takes a vector of integers and returns the maximum element. Assume the vector is never empty.\n\nExample:\n`findMax({10, -5, 30, 20})` should return `30`.',
      starterCode: '#include <vector>\n#include <algorithm>\n\nint findMax(const std::vector<int>& vec) {\n    // Write your code here\n    \n}\n',
      solutionTemplate: 'int findMax(const std::vector<int>& vec) {\n    int m = vec[0];\n    for(int val : vec) {\n        if (val > m) m = val;\n    }\n    return m;\n}'
    },
    {
      id: 'cpp_chal3',
      title: 'String Palindrome Pointers',
      difficulty: 'Hard',
      xpReward: 400,
      description: 'Write a C++ function `bool isPalindrome(const std::string& s)` that checks if a string is a palindrome (reads the same forwards and backwards). Ignore case and ignore non-alphanumeric characters.\n\nExample:\n`isPalindrome("A man, a plan, a canal: Panama")` should return `true`.',
      starterCode: '#include <string>\n#include <cctype>\n\nbool isPalindrome(const std::string& s) {\n    // Write your code here\n    \n}\n',
      solutionTemplate: 'bool isPalindrome(const std::string& s) {\n    int left = 0;\n    int right = s.length() - 1;\n    while(left < right) {\n      while(left < right && !std::isalnum(s[left])) left++;\n      while(left < right && !std::isalnum(s[right])) right--;\n      if(std::tolower(s[left]) != std::tolower(s[right])) return false;\n      left++;\n      right--;\n    }\n    return true;\n}'
    }
  ],
  java: [
    {
      id: 'java_chal1',
      title: 'Fahrenheit to Celsius',
      difficulty: 'Easy',
      xpReward: 150,
      description: 'Write a Java method `double toCelsius(double fahrenheit)` inside a class helper that converts Fahrenheit degrees to Celsius.\nFormula: `(Fahrenheit - 32) * 5 / 9`.\n\nExample:\n`toCelsius(50)` should return `10.0`.',
      starterCode: 'public class TempConverter {\n    public static double toCelsius(double fahrenheit) {\n        // Write your code here\n        return 0.0;\n    }\n}\n',
      solutionTemplate: 'public class TempConverter {\n    public static double toCelsius(double fahrenheit) {\n        return (fahrenheit - 32.0) * 5.0 / 9.0;\n    }\n}'
    },
    {
      id: 'java_chal2',
      title: 'Recursive Factorial',
      difficulty: 'Medium',
      xpReward: 250,
      description: 'Write a Java recursive method `long factorial(int n)` that computes the factorial of non-negative integer n.\n\nExample:\n`factorial(5)` should return `120`.',
      starterCode: 'public class MathHelper {\n    public static long factorial(int n) {\n        // Write your code here\n        return 1;\n    }\n}\n',
      solutionTemplate: 'public class MathHelper {\n    public static long factorial(int n) {\n        if (n <= 1) return 1;\n        return n * factorial(n - 1);\n    }\n}'
    },
    {
      id: 'java_chal3',
      title: 'Array Duplicates Finder',
      difficulty: 'Hard',
      xpReward: 400,
      description: 'Write a Java method `java.util.List<Integer> findDuplicates(int[] arr)` that finds and returns a list containing all duplicates in the given integer array.\n\nExample:\n`findDuplicates(new int[]{1, 2, 3, 1, 4, 3})` should return a list with `[1, 3]` or `[3, 1]`.',
      starterCode: 'import java.util.*;\n\npublic class DuplicateFinder {\n    public static List<Integer> findDuplicates(int[] arr) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}\n',
      solutionTemplate: 'import java.util.*;\npublic class DuplicateFinder {\n    public static List<Integer> findDuplicates(int[] arr) {\n        Set<Integer> uniques = new HashSet<>();\n        Set<Integer> duplicates = new HashSet<>();\n        for (int num : arr) {\n            if (!uniques.add(num)) {\n                duplicates.add(num);\n            }\n        }\n        return new ArrayList<>(duplicates);\n    }\n}'
    }
  ]
};
