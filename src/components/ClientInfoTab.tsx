import React from 'react';
import { EuroIcon, GaugeIcon, CalendarIcon } from 'lucide-react';

interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  time: string;
}

interface ClientData {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicle: string;
  maxKm: string;
  vehicleColor: string;
  step: number;
  progress: number;
  budget: string;
  description: string;
  timeline: TimelineEvent[];
  deliveryOption?: string; // Nouveau champ pour l'option de livraison
}

interface Vehicle {
  id: string;
  name: string;
  price: string;
  mileage: number;
  year: number;
  image: string;
}

interface ClientInfoTabProps {
  clientData: ClientData;
  vehicleOptions: Vehicle[];
  formatMileage: (mileage: number) => string;
}

const ClientInfoTab: React.FC<ClientInfoTabProps> = ({ clientData, vehicleOptions, formatMileage }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        { label: 'Nom Complet', value: clientData.name },
        { label: 'Email', value: clientData.email },
        { label: 'Téléphone', value: clientData.phone },
        { label: 'Budget', value: clientData.budget },
        { label: 'Véhicule', value: clientData.vehicle },
        { label: 'Couleur du Véhicule', value: clientData.vehicleColor },
        { label: 'KM Max', value: clientData.maxKm },
        { label: 'Option de livraison', value: clientData.deliveryOption || 'Non spécifié' }, // Nouveau champ
      ].map(item => (
        <div key={item.label}>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {item.label}
          </h3>
          <p className="text-base">{item.value}</p>
        </div>
      ))}
    </div>
    <div>
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
        Préférences Véhicule
      </h3>
      <p className="text-base">{clientData.description}</p>
    </div>
    <div>
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
        Présélection Véhicules par l'Administration
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {vehicleOptions.map(vehicle => (
          <div
            key={vehicle.id}
            className="border rounded-lg overflow-hidden border-gray-200 dark:border-gray-700"
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
              <div className="mt-3 flex justify-end">
                <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700">
                  Présélectionner
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ClientInfoTab;