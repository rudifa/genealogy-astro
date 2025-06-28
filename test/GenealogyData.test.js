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
