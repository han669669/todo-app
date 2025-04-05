import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Checkbox, Input } from '@heroui/react';
import { Icon } from '@iconify/react';
import { Todo } from '../types/todo';

interface SortableTodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newTitle: string) => void;
}

export const SortableTodoItem: React.FC<SortableTodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
  onEdit,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: todo.id });

  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState(todo.title);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Debounced toggle handler
  const toggleTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const debouncedToggle = () => {
    if (toggleTimeout.current) {
      clearTimeout(toggleTimeout.current);
    }
    toggleTimeout.current = setTimeout(() => {
      onToggle(todo.id);
    }, 200);
  };

  const handleEditSubmit = () => {
    if (editValue.trim() && editValue !== todo.title) {
      onEdit(todo.id, editValue);
    }
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={{ ...style }}
      className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md w-full max-w-full border border-gray-200"
    >
      <Button
        isIconOnly
        variant="light"
        size="sm"
        style={{ touchAction: 'none' }}
        {...attributes}
        {...listeners}
        className="text-gray-500 hover:text-gray-700"
      >
        <Icon icon="lucide:grip-vertical" />
      </Button>

      <div className="flex-1 flex items-center gap-3">
        <Checkbox
          isSelected={todo.completed}
          onValueChange={debouncedToggle}
          className="shrink-0"
        />
        {isEditing ? (
          <Input
            autoFocus
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleEditSubmit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleEditSubmit();
              if (e.key === 'Escape') setIsEditing(false);
            }}
            className="w-full text-sm"
          />
        ) : (
          <span
            className={`flex-1 text-sm ${
              todo.completed ? 'line-through text-gray-400' : 'text-gray-800'
            }`}
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {!isEditing && (
          <Button
            isIconOnly
            variant="light"
            size="sm"
            onPress={() => setIsEditing(true)}
            className="text-gray-500 hover:text-gray-700"
          >
            <Icon icon="lucide:edit" />
          </Button>
        )}
        <Button
          isIconOnly
          color="danger"
          variant="light"
          size="sm"
          onPress={() => onDelete(todo.id)}
          className="text-red-500 hover:text-red-700"
        >
          <Icon icon="lucide:trash-2" />
        </Button>
      </div>
    </div>
  );
};
