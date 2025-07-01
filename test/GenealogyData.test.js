import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { GenealogyData } from '../public/utility/GenealogyData.js';

describe('GenealogyData', () => {
  let data;
  const initialPersons = {
    persons: [
      { name: 'John Doe', mother: 'Jane Doe', father: 'Jack Doe' },
      { name: 'Jane Doe', mother: null, father: null },
    ],
  };

  beforeEach(() => {
    // Deep copy to prevent tests from interfering with each other
    data = new GenealogyData(JSON.parse(JSON.stringify(initialPersons)));
  });

  it('should initialize correctly and add missing persons', () => {
    assert.strictEqual(data.persons.length, 3, 'Should have 3 persons after initialization (John, Jane, and Jack)');
    const jack = data.persons.find(p => p.name === 'Jack Doe');
    assert.ok(jack, 'Jack Doe should be added automatically');
    assert.strictEqual(jack.mother, null);
    assert.strictEqual(jack.father, null);
  });

  it('should add a new person', () => {
    const newPerson = { name: 'Mary Jane', mother: 'Jane Doe', father: 'John Doe' };
    data.addPerson(newPerson);
    assert.strictEqual(data.persons.length, 4);
    assert.ok(data.persons.find(p => p.name === 'Mary Jane'));
  });

  it('should add parents of a new person if they do not exist', () => {
    const newPerson = { name: 'New Kid', mother: 'New Mom', father: 'New Dad' };
    data.addPerson(newPerson);
    assert.strictEqual(data.persons.length, 6, 'Should have initial 3 + new 3');
    assert.ok(data.persons.find(p => p.name === 'New Mom'));
    assert.ok(data.persons.find(p => p.name === 'New Dad'));
  });

  it('should update an existing person and its references', () => {
    const updatedJane = { name: 'Jane Doe Smith', mother: 'Grandma', father: 'Grandpa' };
    data.updatePerson('Jane Doe', updatedJane);

    const jane = data.persons.find(p => p.name === 'Jane Doe Smith');
    assert.ok(jane, 'Jane should be found with her new name');
    assert.strictEqual(jane.mother, 'Grandma');

    const john = data.persons.find(p => p.name === 'John Doe');
    assert.strictEqual(john.mother, 'Jane Doe Smith', 'Johns mother reference should be updated');

    assert.strictEqual(data.persons.length, 5, 'Grandma and Grandpa should be added');
    assert.ok(data.persons.find(p => p.name === 'Grandma'));
  });

  it("should update references for all children when a parent is renamed", () => {
    // Setup: Add another child for Jane Doe to test multi-reference update
    const anotherChild = {
      name: "Second Child",
      mother: "Jane Doe",
      father: "Jack Doe",
    };
    data.addPerson(anotherChild);
    assert.strictEqual(
      data.persons.length,
      4,
      "Should have 4 people after adding a second child"
    );

    // Action: Rename Jane Doe
    const updatedJane = {name: "Jane Doe Smith", mother: null, father: null};
    data.updatePerson("Jane Doe", updatedJane);

    // Assertions
    const john = data.persons.find((p) => p.name === "John Doe");
    const second = data.persons.find((p) => p.name === "Second Child");
    assert.strictEqual(
      john.mother,
      "Jane Doe Smith",
      "First child's mother reference should be updated"
    );
    assert.strictEqual(
      second.mother,
      "Jane Doe Smith",
      "Second child's mother reference should be updated"
    );
  });

  it('should remove a person and update references', () => {
    data.removePerson('Jane Doe');
    assert.strictEqual(data.persons.length, 2);
    assert.strictEqual(data.persons.find(p => p.name === 'Jane Doe'), undefined);

    const john = data.persons.find(p => p.name === 'John Doe');
    assert.strictEqual(john.mother, null, 'Johns mother should be set to null');
  });

  it('should clear all persons', () => {
    data.clear();
    assert.strictEqual(data.persons.length, 0);
  });

  it('should get all unique names', () => {
    const names = data.getAllUniqueNames();
    assert.strictEqual(names.size, 3);
    assert.ok(names.has('John Doe'));
    assert.ok(names.has('Jane Doe'));
    assert.ok(names.has('Jack Doe'));
  });

  it('should generate a correct DOT string for a couple and child', () => {
    const dotString = data.genealogyDotString();
    assert.ok(dotString.includes('strict digraph G {'));
    assert.ok(dotString.includes('"John Doe" [label="John Doe", URL="person:John%20Doe"];'));
    assert.ok(dotString.includes('"Jane Doe_Jack Doe_family" [shape=point];'));
    assert.ok(dotString.includes('"Jane Doe" -> "Jane Doe_Jack Doe_family";'));
    assert.ok(dotString.includes('"Jack Doe" -> "Jane Doe_Jack Doe_family";'));
    assert.ok(dotString.includes('"Jane Doe_Jack Doe_family" -> "John Doe" [dir=forward, arrowhead=normal];'));
    assert.ok(dotString.includes('}'));
  });

  it('should generate a DOT string for a person with one parent', () => {
    const singleParentData = new GenealogyData({
      persons: [{ name: 'Child', mother: 'Mom', father: null }]
    });
    const dotString = singleParentData.genealogyDotString();
    assert.ok(dotString.includes('"Mom" -> "Child" [dir=forward, arrowhead=normal];'));
    assert.ok(!dotString.includes('_family"'));
  });
});

