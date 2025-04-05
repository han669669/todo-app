import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableTodoItem } from './sortable-todo-item';
import { Todo } from '../types/todo';
import { addToast } from '@heroui/toast'; // Import addToast

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newTask: string) => void;
  onReorder: (todos: Todo[]) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onToggle,
  onDelete,
  onEdit,
  onReorder,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 10,
        tolerance: 3,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = todos.findIndex((todo) => todo.id === active.id);
      const newIndex = todos.findIndex((todo) => todo.id === over.id);

      try {
        onReorder(arrayMove(todos, oldIndex, newIndex));
        addToast({
          title: 'Task Reordered',
          description: 'Task was successfully reordered',
          variant: 'flat',
          color: 'default',
          timeout: 1500
        });
      } catch (error) {
        addToast({
          title: 'Reorder Failed',
          description: error instanceof Error ? error.message : 'Failed to reorder task',
          variant: 'flat',
          color: 'danger',
          timeout: 2000
        });
      }
    }
  };

  if (todos.length === 0) {
    return (
      <div className="text-center py-8 text-default-500">
        No tasks yet. Add one above to get started!
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={todos} strategy={verticalListSortingStrategy}>
        <div className="space-y-2 w-full max-w-full overflow-x-auto">
          {todos.map((todo) => (
            <SortableTodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};