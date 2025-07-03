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

describe('Person Info Field', () => {
  let data;
  const initialPersonsWithInfo = {
    persons: [
      { name: 'John Doe', mother: 'Jane Doe', father: 'Jack Doe', info: '1990-Present, Software Engineer' },
      { name: 'Jane Doe', mother: null, father: null, info: '1965-2020, Teacher' },
      { name: 'Bob Smith', mother: null, father: null, info: null },
    ],
  };

  beforeEach(() => {
    data = new GenealogyData(JSON.parse(JSON.stringify(initialPersonsWithInfo)));
  });

  it('should initialize correctly with info fields', () => {
    assert.strictEqual(data.persons.length, 4, 'Should have 4 persons after initialization (John, Jane, Jack, Bob)');

    const john = data.persons.find(p => p.name === 'John Doe');
    assert.strictEqual(john.info, '1990-Present, Software Engineer');

    const jane = data.persons.find(p => p.name === 'Jane Doe');
    assert.strictEqual(jane.info, '1965-2020, Teacher');

    const bob = data.persons.find(p => p.name === 'Bob Smith');
    assert.strictEqual(bob.info, null);

    // Auto-generated person should have null info
    const jack = data.persons.find(p => p.name === 'Jack Doe');
    assert.strictEqual(jack.info, null);
  });

  it('should add a new person with info field', () => {
    const newPerson = { name: 'Mary Jane', mother: 'Jane Doe', father: 'John Doe', info: 'Born 2015, Student' };
    data.addPerson(newPerson);

    const mary = data.persons.find(p => p.name === 'Mary Jane');
    assert.ok(mary);
    assert.strictEqual(mary.info, 'Born 2015, Student');
  });

  it('should add a new person without info field', () => {
    const newPerson = { name: 'Sam Wilson', mother: 'Unknown', father: null };
    data.addPerson(newPerson);

    const sam = data.persons.find(p => p.name === 'Sam Wilson');
    assert.ok(sam);
    assert.strictEqual(sam.info, undefined);
  });

  it('should update person info field', () => {
    const updatedJohn = { name: 'John Doe', mother: 'Jane Doe', father: 'Jack Doe', info: '1990-Present, Senior Developer' };
    data.updatePerson('John Doe', updatedJohn);

    const john = data.persons.find(p => p.name === 'John Doe');
    assert.strictEqual(john.info, '1990-Present, Senior Developer');
  });

  it('should clear info field when updating person', () => {
    const updatedJane = { name: 'Jane Doe', mother: null, father: null, info: null };
    data.updatePerson('Jane Doe', updatedJane);

    const jane = data.persons.find(p => p.name === 'Jane Doe');
    assert.strictEqual(jane.info, null);
  });

  it('should generate DOT string with info as second line', () => {
    const dotString = data.genealogyDotString();

    // Person with info should have two-line label
    assert.ok(dotString.includes('"John Doe" [label="John Doe\\n1990-Present, Software Engineer"'));
    assert.ok(dotString.includes('"Jane Doe" [label="Jane Doe\\n1965-2020, Teacher"'));

    // Person without info should have single-line label
    assert.ok(dotString.includes('"Bob Smith" [label="Bob Smith"'));
    assert.ok(dotString.includes('"Jack Doe" [label="Jack Doe"'));
  });

  it('should escape quotes in info field for DOT generation', () => {
    const personWithQuotes = { name: 'Test Person', mother: null, father: null, info: 'Known as "The Expert"' };
    data.addPerson(personWithQuotes);

    const dotString = data.genealogyDotString();
    assert.ok(dotString.includes('"Test Person" [label="Test Person\\nKnown as \\"The Expert\\""'));
  });

  it('should handle empty info field correctly', () => {
    const personWithEmptyInfo = { name: 'Empty Info', mother: null, father: null, info: '' };
    data.addPerson(personWithEmptyInfo);

    const dotString = data.genealogyDotString();
    // Empty info should result in single-line label
    assert.ok(dotString.includes('"Empty Info" [label="Empty Info"'));
  });

  it('should handle whitespace-only info field correctly', () => {
    const personWithWhitespaceInfo = { name: 'Whitespace Info', mother: null, father: null, info: '   ' };
    data.addPerson(personWithWhitespaceInfo);

    const dotString = data.genealogyDotString();
    // Whitespace-only info should result in single-line label
    assert.ok(dotString.includes('"Whitespace Info" [label="Whitespace Info"'));
  });

  it('should preserve info during person removal and reference updates', () => {
    // Add a child of John who has info
    const child = { name: 'Child Doe', mother: 'Jane Doe', father: 'John Doe', info: 'Born 2010' };
    data.addPerson(child);

    // Remove Jane Doe
    data.removePerson('Jane Doe');

    // Child should still have info but mother reference should be null
    const childAfter = data.persons.find(p => p.name === 'Child Doe');
    assert.strictEqual(childAfter.info, 'Born 2010');
    assert.strictEqual(childAfter.mother, null);
  });
});

