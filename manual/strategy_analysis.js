#!/usr/bin/env node

import { GenealogyTreeData } from '../public/utility/GenealogyTreeData.js';

console.log('=== MERGE STRATEGY ANALYSIS ===\n');

// Test different scenarios to understand strategy behaviors
const scenarios = [
  {
    name: 'Scenario A: One parent missing vs both parents different',
    person1: { name: 'Alex', mother: 'Mary', father: null },
    person2: { name: 'Alex', mother: 'Maria', father: 'John' }
  },
  {
    name: 'Scenario B: Partial overlap with conflicts',
    person1: { name: 'Beth', mother: 'Sarah', father: 'Tom' },
    person2: { name: 'Beth', mother: 'Sarah', father: 'Thomas' }
  },
  {
    name: 'Scenario C: Complete vs incomplete information',
    person1: { name: 'Carol', mother: null, father: null },
    person2: { name: 'Carol', mother: 'Linda', father: 'Mike' }
  },
  {
    name: 'Scenario D: Both incomplete but different',
    person1: { name: 'David', mother: 'Ann', father: null },
    person2: { name: 'David', mother: null, father: 'Bob' }
  },
  {
    name: 'Scenario E: Identical information',
    person1: { name: 'Eve', mother: 'Grace', father: 'Frank' },
    person2: { name: 'Eve', mother: 'Grace', father: 'Frank' }
  }
];

const strategies = ['keep-first', 'keep-second', 'combine-non-null', 'prefer-complete'];

scenarios.forEach((scenario, index) => {
  console.log(`${index + 1}. ${scenario.name}`);
  console.log(`   Person 1: mother="${scenario.person1.mother}", father="${scenario.person1.father}"`);
  console.log(`   Person 2: mother="${scenario.person2.mother}", father="${scenario.person2.father}"`);
  console.log('   Results:');

  const tree = new GenealogyTreeData({ persons: [] });

  strategies.forEach(strategy => {
    try {
      const result = tree.mergePerson(scenario.person1, scenario.person2, strategy);
      console.log(`     ${strategy.padEnd(18)}: mother="${result.mother}", father="${result.father}"`);
    } catch (error) {
      console.log(`     ${strategy.padEnd(18)}: ERROR - ${error.message}`);
    }
  });
  console.log();
});

// Test tree merge with different complexity levels
console.log('=== TREE MERGE COMPLEXITY ANALYSIS ===\n');

// Simple merge
console.log('1. Simple Merge (no conflicts)');
const simpleTree1 = new GenealogyTreeData({
  persons: [
    { name: 'Person A', mother: 'Mom A', father: null }
  ]
});
const simpleTree2 = new GenealogyTreeData({
  persons: [
    { name: 'Person B', mother: 'Mom B', father: 'Dad B' }
  ]
});

console.log(`Tree 1: ${simpleTree1.persons.length} persons`);
console.log(`Tree 2: ${simpleTree2.persons.length} persons`);
const simpleStats = simpleTree1.mergeTree(simpleTree2);
console.log(`After merge: ${simpleTree1.persons.length} persons`);
console.log(`Stats: merged=${simpleStats.merged}, added=${simpleStats.added}, conflicts=${simpleStats.conflicts.length}\n`);

// Medium complexity merge
console.log('2. Medium Complexity Merge (some overlap)');
const mediumTree1 = new GenealogyTreeData({
  persons: [
    { name: 'Alice', mother: 'Mother A', father: 'Father A' },
    { name: 'Bob', mother: 'Mother B', father: null },
    { name: 'Shared Person', mother: 'Original Mom', father: null }
  ]
});
const mediumTree2 = new GenealogyTreeData({
  persons: [
    { name: 'Charlie', mother: 'Mother C', father: 'Father C' },
    { name: 'Shared Person', mother: null, father: 'New Dad' },
    { name: 'Dave', mother: 'Mother D', father: 'Father D' }
  ]
});

