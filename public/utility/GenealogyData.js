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
   * @param {string|null} person.info - Additional info about the person (optional)
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
   * @param {string|null} updatedPerson.info - Additional info about the person (optional)
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
      this.persons.push({ name, mother: null, father: null, info: null });
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
      const person = this.persons.find(p => p.name === name);
      const url = `URL="person:${encodeURIComponent(name)}"`;

      // Create label with name on first line and info on second line (if available)
      let label = name;
      if (person && person.info && person.info.trim()) {
        // Escape quotes and newlines for DOT format
        const escapedName = name.replace(/"/g, '\\"');
        const escapedInfo = person.info.trim().replace(/"/g, '\\"');
        label = `${escapedName}\\n${escapedInfo}`;
      }

      dotLines.push(`  "${name}" [label="${label}"${url ? ", " + url : ""}];`);
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

  /**
   * Merge two person objects using the specified strategy
   * @param {Object} person1 - First person object (target)
   * @param {Object} person2 - Second person object (source)
   * @param {string} mergeStrategy - Strategy: 'keep-first', 'keep-second', 'combine-non-null', 'prefer-complete'
   * @returns {Object} Merged person object
   */
  mergePerson(person1, person2, mergeStrategy = 'combine-non-null') {
    if (!person1 || !person2) {
      throw new Error('Both persons must be provided for merging');
    }

    if (person1.name !== person2.name) {
      throw new Error('Cannot merge persons with different names');
    }

    const merged = { name: person1.name };

    switch (mergeStrategy) {
      case 'keep-first':
        merged.mother = person1.mother;
        merged.father = person1.father;
        merged.info = person1.info;
        break;

      case 'keep-second':
        merged.mother = person2.mother;
        merged.father = person2.father;
        merged.info = person2.info;
        break;

      case 'combine-non-null':
        merged.mother = person1.mother || person2.mother || null;
        merged.father = person1.father || person2.father || null;
        merged.info = person1.info || person2.info || null;
        break;

      case 'prefer-complete': {
        // Choose the person with more complete information
        const person1Complete = (person1.mother ? 1 : 0) + (person1.father ? 1 : 0) + (person1.info ? 1 : 0);
        const person2Complete = (person2.mother ? 1 : 0) + (person2.father ? 1 : 0) + (person2.info ? 1 : 0);

        if (person1Complete >= person2Complete) {
          merged.mother = person1.mother;
          merged.father = person1.father;
          merged.info = person1.info;
        } else {
          merged.mother = person2.mother;
          merged.father = person2.father;
          merged.info = person2.info;
        }
        break;
      }

      default:
        throw new Error(`Unknown merge strategy: ${mergeStrategy}`);
    }

    return merged;
  }

  /**
   * Merge another genealogy tree into this one
   * @param {GenealogyData} otherTree - Another GenealogyData instance to merge
   * @param {string} mergeStrategy - Strategy for merging duplicate persons: 'keep-first', 'keep-second', 'combine-non-null', 'prefer-complete'
   * @param {boolean} updateReferences - Whether to update references after merging (default: true)
   * @returns {Object} Merge statistics: { merged: number, added: number, conflicts: Array }
   */
  mergeTree(otherTree, mergeStrategy = 'combine-non-null', updateReferences = true) {
    if (!(otherTree instanceof GenealogyData)) {
      throw new Error('otherTree must be an instance of GenealogyData');
    }

    const stats = {
      merged: 0,
      added: 0,
      conflicts: []
    };

    const existingNames = new Map();
    this.persons.forEach((person, index) => {
      existingNames.set(person.name, index);
    });

    // Process each person from the other tree
    otherTree.persons.forEach(otherPerson => {
      if (existingNames.has(otherPerson.name)) {
        // Person exists - merge them
        const existingIndex = existingNames.get(otherPerson.name);
        const existingPerson = this.persons[existingIndex];

        try {
          const mergedPerson = this.mergePerson(existingPerson, otherPerson, mergeStrategy);

          // Check if there are conflicts (different non-null values)
          const hasConflict =
            (existingPerson.mother && otherPerson.mother && existingPerson.mother !== otherPerson.mother) ||
            (existingPerson.father && otherPerson.father && existingPerson.father !== otherPerson.father) ||
            (existingPerson.info && otherPerson.info && existingPerson.info !== otherPerson.info);

          if (hasConflict) {
            stats.conflicts.push({
              name: otherPerson.name,
              existing: { mother: existingPerson.mother, father: existingPerson.father, info: existingPerson.info },
              incoming: { mother: otherPerson.mother, father: otherPerson.father, info: otherPerson.info },
              resolved: { mother: mergedPerson.mother, father: mergedPerson.father, info: mergedPerson.info }
            });
          }

          this.persons[existingIndex] = mergedPerson;
          stats.merged++;
        } catch (error) {
          stats.conflicts.push({
            name: otherPerson.name,
            error: error.message
          });
        }
      } else {
        // Person doesn't exist - add them
        this.persons.push({ ...otherPerson });
        stats.added++;
      }
    });

    if (updateReferences) {
      this.updatePersonsFromNames();
    }

    return stats;
  }
}
