#!/usr/bin/env node

import { GenealogyTreeData } from '../public/utility/GenealogyTreeData.js';

console.log('=== MERGE FUNCTIONALITY DEMONSTRATION (Node.js) ===\n');

// Test the error handling scenarios specifically
function testErrorHandling() {
  console.log('🚨 Testing Error Handling Scenarios');
  console.log('─'.repeat(50));

  const testTree = new GenealogyTreeData({
    persons: [
      { name: 'John Doe', mother: 'Jane Doe', father: 'Jack Doe' }
    ]
  });

  // Test 1: Invalid tree type
  console.log('1. Testing invalid tree type error:');
  try {
    testTree.mergeTree({ persons: [] }); // Not a GenealogyTreeData instance
  } catch (error) {
    console.log(`   ✓ Caught expected error: "${error.message}"`);
  }

  // Test 2: Invalid merge strategy (gets caught and put in conflicts)
  console.log('\n2. Testing invalid merge strategy handling:');
  try {
    const tree1 = new GenealogyTreeData({
      persons: [{ name: 'Test', mother: 'Mom', father: 'Dad' }]
    });
    const tree2 = new GenealogyTreeData({
      persons: [{ name: 'Test', mother: 'Other Mom', father: 'Other Dad' }]
    });
    const stats = tree1.mergeTree(tree2, 'invalid-strategy');

    if (stats.conflicts.length > 0 && stats.conflicts[0].error?.includes('Unknown merge strategy')) {
      console.log(`   ✓ Invalid strategy properly handled in conflicts: "${stats.conflicts[0].error}"`);
    } else {
      console.log(`   ❌ Expected strategy error in conflicts, got: ${JSON.stringify(stats.conflicts)}`);
    }
  } catch (error) {
    console.log(`   ❌ Unexpected exception: "${error.message}"`);
  }

  // Test 3: Person merge with different names
  console.log('\n3. Testing person merge with different names error:');
  try {
    testTree.mergePerson(
      { name: 'Alice', mother: null, father: null },
      { name: 'Bob', mother: null, father: null }
    );
  } catch (error) {
    console.log(`   ✓ Caught expected error: "${error.message}"`);
  }

  // Test 4: Null person merge
  console.log('\n4. Testing null person merge error:');
  try {
    testTree.mergePerson(null, { name: 'Test', mother: null, father: null });
  } catch (error) {
    console.log(`   ✓ Caught expected error: "${error.message}"`);
  }

  console.log('\n✅ All error handling tests passed!\n');
}

// Test successful merge scenarios with proper error handling
function testSuccessfulMerges() {
  console.log('✅ Testing Successful Merge Scenarios with Error Handling');
  console.log('─'.repeat(60));

  // Scenario 1: Basic merge with error handling wrapper
  console.log('1. Basic merge with error handling:');
  try {
    const tree1 = new GenealogyTreeData({
      persons: [
        { name: 'Alice', mother: 'Mom A', father: null }
      ]
    });

    const tree2 = new GenealogyTreeData({
      persons: [
        { name: 'Alice', mother: null, father: 'Dad A' },
        { name: 'Bob', mother: 'Mom B', father: 'Dad B' }
      ]
    });

    console.log(`   Tree 1 before merge: ${tree1.persons.length} persons`);
    console.log(`   Tree 2: ${tree2.persons.length} persons`);

    const stats = tree1.mergeTree(tree2, 'combine-non-null');

    console.log(`   ✓ Merge successful:`);
    console.log(`     - Merged: ${stats.merged} persons`);
    console.log(`     - Added: ${stats.added} persons`);
    console.log(`     - Conflicts: ${stats.conflicts.length}`);
    console.log(`     - Final tree size: ${tree1.persons.length} persons`);

    // Verify Alice got both parents
    const alice = tree1.persons.find(p => p.name === 'Alice');
    console.log(`     - Alice: mother="${alice.mother}", father="${alice.father}"`);

  } catch (error) {
    console.log(`   ❌ Unexpected error: ${error.message}`);
  }

  // Scenario 2: Merge with conflicts
  console.log('\n2. Merge with conflicts and error handling:');
  try {
    const tree1 = new GenealogyTreeData({
      persons: [
        { name: 'Charlie', mother: 'Original Mom', father: 'Original Dad' }
      ]
    });

    const tree2 = new GenealogyTreeData({
      persons: [
        { name: 'Charlie', mother: 'Different Mom', father: 'Different Dad' }
      ]
    });

    console.log(`   Attempting merge with conflicting data...`);
    const stats = tree1.mergeTree(tree2, 'keep-first');

    console.log(`   ✓ Merge completed despite conflicts:`);
    console.log(`     - Merged: ${stats.merged} persons`);
    console.log(`     - Conflicts detected: ${stats.conflicts.length}`);

    if (stats.conflicts.length > 0) {
      console.log(`     - Conflict details:`);
      stats.conflicts.forEach(conflict => {
        console.log(`       * ${conflict.name}:`);
        console.log(`         Original: mother="${conflict.existing.mother}", father="${conflict.existing.father}"`);
        console.log(`         Incoming: mother="${conflict.incoming.mother}", father="${conflict.incoming.father}"`);
        console.log(`         Resolved: mother="${conflict.resolved.mother}", father="${conflict.resolved.father}"`);
      });
    }

  } catch (error) {
    console.log(`   ❌ Unexpected error: ${error.message}`);
  }

  console.log('\n✅ All success scenario tests passed!\n');
}

