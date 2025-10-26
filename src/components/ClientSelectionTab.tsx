import React from 'react';
import { EuroIcon, GaugeIcon, CalendarIcon, FuelIcon, PowerCircleIcon, ZapIcon, CogIcon } from 'lucide-react';

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
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {vehicleOptions.map(vehicle => (
    <div
      key={vehicle.id}
      title={vehicle.title}
      className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
        selectedVehicles.includes(vehicle.id)
          ? 'ring-2 ring-blue-500'
          : 'border border-gray-200 dark:border-gray-700'
      }`}
    >
      <img
        src={vehicle.image}
        alt={vehicle.title}
        className="w-full h-40 object-cover rounded-t-xl"
      />
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {vehicle.title}
        </h3>
        <div className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center">
            <GaugeIcon className="w-4 h-4 mr-2 text-green-500" />
            <span>{formatMileage(vehicle.mileage)} km</span>
          </div>
          <div className="flex items-center">
            <FuelIcon className="w-4 h-4 mr-2 text-green-500" />
            <span>{formatMileage(vehicle.fuel)}</span>
          </div>
          <div className="flex items-center">
            <ZapIcon className="w-4 h-4 mr-2 text-green-500" />
            <span>{formatMileage(vehicle.power)}</span>
          </div>
          <div className="flex items-center">
            <CalendarIcon className="w-4 h-4 mr-2 text-purple-500" />
            <span>{vehicle.year}</span>
          </div>
          <div className="flex items-center">
            <CogIcon className="w-4 h-4 mr-2 text-purple-500" />
            <span>{vehicle.gearbox}</span>
          </div>
          <div className="flex items-center">
            <a
              href={vehicle.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 underline text-sm"
            >
              Voir les détails
            </a>
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <input
            type="checkbox"
            id={`select-${vehicle.id}`}
            checked={selectedVehicles.includes(vehicle.id)}
            onChange={() => handleVehicleSelection(vehicle.id)}
            disabled={
              selectedVehicles.length >= 3 &&
              !selectedVehicles.includes(vehicle.id)
            }
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-colors"
          />
          <label
            htmlFor={`select-${vehicle.id}`}
            className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            {selectedVehicles.includes(vehicle.id) ? 'Sélectionné' : 'Sélectionner'}
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