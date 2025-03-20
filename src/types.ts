export type ColorTypes = 'red' | 'green' | 'yellow' | 'purple' | 'blue' | 'orange' | 'none';

export interface Card {
  id: number;
  title: string;
  description: string;
  lastEdited: Date | null;
  color: ColorTypes;
  deadline: Date | null;
  comments: Comment;
}

export interface List {
  id: number;
  title: string;
  cards: Card[];
  filterOpened: boolean;
}

export interface Comment {
  id: number;
  cardId: number;
  createdDate: Date;
  lastEdited: Date | null;
  content: string;
}
