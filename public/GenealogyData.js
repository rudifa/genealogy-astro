export class GenealogyData {
  constructor(initialData) {
    this.persons = initialData.persons || [];
  }

  addPerson(person) {
    this.persons.push(person);
  }

  updatePerson(originalName, updatedPerson) {
    const personIndex = this.persons.findIndex(p => p.name === originalName);
    if (personIndex > -1) {
      this.persons[personIndex] = updatedPerson;
      if (updatedPerson.name !== originalName) {
        this.updateReferences(originalName, updatedPerson.name);
      }
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
}
