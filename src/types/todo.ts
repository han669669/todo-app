export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  userId: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}
