import React from 'react';
import { CheckCircleIcon, EuroIcon, GaugeIcon, CalendarIcon } from 'lucide-react';

const DeliveryTab: React.FC = () => (
  <div className="space-y-6">
    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <CheckCircleIcon className="w-6 h-6 text-green-500 mr-3 mt-0.5" />
        <div>
          <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-1">
            Projet finalisé
          </h3>
          <p className="text-sm text-green-700 dark:text-green-400">
            Toutes les étapes ont été complétées avec succès. Le véhicule est prêt à être livré.
          </p>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="border rounded-lg p-4 border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium mb-4">Détails de Livraison</h3>
        <div className="space-y-3">
          {[
            { label: 'Date de livraison', value: '15/10/2023' },
            { label: 'Lieu de livraison', value: 'À domicile' },
            { label: 'Adresse', value: '123 Rue de Paris, 75001 Paris' },
            { label: 'Statut', value: 'Confirmé', className: 'text-green-600 dark:text-green-400' },
          ].map(item => (
            <div key={item.label} className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
              <span className={`font-medium ${item.className || ''}`}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="border rounded-lg p-4 border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium mb-4">Récapitulatif Véhicule</h3>
        <div className="flex mb-4">
          <img
            src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
            alt="BMW X3"
            className="w-24 h-24 object-cover rounded-md mr-4"
          />
          <div>
            <h4 className="font-medium">BMW X3 xDrive30i</h4>
            <div className="mt-1 space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <EuroIcon className="w-3.5 h-3.5 mr-1 text-blue-500" />
                €42,500
              </div>
              <div className="flex items-center">
                <GaugeIcon className="w-3.5 h-3.5 mr-1 text-green-500" />
                25 000 km
              </div>
              <div className="flex items-center">
                <CalendarIcon className="w-3.5 h-3.5 mr-1 text-purple-500" />
                2021
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="flex justify-end">
      <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
        Confirmer la Livraison
      </button>
    </div>
  </div>
);

export default DeliveryTab;