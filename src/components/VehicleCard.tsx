import React from "react";
import { EuroIcon, GaugeIcon, ExternalLink, CogIcon, ZapIcon, FuelIcon } from "lucide-react";

interface VehicleCardProps {
  id: string;
  title: string;       // titre complet
  price: string;
  mileage: number;
  year: number;
  image: string;
  link: string;
  fuel?: string;
  gearbox?: string;
  power?: string;
  formatMileage: (mileage: number) => string;
  onSelect?: () => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  title,
  price,
  mileage,
  year,
  image,
  link,
  fuel,
  gearbox,
  power,
  formatMileage,
  onSelect,
}) => {
  return (
    <div className="group border rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300">
      
      {/* Image avec titre et année */}
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Titre complet */}
        {/* Année */}
        <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full shadow">
          {year}
        </span>
      </div>

      {/* Infos détaillées */}
      <div className="p-4 space-y-2 text-gray-700 dark:text-gray-300 text-sm">
        <div className="text-black bg-opacity-60 rounded w-[calc(100%-0.5rem)] truncate">
          <span className="font-semibold text-sm">{title}</span>
        </div>

        <div className="flex items-center flex-wrap">
          <EuroIcon className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
          <span className="font-medium">{price}</span>
        </div>
        <div className="flex items-center flex-wrap">
          <GaugeIcon className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
          <span>{formatMileage(mileage)}</span>
        </div>
        <div className="flex items-center flex-wrap">
        <FuelIcon className="w-4 h-4 mr-2 text-orange-500" />
          <span>{fuel || "N/A"}</span>
        </div>
        <div className="flex items-center flex-wrap">
        <CogIcon className="w-4 h-4 mr-2 text-gray-500" />          
        <span>{gearbox || "N/A"}</span>
        </div>
        <div className="flex items-center flex-wrap">
            <ZapIcon className="w-4 h-4 mr-2 text-yellow-500" />          
            <span>{power || "N/A"}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 flex justify-between items-center space-x-2">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center px-3 py-1.5 bg-gray-700 text-white rounded-md text-xs hover:bg-gray-800 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5 mr-1" />
          Annonce
        </a>
        <button
          onClick={onSelect}
          className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700 transition-colors"
        >
          Présélectionner
        </button>
      </div>
    </div>
  );
};

export default VehicleCard;
