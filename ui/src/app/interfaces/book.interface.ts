// src/tasks/interfaces/task.interface.ts
export interface Book {
  _id?: string;
  title: string;
  description: string;
  __v?: number;
}

export interface Action {
  action: string;
  item: Book;
}