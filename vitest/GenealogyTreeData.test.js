import { describe, it, beforeEach, expect } from 'vitest';
import { GenealogyTreeData } from '../public/utility/GenealogyTreeData.js';

describe('GenealogyTreeData', () => {
  let data;
  const initialPersons = {
    persons: [
      { name: 'John Doe', mother: 'Jane Doe', father: 'Jack Doe' },
      { name: 'Jane Doe', mother: null, father: null },
    ],
  };

  beforeEach(() => {
    data = new GenealogyTreeData(JSON.parse(JSON.stringify(initialPersons)));
  });

  it('should initialize correctly and add missing persons', () => {
    expect(data.persons.length).toBe(3);
    const jack = data.persons.find(p => p.name === 'Jack Doe');
    expect(jack).toBeTruthy();
    expect(jack.mother).toBeNull();
    expect(jack.father).toBeNull();
  });

  it('should add a new person', () => {
    const newPerson = { name: 'Mary Jane', mother: 'Jane Doe', father: 'John Doe' };
    data.addPerson(newPerson);
    expect(data.persons.length).toBe(4);
    expect(data.persons.find(p => p.name === 'Mary Jane')).toBeTruthy();
  });

  it('should add parents of a new person if they do not exist', () => {
    const newPerson = { name: 'New Kid', mother: 'New Mom', father: 'New Dad' };
    data.addPerson(newPerson);
    expect(data.persons.length).toBe(6);
    expect(data.persons.find(p => p.name === 'New Mom')).toBeTruthy();
    expect(data.persons.find(p => p.name === 'New Dad')).toBeTruthy();
  });

  it('should update an existing person and its references', () => {
    const updatedJane = { name: 'Jane Doe Smith', mother: 'Grandma', father: 'Grandpa' };
    data.updatePerson('Jane Doe', updatedJane);

    const jane = data.persons.find(p => p.name === 'Jane Doe Smith');
    expect(jane).toBeTruthy();
    expect(jane.mother).toBe('Grandma');

    const john = data.persons.find(p => p.name === 'John Doe');
    expect(john.mother).toBe('Jane Doe Smith');

    expect(data.persons.length).toBe(5);
    expect(data.persons.find(p => p.name === 'Grandma')).toBeTruthy();
  });

  it("should update references for all children when a parent is renamed", () => {
    const anotherChild = {
      name: "Second Child",
      mother: "Jane Doe",
      father: "Jack Doe",
    };
    data.addPerson(anotherChild);
    expect(data.persons.length).toBe(4);

    const updatedJane = {name: "Jane Doe Smith", mother: null, father: null};
    data.updatePerson("Jane Doe", updatedJane);

    const john = data.persons.find((p) => p.name === "John Doe");
    const second = data.persons.find((p) => p.name === "Second Child");
    expect(john.mother).toBe("Jane Doe Smith");
    expect(second.mother).toBe("Jane Doe Smith");
  });

  it('should remove a person and update references', () => {
    data.removePerson('Jane Doe');
    expect(data.persons.length).toBe(2);
    expect(data.persons.find(p => p.name === 'Jane Doe')).toBeUndefined();

    const john = data.persons.find(p => p.name === 'John Doe');
    expect(john.mother).toBeNull();
  });

  it('should clear all persons', () => {
    data.clear();
    expect(data.persons.length).toBe(0);
  });

  it('should get all unique names', () => {
    const names = data.getAllUniqueNames();
    expect(names.size).toBe(3);
    expect(names.has('John Doe')).toBeTruthy();
    expect(names.has('Jane Doe')).toBeTruthy();
    expect(names.has('Jack Doe')).toBeTruthy();
  });

  it('should generate a correct DOT string for a couple and child', () => {
    const dotString = data.genealogyDotString();
    expect(dotString).toContain('strict digraph G {');
    expect(dotString).toContain('"John Doe" [label="John Doe", URL="person:John%20Doe"];');
    expect(dotString).toContain('"Jane Doe_Jack Doe_family" [shape=point];');
    expect(dotString).toContain('"Jane Doe" -> "Jane Doe_Jack Doe_family";');
    expect(dotString).toContain('"Jack Doe" -> "Jane Doe_Jack Doe_family";');
    expect(dotString).toContain('"Jane Doe_Jack Doe_family" -> "John Doe" [dir=forward, arrowhead=normal];');
    expect(dotString).toContain('}');
  });

  it('should generate a DOT string for a person with one parent', () => {
    const singleParentData = new GenealogyTreeData({
      persons: [{ name: 'Child', mother: 'Mom', father: null }]
    });
    const dotString = singleParentData.genealogyDotString();
    expect(dotString).toContain('"Mom" -> "Child" [dir=forward, arrowhead=normal];');
    expect(dotString).not.toContain('_family"');
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
    data = new GenealogyTreeData(JSON.parse(JSON.stringify(initialPersons)));
  });

  it('should merge two persons using combine-non-null strategy', () => {
    const person1 = { name: 'Alice', mother: 'Mom1', father: null };
    const person2 = { name: 'Alice', mother: null, father: 'Dad1' };

    const merged = data.mergePerson(person1, person2, 'combine-non-null');

    expect(merged.name).toBe('Alice');
    expect(merged.mother).toBe('Mom1');
    expect(merged.father).toBe('Dad1');
  });

  it('should merge two persons using keep-first strategy', () => {
    const person1 = { name: 'Bob', mother: 'Mom1', father: 'Dad1' };
    const person2 = { name: 'Bob', mother: 'Mom2', father: 'Dad2' };

    const merged = data.mergePerson(person1, person2, 'keep-first');

    expect(merged.name).toBe('Bob');
    expect(merged.mother).toBe('Mom1');
    expect(merged.father).toBe('Dad1');
  });

  it('should merge two persons using keep-second strategy', () => {
    const person1 = { name: 'Charlie', mother: 'Mom1', father: 'Dad1' };
    const person2 = { name: 'Charlie', mother: 'Mom2', father: 'Dad2' };

    const merged = data.mergePerson(person1, person2, 'keep-second');

    expect(merged.name).toBe('Charlie');
    expect(merged.mother).toBe('Mom2');
    expect(merged.father).toBe('Dad2');
  });

  it('should merge two persons using prefer-complete strategy', () => {
    const person1 = { name: 'David', mother: 'Mom1', father: null };
    const person2 = { name: 'David', mother: 'Mom2', father: 'Dad2' };

    const merged = data.mergePerson(person1, person2, 'prefer-complete');

    expect(merged.name).toBe('David');
    expect(merged.mother).toBe('Mom2');
    expect(merged.father).toBe('Dad2');
  });

  it('should prefer first person when both have equal completeness', () => {
    const person1 = { name: 'Eve', mother: 'Mom1', father: 'Dad1' };
    const person2 = { name: 'Eve', mother: 'Mom2', father: 'Dad2' };

    const merged = data.mergePerson(person1, person2, 'prefer-complete');

    expect(merged.name).toBe('Eve');
    expect(merged.mother).toBe('Mom1');
    expect(merged.father).toBe('Dad1');
  });

  it('should throw error when merging persons with different names', () => {
    const person1 = { name: 'Alice', mother: 'Mom1', father: null };
    const person2 = { name: 'Bob', mother: null, father: 'Dad1' };

    expect(() => {
      data.mergePerson(person1, person2);
    }).toThrow(/Cannot merge persons with different names/);
  });

  it('should throw error when merging with null person', () => {
    const person1 = { name: 'Alice', mother: 'Mom1', father: null };

    expect(() => {
      data.mergePerson(person1, null);
    }).toThrow(/Both persons must be provided for merging/);
  });

  it('should throw error with unknown merge strategy', () => {
    const person1 = { name: 'Alice', mother: 'Mom1', father: null };
    const person2 = { name: 'Alice', mother: null, father: 'Dad1' };

    expect(() => {
      data.mergePerson(person1, person2, 'unknown-strategy');
    }).toThrow(/Unknown merge strategy: unknown-strategy/);
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
    data = new GenealogyTreeData(JSON.parse(JSON.stringify(initialPersons)));
  });

  it('should merge trees using combine-non-null strategy', () => {
    const otherTree = new GenealogyTreeData({
      persons: [
        { name: 'John Doe', mother: 'Different Mom', father: 'Jack Doe' },
        { name: 'Alice Smith', mother: 'Alice Mom', father: 'Alice Dad' },
        { name: 'Bob Jones', mother: null, father: 'Bob Dad' }
      ]
    });
    const stats = data.mergeTree(otherTree, 'combine-non-null');

    expect(stats.merged).toBe(2);
    expect(stats.added).toBe(6);

    const john = data.persons.find(p => p.name === 'John Doe');
    expect(john.mother).toBe('Jane Doe');
    expect(john.father).toBe('Jack Doe');

    expect(data.persons.find(p => p.name === 'Alice Smith')).toBeTruthy();
    expect(data.persons.find(p => p.name === 'Bob Jones')).toBeTruthy();
  });

  it('should merge trees using keep-first strategy', () => {
    const otherTree = new GenealogyTreeData({
      persons: [
        { name: 'John Doe', mother: 'Different Mom', father: 'Jack Doe' },
        { name: 'Alice Smith', mother: 'Alice Mom', father: 'Alice Dad' },
        { name: 'Bob Jones', mother: null, father: 'Bob Dad' }
      ]
    });
    const stats = data.mergeTree(otherTree, 'keep-first');

    expect(stats.merged).toBe(2);
    expect(stats.added).toBe(6);

    const john = data.persons.find(p => p.name === 'John Doe');
    expect(john.mother).toBe('Jane Doe');
    expect(john.father).toBe('Jack Doe');
  });

  it('should merge trees using keep-second strategy', () => {
    const otherTree = new GenealogyTreeData({
      persons: [
        { name: 'John Doe', mother: 'Different Mom', father: 'Jack Doe' },
        { name: 'Alice Smith', mother: 'Alice Mom', father: 'Alice Dad' },
        { name: 'Bob Jones', mother: null, father: 'Bob Dad' }
      ]
    });
    const stats = data.mergeTree(otherTree, 'keep-second');

    expect(stats.merged).toBe(2);
    expect(stats.added).toBe(6);

    const john = data.persons.find(p => p.name === 'John Doe');
    expect(john.mother).toBe('Different Mom');
    expect(john.father).toBe('Jack Doe');
  });

  it('should detect conflicts when merging', () => {
    const conflictTree = new GenealogyTreeData({
      persons: [
        { name: 'John Doe', mother: 'Conflicting Mom', father: 'Conflicting Dad' }
      ]
    });

    const stats = data.mergeTree(conflictTree, 'combine-non-null');

    expect(stats.conflicts.length).toBe(1);
    expect(stats.conflicts[0].name).toBe('John Doe');
    expect(stats.conflicts[0].existing.mother).toBe('Jane Doe');
    expect(stats.conflicts[0].incoming.mother).toBe('Conflicting Mom');
  });

  it('should handle empty tree merge', () => {
    const emptyTree = new GenealogyTreeData({ persons: [] });
    const stats = data.mergeTree(emptyTree);

    expect(stats.merged).toBe(0);
    expect(stats.added).toBe(0);
    expect(stats.conflicts.length).toBe(0);
    expect(data.persons.length).toBe(3);
  });

  it('should throw error when merging with non-GenealogyTreeData object', () => {
    expect(() => {
      data.mergeTree({ persons: [] });
    }).toThrow(/otherTree must be an instance of GenealogyTreeData/);
  });

  it('should merge without updating references when specified', () => {
    const otherTree = new GenealogyTreeData({
      persons: [
        { name: 'John Doe', mother: 'Different Mom', father: 'Jack Doe' },
        { name: 'Alice Smith', mother: 'Alice Mom', father: 'Alice Dad' },
        { name: 'Bob Jones', mother: null, father: 'Bob Dad' }
      ]
    });
    const stats = data.mergeTree(otherTree, 'combine-non-null', false);

    expect(stats.merged).toBe(2);
    expect(stats.added).toBe(6);

    const initialCount = 3 + 6;
    expect(data.persons.length).toBe(initialCount);
  });

  it('should merge complex tree with multiple relationships', () => {
    const complexTree = new GenealogyTreeData({
      persons: [
        { name: 'Grandpa Smith', mother: null, father: null },
        { name: 'Grandma Smith', mother: null, father: null },
        { name: 'Parent Smith', mother: 'Grandma Smith', father: 'Grandpa Smith' },
        { name: 'Child Smith', mother: 'Parent Smith', father: 'Jack Doe' }
      ]
    });

    const stats = data.mergeTree(complexTree);

    expect(stats.merged).toBe(1);
    expect(stats.added).toBeGreaterThanOrEqual(4);

    const childSmith = data.persons.find(p => p.name === 'Child Smith');
    expect(childSmith).toBeTruthy();
    expect(childSmith.mother).toBe('Parent Smith');
    expect(childSmith.father).toBe("Jack Doe");
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
    data = new GenealogyTreeData(JSON.parse(JSON.stringify(initialPersonsWithInfo)));
  });

  it('should initialize correctly with info fields', () => {
    expect(data.persons.length).toBe(4);

    const john = data.persons.find(p => p.name === 'John Doe');
    expect(john.info).toBe('1990-Present, Software Engineer');

    const jane = data.persons.find(p => p.name === 'Jane Doe');
    expect(jane.info).toBe('1965-2020, Teacher');

    const bob = data.persons.find(p => p.name === 'Bob Smith');
    expect(bob.info).toBeNull();

    const jack = data.persons.find(p => p.name === 'Jack Doe');
    expect(jack.info).toBeNull();
  });

  it('should add a new person with info field', () => {
    const newPerson = { name: 'Mary Jane', mother: 'Jane Doe', father: 'John Doe', info: 'Born 2015, Student' };
    data.addPerson(newPerson);

    const mary = data.persons.find(p => p.name === 'Mary Jane');
    expect(mary).toBeTruthy();
    expect(mary.info).toBe('Born 2015, Student');
  });

  it('should add a new person without info field', () => {
    const newPerson = { name: 'Sam Wilson', mother: 'Unknown', father: null };
    data.addPerson(newPerson);

    const sam = data.persons.find(p => p.name === 'Sam Wilson');
    expect(sam).toBeTruthy();
    expect(sam.info).toBeUndefined();
  });

  it('should update person info field', () => {
    const updatedJohn = { name: 'John Doe', mother: 'Jane Doe', father: 'Jack Doe', info: '1990-Present, Senior Developer' };
    data.updatePerson('John Doe', updatedJohn);

    const john = data.persons.find(p => p.name === 'John Doe');
    expect(john.info).toBe('1990-Present, Senior Developer');
  });

  it('should clear info field when updating person', () => {
    const updatedJane = { name: 'Jane Doe', mother: null, father: null, info: null };
    data.updatePerson('Jane Doe', updatedJane);

    const jane = data.persons.find(p => p.name === 'Jane Doe');
    expect(jane.info).toBeNull();
  });

  it('should generate DOT string with info as second line', () => {
    const dotString = data.genealogyDotString();

    expect(dotString).toContain('"John Doe" [label="John Doe\\n1990-Present, Software Engineer"');
    expect(dotString).toContain('"Jane Doe" [label="Jane Doe\\n1965-2020, Teacher"');
    expect(dotString).toContain('"Bob Smith" [label="Bob Smith"');
    expect(dotString).toContain('"Jack Doe" [label="Jack Doe"');
  });

  it('should escape quotes in info field for DOT generation', () => {
    const personWithQuotes = { name: 'Test Person', mother: null, father: null, info: 'Known as \"The Expert\"' };
    data.addPerson(personWithQuotes);

    const dotString = data.genealogyDotString();
    expect(dotString).toContain('"Test Person" [label="Test Person\\nKnown as \\"The Expert\\""');
  });

  it('should handle empty info field correctly', () => {
    const personWithEmptyInfo = { name: 'Empty Info', mother: null, father: null, info: '' };
    data.addPerson(personWithEmptyInfo);

    const dotString = data.genealogyDotString();
    expect(dotString).toContain('"Empty Info" [label="Empty Info"');
  });

  it('should handle whitespace-only info field correctly', () => {
    const personWithWhitespaceInfo = { name: 'Whitespace Info', mother: null, father: null, info: '   ' };
    data.addPerson(personWithWhitespaceInfo);

    const dotString = data.genealogyDotString();
    expect(dotString).toContain('"Whitespace Info" [label="Whitespace Info"');
  });

  it('should preserve info during person removal and reference updates', () => {
    const child = { name: 'Child Doe', mother: 'Jane Doe', father: 'John Doe', info: 'Born 2010' };
    data.addPerson(child);

    data.removePerson('Jane Doe');

    const childAfter = data.persons.find(p => p.name === 'Child Doe');
    expect(childAfter.info).toBe('Born 2010');
    expect(childAfter.mother).toBeNull();
  });
});