describe('Person Merging', () => {
  let data;
  const initialPersons = {
    persons: [
      { name: 'John Doe', mother: 'Jane Doe', father: 'Jack Doe' },
      { name: 'Jane Doe', mother: null, father: null },
    ],
  };

  beforeEach(() => {
    // Deep copy to prevent tests from interfering with each other
    data = new GenealogyData(JSON.parse(JSON.stringify(initialPersons)));
  });

  it('should merge two persons using combine-non-null strategy', () => {
    const person1 = { name: 'Alice', mother: 'Mom1', father: null };
    const person2 = { name: 'Alice', mother: null, father: 'Dad1' };

    const merged = data.mergePerson(person1, person2, 'combine-non-null');

    assert.strictEqual(merged.name, 'Alice');
    assert.strictEqual(merged.mother, 'Mom1');
    assert.strictEqual(merged.father, 'Dad1');
  });

  it('should merge two persons using keep-first strategy', () => {
    const person1 = { name: 'Bob', mother: 'Mom1', father: 'Dad1' };
    const person2 = { name: 'Bob', mother: 'Mom2', father: 'Dad2' };

    const merged = data.mergePerson(person1, person2, 'keep-first');

    assert.strictEqual(merged.name, 'Bob');
    assert.strictEqual(merged.mother, 'Mom1');
    assert.strictEqual(merged.father, 'Dad1');
  });

  it('should merge two persons using keep-second strategy', () => {
    const person1 = { name: 'Charlie', mother: 'Mom1', father: 'Dad1' };
    const person2 = { name: 'Charlie', mother: 'Mom2', father: 'Dad2' };

    const merged = data.mergePerson(person1, person2, 'keep-second');

    assert.strictEqual(merged.name, 'Charlie');
    assert.strictEqual(merged.mother, 'Mom2');
    assert.strictEqual(merged.father, 'Dad2');
  });

  it('should merge two persons using prefer-complete strategy', () => {
    const person1 = { name: 'David', mother: 'Mom1', father: null };
    const person2 = { name: 'David', mother: 'Mom2', father: 'Dad2' };

    const merged = data.mergePerson(person1, person2, 'prefer-complete');

    assert.strictEqual(merged.name, 'David');
    assert.strictEqual(merged.mother, 'Mom2');
    assert.strictEqual(merged.father, 'Dad2');
  });

  it('should prefer first person when both have equal completeness', () => {
    const person1 = { name: 'Eve', mother: 'Mom1', father: 'Dad1' };
    const person2 = { name: 'Eve', mother: 'Mom2', father: 'Dad2' };

    const merged = data.mergePerson(person1, person2, 'prefer-complete');

    assert.strictEqual(merged.name, 'Eve');
    assert.strictEqual(merged.mother, 'Mom1');
    assert.strictEqual(merged.father, 'Dad1');
  });

  it('should throw error when merging persons with different names', () => {
    const person1 = { name: 'Alice', mother: 'Mom1', father: null };
    const person2 = { name: 'Bob', mother: null, father: 'Dad1' };

    assert.throws(() => {
      data.mergePerson(person1, person2);
    }, /Cannot merge persons with different names/);
  });

  it('should throw error when merging with null person', () => {
    const person1 = { name: 'Alice', mother: 'Mom1', father: null };

    assert.throws(() => {
      data.mergePerson(person1, null);
    }, /Both persons must be provided for merging/);
  });

  it('should throw error with unknown merge strategy', () => {
    const person1 = { name: 'Alice', mother: 'Mom1', father: null };
    const person2 = { name: 'Alice', mother: null, father: 'Dad1' };

    assert.throws(() => {
      data.mergePerson(person1, person2, 'unknown-strategy');
    }, /Unknown merge strategy: unknown-strategy/);
  });
});

