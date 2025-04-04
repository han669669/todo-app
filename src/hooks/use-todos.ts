import React from 'react';
import { Todo } from '../types/todo';

export const useTodos = () => {
  const [todos, setTodos] = React.useState<Todo[]>([]);

  const addTodo = (task: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      task,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTodos((prev) => [...prev, newTodo]);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const reorderTodos = (newTodos: Todo[]) => {
    setTodos(newTodos);
  };

  const editTodo = (id: string, newTask: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? {...todo, task: newTask} : todo
      )
    );
  };

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    reorderTodos,
    editTodo,
  };
};