describe('Person Merging with Info Field', () => {
  let data;

  beforeEach(() => {
    data = new GenealogyTreeData({
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
    expect(merged.name).toBe('Alice');
    expect(merged.mother).toBe('Mom1');
    expect(merged.father).toBe('Dad1');
    expect(merged.info).toBe('Info from person1');
  });

  it('should merge persons with info using keep-first strategy', () => {
    const person1 = { name: 'Bob', mother: 'Mom1', father: 'Dad1', info: 'First info' };
    const person2 = { name: 'Bob', mother: 'Mom2', father: 'Dad2', info: 'Second info' };

    const merged = data.mergePerson(person1, person2, 'keep-first');
    expect(merged.info).toBe('First info');
  });

  it('should merge persons with info using keep-second strategy', () => {
    const person1 = { name: 'Charlie', mother: 'Mom1', father: 'Dad1', info: 'First info' };
    const person2 = { name: 'Charlie', mother: 'Mom2', father: 'Dad2', info: 'Second info' };

    const merged = data.mergePerson(person1, person2, 'keep-second');
    expect(merged.info).toBe('Second info');
  });

  it('should merge persons with info using prefer-complete strategy', () => {
    const person1 = { name: 'David', mother: 'Mom1', father: null, info: null };
    const person2 = { name: 'David', mother: null, father: 'Dad2', info: 'Complete info' };

    const merged = data.mergePerson(person1, person2, 'prefer-complete');
    expect(merged.mother).toBeNull();
    expect(merged.father).toBe('Dad2');
    expect(merged.info).toBe('Complete info');
  });

  it('should detect info conflicts during tree merge', () => {
    const otherTree = new GenealogyTreeData({
      persons: [
        { name: 'John Doe', mother: 'Jane Doe', father: 'Jack Doe', info: 'Different info' }
      ]
    });

    const stats = data.mergeTree(otherTree, 'combine-non-null');

    expect(stats.merged).toBe(3);

    const johnConflict = stats.conflicts.find(c => c.name === 'John Doe');
    expect(johnConflict).toBeTruthy();
    expect(johnConflict.existing.info).toBe('Original info');
    expect(johnConflict.incoming.info).toBe('Different info');
    expect(johnConflict.resolved.info).toBe('Original info');
  });

  it('should merge trees without info conflicts when no conflicts exist', () => {
    const otherTree = new GenealogyTreeData({
      persons: [
        { name: 'New Person', mother: null, father: null, info: 'Some info' },
        { name: 'Jane Doe', mother: 'Grandma', father: 'Grandpa', info: 'Added info' }
      ]
    });

    data.mergeTree(otherTree, 'combine-non-null');

    const jane = data.persons.find(p => p.name === 'Jane Doe');
    expect(jane.info).toBe('Added info');

    const newPerson = data.persons.find(p => p.name === 'New Person');
    expect(newPerson.info).toBe('Some info');
  });

  it('should handle null and undefined info fields correctly in merging', () => {
    const person1 = { name: 'Test', mother: null, father: null, info: undefined };
    const person2 = { name: 'Test', mother: null, father: null, info: 'Real info' };

    const merged = data.mergePerson(person1, person2, 'combine-non-null');
    expect(merged.info).toBe('Real info');
  });
});
