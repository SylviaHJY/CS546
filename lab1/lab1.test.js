const lab1 = require('./lab1');

//TODO: Write and call each function in lab1.js 5 times each, passing in different input
console.log(lab1.questionOne([5, 3, 10]));  // Returns and then outputs [true, true, false]
console.log(lab1.questionOne([2, 1, 2])); // Returns and then outputs[true, false, true] 
console.log(lab1.questionOne([512, 1007, 17389])); //Returns and then outputs [false, false, true]
console.log(lab1.questionOne([0, 14159, 785])); //Returns and then outputs [false, true, false]
console.log(lab1.questionOne([11, 4])); //Returns and then outputs [true, false]

console.log(lab1.questionTwo(5, 3, 10));  // Returns and then outputs 147620 
console.log(lab1.questionTwo(2, 0, 2)); // Returns and then outputs 0 
console.log(lab1.questionTwo(512, 1007, -5)); //Returns and then outputs NaN
console.log(lab1.questionTwo(2, 10, 4)); //Returns and then outputs 2222
console.log(lab1.questionTwo(175, 3, 5)); //Returns and then outputs 21175 

console.log(lab1.questionThree("How now brown cow"));  // Returns and then outputs 10
console.log(lab1.questionThree("Welcome to CS-546")); // Returns and then outputs 7 
console.log(lab1.questionThree("JavaScript is fun!")); //Returns and then outputs 10
console.log(lab1.questionThree("Come on we are computer science."));
console.log(lab1.questionThree("I like JavaScript."));

console.log(lab1.questionFour("hello world", "o"));  // Returns and then outputs 2
console.log(lab1.questionFour("Helllllllo, class!", "ll")); // Returns and then outputs 3 
console.log(lab1.questionFour("helllollllll","llo"));
console.log(lab1.questionFour("abbbcdeffggh","bbc"));
console.log(lab1.questionFour("sooooootrueee","ooo"));