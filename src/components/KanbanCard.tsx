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
        className={`group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer ${isDragging ? "opacity-70 scale-[0.98]" : ""
          }`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
            {client.name}
          </h3>
          <span className="text-[11px] text-gray-400">#{client.id}</span>
        </div>

        {/* VEHICLE */}
        <div className="flex items-center text-xs text-gray-600 dark:text-gray-300 mb-1">
          <CarIcon className="w-3.5 h-3.5 mr-1 text-blue-500" />
          <span className="truncate">
            {client.marque} {client.modele}
          </span>
        </div>

        {/* INFOS */}
        <div className="flex justify-between items-center text-[11px] text-gray-500 dark:text-gray-400 mb-1">
          {client.mileage && (
            <div className="flex items-center">
              <GaugeIcon className="w-3 h-3 mr-1" />
              {formatNumber(client.mileage)} km
            </div>
          )}
          {client.premiere_immat && (
            <div className="flex items-center">
              <CalendarIcon className="w-3 h-3 mr-1" />
              {client.premiere_immat}
            </div>
          )}
        </div>

        {/* 💶 BUDGET */}
        {client.budget && (
          <div className="flex items-center text-xs font-medium text-gray-800 dark:text-gray-200 mb-2">
            <EuroIcon className="w-3.5 h-3.5 mr-1 text-green-500" />
            {formatNumber(client.budget)} €
          </div>
        )}

        {/* PROGRESS BAR */}
        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1 mt-2">
          <div
            className="h-1 bg-blue-500 rounded-full transition-all"
            style={{ width: `${client.progress}%` }}
          />
        </div>

        {/* STEP INFO */}
        <div className="text-[10px] text-gray-400 mt-1">Étape {client.step} / 6</div>
      </div>
    </Link>
  );
};

export default KanbanCard;
