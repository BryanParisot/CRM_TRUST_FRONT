import React from 'react';
import { useDroppable } from '@dnd-kit/core';
interface KanbanColumnProps {
  id: string;
  title: string;
  step: number;
  isArchived?: boolean;
  children: React.ReactNode;
}
const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  step,
  isArchived = false,
  children
}) => {
  const {
    setNodeRef,
    isOver
  } = useDroppable({
    id
  });
  return (
    <div
      ref={setNodeRef}
      className={`flex-shrink-0 w-[360px] mr-4 last:mr-0 flex flex-col h-full transition-all duration-200 ${isOver ? 'scale-[1.02] ring-2 ring-blue-400 ring-offset-2' : ''
        }`}
    >
      <div className={`rounded-t-xl p-4 font-semibold text-sm shadow-sm ${isArchived
        ? 'bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-300'
        : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
        }`}>
        {title}
      </div>
      <div className={`flex-1 overflow-y-auto p-3 rounded-b-xl space-y-3 shadow-md ${isArchived
        ? 'bg-gray-50 dark:bg-gray-900'
        : 'bg-gradient-to-b from-blue-50/50 to-white dark:from-gray-800 dark:to-gray-900'
        }`}>
        {children}
      </div>
    </div>
  );
};

export default KanbanColumn;