console.log(`Tree 1: ${mediumTree1.persons.length} persons initially`);
console.log(`Tree 2: ${mediumTree2.persons.length} persons`);
const mediumStats = mediumTree1.mergeTree(mediumTree2);
console.log(`After merge: ${mediumTree1.persons.length} persons`);
console.log(`Stats: merged=${mediumStats.merged}, added=${mediumStats.added}, conflicts=${mediumStats.conflicts.length}`);
if (mediumStats.conflicts.length > 0) {
  mediumStats.conflicts.forEach(conflict => {
    console.log(`  Conflict: ${conflict.name} - resolved to mother="${conflict.resolved.mother}", father="${conflict.resolved.father}"`);
  });
}
console.log();

// High complexity merge with multiple conflicts
console.log('3. High Complexity Merge (multiple conflicts)');
const complexTree1 = new GenealogyTreeData({
  persons: [
    { name: 'John', mother: 'Mary Smith', father: 'James Smith' },
    { name: 'Jane', mother: 'Lisa Brown', father: 'Robert Brown' },
    { name: 'Common Person', mother: 'Mom 1', father: 'Dad 1' }
  ]
});
const complexTree2 = new GenealogyTreeData({
  persons: [
    { name: 'John', mother: 'Maria Gonzalez', father: 'Jose Gonzalez' },
    { name: 'Mike', mother: 'Sarah White', father: 'David White' },
    { name: 'Common Person', mother: 'Mom 2', father: 'Dad 2' }
  ]
});

console.log(`Tree 1: ${complexTree1.persons.length} persons initially`);
console.log(`Tree 2: ${complexTree2.persons.length} persons`);

strategies.forEach(strategy => {
  const testTree = new GenealogyTreeData({ persons: JSON.parse(JSON.stringify(complexTree1.persons)) });
  const stats = testTree.mergeTree(complexTree2, strategy);
  console.log(`  Strategy "${strategy}": merged=${stats.merged}, added=${stats.added}, conflicts=${stats.conflicts.length}`);

  if (stats.conflicts.length > 0) {
    stats.conflicts.forEach(conflict => {
      console.log(`    Conflict: ${conflict.name}`);
      console.log(`      Original: mother="${conflict.existing.mother}", father="${conflict.existing.father}"`);
      console.log(`      Incoming: mother="${conflict.incoming.mother}", father="${conflict.incoming.father}"`);
      console.log(`      Resolved: mother="${conflict.resolved.mother}", father="${conflict.resolved.father}"`);
    });
  }
});

console.log('\n=== PERFORMANCE & EDGE CASES ===\n');

// Large tree merge simulation
console.log('4. Large Tree Simulation');
const largeTree1 = new GenealogyTreeData({ persons: [] });
const largeTree2 = new GenealogyTreeData({ persons: [] });

// Generate some test data
for (let i = 1; i <= 20; i++) {
  largeTree1.addPerson({
    name: `Person ${i}`,
    mother: i % 3 === 0 ? `Mother ${i}` : null,
    father: i % 4 === 0 ? `Father ${i}` : null
  });
}

for (let i = 15; i <= 35; i++) {
  largeTree2.addPerson({
    name: `Person ${i}`,
    mother: i % 5 === 0 ? `Mother ${i}` : null,
    father: i % 3 === 0 ? `Father ${i}` : null
  });
}

console.log(`Large Tree 1: ${largeTree1.persons.length} persons`);
console.log(`Large Tree 2: ${largeTree2.persons.length} persons`);

const startTime = Date.now();
const largeStats = largeTree1.mergeTree(largeTree2, 'combine-non-null');
const endTime = Date.now();

console.log(`Merge completed in ${endTime - startTime}ms`);
console.log(`Result: ${largeTree1.persons.length} total persons`);
console.log(`Stats: merged=${largeStats.merged}, added=${largeStats.added}, conflicts=${largeStats.conflicts.length}`);

console.log('\n=== ANALYSIS COMPLETE ===');

// Summary of strategy characteristics
console.log('\n=== STRATEGY SUMMARY ===');
console.log('keep-first:       Always preserves the existing person\'s information');
console.log('keep-second:      Always uses the incoming person\'s information');
console.log('combine-non-null: Uses first non-null value for each field (existing takes precedence)');
console.log('prefer-complete:  Chooses the person with more complete information (more non-null fields)');
console.log('\nConflict Detection: Reports when both persons have different non-null values for the same field');
console.log('Reference Updates: Automatically adds placeholder entries for all referenced parent names');