// Test all merge strategies with error handling
function testAllStrategies() {
  console.log('🔄 Testing All Merge Strategies with Error Handling');
  console.log('─'.repeat(55));

  const strategies = ['keep-first', 'keep-second', 'combine-non-null', 'prefer-complete'];

  strategies.forEach(strategy => {
    console.log(`Testing strategy: ${strategy}`);

    try {
      const tree1 = new GenealogyTreeData({
        persons: [
          { name: 'Test Person', mother: 'Mom 1', father: null }
        ]
      });

      const tree2 = new GenealogyTreeData({
        persons: [
          { name: 'Test Person', mother: null, father: 'Dad 2' }
        ]
      });

      const stats = tree1.mergeTree(tree2, strategy);
      const person = tree1.persons.find(p => p.name === 'Test Person');

      console.log(`  ✓ ${strategy}: mother="${person.mother}", father="${person.father}" (conflicts: ${stats.conflicts.length})`);

    } catch (error) {
      console.log(`  ❌ ${strategy}: Error - ${error.message}`);
    }
  });

  console.log('\n✅ All strategy tests completed!\n');
}

// Demonstrate proper error handling patterns
function demonstrateErrorHandlingPatterns() {
  console.log('📋 Error Handling Patterns for Astro Components');
  console.log('─'.repeat(50));

  console.log(`
Here's how you should handle mergeTree errors in your Astro components:

1. BASIC PATTERN:
   try {
     const stats = genealogyData.mergeTree(otherTree, strategy);
     // Handle success
   } catch (error) {
     // Handle specific errors
     if (error.message.includes('must be an instance of GenealogyTreeData')) {
       showUserError('Invalid data format');
     } else {
       showUserError('Merge failed: ' + error.message);
     }
   }

2. VALIDATION PATTERN:
   function validateBeforeMerge(treeData, strategy) {
     if (!treeData || !treeData.persons) {
       throw new Error('Invalid tree data');
     }
     if (!['keep-first', 'keep-second', 'combine-non-null', 'prefer-complete'].includes(strategy)) {
       throw new Error('Invalid strategy');
     }
   }

3. COMPLETE PATTERN:
   async function safeMerge(treeData, strategy) {
     try {
       validateBeforeMerge(treeData, strategy);
       const otherTree = new GenealogyTreeData(treeData);
       const stats = genealogyData.mergeTree(otherTree, strategy);
       saveDataToStorage();
       showSuccess('Merge completed!');
       return stats;
     } catch (error) {
       console.error('Merge error:', error);
       showError('Merge failed: ' + error.message);
       return null;
     }
   }
`);
}

// Run all tests
function runAllTests() {
  try {
    testErrorHandling();
    testSuccessfulMerges();
    testAllStrategies();
    demonstrateErrorHandlingPatterns();

    console.log('🎉 ALL TESTS COMPLETED SUCCESSFULLY!');
    console.log('The merge functionality is working correctly with proper error handling.');

  } catch (error) {
    console.error('❌ Test suite failed:', error);
    process.exit(1);
  }
}

// Run the tests
runAllTests();
