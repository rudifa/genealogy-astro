#!/usr/bin/env node

import { GenealogyData } from '../public/utility/GenealogyData.js';

console.log('=== GENEALOGY DATA MERGE TESTING ===\n');

// Helper function to display a tree nicely
function displayTree(tree, title) {
  console.log(`${title}:`);
  tree.persons.forEach(person => {
    const mother = person.mother ? `mother: ${person.mother}` : 'mother: null';
    const father = person.father ? `father: ${person.father}` : 'father: null';
    console.log(`  - ${person.name} (${mother}, ${father})`);
  });
  console.log(`  Total persons: ${tree.persons.length}\n`);
}

// Helper function to display merge stats
function displayMergeStats(stats) {
  console.log(`Merge Statistics:`);
  console.log(`  - Merged: ${stats.merged} persons`);
  console.log(`  - Added: ${stats.added} persons`);
  console.log(`  - Conflicts: ${stats.conflicts.length}`);
  if (stats.conflicts.length > 0) {
    stats.conflicts.forEach(conflict => {
      console.log(`    * ${conflict.name}:`);
      if (conflict.error) {
        console.log(`      Error: ${conflict.error}`);
      } else {
        console.log(`      Existing: mother=${conflict.existing.mother}, father=${conflict.existing.father}`);
        console.log(`      Incoming: mother=${conflict.incoming.mother}, father=${conflict.incoming.father}`);
        console.log(`      Resolved: mother=${conflict.resolved.mother}, father=${conflict.resolved.father}`);
      }
    });
  }
  console.log();
}

// Test Case 1: Basic merge with complementary information
console.log('🧪 TEST CASE 1: Basic merge with complementary information');
console.log('='.repeat(60));

const tree1 = new GenealogyData({
  persons: [
    { name: 'Alice', mother: 'Helen', father: null },
    { name: 'Bob', mother: null, father: 'Robert' }
  ]
});

const tree2 = new GenealogyData({
  persons: [
    { name: 'Alice', mother: null, father: 'Henry' },
    { name: 'Charlie', mother: 'Sarah', father: 'David' }
  ]
});

displayTree(tree1, 'Tree 1 (before merge)');
displayTree(tree2, 'Tree 2');

console.log('Strategy: combine-non-null');
const tree1Copy = new GenealogyData({ persons: JSON.parse(JSON.stringify(tree1.persons)) });
const stats1 = tree1Copy.mergeTree(tree2, 'combine-non-null');
displayMergeStats(stats1);
displayTree(tree1Copy, 'Result after merge');

// Test Case 2: Conflicting information with different strategies
console.log('🧪 TEST CASE 2: Conflicting information with different strategies');
console.log('='.repeat(60));

const conflictTree1 = new GenealogyData({
  persons: [
    { name: 'John', mother: 'Mary', father: 'Paul' },
    { name: 'Mary', mother: 'Grandma1', father: 'Grandpa1' }
  ]
});

const conflictTree2 = new GenealogyData({
  persons: [
    { name: 'John', mother: 'Maria', father: 'Paulo' },
    { name: 'Jane', mother: 'Anna', father: 'Mark' }
  ]
});

displayTree(conflictTree1, 'Conflict Tree 1');
displayTree(conflictTree2, 'Conflict Tree 2');

const strategies = ['keep-first', 'keep-second', 'combine-non-null', 'prefer-complete'];

strategies.forEach(strategy => {
  console.log(`--- Strategy: ${strategy} ---`);
  const testTree = new GenealogyData({ persons: JSON.parse(JSON.stringify(conflictTree1.persons)) });
  const stats = testTree.mergeTree(conflictTree2, strategy);
  displayMergeStats(stats);

  const john = testTree.persons.find(p => p.name === 'John');
  console.log(`John after merge: mother=${john.mother}, father=${john.father}\n`);
});

// Test Case 3: Complex family relationships
console.log('🧪 TEST CASE 3: Complex family relationships');
console.log('='.repeat(60));

const familyTree1 = new GenealogyData({
  persons: [
    { name: 'Child1', mother: 'Mom', father: 'Dad' },
    { name: 'Child2', mother: 'Mom', father: 'Dad' },
    { name: 'Mom', mother: 'Grandma', father: null }
  ]
});

