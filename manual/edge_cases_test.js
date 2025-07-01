#!/usr/bin/env node

import { GenealogyData } from '../public/utility/GenealogyData.js';

console.log('=== EDGE CASES & CONSIDERATIONS ===\n');

// Test Case 1: Circular relationships (should be handled gracefully)
console.log('1. Testing circular relationship handling');
const circularTree1 = new GenealogyData({
  persons: [
    { name: 'Alice', mother: 'Bob', father: null },
    { name: 'Bob', mother: 'Alice', father: null }
  ]
});

const circularTree2 = new GenealogyData({
  persons: [
    { name: 'Charlie', mother: 'Alice', father: 'Bob' }
  ]
});

console.log('Tree 1 (circular):');
circularTree1.persons.forEach(p => console.log(`  ${p.name}: mother=${p.mother}, father=${p.father}`));

console.log('Tree 2:');
circularTree2.persons.forEach(p => console.log(`  ${p.name}: mother=${p.mother}, father=${p.father}`));

const circularStats = circularTree1.mergeTree(circularTree2);
console.log(`Merge result: merged=${circularStats.merged}, added=${circularStats.added}, conflicts=${circularStats.conflicts.length}`);
console.log('Final tree:');
circularTree1.persons.forEach(p => console.log(`  ${p.name}: mother=${p.mother}, father=${p.father}`));
console.log();

// Test Case 2: Same person as both mother and father (unusual but possible in data errors)
console.log('2. Testing same person as both parents');
const sameParentTree = new GenealogyData({ persons: [] });
try {
  const result = sameParentTree.mergePerson(
    { name: 'Child', mother: 'Parent', father: 'Parent' },
    { name: 'Child', mother: 'Parent', father: 'Different Parent' },
    'combine-non-null'
  );
  console.log(`Result: mother=${result.mother}, father=${result.father}`);
} catch (error) {
  console.log(`Error: ${error.message}`);
}
console.log();

// Test Case 3: Very long names and special characters
console.log('3. Testing special characters and long names');
const specialTree1 = new GenealogyData({
  persons: [
    { name: 'José María García-López', mother: 'María José', father: null },
    { name: 'O\'Connor-Smith', mother: null, father: 'Patrick O\'Connor' }
  ]
});

const specialTree2 = new GenealogyData({
  persons: [
    { name: 'José María García-López', mother: null, father: 'Juan García' },
    { name: 'Zhang Wei (张伟)', mother: 'Li Mei', father: 'Zhang Jun' }
  ]
});

console.log('Special characters merge:');
const specialStats = specialTree1.mergeTree(specialTree2);
console.log(`Stats: merged=${specialStats.merged}, added=${specialStats.added}, conflicts=${specialStats.conflicts.length}`);
specialTree1.persons.forEach(p => {
  if (p.name.includes('José') || p.name.includes('Zhang')) {
    console.log(`  ${p.name}: mother=${p.mother}, father=${p.father}`);
  }
});
console.log();

// Test Case 4: Empty strings vs null values
console.log('4. Testing empty strings vs null values');
const emptyStringTree = new GenealogyData({ persons: [] });
try {
  const result1 = emptyStringTree.mergePerson(
    { name: 'Test', mother: '', father: null },
    { name: 'Test', mother: null, father: '' },
    'combine-non-null'
  );
  console.log(`Empty string result: mother="${result1.mother}", father="${result1.father}"`);

  const result2 = emptyStringTree.mergePerson(
    { name: 'Test2', mother: '', father: 'Dad' },
    { name: 'Test2', mother: 'Mom', father: '' },
    'combine-non-null'
  );
  console.log(`Mixed empty/values: mother="${result2.mother}", father="${result2.father}"`);
} catch (error) {
  console.log(`Error: ${error.message}`);
}
console.log();

// Test Case 5: Memory usage with large merges
console.log('5. Memory and performance considerations');
const largeTree1 = new GenealogyData({ persons: [] });
const largeTree2 = new GenealogyData({ persons: [] });

