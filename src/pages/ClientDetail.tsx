import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ClientHeader from '../components/ClientHeader';
import TabsNavigation from '../components/TabsNavigation';
import ClientInfoTab from '../components/ClientInfoTab';
import ClientSelectionTab from '../components/ClientSelectionTab';
import DepositAndIdTab from '../components/DepositAndIdTab';
import GarageChecklistTab from '../components/GarageChecklistTab';
import DocumentsAndPaymentTab from '../components/DocumentsAndPaymentTab';
import DeliveryTab from '../components/DeliveryTab';
import Sidebar from '../components/Sidebar';
import VehicleChecklistCard from '../components/VehicleChecklistCard';
import VehicleChecklistModal from '../components/VehicleChecklistModal';
import Breadcrumb from '../components/Breadcrumb';

// Define interfaces for data structures
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

interface Vehicle {
  id: string;
  name: string;
  price: string;
  mileage: number;
  year: number;
  image: string;
}

interface ChecklistItem {
  id: string;
  name: string;
  status: 'validated' | 'pending' | 'issue';
  comment?: string;
}

interface VehicleChecklist {
  id: string;
  name: string;
  price: string;
  mileage: number;
  year: number;
  image: string;
  checklistItems: ChecklistItem[];
}

// Mock data
const clientData: ClientData = {
  id: 'client-4',
  name: 'Sarah Williams',
  email: 'sarah.williams@example.com',
  phone: '+33 6 12 34 56 78',
  vehicle: 'BMW X3',
  maxKm: '122 000',
  vehicleColor: 'Rouge',
  step: 2,
  progress: 60,
  budget: '€35,000',
  description: 'Looking for a family SUV with good safety features and comfort.',
  timeline: [
    { id: 'event-1', title: 'Client ajouté au système', date: '2023-09-10', time: '09:15' },
    { id: 'event-2', title: 'Étape 1 terminée', date: '2023-09-12', time: '14:30' },
    { id: 'event-3', title: "Passage à l'Étape 2", date: '2023-09-12', time: '14:35' },
  ],
};

const vehicleOptions: Vehicle[] = [
  {
    id: 'vehicle-1',
    name: 'BMW X3 xDrive30i',
    price: '€42,500',
    mileage: 25000,
    year: 2021,
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'vehicle-2',
    name: 'BMW X3 M40i',
    price: '€59,800',
    mileage: 18000,
    year: 2022,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'vehicle-3',
    name: 'BMW X3 sDrive20i',
    price: '€38,200',
    mileage: 32000,
    year: 2020,
    image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  },
];

const vehicleChecklistData: VehicleChecklist[] = [
  {
    id: 'vehicle-1',
    name: 'BMW X3 xDrive30i',
    price: '€42,500',
    mileage: 25000,
    year: 2021,
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    checklistItems: [
      { id: 'check-1-1', name: 'Kilométrage certifié', status: 'validated' },
      { id: 'check-1-2', name: 'Vidange à jour', status: 'validated' },
      { id: 'check-1-3', name: 'Distribution vérifiée', status: 'validated' },
      { id: 'check-1-4', name: 'CarVertical ajouté', status: 'validated' },
      { id: 'check-1-5', name: 'Contrôle technique à jour', status: 'validated' },
      { id: 'check-1-6', name: 'Freins vérifiés', status: 'validated' },
      { id: 'check-1-7', name: 'Pneus vérifiés', status: 'validated' },
      { id: 'check-1-8', name: 'Climatisation fonctionnelle', status: 'validated' },
      { id: 'check-1-9', name: 'Batterie testée', status: 'validated' },
    ],
  },
  {
    id: 'vehicle-2',
    name: 'BMW X3 M40i',
    price: '€59,800',
    mileage: 18000,
    year: 2022,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    checklistItems: [
      { id: 'check-2-1', name: 'Kilométrage certifié', status: 'validated' },
      { id: 'check-2-2', name: 'Vidange à jour', status: 'validated' },
      { id: 'check-2-3', name: 'Distribution vérifiée', status: 'pending', comment: 'À faire avant livraison' },
      { id: 'check-2-4', name: 'CarVertical ajouté', status: 'validated' },
      { id: 'check-2-5', name: 'Contrôle technique à jour', status: 'validated' },
      { id: 'check-2-6', name: 'Freins vérifiés', status: 'issue', comment: 'Plaquettes à remplacer' },
      { id: 'check-2-7', name: 'Pneus vérifiés', status: 'validated' },
      { id: 'check-2-8', name: 'Climatisation fonctionnelle', status: 'validated' },
    ],
  },
  {
    id: 'vehicle-3',
    name: 'BMW X3 sDrive20i',
    price: '€38,200',
    mileage: 32000,
    year: 2020,
    image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    checklistItems: [
      { id: 'check-3-1', name: 'Kilométrage certifié', status: 'validated' },
      { id: 'check-3-2', name: 'Vidange à jour', status: 'validated' },
      { id: 'check-3-3', name: 'Distribution vérifiée', status: 'pending' },
      { id: 'check-3-4', name: 'CarVertical ajouté', status: 'pending' },
      { id: 'check-3-5', name: 'Contrôle technique à jour', status: 'validated' },
      { id: 'check-3-6', name: 'Freins vérifiés', status: 'validated' },
      { id: 'check-3-7', name: 'Pneus vérifiés', status: 'validated' },
      { id: 'check-3-8', name: 'Climatisation fonctionnelle', status: 'issue', comment: 'Recharge nécessaire' },
    ],
  },
];

const ClientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<number>(1);
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [depositPaid, setDepositPaid] = useState<boolean>(false);
  const [idCardSent, setIdCardSent] = useState<boolean>(false);
  const [vehiclesChecklist, setVehiclesChecklist] = useState<VehicleChecklist[]>(vehicleChecklistData);
  const [finalPaymentDone, setFinalPaymentDone] = useState<boolean>(false);
  const [selectedChecklistVehicle, setSelectedChecklistVehicle] = useState<string | null>(null);

  const handleVehicleSelection = (vehicleId: string) => {
    if (selectedVehicles.includes(vehicleId)) {
      setSelectedVehicles(selectedVehicles.filter(id => id !== vehicleId));
    } else {
      if (selectedVehicles.length < 3) {
        setSelectedVehicles([...selectedVehicles, vehicleId]);
      }
    }
  };

  const handleOpenVehicleChecklist = (vehicleId: string) => {
    setSelectedChecklistVehicle(vehicleId);
  };

  const handleCloseVehicleChecklist = () => {
    setSelectedChecklistVehicle(null);
  };

  const handleChecklistStatusUpdate = (
    vehicleId: string,
    itemId: string,
    status: 'validated' | 'pending' | 'issue'
  ) => {
    setVehiclesChecklist(prev =>
      prev.map(vehicle =>
        vehicle.id === vehicleId
          ? {
              ...vehicle,
              checklistItems: vehicle.checklistItems.map(item =>
                item.id === itemId ? { ...item, status } : item
              ),
            }
          : vehicle
      )
    );
  };

  const handleChecklistCommentUpdate = (vehicleId: string, itemId: string, comment: string) => {
    setVehiclesChecklist(prev =>
      prev.map(vehicle =>
        vehicle.id === vehicleId
          ? {
              ...vehicle,
              checklistItems: vehicle.checklistItems.map(item =>
                item.id === itemId ? { ...item, comment } : item
              ),
            }
          : vehicle
      )
    );
  };

  const formatMileage = (mileage: number): string => {
    return mileage.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const selectedVehicle = selectedChecklistVehicle
    ? vehiclesChecklist.find(v => v.id === selectedChecklistVehicle)
    : null;

  return (
    <div className="space-y-6">
      <Breadcrumb clientId={id} clientName={clientData.name} />
      <ClientHeader clientData={clientData} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <TabsNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="p-6">
              {activeTab === 1 && (
                <ClientInfoTab
                  clientData={clientData}
                  vehicleOptions={vehicleOptions}
                  formatMileage={formatMileage}
                />
              )}
              {activeTab === 2 && (
                <ClientSelectionTab
                  vehicleOptions={vehicleOptions}
                  selectedVehicles={selectedVehicles}
                  handleVehicleSelection={handleVehicleSelection}
                  formatMileage={formatMileage}
                />
              )}
              {activeTab === 3 && (
                <DepositAndIdTab
                  depositPaid={depositPaid}
                  setDepositPaid={setDepositPaid}
                  idCardSent={idCardSent}
                  setIdCardSent={setIdCardSent}
                />
              )}
              {activeTab === 4 && (
                <GarageChecklistTab
                  vehiclesChecklist={vehiclesChecklist}
                  handleOpenVehicleChecklist={handleOpenVehicleChecklist}
                />
              )}
              {activeTab === 5 && (
                <DocumentsAndPaymentTab
                  finalPaymentDone={finalPaymentDone}
                  setFinalPaymentDone={setFinalPaymentDone}
                />
              )}
              {activeTab === 6 && <DeliveryTab />}
            </div>
          </div>
        </div>
        <Sidebar clientData={clientData} />
      </div>
      {selectedVehicle && (
        <VehicleChecklistModal
          isOpen={!!selectedChecklistVehicle}
          onClose={handleCloseVehicleChecklist}
          vehicleName={selectedVehicle.name}
          vehicleImage={selectedVehicle.image}
          vehicleYear={selectedVehicle.year}
          vehicleMileage={selectedVehicle.mileage}
          checklistItems={selectedVehicle.checklistItems}
          onUpdateStatus={(itemId, status) =>
            handleChecklistStatusUpdate(selectedVehicle.id, itemId, status)
          }
          onUpdateComment={(itemId, comment) =>
            handleChecklistCommentUpdate(selectedVehicle.id, itemId, comment)
          }
        />
      )}
    </div>
  );
};

export default ClientDetail;