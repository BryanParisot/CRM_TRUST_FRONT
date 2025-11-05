import {
  CarIcon,
  CogIcon,
  FuelIcon,
  GaugeIcon,
  MailIcon,
  PaletteIcon,
  PhoneIcon,
  TruckIcon,
  UserIcon,
  WalletIcon,
  ZapIcon,
} from "lucide-react";
import React, { useState } from "react";
import VehicleCard from "./VehicleCard";

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
  marque: string;
  modele: string;
  max_km: string;
  couleur: string;
  carburant: string;
  boite: string;
  puissance_min: number;
  step: number;
  progress: number;
  budget: string;
  description: string;
  timeline: TimelineEvent[];
  deliveryOption?: string;
}

interface Vehicle {
  id: string;
  title: string;
  price: string;
  mileage: number;
  year: number;
  image: string;
  link: string;
  fuel?: string;
  gearbox?: string;
  power?: string;
}

interface ClientInfoTabProps {
  clientData: ClientData;
  vehicleOptions: Vehicle[];
  formatMileage: (mileage: number) => string;
}

const ClientInfoTab: React.FC<ClientInfoTabProps> = ({
  clientData,
  vehicleOptions,
  formatMileage,
}) => {
  const [selectedVehicles, setSelectedVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const clientInfos = [
    { label: "Nom Complet", value: clientData.name, icon: UserIcon },
    { label: "Email", value: clientData.email, icon: MailIcon },
    { label: "Téléphone", value: clientData.phone, icon: PhoneIcon },
    { label: "Budget", value: clientData.budget, icon: WalletIcon },
    { label: "Marque", value: clientData.marque, icon: CarIcon },
    { label: "Modele", value: clientData.modele, icon: CarIcon },
    { label: "Carburant", value: clientData.carburant, icon: FuelIcon },
    { label: "Puissance", value: clientData.puissance_min, icon: ZapIcon },
    { label: "Boite", value: clientData.boite, icon: CogIcon },
    {
      label: "Couleur du Véhicule",
      value: clientData.couleur,
      icon: PaletteIcon,
    },
    { label: "KM Max", value: clientData.max_km, icon: GaugeIcon },
    {
      label: "Option de livraison",
      value: clientData.deliveryOption || "Non spécifié",
      icon: TruckIcon,
    },
  ];

  // ✅ Fonction pour envoyer les véhicules présélectionnés
  const handlePreselect = async (vehicle: Vehicle) => {
    try {
      setLoading(true);
      setMessage("");

      const res = await fetch("http://localhost:3000/api/vehicles/preselect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: clientData.id,
          vehicles: [vehicle],
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Erreur serveur");

      setSelectedVehicles((prev) => [...prev, vehicle]);
      setMessage("✅ Véhicule présélectionné !");
    } catch (error: any) {
      console.error("Erreur lors de la présélection :", error);
      setMessage("❌ Erreur : " + error.message);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000); // efface le message après 3 sec
    }
  };

  return (
    <div className="space-y-8">
      {/* Infos Client */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {clientInfos.map((item) => (
          <div
            key={item.label}
            className="flex items-start p-3 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-md transition-shadow"
          >
            <item.icon className="w-5 h-5 text-blue-600 mt-1 mr-3" />
            <div>
              <h3 className="text-xs tracking-wide font-medium text-gray-500 dark:text-gray-400">
                {item.label}
              </h3>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Préférences */}
      <div className="p-5 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          Préférences Véhicule
        </h3>
        <p className="text-base text-gray-800 dark:text-gray-200">
          {clientData.description}
        </p>
      </div>

      {/* Véhicules proposés */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
          Présélection Véhicules par l'Administration
        </h3>

        {message && (
          <p className="text-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            {message}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {vehicleOptions.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              id={vehicle.id}
              title={vehicle.title}
              price={vehicle.price}
              mileage={vehicle.mileage}
              year={vehicle.year}
              image={vehicle.image}
              link={vehicle.link}
              fuel={vehicle.fuel}
              gearbox={vehicle.gearbox}
              power={vehicle.power}
              formatMileage={formatMileage}
              onSelect={() => handlePreselect(vehicle)}
            />
          ))}
        </div>

        {loading && (
          <p className="text-xs text-center text-gray-500 mt-2">
            Envoi en cours...
          </p>
        )}
      </div>
    </div>
  );
};

export default ClientInfoTab;
