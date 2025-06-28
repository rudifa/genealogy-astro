export class GenealogyData {
  constructor(initialData) {
    this.persons = initialData.persons || [];
    this.updatePersonsFromNames();
  }

  addPerson(person) {
    this.persons.push(person);
    this.updatePersonsFromNames();
  }

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

  removePerson(personName) {
    const personIndex = this.persons.findIndex(p => p.name === personName);
    if (personIndex > -1) {
      this.persons.splice(personIndex, 1);
    }
    this.removeReferences(personName);
  }

  updateReferences(oldName, newName) {
    this.persons.forEach(p => {
      if (p.mother === oldName) p.mother = newName;
      if (p.father === oldName) p.father = newName;
    });
  }

  removeReferences(personName) {
    this.persons.forEach(p => {
      if (p.mother === personName) p.mother = null;
      if (p.father === personName) p.father = null;
    });
  }

  clear() {
    this.persons = [];
  }

  getAllUniqueNames() {
    const allNames = new Set();
    this.persons.forEach(p => {
      allNames.add(p.name);
      if (p.mother) allNames.add(p.mother);
      if (p.father) allNames.add(p.father);
    });
    return allNames;
  }

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
