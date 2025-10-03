import React from "react";
import { EuroIcon, GaugeIcon, CalendarIcon, ExternalLink } from "lucide-react";

interface VehicleCardProps {
    id: string;
    name: string;
    price: string;
    mileage: number;
    year: number;
    image: string;
    link: string;
    formatMileage: (mileage: number) => string;
    onSelect?: () => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({
    name,
    price,
    mileage,
    year,
    image,
    link,
    formatMileage,
    onSelect,
}) => {
    return (
        <div className="group border rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300">
            {/* Image */}
            <div className="relative">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full shadow">
                    {year}
                </span>
            </div>

            {/* Infos */}
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
                    {name}
                </h3>

                <div className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                        <EuroIcon className="w-4 h-4 mr-2 text-blue-500" />
                        <span className="font-medium">{price}</span>
                    </div>
                    <div className="flex items-center">
                        <GaugeIcon className="w-4 h-4 mr-2 text-green-500" />
                        {formatMileage(mileage)} km
                    </div>
                    <div className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-2 text-purple-500" />
                        Année {year}
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex justify-between items-center">
                    <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-3 py-1.5 bg-gray-700 text-white rounded-md text-xs hover:bg-gray-800 transition-colors"
                    >
                        <ExternalLink className="w-3.5 h-3.5 mr-1" />
                        Voir l’annonce
                    </a>
                    <button
                        onClick={onSelect}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700 transition-colors"
                    >
                        Présélectionner
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VehicleCard;
