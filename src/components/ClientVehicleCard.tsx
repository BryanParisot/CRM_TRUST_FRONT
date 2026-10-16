import React from "react";
import { ExternalLink } from "lucide-react";

export interface Vehicle {
    id: number;
    title: string;
    price: string;
    mileage: string;
    year: string;
    fuel: string;
    gearbox?: string;
    power?: string;
    image: string;
    link: string;
    selected_by?: string;
}

interface ClientVehicleCardProps {
    vehicle: Vehicle;
    isSelected?: boolean;
    onToggleSelect?: (id: number) => void;
    readOnly?: boolean;
}

const ClientVehicleCard: React.FC<ClientVehicleCardProps> = ({ vehicle, isSelected = false, onToggleSelect, readOnly = false }) => (
  <div className={`rounded-xl border p-4 ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}>
    <h3 className="font-semibold text-gray-900">{vehicle.title}</h3>
    <a href={vehicle.link} target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center gap-2 text-sm text-blue-600 break-all">
      {vehicle.link}<ExternalLink size={16} className="shrink-0" />
    </a>
    {!readOnly && onToggleSelect && <button onClick={() => onToggleSelect(vehicle.id)} className="mt-3 text-sm text-blue-600">{isSelected ? 'Retirer de ma sélection' : 'Retenir ce véhicule'}</button>}
  </div>
);
export default ClientVehicleCard;
