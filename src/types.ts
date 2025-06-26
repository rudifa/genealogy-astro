export interface Person {
  name: string;
  mother?: string;
  father?: string;
}

export interface GenealogyData {
  persons: Person[];
}
