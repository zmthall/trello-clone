export type ColorTypes = 'red' | 'green' | 'yellow' | 'purple' | 'blue' | 'orange' | 'none';

export interface Card {
  id: number;
  title: string;
  description: string;
  color: ColorTypes;
  deadline: Date | null;
}

export interface List {
  id: number;
  title: string;
  cards: Card[];
  filterOpened: boolean;
}
