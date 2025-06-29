// Decode specific answers
const q10_answer = Buffer.from('ezV9', 'base64').toString('utf-8');
const q20_answer = Buffer.from('eCDiiaUg4oiSMw==', 'base64').toString('utf-8');

console.log('Q10 answer:', q10_answer);
console.log('Q20 answer:', q20_answer);

// Check the questions
console.log('\nQ10 question: 2^(x-5) = 1 where x ∈');
console.log('Q10 options: ["5", "R−{5}", "IR", "{5}"]');
console.log('Q10 correct answer:', q10_answer);

console.log('\nQ20 question: The number 3 belongs to the solution set of the inequality');
console.log('Q20 options: ["x > 3", "x < 3", "x ≥ −3", "−x ≥ 3"]');
console.log('Q20 correct answer:', q20_answer);

// Test and print the decoded answers for Q24, Q26, and Q30
const q24 = Buffer.from('NGE=', 'base64').toString('utf-8');
const q26 = Buffer.from('4oqG', 'base64').toString('utf-8');
const q30 = Buffer.from('e+KIkjUsM30=', 'base64').toString('utf-8');

console.log('Q24 decoded:', q24); // Should be '4a'
console.log('Q26 decoded:', q26); // Should be '⊆'
console.log('Q30 decoded:', q30); // Should be '{−5,3}' 