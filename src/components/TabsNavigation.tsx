import React from 'react';
import { IdCardIcon, CarIcon, CreditCardIcon, CheckSquareIcon, FileSignatureIcon, TruckIcon } from 'lucide-react';

interface TabsNavigationProps {
  activeTab: number;
  setActiveTab: (tab: number) => void;
}

const TabsNavigation: React.FC<TabsNavigationProps> = ({ activeTab, setActiveTab }) => (
  <div className="border-b dark:border-gray-700 overflow-x-auto">
    <nav className="flex -mb-px">
      {[
        { id: 1, label: 'Étape 1: Infos & Présélection', icon: IdCardIcon },
        { id: 2, label: 'Étape 2: Sélection Client', icon: CarIcon },
        { id: 3, label: 'Étape 3: Acompte & Pièce ID', icon: CreditCardIcon },
        { id: 4, label: 'Étape 4: Checklist Garage', icon: CheckSquareIcon },
        { id: 5, label: 'Étape 5: Docs & Paiement', icon: FileSignatureIcon },
        { id: 6, label: 'Étape 6: Livraison', icon: TruckIcon },
      ].map(tab => (
        <button
          key={tab.id}
          className={`py-4 px-6 text-sm font-medium border-b-2 whitespace-nowrap ${
            activeTab === tab.id
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          <div className="flex items-center">
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </div>
        </button>
      ))}
    </nav>
  </div>
);

export default TabsNavigation;