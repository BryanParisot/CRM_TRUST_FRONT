import React from 'react';
import VehicleChecklistCard from './VehicleChecklistCard';

interface ChecklistItem {
  id: string;
  name: string;
  status: 'validated' | 'pending' | 'issue' | 'rejected';
  comment?: string;
}

interface VehicleChecklist {
  id: string;
  name: string;
  link: string | null;
  checklistItems: ChecklistItem[];
  isFinalChoice:boolean;
  needsReconfirmation:boolean;
}

interface GarageChecklistTabProps {
  vehiclesChecklist: VehicleChecklist[];
  handleOpenVehicleChecklist: (vehicleId: string) => void;
}

const GarageChecklistTab: React.FC<GarageChecklistTabProps> = ({
  vehiclesChecklist,
  handleOpenVehicleChecklist,
}) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-medium mb-2">Validation Technique des Véhicules</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Vérification technique complète des véhicules par notre garage partenaire.
        Cliquez sur un véhicule pour voir et modifier sa checklist.
      </p>
      {vehiclesChecklist.some(vehicle=>vehicle.isFinalChoice)?<p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">{vehiclesChecklist.find(vehicle=>vehicle.isFinalChoice)?.needsReconfirmation?'Choix à reconfirmer par le client':'Choix définitif du client'} : <strong>{vehiclesChecklist.find(vehicle=>vehicle.isFinalChoice)?.name}</strong></p>:<p className="mb-4 text-sm text-gray-500">En attente du choix définitif du client après consultation des contrôles.</p>}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {vehiclesChecklist.map(vehicle => (
        <VehicleChecklistCard
          key={vehicle.id}
          id={vehicle.id}
          name={vehicle.name}
          link={vehicle.link}
          checklistItems={vehicle.checklistItems}
          isFinalChoice={vehicle.isFinalChoice}
          needsReconfirmation={vehicle.needsReconfirmation}
          isNotChosen={vehiclesChecklist.some(item=>item.isFinalChoice)&&!vehicle.isFinalChoice}
          onClick={() => handleOpenVehicleChecklist(vehicle.id)}
        />
      ))}
    </div>
    <div className="flex justify-end">
      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        Valider toutes les Checklists
      </button>
    </div>
  </div>
);

export default GarageChecklistTab;
