/**
 * GenealogyData handles genealogy tree operations and DOT graph generation.
 * Manages person data and relationships for family tree visualization.
 *
 * Expected data structures (matching TypeScript interfaces):
 * - PersonType: { name: string, mother?: string, father?: string }
 * - TreeDataType: { persons: PersonType[] }
 */
export class GenealogyData {
  /**
   * @param {Object} initialData - Tree data matching TreeDataType interface
   * @param {Array} initialData.persons - Array of person objects with name, mother?, father? properties
   */
  constructor(initialData) {
    this.persons = initialData.persons || [];
    this.updatePersonsFromNames();
  }

  /**
   * Add a new person to the genealogy data
   * @param {Object} person - Person object matching PersonType interface
   * @param {string} person.name - The person's name
   * @param {string|null} person.mother - The mother's name (optional)
   * @param {string|null} person.father - The father's name (optional)
   */
  addPerson(person) {
    this.persons.push(person);
    this.updatePersonsFromNames();
  }

  /**
   * Update an existing person or add a new one if not found
   * @param {string} originalName - The original name to search for
   * @param {Object} updatedPerson - Updated person data matching PersonType interface
   * @param {string} updatedPerson.name - The person's name
   * @param {string|null} updatedPerson.mother - The mother's name (optional)
   * @param {string|null} updatedPerson.father - The father's name (optional)
   */
  updatePerson(originalName, updatedPerson) {
    const personIndex = this.persons.findIndex(p => p.name === originalName);
    if (personIndex > -1) {
      this.persons[personIndex] = updatedPerson;
      if (updatedPerson.name !== originalName) {
        this.updateReferences(originalName, updatedPerson.name);
      }
      this.updatePersonsFromNames(); // we may have added a parent
    } else {
      this.addPerson(updatedPerson);
    }
  }

  /**
   * Remove a person from the genealogy data and update all references
   * @param {string} personName - The name of the person to remove
   */
  removePerson(personName) {
    const personIndex = this.persons.findIndex(p => p.name === personName);
    if (personIndex > -1) {
      this.persons.splice(personIndex, 1);
    }
    this.removeReferences(personName);
  }

  /**
   * Update all references to a person when their name changes
   * @param {string} oldName - The old name to replace
   * @param {string} newName - The new name to use
   */
  updateReferences(oldName, newName) {
    this.persons.forEach(p => {
      if (p.mother === oldName) p.mother = newName;
      if (p.father === oldName) p.father = newName;
    });
  }

  /**
   * Remove all references to a person (set mother/father to null)
   * @param {string} personName - The name of the person to remove references to
   */
  removeReferences(personName) {
    this.persons.forEach(p => {
      if (p.mother === personName) p.mother = null;
      if (p.father === personName) p.father = null;
    });
  }

  /**
   * Clear all person data from the genealogy
   */
  clear() {
    this.persons = [];
  }

  /**
   * Get all unique names mentioned in the genealogy data
   * Includes both direct persons and referenced parents
   * @returns {Set<string>} Set of all unique names
   */
  getAllUniqueNames() {
    const allNames = new Set();
    this.persons.forEach(p => {
      allNames.add(p.name);
      if (p.mother) allNames.add(p.mother);
      if (p.father) allNames.add(p.father);
    });
    return allNames;
  }

  /**
   * Automatically add missing person entries for all referenced names
   * Creates placeholder persons for mothers/fathers that don't have their own entries
   */
  updatePersonsFromNames() {

    const existingPersonNames = new Set(this.persons.map(p => p.name));
    const allNames = this.getAllUniqueNames(); // of persons and of parents
    const missingPersonNames = [];

    allNames.forEach(name => {
      if (!existingPersonNames.has(name)) {
        missingPersonNames.push(name);
      }
    });

    missingPersonNames.forEach(name => {
      this.persons.push({ name, mother: null, father: null });
    });
  }

   /**
   * Generate a DOT graph string for Graphviz visualization
   * Creates a directed graph with family relationships and clickable nodes
   * @returns {string} DOT format string for graph visualization
   */
   genealogyDotString() {
    const dotLines = [
      "strict digraph G {",
      '  node [shape=box, style="filled", fillcolor="#E9F4FF"];',
      "  edge [dir=none];",
    ];

    // 1. Collect all unique names from the dataset to define nodes.
    const allNames = this.getAllUniqueNames();

    // 2. Define all person nodes.
    allNames.forEach((name) => {
      const url = `URL="person:${encodeURIComponent(name)}"`;
      dotLines.push(`  "${name}" [label="${name}"${url ? ", " + url : ""}];`);
    });

    // 3. Define all relationships.
    for (const person of this.persons) {
      const childNode = `"${person.name}"`;
      if (person.mother && person.father) {
        const parentsNode = `"${person.mother}_${person.father}_family"`;
        dotLines.push(
          `  ${parentsNode} [shape=point];`,
          `  "${person.mother}" -> ${parentsNode};`,
          `  "${person.father}" -> ${parentsNode};`,
          `  ${parentsNode} -> ${childNode} [dir=forward, arrowhead=normal];`
        );
      } else if (person.mother) {
        dotLines.push(
          `  "${person.mother}" -> ${childNode} [dir=forward, arrowhead=normal];`
        );
      } else if (person.father) {
        dotLines.push(
          `  "${person.father}" -> ${childNode} [dir=forward, arrowhead=normal];`
        );
      }
    }

    dotLines.push("}");
    return dotLines.join("\n");
  }
}
