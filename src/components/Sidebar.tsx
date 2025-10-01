import React from 'react';
import { PencilIcon, ArchiveIcon, BellIcon, ClockIcon, Paperclip } from 'lucide-react';

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
}

interface SidebarProps {
  clientData: ClientData;
}

const Sidebar: React.FC<SidebarProps> = ({ clientData }) => (
  <div className="space-y-6">
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
        Actions
      </h3>
      <div className="space-y-2">
        {[
          { label: 'Générer et envoyer le lien', icon: Paperclip },
          { label: 'Modifier Client', icon: PencilIcon },
          { label: 'Archiver Client', icon: ArchiveIcon },
          { label: 'Envoyer Notification', icon: BellIcon },
        ].map(action => (
          <button
            key={action.label}
            className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <action.icon className="w-4 h-4 mr-2" />
            {action.label}
          </button>
        ))}
      </div>
    </div>
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
        Historique
      </h3>
      <div className="relative pl-6 space-y-4">
        {clientData.timeline.map((event, index) => (
          <div key={event.id} className="relative">
            <div className="absolute -left-6 mt-1.5">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              {index < clientData.timeline.length - 1 && (
                <div className="absolute top-3 left-1.5 w-0.5 h-full -ml-px bg-gray-300 dark:bg-gray-600"></div>
              )}
            </div>
            <div>
              <p className="text-sm">{event.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                <ClockIcon className="w-3 h-3 mr-1" />
                {event.date} à {event.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Sidebar;