describe('Tree Merging', () => {
  let data;
  const initialPersons = {
    persons: [
      { name: 'John Doe', mother: 'Jane Doe', father: 'Jack Doe' },
      { name: 'Jane Doe', mother: null, father: null },
    ],
  };

  beforeEach(() => {
    // Deep copy to prevent tests from interfering with each other
    data = new GenealogyData(JSON.parse(JSON.stringify(initialPersons)));
  });

  it('should merge trees using combine-non-null strategy', () => {
    const otherTree = new GenealogyData({
      persons: [
        { name: 'John Doe', mother: 'Different Mom', father: 'Jack Doe' },
        { name: 'Alice Smith', mother: 'Alice Mom', father: 'Alice Dad' },
        { name: 'Bob Jones', mother: null, father: 'Bob Dad' }
      ]
    });
    const stats = data.mergeTree(otherTree, 'combine-non-null');

    assert.strictEqual(stats.merged, 2, 'Should merge 2 existing persons (John Doe and Jack Doe)');
    assert.strictEqual(stats.added, 6, 'Should add 6 new persons (Alice Smith, Bob Jones, Different Mom, Alice Mom, Alice Dad, Bob Dad)');

    // Check that John Doe was merged correctly
    const john = data.persons.find(p => p.name === 'John Doe');
    assert.strictEqual(john.mother, 'Jane Doe', 'Should keep original mother (Jane Doe)');
    assert.strictEqual(john.father, 'Jack Doe', 'Should keep father (both had Jack Doe)');

    // Check that new persons were added
    assert.ok(data.persons.find(p => p.name === 'Alice Smith'));
    assert.ok(data.persons.find(p => p.name === 'Bob Jones'));
  });

  it('should merge trees using keep-first strategy', () => {
    const otherTree = new GenealogyData({
      persons: [
        { name: 'John Doe', mother: 'Different Mom', father: 'Jack Doe' },
        { name: 'Alice Smith', mother: 'Alice Mom', father: 'Alice Dad' },
        { name: 'Bob Jones', mother: null, father: 'Bob Dad' }
      ]
    });
    const stats = data.mergeTree(otherTree, 'keep-first');

    assert.strictEqual(stats.merged, 2);
    assert.strictEqual(stats.added, 6);

    const john = data.persons.find(p => p.name === 'John Doe');
    assert.strictEqual(john.mother, 'Jane Doe', 'Should keep original mother');
    assert.strictEqual(john.father, 'Jack Doe', 'Should keep original father');
  });

  it('should merge trees using keep-second strategy', () => {
    const otherTree = new GenealogyData({
      persons: [
        { name: 'John Doe', mother: 'Different Mom', father: 'Jack Doe' },
        { name: 'Alice Smith', mother: 'Alice Mom', father: 'Alice Dad' },
        { name: 'Bob Jones', mother: null, father: 'Bob Dad' }
      ]
    });
    const stats = data.mergeTree(otherTree, 'keep-second');

    assert.strictEqual(stats.merged, 2);
    assert.strictEqual(stats.added, 6);

    const john = data.persons.find(p => p.name === 'John Doe');
    assert.strictEqual(john.mother, 'Different Mom', 'Should use incoming mother');
    assert.strictEqual(john.father, 'Jack Doe', 'Should use incoming father');
  });

  it('should detect conflicts when merging', () => {
    const conflictTree = new GenealogyData({
      persons: [
        { name: 'John Doe', mother: 'Conflicting Mom', father: 'Conflicting Dad' }
      ]
    });

    const stats = data.mergeTree(conflictTree, 'combine-non-null');

    assert.strictEqual(stats.conflicts.length, 1);
    assert.strictEqual(stats.conflicts[0].name, 'John Doe');
    assert.strictEqual(stats.conflicts[0].existing.mother, 'Jane Doe');
    assert.strictEqual(stats.conflicts[0].incoming.mother, 'Conflicting Mom');
  });

  it('should handle empty tree merge', () => {
    const emptyTree = new GenealogyData({ persons: [] });
    const stats = data.mergeTree(emptyTree);

    assert.strictEqual(stats.merged, 0);
    assert.strictEqual(stats.added, 0);
    assert.strictEqual(stats.conflicts.length, 0);
    assert.strictEqual(data.persons.length, 3, 'Original tree should be unchanged');
  });

  it('should throw error when merging with non-GenealogyData object', () => {
    assert.throws(() => {
      data.mergeTree({ persons: [] });
    }, /otherTree must be an instance of GenealogyData/);
  });

  it('should merge without updating references when specified', () => {
    const otherTree = new GenealogyData({
      persons: [
        { name: 'John Doe', mother: 'Different Mom', father: 'Jack Doe' },
        { name: 'Alice Smith', mother: 'Alice Mom', father: 'Alice Dad' },
        { name: 'Bob Jones', mother: null, father: 'Bob Dad' }
      ]
    });
    const stats = data.mergeTree(otherTree, 'combine-non-null', false);

    assert.strictEqual(stats.merged, 2);
    assert.strictEqual(stats.added, 6);

    // Check that referenced parents weren't automatically added
    const initialCount = 3 + 6; // original 3 + added 6
    assert.strictEqual(data.persons.length, initialCount, 'Should not auto-add referenced parents');
  });

  it('should merge complex tree with multiple relationships', () => {
    const complexTree = new GenealogyData({
      persons: [
        { name: 'Grandpa Smith', mother: null, father: null },
        { name: 'Grandma Smith', mother: null, father: null },
        { name: 'Parent Smith', mother: 'Grandma Smith', father: 'Grandpa Smith' },
        { name: 'Child Smith', mother: 'Parent Smith', father: 'Jack Doe' }
      ]
    });

    const stats = data.mergeTree(complexTree);

    assert.strictEqual(stats.merged, 1, 'Should merge Jane Doe');
    assert.ok(stats.added >= 4, 'Should add at least 4 new persons');

    // Verify relationships are preserved
    const childSmith = data.persons.find(p => p.name === 'Child Smith');
    assert.ok(childSmith);
    assert.strictEqual(childSmith.mother, 'Parent Smith');
    assert.strictEqual(childSmith.father, "Jack Doe");
  });
});
