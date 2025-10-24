import { useState } from 'react';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DraggablePostProps {
  id: string;
  title: string;
  content: string;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  className?: string;
}

export function DraggablePost({
  id,
  title,
  content,
  onDragStart,
  onDragEnd,
  className
}: DraggablePostProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
    e.dataTransfer.setData('postId', id);
    onDragStart(id);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    onDragEnd();
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={cn(
        'draggable p-3 bg-card border border-border rounded-lg',
        isDragging && 'dragging',
        className
      )}
    >
      <div className="flex items-start gap-2">
        <GripVertical className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium truncate">{title}</h4>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
}
