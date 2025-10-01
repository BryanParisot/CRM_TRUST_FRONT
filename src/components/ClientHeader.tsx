import React from 'react';

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

interface ClientHeaderProps {
  clientData: ClientData;
}

const ClientHeader: React.FC<ClientHeaderProps> = ({ clientData }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <div className="flex flex-col md:flex-row md:items-center">
      <div className="flex items-center mb-4 md:mb-0">
        <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 text-2xl font-semibold mr-4">
          {clientData.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <h1 className="text-xl font-bold">{clientData.name}</h1>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {clientData.email} • {clientData.phone}
          </div>
        </div>
      </div>
      <div className="md:ml-auto flex flex-col">
        <div className="text-sm font-medium mb-1">Progression Globale</div>
        <div className="w-full md:w-64 h-4 bg-gray-200 dark:bg-gray-700 rounded-full">
          <div
            className="h-4 bg-blue-600 dark:bg-blue-500 rounded-full"
            style={{ width: `${clientData.progress}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Étape {clientData.step} sur 6 ({clientData.progress}% complété)
        </div>
      </div>
    </div>
  </div>
);

export default ClientHeader;