const familyTree2 = new GenealogyData({
  persons: [
    { name: 'Child3', mother: 'Mom', father: 'Dad' },
    { name: 'Mom', mother: 'Grandma', father: 'Grandpa' },
    { name: 'Dad', mother: 'Other Grandma', father: 'Other Grandpa' }
  ]
});

displayTree(familyTree1, 'Family Tree 1');
displayTree(familyTree2, 'Family Tree 2');

console.log('Strategy: combine-non-null');
const mergedFamily = new GenealogyData({ persons: JSON.parse(JSON.stringify(familyTree1.persons)) });
const familyStats = mergedFamily.mergeTree(familyTree2, 'combine-non-null');
displayMergeStats(familyStats);
displayTree(mergedFamily, 'Merged Family Tree');

// Test Case 4: Person merge examples
console.log('🧪 TEST CASE 4: Individual person merge examples');
console.log('='.repeat(60));

const testTree = new GenealogyData({ persons: [] });

const personTests = [
  {
    desc: 'Complementary information',
    p1: { name: 'Alex', mother: 'Mom1', father: null },
    p2: { name: 'Alex', mother: null, father: 'Dad1' }
  },
  {
    desc: 'Conflicting mothers',
    p1: { name: 'Beth', mother: 'Mom1', father: 'Dad1' },
    p2: { name: 'Beth', mother: 'Mom2', father: 'Dad1' }
  },
  {
    desc: 'Different completeness levels',
    p1: { name: 'Carol', mother: 'Mom1', father: null },
    p2: { name: 'Carol', mother: 'Mom2', father: 'Dad2' }
  }
];

personTests.forEach((test, i) => {
  console.log(`Person Test ${i + 1}: ${test.desc}`);
  console.log(`Person 1: mother=${test.p1.mother}, father=${test.p1.father}`);
  console.log(`Person 2: mother=${test.p2.mother}, father=${test.p2.father}`);

  strategies.forEach(strategy => {
    try {
      const merged = testTree.mergePerson(test.p1, test.p2, strategy);
      console.log(`  ${strategy}: mother=${merged.mother}, father=${merged.father}`);
    } catch (error) {
      console.log(`  ${strategy}: ERROR - ${error.message}`);
    }
  });
  console.log();
});

// Test Case 5: Edge cases
console.log('🧪 TEST CASE 5: Edge cases');
console.log('='.repeat(60));

console.log('5a. Merging empty tree:');
const emptyTree = new GenealogyData({ persons: [] });
const nonEmptyTree = new GenealogyData({
  persons: [{ name: 'Solo', mother: null, father: null }]
});
displayTree(nonEmptyTree, 'Non-empty tree');
const emptyStats = nonEmptyTree.mergeTree(emptyTree);
displayMergeStats(emptyStats);
displayTree(nonEmptyTree, 'After merging empty tree');

console.log('5b. Self-merge (tree merging with itself):');
const selfTree = new GenealogyData({
  persons: [
    { name: 'Self1', mother: 'Mom', father: 'Dad' },
    { name: 'Self2', mother: 'Mom', father: null }
  ]
});
displayTree(selfTree, 'Self tree before');
const selfTreeCopy = new GenealogyData({ persons: JSON.parse(JSON.stringify(selfTree.persons)) });
const selfStats = selfTree.mergeTree(selfTreeCopy);
displayMergeStats(selfStats);
displayTree(selfTree, 'Self tree after self-merge');

console.log('5c. Merge without updating references:');
const noRefTree1 = new GenealogyData({
  persons: [{ name: 'Base', mother: null, father: null }]
});
const noRefTree2 = new GenealogyData({
  persons: [{ name: 'New', mother: 'Unknown Mom', father: 'Unknown Dad' }]
});
console.log(`Before merge (no ref update): ${noRefTree1.persons.length} persons`);
const noRefStats = noRefTree1.mergeTree(noRefTree2, 'combine-non-null', false);
console.log(`After merge (no ref update): ${noRefTree1.persons.length} persons`);
displayMergeStats(noRefStats);

const withRefTree1 = new GenealogyData({
  persons: [{ name: 'Base', mother: null, father: null }]
});
console.log(`Before merge (with ref update): ${withRefTree1.persons.length} persons`);
const withRefStats = withRefTree1.mergeTree(noRefTree2, 'combine-non-null', true);
console.log(`After merge (with ref update): ${withRefTree1.persons.length} persons`);
displayMergeStats(withRefStats);

console.log('=== TESTING COMPLETE ===');
