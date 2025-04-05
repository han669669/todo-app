import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../contexts/auth-context';
import useTodos from '../../hooks/useTodos';
import { TodoList } from '../../components/todo-list';
import { Button, Input, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/react';
import { Icon } from '@iconify/react';
import { addToast } from '@heroui/toast';
import { databases, DATABASE_ID, TODOS_COLLECTION_ID } from '../../lib/appwriteConfig';
import { Todo } from '../../types/todo';

export default function Dashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const { todos, setTodos, loading: todosLoading, addTodo, toggleTodo, deleteTodo } = useTodos(user?.$id);
  const history = useHistory();
  const [newTodo, setNewTodo] = useState('');

  if (authLoading) return <div className="flex justify-center p-8">Loading user...</div>;
  if (!user) {
    history.push('/login');
    return null;
  }

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      addTodo(newTodo);
      setNewTodo('');
    }
  };

  const handleEditTodo = async (id: string, newTitle: string) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (!todo || todo.title === newTitle) return;

      setTodos(prev => prev.map(t => 
        t.id === id ? { ...t, title: newTitle } : t
      ));

      await databases.updateDocument(
        DATABASE_ID,
        TODOS_COLLECTION_ID,
        id,
        { title: newTitle }
      );

      addToast({
        title: 'Task Updated',
        description: 'Task was successfully updated',
        variant: 'flat',
        color: 'success',
        timeout: 2000
      });
    } catch (error) {
      setTodos(todos);
      addToast({
        title: 'Update Failed',
        description: 'Could not update the task',
        variant: 'flat',
        color: 'danger',
        timeout: 3000
      });
    }
  };

  const handleReorder = async (newTodos: Todo[]) => {
    try {
      setTodos(newTodos);
      await Promise.all(newTodos.map((todo, index) => 
        databases.updateDocument(
          DATABASE_ID,
          TODOS_COLLECTION_ID,
          todo.id,
          { order: index }
        )
      ));
    } catch (error) {
      setTodos(todos);
      addToast({
        title: 'Reorder Failed',
        description: 'Could not save new order',
        variant: 'flat',
        color: 'danger',
        timeout: 3000
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar maxWidth="xl" className="border-b border-divider">
        <NavbarBrand>
          <Icon icon="lucide:check-circle" className="text-xl text-primary-500 mr-2" />
          <p className="font-semibold text-inherit text-lg">TodoApp</p>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem>
            <span className="text-default-600">Welcome, {user.name}</span>
          </NavbarItem>
          <NavbarItem>
            <Button
              color="danger"
              variant="light"
              onPress={logout}
              endContent={<Icon icon="lucide:log-out" />}
            >
              Logout
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <main className="flex-grow container mx-auto px-6 py-8">
        <form onSubmit={handleAddTodo} className="mb-8 flex gap-2">
          <Input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task..."
            className="flex-grow"
          />
          <Button type="submit" color="primary">
            Add
          </Button>
        </form>

        {todosLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin">
              <Icon icon="lucide:loader" className="text-2xl" />
            </div>
          </div>
        ) : (
          <TodoList 
            todos={todos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onEdit={handleEditTodo}
            onReorder={handleReorder}
          />
        )}
      </main>
    </div>
  );
}