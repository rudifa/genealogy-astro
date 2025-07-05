#!/usr/bin/env node

import { GenealogyTreeData } from '../public/utility/GenealogyTreeData.js';

console.log('=== INTERACTIVE MERGE TESTING ===');
console.log('This script demonstrates various merge scenarios you can modify and test\n');

// Example usage function
function testMergeScenario(description, tree1Data, tree2Data, strategy = 'combine-non-null') {
  console.log(`🧪 ${description}`);
  console.log('─'.repeat(50));

  const tree1 = new GenealogyTreeData(tree1Data);
  const tree2 = new GenealogyTreeData(tree2Data);

  console.log('Tree 1:');
  tree1.persons.forEach(p => console.log(`  ${p.name} (mother: ${p.mother || 'null'}, father: ${p.father || 'null'})`));

  console.log('Tree 2:');
  tree2.persons.forEach(p => console.log(`  ${p.name} (mother: ${p.mother || 'null'}, father: ${p.father || 'null'})`));

  console.log(`\nMerging with strategy: ${strategy}`);
  const stats = tree1.mergeTree(tree2, strategy);

  console.log(`\nResults:`);
  console.log(`  Merged: ${stats.merged} persons`);
  console.log(`  Added: ${stats.added} persons`);
  console.log(`  Conflicts: ${stats.conflicts.length}`);

  if (stats.conflicts.length > 0) {
    console.log('  Conflict details:');
    stats.conflicts.forEach(conflict => {
      console.log(`    - ${conflict.name}:`);
      if (conflict.error) {
        console.log(`      Error: ${conflict.error}`);
      } else {
        console.log(`      Original: mother="${conflict.existing.mother}", father="${conflict.existing.father}"`);
        console.log(`      Incoming: mother="${conflict.incoming.mother}", father="${conflict.incoming.father}"`);
        console.log(`      Resolved: mother="${conflict.resolved.mother}", father="${conflict.resolved.father}"`);
      }
    });
  }

  console.log('\nFinal merged tree:');
  tree1.persons.forEach(p => console.log(`  ${p.name} (mother: ${p.mother || 'null'}, father: ${p.father || 'null'})`));
  console.log('\n' + '='.repeat(70) + '\n');

  return { tree: tree1, stats };
}

// Test various scenarios - modify these to test your specific cases

// Scenario 1: Family reunion - merging two branches of a family
testMergeScenario(
  'Family Reunion: Merging Smith and Johnson family branches',
  {
    persons: [
      { name: 'John Smith', mother: 'Mary Smith', father: 'Robert Smith' },
      { name: 'Mary Smith', mother: 'Grandma Smith', father: null },
      { name: 'Sarah Smith', mother: 'Mary Smith', father: 'Robert Smith' }
    ]
  },
  {
    persons: [
      { name: 'John Smith', mother: 'Mary Johnson', father: 'Robert Smith' }, // Conflict: different mother
      { name: 'Michael Johnson', mother: 'Lisa Johnson', father: 'David Johnson' },
      { name: 'Robert Smith', mother: 'Great Grandma', father: 'Great Grandpa' }
    ]
  },
  'combine-non-null'
);

// Scenario 2: Research consolidation - combining different research sources
testMergeScenario(
  'Research Consolidation: Census data + Birth records',
  {
    persons: [
      { name: 'Elizabeth Brown', mother: null, father: null }, // Census had no parents
      { name: 'William Brown', mother: 'Jane Brown', father: null }, // Partial info
      { name: 'Thomas Brown', mother: 'Margaret', father: 'James' }
    ]
  },
  {
    persons: [
      { name: 'Elizabeth Brown', mother: 'Catherine Wilson', father: 'Henry Wilson' }, // Birth cert
      { name: 'William Brown', mother: null, father: 'Samuel Brown' }, // Death cert
      { name: 'Anna Brown', mother: 'Elizabeth Brown', father: 'William Brown' } // New person
    ]
  },
  'combine-non-null'
);

// Scenario 3: Database migration - different naming conventions
testMergeScenario(
  'Database Migration: Handling name variations',
  {
    persons: [
      { name: 'Dr. James Wilson MD', mother: 'Eleanor Wilson', father: 'Charles Wilson' },
      { name: 'Eleanor Wilson', mother: 'Grace Taylor', father: 'Edward Taylor' }
    ]
  },
  {
    persons: [
      { name: 'Dr. James Wilson MD', mother: 'Eleanor Smith-Wilson', father: 'Charles Wilson' }, // Name variation
      { name: 'James Wilson Jr.', mother: 'Dr. James Wilson MD', father: 'Unknown' } // Different person or same?
    ]
  },
  'prefer-complete'
);

// Example of testing different strategies on the same data
console.log('🔄 STRATEGY COMPARISON');
console.log('Testing the same merge with different strategies:');
console.log('─'.repeat(50));

const testData1 = {
  persons: [
    { name: 'Alice Test', mother: 'Original Mom', father: 'Original Dad' }
  ]
};

const testData2 = {
  persons: [
    { name: 'Alice Test', mother: 'New Mom', father: 'New Dad' }
  ]
};

const strategies = ['keep-first', 'keep-second', 'combine-non-null', 'prefer-complete'];

strategies.forEach(strategy => {
  const tree1 = new GenealogyTreeData(JSON.parse(JSON.stringify(testData1)));
  const tree2 = new GenealogyTreeData(JSON.parse(JSON.stringify(testData2)));

  const stats = tree1.mergeTree(tree2, strategy);
  const alice = tree1.persons.find(p => p.name === 'Alice Test');

  console.log(`${strategy.padEnd(18)}: mother="${alice.mother}", father="${alice.father}" (conflicts: ${stats.conflicts.length})`);
});

console.log('\n' + '='.repeat(70));
console.log('💡 CUSTOMIZATION GUIDE:');
console.log('To test your own scenarios:');
console.log('1. Modify the persons arrays in testMergeScenario calls above');
console.log('2. Add new testMergeScenario calls with your data');
console.log('3. Change the strategy parameter to test different merge behaviors');
console.log('4. Run: node interactive_test.js');
console.log('\nAvailable strategies: keep-first, keep-second, combine-non-null, prefer-complete');
console.log('='.repeat(70));
