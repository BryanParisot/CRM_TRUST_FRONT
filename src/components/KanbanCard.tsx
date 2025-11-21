import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CalendarIcon, CarIcon, EuroIcon, GaugeIcon } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { Client } from "./KanbanBoard";

interface KanbanCardProps {
  client: Client;
  isDragging?: boolean;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ client, isDragging = false }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: client.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // ✅ Formateur universel pour les nombres avec espaces (FR style)
  const formatNumber = (value?: number | string) => {
    if (!value) return "";
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(num)) return value.toString();
    return num.toLocaleString("fr-FR"); // ex : 35 000
  };

  return (
    <Link to={`/client/${client.id}`} className="block">
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden ${isDragging ? "opacity-70 scale-95 rotate-2" : "hover:scale-[1.02] hover:-translate-y-1"
          }`}
      >
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

        {/* Content */}
        <div className="relative z-10">
          {/* HEADER */}
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-semibold text-base text-gray-900 dark:text-gray-100 truncate pr-2">
              {client.name}
            </h3>
            <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full font-medium">
              #{client.id}
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-700 dark:text-gray-300 mb-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2">
            <CarIcon className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <span className="truncate font-medium">
              {client.marque} {client.modele}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400 mb-3 gap-2">
            {client.mileage && (
              <div className="flex items-center bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded-md">
                <GaugeIcon className="w-3.5 h-3.5 mr-1 text-gray-500" />
                <span className="font-medium">{formatNumber(client.mileage)} km</span>
              </div>
            )}
          </div>

          {/* 💶 BUDGET */}
          {client.budget && (
            <div className="flex items-center text-sm font-semibold text-green-700 dark:text-green-400 mb-3 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">
              <EuroIcon className="w-4 h-4 mr-1.5 text-green-600 dark:text-green-500" />
              {formatNumber(client.budget)} €
            </div>
          )}

          {/* PROGRESS BAR */}
          {/* <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300 shadow-sm"
              style={{ width: `${client.progress}%` }}
            />
          </div>
 */}
          {/* STEP INFO */}
          {/* <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Étape {client.step} / 6
            </span>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              {client.progress}%
            </span>
          </div> */}
        </div>
      </div>
    </Link>
  );
};

export default KanbanCard;