// Create larger test data
for (let i = 1; i <= 100; i++) {
  largeTree1.addPerson({
    name: `Person-${i}`,
    mother: i % 3 === 0 ? `Mother-${i}` : null,
    father: i % 4 === 0 ? `Father-${i}` : null
  });
}

for (let i = 80; i <= 200; i++) {
  largeTree2.addPerson({
    name: `Person-${i}`,
    mother: i % 5 === 0 ? `Mother-${i}-v2` : null,
    father: i % 3 === 0 ? `Father-${i}-v2` : null
  });
}

console.log(`Large Tree 1: ${largeTree1.persons.length} persons`);
console.log(`Large Tree 2: ${largeTree2.persons.length} persons`);

const startTime = Date.now();
const largeStats = largeTree1.mergeTree(largeTree2, 'combine-non-null');
const endTime = Date.now();

console.log(`Large merge completed in ${endTime - startTime}ms`);
console.log(`Final tree: ${largeTree1.persons.length} persons`);
console.log(`Stats: merged=${largeStats.merged}, added=${largeStats.added}, conflicts=${largeStats.conflicts.length}`);
console.log();

// Test Case 6: Multiple consecutive merges
console.log('6. Testing multiple consecutive merges');
const baseTree = new GenealogyData({
  persons: [{ name: 'Base Person', mother: null, father: null }]
});

const trees = [];
for (let i = 1; i <= 5; i++) {
  trees.push(new GenealogyData({
    persons: [
      { name: 'Base Person', mother: i % 2 === 0 ? `Mom-${i}` : null, father: i % 3 === 0 ? `Dad-${i}` : null },
      { name: `Person-${i}`, mother: `Mom-${i}`, father: `Dad-${i}` }
    ]
  }));
}

console.log(`Starting with ${baseTree.persons.length} persons`);
let totalStats = { merged: 0, added: 0, conflicts: 0 };

trees.forEach((tree, index) => {
  const stats = baseTree.mergeTree(tree, 'combine-non-null');
  totalStats.merged += stats.merged;
  totalStats.added += stats.added;
  totalStats.conflicts += stats.conflicts.length;
  console.log(`After merge ${index + 1}: ${baseTree.persons.length} persons (merged: ${stats.merged}, added: ${stats.added})`);
});

console.log(`Total stats: merged=${totalStats.merged}, added=${totalStats.added}, conflicts=${totalStats.conflicts}`);

// Check final state of Base Person
const basePerson = baseTree.persons.find(p => p.name === 'Base Person');
console.log(`Final Base Person: mother=${basePerson.mother}, father=${basePerson.father}`);
console.log();

// Test Case 7: Error recovery and validation
console.log('7. Error handling and recovery');
const errorTree = new GenealogyData({ persons: [{ name: 'Valid', mother: null, father: null }] });

try {
  errorTree.mergeTree(null);
} catch (error) {
  console.log(`✓ Null tree error handled: ${error.message}`);
}

try {
  errorTree.mergeTree({ persons: [] });
} catch (error) {
  console.log(`✓ Invalid tree type error handled: ${error.message}`);
}

try {
  errorTree.mergePerson(null, { name: 'Test', mother: null, father: null });
} catch (error) {
  console.log(`✓ Null person error handled: ${error.message}`);
}

try {
  errorTree.mergePerson(
    { name: 'Alice', mother: null, father: null },
    { name: 'Bob', mother: null, father: null }
  );
} catch (error) {
  console.log(`✓ Different names error handled: ${error.message}`);
}

console.log(`Tree still functional after errors: ${errorTree.persons.length} persons`);
console.log();

console.log('=== RECOMMENDATIONS ===');
console.log('1. Performance: Merge operations are O(n*m) where n=existing persons, m=incoming persons');
console.log('2. Memory: Each merge creates new person objects, consider cleanup for large operations');
console.log('3. Data Quality: Consider validation for circular relationships in genealogy data');
console.log('4. UI Considerations: Conflict reporting allows users to review merge decisions');
console.log('5. Strategy Selection: combine-non-null is safest for most use cases');
console.log('6. Reference Management: updateReferences=true ensures data consistency but increases processing time');
console.log();
