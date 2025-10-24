import { useState, useRef, useEffect, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TooltipCustomProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

export function TooltipCustom({
  content,
  children,
  position = 'top',
  delay = 300,
  className
}: TooltipCustomProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<NodeJS.Timeout>();
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        let x = 0;
        let y = 0;

        switch (position) {
          case 'top':
            x = rect.left + rect.width / 2;
            y = rect.top - 10;
            break;
          case 'bottom':
            x = rect.left + rect.width / 2;
            y = rect.bottom + 10;
            break;
          case 'left':
            x = rect.left - 10;
            y = rect.top + rect.height / 2;
            break;
          case 'right':
            x = rect.right + 10;
            y = rect.top + rect.height / 2;
            break;
        }

        setCoords({ x, y });
        setIsVisible(true);
      }
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const positionClasses = {
    top: '-translate-x-1/2 -translate-y-full mb-2',
    bottom: '-translate-x-1/2 translate-y-0 mt-2',
    left: '-translate-x-full -translate-y-1/2 mr-2',
    right: 'translate-x-0 -translate-y-1/2 ml-2'
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        {children}
      </div>
      {isVisible && (
        <div
          className={cn(
            'tooltip tooltip-visible',
            positionClasses[position],
            className
          )}
          style={{
            position: 'fixed',
            left: `${coords.x}px`,
            top: `${coords.y}px`,
            zIndex: 9999
          }}
        >
          {content}
          <div
            className={cn(
              'absolute w-2 h-2 bg-gray-900 rotate-45',
              position === 'top' && 'bottom-[-4px] left-1/2 -translate-x-1/2',
              position === 'bottom' && 'top-[-4px] left-1/2 -translate-x-1/2',
              position === 'left' && 'right-[-4px] top-1/2 -translate-y-1/2',
              position === 'right' && 'left-[-4px] top-1/2 -translate-y-1/2'
            )}
          />
        </div>
      )}
    </>
  );
}
