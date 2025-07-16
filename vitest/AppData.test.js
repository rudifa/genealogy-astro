// vitest/AppData.test.js
import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { GenealogyForestData } from '../public/utility/GenealogyForestData.js';
import { GenealogyTreeData } from '../public/utility/GenealogyTreeData.js';
import { AppData } from '../public/utility/AppData.js';

describe('AppData', () => {
  beforeAll(() => {
    global.localStorage = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
  });
  let appData;
  const initialTreeData = { persons: [{ name: 'Alice' }, { name: 'Bob' }] };
  const translations = { en: { hello: 'Hello' }, fr: { hello: 'Bonjour' } };

  beforeEach(() => {
    appData = new AppData();
  });

  it('initializes state with initialize()', () => {
    appData.initialize(initialTreeData, translations);
    expect(appData.state.forestData).toBeInstanceOf(GenealogyForestData);
    expect(appData.state.genealogyData).toBeInstanceOf(GenealogyTreeData);
    expect(appData.state.currentTreeName).toBe('Family Example');
    expect(appData.state.availableTrees).toContain('Family Example');
    expect(appData.state.translations).toBe(translations);
    expect(appData.state.isLoading).toBe(false);
  });

  it('subscribes and notifies callbacks', () => {
    const cb = vi.fn();
    appData.subscribe(cb);
    appData.notify();
    expect(cb).toHaveBeenCalledWith(appData.state);
  });

  it('setLanguage updates translations', () => {
    appData.initialize(initialTreeData, translations);
    appData.setLanguage('fr', translations);
    expect(appData.state.translations).toBe(translations.fr);
  });



  it('updatePerson updates a person', () => {
    appData.initialize(initialTreeData, translations);
    appData.updatePerson('Alice', { name: 'Alice', age: 30 });
    expect(appData.state.genealogyData.persons.find(p => p.name === 'Alice').age).toBe(30);
  });

  it('removePerson removes a person', () => {
    appData.initialize(initialTreeData, translations);
    appData.removePerson('Bob');
    expect(appData.state.genealogyData.persons.find(p => p.name === 'Bob')).toBeUndefined();
  });

  it('clearAllPersons clears all persons', () => {
    appData.initialize(initialTreeData, translations);
    appData.clearAllPersons();
    expect(appData.state.genealogyData.persons.length).toBe(0);
  });

  it('switchToTree switches tree', () => {
    appData.initialize(initialTreeData, translations);
    appData.state.forestData.createNewTree('Tree2', { persons: [] });
    const result = appData.switchToTree('Tree2');
    expect(result).toBe(true);
    expect(appData.state.currentTreeName).toBe('Tree2');
  });

  it('createNewTree creates a new tree', () => {
    appData.initialize(initialTreeData, translations);
    const result = appData.createNewTree('Tree3');
    expect(result).toBe(true);
    expect(appData.state.availableTrees).toContain('Tree3');
  });

  it('replaceCurrentTreeData replaces data', () => {
    appData.initialize(initialTreeData, translations);
    appData.replaceCurrentTreeData([{ name: 'Zoe' }]);
    expect(appData.state.genealogyData.persons[0].name).toBe('Zoe');
  });

  it('mergeDataIntoCurrentTree merges data', () => {
    appData.initialize(initialTreeData, translations);
    appData.mergeDataIntoCurrentTree([{ name: 'Eve' }]);
    expect(appData.state.genealogyData.persons.find(p => p.name === 'Eve')).toBeDefined();
  });

  it('deleteTree deletes a tree', () => {
    appData.initialize(initialTreeData, translations);
    appData.createNewTree('Tree4');
    const result = appData.deleteTree('Tree4');
    expect(result).toBe(true);
    expect(appData.state.availableTrees).not.toContain('Tree4');
  });

  it('resetFamilyExample resets data', () => {
    appData.initialize(initialTreeData, translations);
    const result = appData.resetFamilyExample();
    expect(result).toBe(true);
  });

  it('getTreeData and getOriginalFamilyExampleData return data', () => {
    appData.initialize(initialTreeData, translations);
    expect(appData.getTreeData('Family Example')).toEqual(initialTreeData);
    expect(appData.getOriginalFamilyExampleData()).toEqual(initialTreeData);
  });

  it('getState returns a copy of state', () => {
    appData.initialize(initialTreeData, translations);
    const state = appData.getState();
    expect(state).not.toBe(appData.state);
    expect(state.currentTreeName).toBe('Family Example');
  });
});
