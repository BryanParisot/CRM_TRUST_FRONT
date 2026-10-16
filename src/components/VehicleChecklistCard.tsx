import React from 'react';
import { CheckCircleIcon, AlertCircleIcon, XCircleIcon, ArrowRightIcon, Car, ExternalLink } from 'lucide-react';
import { ChecklistItem } from './VehicleChecklist';
export interface VehicleChecklistCardProps {
  id: string;
  name: string;
  link: string | null;
  checklistItems: ChecklistItem[];
  onClick: () => void;
}
const VehicleChecklistCard: React.FC<VehicleChecklistCardProps> = ({
  name,
  link,
  checklistItems,
  onClick
}) => {
  // Count validated, pending and issue items
  const validated = checklistItems.filter(item => item.status === 'validated').length;
  const pending = checklistItems.filter(item => item.status === 'pending').length;
  const issues = checklistItems.filter(item => item.status === 'issue').length;
  const rejected = checklistItems.filter(item => item.status === 'rejected').length;
  const total = checklistItems.length;
  // Determine the status color for the card border
  const getBorderColor = () => {
    if (rejected > 0) return 'border-red-500 dark:border-red-600';
    if (issues > 0) return 'border-orange-300 dark:border-orange-700';
    if (pending > 0) return 'border-yellow-300 dark:border-yellow-700';
    if (total > 0 && validated === total) return 'border-green-300 dark:border-green-700';
    return 'border-gray-200 dark:border-gray-700';
  };
  return <article className={`min-w-0 border-2 ${getBorderColor()} rounded-xl overflow-hidden transition-shadow hover:shadow-md`}>
    <div className="p-4">
      <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300"><Car size={21}/></span>
      <h3 className="break-words font-semibold text-base">{name}</h3>
      {link&&<a href={link} target="_blank" rel="noopener noreferrer" className="mt-2 flex items-start gap-1.5 text-xs leading-5 text-blue-600 hover:underline dark:text-blue-400"><ExternalLink size={14} className="mt-0.5 shrink-0"/><span className="break-all">{link}</span></a>}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-4 dark:border-gray-700">
        <div className="text-sm font-medium">
          Points de contrôle:{' '}
          <span className="font-bold">
            {validated}/{total}
          </span>
        </div>
        <div className="flex space-x-2">
          {validated > 0 && <div className="flex items-center text-xs text-green-600 dark:text-green-400">
            <CheckCircleIcon className="w-4 h-4 mr-1" />
            {validated}
          </div>}
          {pending > 0 && <div className="flex items-center text-xs text-yellow-600 dark:text-yellow-400">
            <AlertCircleIcon className="w-4 h-4 mr-1" />
            {pending}
          </div>}
          {issues > 0 && <div className="flex items-center text-xs text-orange-600 dark:text-orange-400">
            <AlertCircleIcon className="w-4 h-4 mr-1" />
            {issues}
          </div>}
          {rejected > 0 && <div className="flex items-center text-xs text-red-600 dark:text-red-400">
            <XCircleIcon className="w-4 h-4 mr-1" />
            {rejected}
          </div>}
        </div>
      </div>
      {total===0&&<p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Checklist à préparer</p>}
      <div className="mt-4 flex justify-end">
        <button aria-label={`Ouvrir la checklist de ${name}`} className="flex items-center rounded-lg px-2 py-1 text-sm text-blue-600 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 dark:text-blue-400 dark:hover:bg-blue-900/30" onClick={onClick}>
          Voir la checklist <ArrowRightIcon className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  </article>;
};
export default VehicleChecklistCard;
