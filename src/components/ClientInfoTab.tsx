import React from 'react';
import VehicleCard from './VehicleCard.tsx';

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
  link: string;
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
          <VehicleCard
            key={vehicle.id}
            id={vehicle.id}
            name={vehicle.name}
            price={vehicle.price}
            mileage={vehicle.mileage}
            year={vehicle.year}
            image={vehicle.image}
            link={vehicle.link}
            formatMileage={formatMileage}
            onSelect={() => console.log("Véhicule présélectionné :", vehicle.id)}
          />
        ))}
      </div>
    </div>
  </div>
);

export default ClientInfoTab;