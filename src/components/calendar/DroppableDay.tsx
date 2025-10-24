import { useState } from 'react';
import { cn } from '@/lib/utils';

interface DroppableDayProps {
  day: number | null;
  onDrop: (postId: string, day: number) => void;
  children: React.ReactNode;
  className?: string;
}

export function DroppableDay({
  day,
  onDrop,
  children,
  className
}: DroppableDayProps) {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    
    const postId = e.dataTransfer.getData('postId');
    if (postId && day !== null) {
      onDrop(postId, day);
    }
  };

  if (day === null) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'drop-zone',
        isOver && 'drop-zone-active',
        className
      )}
    >
      {children}
    </div>
  );
}
