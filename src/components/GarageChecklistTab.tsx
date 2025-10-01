import React from 'react';
import VehicleChecklistCard from './VehicleChecklistCard';

interface ChecklistItem {
  id: string;
  name: string;
  status: 'validated' | 'pending' | 'issue';
  comment?: string;
}

interface VehicleChecklist {
  id: string;
  name: string;
  price: string;
  mileage: number;
  year: number;
  image: string;
  checklistItems: ChecklistItem[];
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
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {vehiclesChecklist.map(vehicle => (
        <VehicleChecklistCard
          key={vehicle.id}
          id={vehicle.id}
          name={vehicle.name}
          image={vehicle.image}
          mileage={vehicle.mileage}
          year={vehicle.year}
          price={vehicle.price}
          checklistItems={vehicle.checklistItems}
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