import React from 'react';
import { EuroIcon, GaugeIcon, CalendarIcon } from 'lucide-react';

interface Vehicle {
  id: string;
  name: string;
  price: string;
  mileage: number;
  year: number;
  image: string;
}

interface ClientSelectionTabProps {
  vehicleOptions: Vehicle[];
  selectedVehicles: string[];
  handleVehicleSelection: (vehicleId: string) => void;
  formatMileage: (mileage: number) => string;
}

const ClientSelectionTab: React.FC<ClientSelectionTabProps> = ({
  vehicleOptions,
  selectedVehicles,
  handleVehicleSelection,
  formatMileage,
}) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-medium mb-4">Sélection des véhicules (max 3)</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Veuillez sélectionner jusqu'à 3 véhicules qui vous intéressent.
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {vehicleOptions.map(vehicle => (
        <div
          key={vehicle.id}
          className={`border rounded-lg overflow-hidden ${
            selectedVehicles.includes(vehicle.id)
              ? 'ring-2 ring-blue-500 border-blue-500'
              : 'border-gray-200 dark:border-gray-700'
          }`}
        >
          <img
            src={vehicle.image}
            alt={vehicle.name}
            className="w-full h-32 object-cover"
          />
          <div className="p-4">
            <h3 className="font-medium">{vehicle.name}</h3>
            <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <EuroIcon className="w-3.5 h-3.5 mr-1 text-blue-500" />
                {vehicle.price}
              </div>
              <div className="flex items-center">
                <GaugeIcon className="w-3.5 h-3.5 mr-1 text-green-500" />
                {formatMileage(vehicle.mileage)} km
              </div>
              <div className="flex items-center">
                <CalendarIcon className="w-3.5 h-3.5 mr-1 text-purple-500" />
                {vehicle.year}
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <input
                type="checkbox"
                id={`select-${vehicle.id}`}
                checked={selectedVehicles.includes(vehicle.id)}
                onChange={() => handleVehicleSelection(vehicle.id)}
                disabled={
                  selectedVehicles.length >= 3 &&
                  !selectedVehicles.includes(vehicle.id)
                }
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor={`select-${vehicle.id}`}
                className="ml-2 text-sm text-gray-700 dark:text-gray-300"
              >
                {selectedVehicles.includes(vehicle.id)
                  ? 'Sélectionné'
                  : 'Sélectionner ce véhicule'}
              </label>
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className="flex justify-between items-center">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {selectedVehicles.length} sur 3 véhicules sélectionnés
      </p>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={selectedVehicles.length === 0}
      >
        Confirmer la Sélection
      </button>
    </div>
  </div>
);

export default ClientSelectionTab;