describe('Person Merging with Info Field', () => {
  let data;

  beforeEach(() => {
    data = new GenealogyData({
      persons: [
        { name: 'John Doe', mother: 'Jane Doe', father: 'Jack Doe', info: 'Original info' },
        { name: 'Jane Doe', mother: null, father: null, info: null },
      ]
    });
  });

  it('should merge persons with info using combine-non-null strategy', () => {
    const person1 = { name: 'Alice', mother: 'Mom1', father: null, info: 'Info from person1' };
    const person2 = { name: 'Alice', mother: null, father: 'Dad1', info: null };

    const merged = data.mergePerson(person1, person2, 'combine-non-null');
    assert.strictEqual(merged.name, 'Alice');
    assert.strictEqual(merged.mother, 'Mom1');
    assert.strictEqual(merged.father, 'Dad1');
    assert.strictEqual(merged.info, 'Info from person1');
  });

  it('should merge persons with info using keep-first strategy', () => {
    const person1 = { name: 'Bob', mother: 'Mom1', father: 'Dad1', info: 'First info' };
    const person2 = { name: 'Bob', mother: 'Mom2', father: 'Dad2', info: 'Second info' };

    const merged = data.mergePerson(person1, person2, 'keep-first');
    assert.strictEqual(merged.info, 'First info');
  });

  it('should merge persons with info using keep-second strategy', () => {
    const person1 = { name: 'Charlie', mother: 'Mom1', father: 'Dad1', info: 'First info' };
    const person2 = { name: 'Charlie', mother: 'Mom2', father: 'Dad2', info: 'Second info' };

    const merged = data.mergePerson(person1, person2, 'keep-second');
    assert.strictEqual(merged.info, 'Second info');
  });

  it('should merge persons with info using prefer-complete strategy', () => {
    const person1 = { name: 'David', mother: 'Mom1', father: null, info: null };
    const person2 = { name: 'David', mother: null, father: 'Dad2', info: 'Complete info' };

    const merged = data.mergePerson(person1, person2, 'prefer-complete');
    // person2 has more complete information (father + info vs just mother)
    assert.strictEqual(merged.mother, null);
    assert.strictEqual(merged.father, 'Dad2');
    assert.strictEqual(merged.info, 'Complete info');
  });

  it('should detect info conflicts during tree merge', () => {
    const otherTree = new GenealogyData({
      persons: [
        { name: 'John Doe', mother: 'Jane Doe', father: 'Jack Doe', info: 'Different info' }
      ]
    });

    const stats = data.mergeTree(otherTree, 'combine-non-null');

    // The merge will merge John Doe, Jane Doe, and Jack Doe (all exist in both trees)
    assert.strictEqual(stats.merged, 3);

    // Find the conflict for John Doe specifically (the only one with conflicting info)
    const johnConflict = stats.conflicts.find(c => c.name === 'John Doe');
    assert.ok(johnConflict, 'Should have a conflict for John Doe');
    assert.strictEqual(johnConflict.existing.info, 'Original info');
    assert.strictEqual(johnConflict.incoming.info, 'Different info');
    assert.strictEqual(johnConflict.resolved.info, 'Original info'); // combine-non-null keeps first
  });

  it('should merge trees without info conflicts when no conflicts exist', () => {
    const otherTree = new GenealogyData({
      persons: [
        { name: 'New Person', mother: null, father: null, info: 'Some info' },
        { name: 'Jane Doe', mother: 'Grandma', father: 'Grandpa', info: 'Added info' }
      ]
    });

    data.mergeTree(otherTree, 'combine-non-null');

    // Jane Doe should be merged (she had no info originally)
    const jane = data.persons.find(p => p.name === 'Jane Doe');
    assert.strictEqual(jane.info, 'Added info');

    // New Person should be added
    const newPerson = data.persons.find(p => p.name === 'New Person');
    assert.strictEqual(newPerson.info, 'Some info');
  });

  it('should handle null and undefined info fields correctly in merging', () => {
    const person1 = { name: 'Test', mother: null, father: null, info: undefined };
    const person2 = { name: 'Test', mother: null, father: null, info: 'Real info' };

    const merged = data.mergePerson(person1, person2, 'combine-non-null');
    assert.strictEqual(merged.info, 'Real info');
  });
});
