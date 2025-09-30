import React from 'react';
import { XIcon } from 'lucide-react';
import VehicleChecklist, { ChecklistItem } from './VehicleChecklist';
export interface VehicleChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleName: string;
  vehicleImage: string;
  vehicleYear: number;
  vehicleMileage: number;
  checklistItems: ChecklistItem[];
  onUpdateStatus: (itemId: string, status: 'validated' | 'pending' | 'issue') => void;
  onUpdateComment: (itemId: string, comment: string) => void;
}
const VehicleChecklistModal: React.FC<VehicleChecklistModalProps> = ({
  isOpen,
  onClose,
  vehicleName,
  vehicleImage,
  vehicleYear,
  vehicleMileage,
  checklistItems,
  onUpdateStatus,
  onUpdateComment
}) => {
  if (!isOpen) return null;
  // Format mileage with thousand separators
  const formatMileage = (mileage: number) => {
    return mileage.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };
  // Count validated, pending and issue items
  const validated = checklistItems.filter(item => item.status === 'validated').length;
  const total = checklistItems.length;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold">Checklist Technique</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none">
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto p-4">
          <div className="flex items-start mb-6">
            <img src={vehicleImage} alt={vehicleName} className="w-24 h-24 object-cover rounded-md mr-4" />
            <div>
              <h3 className="font-medium text-lg">{vehicleName}</h3>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                <div>
                  {vehicleYear} • {formatMileage(vehicleMileage)} km
                </div>
                <div className="mt-2 font-medium">
                  Points validés:{' '}
                  <span className="font-bold">
                    {validated}/{total}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <VehicleChecklist vehicleName={vehicleName} checklistItems={checklistItems} onUpdateStatus={onUpdateStatus} onUpdateComment={onUpdateComment} />
          </div>
        </div>
        <div className="p-4 border-t dark:border-gray-700 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Fermer et Enregistrer
          </button>
        </div>
      </div>
    </div>;
};
export default VehicleChecklistModal;