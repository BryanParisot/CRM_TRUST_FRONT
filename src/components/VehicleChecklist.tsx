import React, { useState } from 'react';
import { CheckIcon, XIcon, AlertCircleIcon } from 'lucide-react';
export interface ChecklistItem {
  id: string;
  name: string;
  status: 'validated' | 'pending' | 'issue';
  comment?: string;
}
export interface VehicleChecklistProps {
  vehicleName: string;
  checklistItems: ChecklistItem[];
  onUpdateStatus: (itemId: string, status: 'validated' | 'pending' | 'issue') => void;
  onUpdateComment: (itemId: string, comment: string) => void;
}
const VehicleChecklist: React.FC<VehicleChecklistProps> = ({
  vehicleName,
  checklistItems,
  onUpdateStatus,
  onUpdateComment
}) => {
  return <div className="border rounded-lg overflow-hidden">
      <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-b dark:border-gray-600">
        <h3 className="font-medium">{vehicleName}</h3>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {checklistItems.map(item => <ChecklistItemRow key={item.id} item={item} onUpdateStatus={onUpdateStatus} onUpdateComment={onUpdateComment} />)}
      </div>
    </div>;
};
interface ChecklistItemRowProps {
  item: ChecklistItem;
  onUpdateStatus: (itemId: string, status: 'validated' | 'pending' | 'issue') => void;
  onUpdateComment: (itemId: string, comment: string) => void;
}
const ChecklistItemRow: React.FC<ChecklistItemRowProps> = ({
  item,
  onUpdateStatus,
  onUpdateComment
}) => {
  const [showComment, setShowComment] = useState(false);
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'validated':
        return <CheckIcon className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <AlertCircleIcon className="w-5 h-5 text-yellow-500" />;
      case 'issue':
        return <XIcon className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };
  return <div className="px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="mr-3">{getStatusIcon(item.status)}</span>
          <span>{item.name}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button className={`w-8 h-8 rounded-full flex items-center justify-center ${item.status === 'validated' ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-700'}`} onClick={() => onUpdateStatus(item.id, 'validated')}>
            <CheckIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
          </button>
          <button className={`w-8 h-8 rounded-full flex items-center justify-center ${item.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900' : 'bg-gray-100 dark:bg-gray-700'}`} onClick={() => onUpdateStatus(item.id, 'pending')}>
            <AlertCircleIcon className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
          </button>
          <button className={`w-8 h-8 rounded-full flex items-center justify-center ${item.status === 'issue' ? 'bg-red-100 dark:bg-red-900' : 'bg-gray-100 dark:bg-gray-700'}`} onClick={() => onUpdateStatus(item.id, 'issue')}>
            <XIcon className="w-4 h-4 text-red-600 dark:text-red-400" />
          </button>
          <button className="text-xs text-blue-600 dark:text-blue-400 underline" onClick={() => setShowComment(!showComment)}>
            {item.comment ? 'Modifier commentaire' : 'Ajouter commentaire'}
          </button>
        </div>
      </div>
      {showComment && <div className="mt-2">
          <textarea className="w-full p-2 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600" value={item.comment || ''} onChange={e => onUpdateComment(item.id, e.target.value)} rows={2} placeholder="Ajouter un commentaire..." />
        </div>}
    </div>;
};
export default VehicleChecklist;