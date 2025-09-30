import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Link } from 'react-router-dom';
import { StarIcon, CalendarIcon, GaugeIcon, CarIcon } from 'lucide-react';
import { Client } from './KanbanBoard';
interface KanbanCardProps {
  client: Client;
  isDragging?: boolean;
}
const KanbanCard: React.FC<KanbanCardProps> = ({
  client,
  isDragging = false
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({
    id: client.id
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };
  // Format mileage with thousand separators
  const formatMileage = (mileage?: number) => {
    if (!mileage) return '';
    return mileage.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };
  return <Link to={`/client/${client.id}`}>
      <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={`bg-white dark:bg-gray-700 p-3 rounded-lg shadow cursor-pointer border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow ${isDragging ? 'opacity-50 shadow-lg' : ''} ${client.step === 6 ? 'opacity-70' : ''}`}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium">{client.name}</h3>
          {client.hasNotification && <div className="relative">
              <StarIcon className="w-5 h-5 text-red-500" />
              <span className="absolute inset-0 animate-ping rounded-full bg-red-400 opacity-75"></span>
            </div>}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
          <span className="flex items-center">
            <CarIcon className="w-3.5 h-3.5 mr-1 text-blue-500" />
            {client.vehicle}
          </span>
        </p>
        <div className="grid grid-cols-2 gap-1 text-xs text-gray-500 dark:text-gray-400 mb-2">
          {client.mileage && <div className="flex items-center">
              <GaugeIcon className="w-3.5 h-3.5 mr-1 text-green-500" />
              {formatMileage(client.mileage)} km
            </div>}
          {client.year && <div className="flex items-center">
              <CalendarIcon className="w-3.5 h-3.5 mr-1 text-purple-500" />
              {client.year}
            </div>}
        </div>
        {client.selectedVehicles && client.selectedVehicles.length > 0 && <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            <span className="font-medium">Sélection:</span>{' '}
            {client.selectedVehicles.length} véhicule(s)
          </div>}
        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
          <div className="bg-blue-600 dark:bg-blue-500 h-1.5 rounded-full" style={{
          width: `${client.progress}%`
        }}></div>
        </div>
      </div>
    </Link>;
};
export default KanbanCard;