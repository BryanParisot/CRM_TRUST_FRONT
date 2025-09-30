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
  return <div ref={setNodeRef} className={`flex-shrink-0 w-80 mr-4 last:mr-0 flex flex-col h-full ${isOver ? 'ring-2 ring-blue-400' : ''}`}>
      <div className={`rounded-t-lg p-3 font-medium ${isArchived ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400' : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'}`}>
        {title}
      </div>
      <div className={`flex-1 overflow-y-auto p-2 rounded-b-lg space-y-2 ${isArchived ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-800'}`}>
        {children}
      </div>
    </div>;
};
export default KanbanColumn;