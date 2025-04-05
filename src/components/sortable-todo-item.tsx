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

  const handleEditSubmit = () => {
    if (editValue.trim() && editValue !== todo.title) {
      onEdit(todo.id, editValue);
    }
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, touchAction: 'none' }}
      className="flex flex-wrap items-center gap-2 p-3 bg-content1 rounded-lg w-full max-w-full"
    >
      <Button
        isIconOnly
        variant="light"
        size="sm"
        {...attributes}
        {...listeners}
      >
        <Icon icon="lucide:grip-vertical" className="text-default-400" />
      </Button>
      
      {isEditing ? (
        <>
          <Checkbox
            isSelected={todo.completed}
            onValueChange={() => onToggle(todo.id)}
            className="flex-1"
          />
          <Input
            autoFocus
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleEditSubmit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleEditSubmit();
              if (e.key === 'Escape') setIsEditing(false);
            }}
            className="w-full"
          />
        </>
      ) : (
        <Checkbox
          isSelected={todo.completed}
          onValueChange={() => onToggle(todo.id)}
          className="flex-1"
        >
          <span
            className={todo.completed ? 'line-through text-default-400' : ''}
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>
        </Checkbox>
      )}

      {!isEditing && (
        <Button
          isIconOnly
          variant="light"
          size="sm"
          onPress={() => setIsEditing(true)}
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
      >
        <Icon icon="lucide:trash-2" />
      </Button>
    </div>
  );
};