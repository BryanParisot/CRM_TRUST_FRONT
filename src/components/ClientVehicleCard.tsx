import React from "react";
import {
    CalendarIcon,
    CheckCircle2Icon,
    EuroIcon,
    ExternalLink,
    FuelIcon,
    GaugeIcon,
    ZapIcon,
    Settings2Icon
} from "lucide-react";

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

const ClientVehicleCard: React.FC<ClientVehicleCardProps> = ({
    vehicle,
    isSelected = false,
    onToggleSelect,
    readOnly = false
}) => {
    const handleClick = () => {
        if (!readOnly && onToggleSelect) {
            onToggleSelect(vehicle.id);
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`
                group relative bg-white rounded-2xl overflow-hidden
                transition-all duration-300 ease-out
                ${!readOnly ? "cursor-pointer hover:shadow-2xl hover:-translate-y-1" : "shadow-md"}
                border ${isSelected && !readOnly
                    ? "border-blue-600 ring-2 ring-blue-400 shadow-xl transform scale-[1.02]"
                    : "border-gray-100"
                }
                ${!readOnly && !isSelected ? "hover:border-blue-300" : ""}
            `}
        >
            {/* IMAGE SECTION */}
            <div className="relative h-52 w-full overflow-hidden bg-gray-100">
                <img
                    src={vehicle.image}
                    alt={vehicle.title}
                    className={`w-full h-full object-cover transition-transform duration-700 ${!readOnly ? "group-hover:scale-110" : ""}`}
                />

                {/* GRADIENT OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                {/* BADGE SELECTED */}
                {isSelected && !readOnly && (
                    <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg animate-in fade-in zoom-in duration-300">
                        <CheckCircle2Icon className="w-3.5 h-3.5" />
                        Sélectionné
                    </div>
                )}

                {/* PRICE TAG ON IMAGE */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white font-bold text-lg drop-shadow-md">
                    <EuroIcon className="w-5 h-5 text-blue-400" />
                    {vehicle.price}
                </div>
            </div>

            {/* CONTENT */}
            <div className="p-5 space-y-4">
                {/* TITLE */}
                <h3 className={`font-bold text-gray-900 text-lg leading-snug line-clamp-2 min-h-[3.5rem] ${!readOnly ? "group-hover:text-blue-700" : ""} transition-colors`}>
                    {vehicle.title}
                </h3>

                {/* INFO GRID */}
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm text-gray-600">
                    <div className={`flex items-center gap-2.5 p-1.5 rounded-lg bg-gray-50 ${!readOnly ? "group-hover:bg-blue-50/50" : ""} transition-colors`}>
                        <GaugeIcon className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">{vehicle.mileage}</span>
                    </div>

                    <div className={`flex items-center gap-2.5 p-1.5 rounded-lg bg-gray-50 ${!readOnly ? "group-hover:bg-blue-50/50" : ""} transition-colors`}>
                        <FuelIcon className="w-4 h-4 text-orange-500" />
                        <span className="font-medium">{vehicle.fuel}</span>
                    </div>

                    <div className={`flex items-center gap-2.5 p-1.5 rounded-lg bg-gray-50 ${!readOnly ? "group-hover:bg-blue-50/50" : ""} transition-colors`}>
                        <CalendarIcon className="w-4 h-4 text-indigo-500" />
                        <span className="font-medium">{vehicle.year}</span>
                    </div>

                    {vehicle.gearbox && (
                        <div className={`flex items-center gap-2.5 p-1.5 rounded-lg bg-gray-50 ${!readOnly ? "group-hover:bg-blue-50/50" : ""} transition-colors`}>
                            <Settings2Icon className="w-4 h-4 text-gray-500" />
                            <span className="font-medium">{vehicle.gearbox}</span>
                        </div>
                    )}

                    {vehicle.power && (
                        <div className={`col-span-2 flex items-center gap-2.5 p-1.5 rounded-lg bg-gray-50 ${!readOnly ? "group-hover:bg-blue-50/50" : ""} transition-colors`}>
                            <ZapIcon className="w-4 h-4 text-yellow-500" />
                            <span className="font-medium">{vehicle.power} ch</span>
                        </div>
                    )}
                </div>

                {/* CTA */}
                <a
                    href={vehicle.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn flex items-center justify-center w-full mt-4 py-2.5 text-sm font-semibold
                    text-blue-700 bg-blue-50 border border-blue-100 rounded-xl
                    hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-md transition-all duration-300"
                    onClick={(e) => e.stopPropagation()}
                >
                    Voir l’annonce
                    <ExternalLink className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                </a>
            </div>
        </div>
    );
};

export default ClientVehicleCard;
