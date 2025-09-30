import React from 'react';
import { CheckCircleIcon, AlertCircleIcon, XCircleIcon, ArrowRightIcon } from 'lucide-react';
import { ChecklistItem } from './VehicleChecklist';
export interface VehicleChecklistCardProps {
  id: string;
  name: string;
  image: string;
  mileage: number;
  year: number;
  price: string;
  checklistItems: ChecklistItem[];
  onClick: () => void;
}
const VehicleChecklistCard: React.FC<VehicleChecklistCardProps> = ({
  id,
  name,
  image,
  mileage,
  year,
  price,
  checklistItems,
  onClick
}) => {
  // Count validated, pending and issue items
  const validated = checklistItems.filter(item => item.status === 'validated').length;
  const pending = checklistItems.filter(item => item.status === 'pending').length;
  const issues = checklistItems.filter(item => item.status === 'issue').length;
  const total = checklistItems.length;
  // Format mileage with thousand separators
  const formatMileage = (mileage: number) => {
    return mileage.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };
  // Determine the status color for the card border
  const getBorderColor = () => {
    if (issues > 0) return 'border-red-300 dark:border-red-700';
    if (pending > 0) return 'border-yellow-300 dark:border-yellow-700';
    if (validated === total) return 'border-green-300 dark:border-green-700';
    return 'border-gray-200 dark:border-gray-700';
  };
  return <div onClick={onClick} className={`border-2 ${getBorderColor()} rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-md`}>
      <div className="relative">
        <img src={image} alt={name} className="w-full h-40 object-cover" />
        <div className="absolute top-2 right-2 px-2 py-1 bg-gray-800 bg-opacity-75 rounded-md text-white text-xs">
          {year}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-lg mb-2">{name}</h3>
        <div className="flex justify-between items-center mb-3 text-sm text-gray-600 dark:text-gray-400">
          <div>{formatMileage(mileage)} km</div>
          <div>{price}</div>
        </div>
        <div className="flex items-center justify-between">
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
            {issues > 0 && <div className="flex items-center text-xs text-red-600 dark:text-red-400">
                <XCircleIcon className="w-4 h-4 mr-1" />
                {issues}
              </div>}
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button className="flex items-center text-sm text-blue-600 dark:text-blue-400" onClick={onClick}>
            Voir détails <ArrowRightIcon className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>;
};
export default VehicleChecklistCard;