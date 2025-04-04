import { useState, useEffect } from 'react';
import { databases, TODOS_COLLECTION_ID, DATABASE_ID } from '../lib/appwriteConfig';
import { Query, ID } from 'appwrite';
import { Todo } from '../types/todo';
import { addToast } from '@heroui/toast';

export default function useTodos(userId: string) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, [userId]);

  const fetchTodos = async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        TODOS_COLLECTION_ID,
        [
          Query.equal('userId', userId),
          Query.orderAsc('order')
        ]
      );
      setTodos(response.documents.map(doc => ({
        id: doc.$id,
        title: doc.title,
        completed: doc.completed,
        userId: doc.userId,
        order: doc.order || 0,
        createdAt: doc.$createdAt,
        updatedAt: doc.$updatedAt
      })));
    } catch (error) {
      addToast({
        title: 'Failed to Load Todos',
        description: 'Could not fetch your todo items',
        variant: 'flat',
        color: 'danger',
        timeout: 3000
      });
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (title: string) => {
    try {
      const order = todos.length > 0 ? Math.max(...todos.map(t => t.order || 0)) + 1 : 0;
      const response = await databases.createDocument(
        DATABASE_ID,
        TODOS_COLLECTION_ID,
        ID.unique(),
        {
          title,
          completed: false,
          userId,
          order
        }
      );
      setTodos(prev => [{
        id: response.$id,
        title: response.title,
        completed: response.completed,
        userId: response.userId,
        order: response.order || 0,
        createdAt: response.$createdAt,
        updatedAt: response.$updatedAt
      }, ...prev]);
      
      addToast({
        title: 'Task Added',
        description: `"${title}" was added to your list`,
        variant: 'flat',
        color: 'success',
        timeout: 2000
      });
    } catch (error) {
      addToast({
        title: 'Failed to Add Task',
        description: 'Could not add the new todo item',
        variant: 'flat',
        color: 'danger',
        timeout: 3000
      });
      console.error('Error adding todo:', error);
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (!todo) return;

      const updated = await databases.updateDocument(
        DATABASE_ID,
        TODOS_COLLECTION_ID,
        id,
        { completed: !todo.completed }
      );
      setTodos(prev => prev.map(t => 
        t.id === id ? { 
          ...t, 
          completed: updated.completed,
          updatedAt: updated.$updatedAt
        } : t
      ));
      
      const action = updated.completed ? 'completed' : 'marked incomplete';
      addToast({
        title: 'Task Updated',
        description: `"${todo.title}" was ${action}`,
        variant: 'flat',
        color: 'default',
        timeout: 2000
      });
    } catch (error) {
      addToast({
        title: 'Failed to Update Task',
        description: 'Could not update the todo status',
        variant: 'flat',
        color: 'danger',
        timeout: 3000
      });
      console.error('Error toggling todo:', error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const todo = todos.find(t => t.id === id);
      await databases.deleteDocument(
        DATABASE_ID,
        TODOS_COLLECTION_ID,
        id
      );
      setTodos(prev => prev.filter(t => t.id !== id));
      
      addToast({
        title: 'Task Deleted',
        description: `"${todo?.title}" was removed`,
        variant: 'flat',
        color: 'default',
        timeout: 2000
      });
    } catch (error) {
      addToast({
        title: 'Failed to Delete Task',
        description: 'Could not remove the todo item',
        variant: 'flat',
        color: 'danger',
        timeout: 3000
      });
      console.error('Error deleting todo:', error);
    }
  };

  return {
    todos,
    setTodos,
    loading,
    addTodo,
    toggleTodo,
    deleteTodo
  };
}