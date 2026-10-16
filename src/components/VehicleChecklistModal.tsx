import React, {useState} from 'react';
import { ExternalLink, XIcon } from 'lucide-react';
import VehicleChecklist, { ChecklistItem } from './VehicleChecklist';
import { matchesChecklistTemplate } from '../utils/vehicleChecklist';
export interface VehicleChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => Promise<boolean>;
  onInitialize: () => void;
  vehicleName: string;
  vehicleLink: string | null;
  checklistItems: ChecklistItem[];
  onUpdateStatus: (itemId: string, status: 'validated' | 'pending' | 'issue' | 'rejected') => void;
  onUpdateComment: (itemId: string, comment: string) => void;
}
const VehicleChecklistModal: React.FC<VehicleChecklistModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onInitialize,
  vehicleName,
  vehicleLink,
  checklistItems,
  onUpdateStatus,
  onUpdateComment
}) => {
  const [saving,setSaving]=useState(false);
  if (!isOpen) return null;
  // Count validated, pending and issue items
  const validated = checklistItems.filter(item => item.status === 'validated').length;
  const total = checklistItems.length;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col">
      <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
        <h2 className="text-lg font-semibold">Checklist Technique</h2>
        <button disabled={saving} aria-label="Fermer la checklist" onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none disabled:opacity-50">
          <XIcon className="w-5 h-5" />
        </button>
      </div>
      <fieldset disabled={saving} className="min-w-0 overflow-y-auto p-4">
        <div className="flex items-start mb-6">
          <div className="min-w-0">
            <h3 className="font-medium text-lg">{vehicleName}</h3>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {vehicleLink&&<a href={vehicleLink} target="_blank" rel="noopener noreferrer" className="inline-flex max-w-full items-start gap-2 text-sm text-blue-600 hover:underline dark:text-blue-400"><ExternalLink size={16} className="mt-0.5 shrink-0"/><span className="break-all">{vehicleLink}</span></a>}
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
          {checklistItems.length > 0 && !matchesChecklistTemplate(checklistItems) && <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-900/20">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-200">Un nouveau modèle de checklist est disponible.</p>
            <p className="mt-1 text-xs leading-5 text-blue-800 dark:text-blue-300">Les six rubriques de contrôle et le rapport CEBIA remplaceront les points actuels, avec tous les statuts en attente. Vérifiez-les puis enregistrez pour appliquer la mise à jour.</p>
            <button onClick={onInitialize} className="mt-3 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">Charger la nouvelle checklist</button>
          </div>}
          {checklistItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-gray-500 mb-4">Aucune checklist n'a été créée pour ce véhicule.</p>
              <button
                onClick={onInitialize}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Charger la checklist standard
              </button>
            </div>
          ) : (
            <VehicleChecklist vehicleName={vehicleName} checklistItems={checklistItems} onUpdateStatus={onUpdateStatus} onUpdateComment={onUpdateComment} />
          )}
        </div>
      </fieldset>
      <div className="p-4 border-t dark:border-gray-700 flex justify-end">
        <button disabled={saving} onClick={async () => {
          setSaving(true);
          try{if(await onSave())onClose();}finally{setSaving(false);}
        }} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
          {saving?'Enregistrement…':'Fermer et Enregistrer'}
        </button>
      </div>
    </div>
  </div>;
};
export default VehicleChecklistModal;
