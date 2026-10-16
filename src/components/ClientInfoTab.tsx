import {
  Calendar,
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
import React from "react";

interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  time: string;
}

interface ClientData {
  id: string;
  name: string;
  first_name?: string | null;
  last_name?: string | null;
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
  premiere_immat?: string;
}

interface ClientInfoTabProps { clientData: ClientData; }
const ClientInfoTab: React.FC<ClientInfoTabProps> = ({ clientData }) => {
  const clientInfos = [
    { label: "Prénom", value: clientData.first_name || "À renseigner", icon: UserIcon },
    { label: "Nom", value: clientData.last_name || "À renseigner", icon: UserIcon },
    { label: "Email", value: clientData.email, icon: MailIcon },
    { label: "Téléphone", value: clientData.phone, icon: PhoneIcon },
    { label: "Budget", value: clientData.budget, icon: WalletIcon },
    { label: "Marque", value: clientData.marque, icon: CarIcon },
    { label: "Modele", value: clientData.modele, icon: CarIcon },
    { label: "Année Min", value: clientData.premiere_immat, icon: Calendar },
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

    </div>
  );
};

export default ClientInfoTab;
