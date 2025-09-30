import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon, FileIcon, IdCardIcon, CarIcon, FileSignatureIcon, CheckCircleIcon, ArchiveIcon, BellIcon, PencilIcon, ClockIcon, GaugeIcon, CalendarIcon, CreditCardIcon, CheckSquareIcon, TruckIcon, EuroIcon } from 'lucide-react';
import VehicleChecklist, { ChecklistItem } from '../components/VehicleChecklist';
import VehicleChecklistCard from '../components/VehicleChecklistCard';
import VehicleChecklistModal from '../components/VehicleChecklistModal';
const clientData = {
  id: 'client-4',
  name: 'Sarah Williams',
  email: 'sarah.williams@example.com',
  phone: '+33 6 12 34 56 78',
  vehicle: 'BMW X3',
  step: 2,
  progress: 60,
  budget: '€35,000',
  description: 'Looking for a family SUV with good safety features and comfort.',
  timeline: [{
    id: 'event-1',
    title: 'Client ajouté au système',
    date: '2023-09-10',
    time: '09:15'
  }, {
    id: 'event-2',
    title: 'Étape 1 terminée',
    date: '2023-09-12',
    time: '14:30'
  }, {
    id: 'event-3',
    title: "Passage à l'Étape 2",
    date: '2023-09-12',
    time: '14:35'
  }]
};
const vehicleOptions = [{
  id: 'vehicle-1',
  name: 'BMW X3 xDrive30i',
  price: '€42,500',
  mileage: 25000,
  year: 2021,
  image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
}, {
  id: 'vehicle-2',
  name: 'BMW X3 M40i',
  price: '€59,800',
  mileage: 18000,
  year: 2022,
  image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
}, {
  id: 'vehicle-3',
  name: 'BMW X3 sDrive20i',
  price: '€38,200',
  mileage: 32000,
  year: 2020,
  image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
}];
const searchLinks = [{
  id: 'link-1',
  name: 'Partner1 Search: BMW under €40k',
  url: '#'
}, {
  id: 'link-2',
  name: 'Partner2 Search: SUVs in Europe',
  url: '#'
}, {
  id: 'link-3',
  name: 'Partner3 Search: Import Options',
  url: '#'
}];
// Checklist data for multiple vehicles
const vehicleChecklistData = [{
  id: 'vehicle-1',
  name: 'BMW X3 xDrive30i',
  price: '€42,500',
  mileage: 25000,
  year: 2021,
  image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  checklistItems: [{
    id: 'check-1-1',
    name: 'Kilométrage certifié',
    status: 'validated'
  }, {
    id: 'check-1-2',
    name: 'Vidange à jour',
    status: 'validated'
  }, {
    id: 'check-1-3',
    name: 'Distribution vérifiée',
    status: 'validated'
  }, {
    id: 'check-1-4',
    name: 'CarVertical ajouté',
    status: 'validated'
  }, {
    id: 'check-1-5',
    name: 'Contrôle technique à jour',
    status: 'validated'
  }, {
    id: 'check-1-6',
    name: 'Freins vérifiés',
    status: 'validated'
  }, {
    id: 'check-1-7',
    name: 'Pneus vérifiés',
    status: 'validated'
  }, {
    id: 'check-1-8',
    name: 'Climatisation fonctionnelle',
    status: 'validated'
  }, {
    id: 'check-1-9',
    name: 'Batterie testée',
    status: 'validated'
  }]
}, {
  id: 'vehicle-2',
  name: 'BMW X3 M40i',
  price: '€59,800',
  mileage: 18000,
  year: 2022,
  image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  checklistItems: [{
    id: 'check-2-1',
    name: 'Kilométrage certifié',
    status: 'validated'
  }, {
    id: 'check-2-2',
    name: 'Vidange à jour',
    status: 'validated'
  }, {
    id: 'check-2-3',
    name: 'Distribution vérifiée',
    status: 'pending',
    comment: 'À faire avant livraison'
  }, {
    id: 'check-2-4',
    name: 'CarVertical ajouté',
    status: 'validated'
  }, {
    id: 'check-2-5',
    name: 'Contrôle technique à jour',
    status: 'validated'
  }, {
    id: 'check-2-6',
    name: 'Freins vérifiés',
    status: 'issue',
    comment: 'Plaquettes à remplacer'
  }, {
    id: 'check-2-7',
    name: 'Pneus vérifiés',
    status: 'validated'
  }, {
    id: 'check-2-8',
    name: 'Climatisation fonctionnelle',
    status: 'validated'
  }]
}, {
  id: 'vehicle-3',
  name: 'BMW X3 sDrive20i',
  price: '€38,200',
  mileage: 32000,
  year: 2020,
  image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  checklistItems: [{
    id: 'check-3-1',
    name: 'Kilométrage certifié',
    status: 'validated'
  }, {
    id: 'check-3-2',
    name: 'Vidange à jour',
    status: 'validated'
  }, {
    id: 'check-3-3',
    name: 'Distribution vérifiée',
    status: 'pending'
  }, {
    id: 'check-3-4',
    name: 'CarVertical ajouté',
    status: 'pending'
  }, {
    id: 'check-3-5',
    name: 'Contrôle technique à jour',
    status: 'validated'
  }, {
    id: 'check-3-6',
    name: 'Freins vérifiés',
    status: 'validated'
  }, {
    id: 'check-3-7',
    name: 'Pneus vérifiés',
    status: 'validated'
  }, {
    id: 'check-3-8',
    name: 'Climatisation fonctionnelle',
    status: 'issue',
    comment: 'Recharge nécessaire'
  }]
}];
const ClientDetail: React.FC = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const [activeTab, setActiveTab] = useState<number>(1);
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [depositPaid, setDepositPaid] = useState<boolean>(false);
  const [idCardSent, setIdCardSent] = useState<boolean>(false);
  const [vehiclesChecklist, setVehiclesChecklist] = useState(vehicleChecklistData);
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
  const handleChecklistStatusUpdate = (vehicleId: string, itemId: string, status: 'validated' | 'pending' | 'issue') => {
    setVehiclesChecklist(prev => prev.map(vehicle => vehicle.id === vehicleId ? {
      ...vehicle,
      checklistItems: vehicle.checklistItems.map(item => item.id === itemId ? {
        ...item,
        status
      } : item)
    } : vehicle));
  };
  const handleChecklistCommentUpdate = (vehicleId: string, itemId: string, comment: string) => {
    setVehiclesChecklist(prev => prev.map(vehicle => vehicle.id === vehicleId ? {
      ...vehicle,
      checklistItems: vehicle.checklistItems.map(item => item.id === itemId ? {
        ...item,
        comment
      } : item)
    } : vehicle));
  };
  const formatMileage = (mileage: number) => {
    return mileage.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };
  // Get the currently selected vehicle for the checklist modal
  const selectedVehicle = selectedChecklistVehicle ? vehiclesChecklist.find(v => v.id === selectedChecklistVehicle) : null;
  // In a real app, you would fetch the client data based on the ID
  // For this example, we're using the mock data
  return <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500">
              <HomeIcon className="w-4 h-4 mr-2" />
              Tableau de bord
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <ChevronRightIcon className="w-5 h-5 text-gray-400" />
              <Link to="/clients" className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500">
                Clients
              </Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <ChevronRightIcon className="w-5 h-5 text-gray-400" />
              <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                {clientData.name} (ID:{id})
              </span>
            </div>
          </li>
        </ol>
      </nav>
      {/* Client Header */}
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
              <div className="h-4 bg-blue-600 dark:bg-blue-500 rounded-full" style={{
              width: `${clientData.progress}%`
            }}></div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Étape {clientData.step} sur 6 ({clientData.progress}% complété)
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="border-b dark:border-gray-700 overflow-x-auto">
              <nav className="flex -mb-px">
                <button className={`py-4 px-6 text-sm font-medium border-b-2 whitespace-nowrap ${activeTab === 1 ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`} onClick={() => setActiveTab(1)}>
                  <div className="flex items-center">
                    <IdCardIcon className="w-4 h-4 mr-2" />
                    Étape 1: Infos & Présélection
                  </div>
                </button>
                <button className={`py-4 px-6 text-sm font-medium border-b-2 whitespace-nowrap ${activeTab === 2 ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`} onClick={() => setActiveTab(2)}>
                  <div className="flex items-center">
                    <CarIcon className="w-4 h-4 mr-2" />
                    Étape 2: Sélection Client
                  </div>
                </button>
                <button className={`py-4 px-6 text-sm font-medium border-b-2 whitespace-nowrap ${activeTab === 3 ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`} onClick={() => setActiveTab(3)}>
                  <div className="flex items-center">
                    <CreditCardIcon className="w-4 h-4 mr-2" />
                    Étape 3: Acompte & Pièce ID
                  </div>
                </button>
                <button className={`py-4 px-6 text-sm font-medium border-b-2 whitespace-nowrap ${activeTab === 4 ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`} onClick={() => setActiveTab(4)}>
                  <div className="flex items-center">
                    <CheckSquareIcon className="w-4 h-4 mr-2" />
                    Étape 4: Checklist Garage
                  </div>
                </button>
                <button className={`py-4 px-6 text-sm font-medium border-b-2 whitespace-nowrap ${activeTab === 5 ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`} onClick={() => setActiveTab(5)}>
                  <div className="flex items-center">
                    <FileSignatureIcon className="w-4 h-4 mr-2" />
                    Étape 5: Docs & Paiement
                  </div>
                </button>
                <button className={`py-4 px-6 text-sm font-medium border-b-2 whitespace-nowrap ${activeTab === 6 ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`} onClick={() => setActiveTab(6)}>
                  <div className="flex items-center">
                    <TruckIcon className="w-4 h-4 mr-2" />
                    Étape 6: Livraison
                  </div>
                </button>
              </nav>
            </div>
            <div className="p-6">
              {/* Étape 1: Infos Client & Présélection */}
              {activeTab === 1 && <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Nom Complet
                      </h3>
                      <p className="text-base">{clientData.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Email
                      </h3>
                      <p className="text-base">{clientData.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Téléphone
                      </h3>
                      <p className="text-base">{clientData.phone}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Budget
                      </h3>
                      <p className="text-base">{clientData.budget}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Préférences Véhicule
                    </h3>
                    <p className="text-base">{clientData.description}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Présélection Véhicules par l'Administration
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {vehicleOptions.map(vehicle => <div key={vehicle.id} className="border rounded-lg overflow-hidden border-gray-200 dark:border-gray-700">
                          <img src={vehicle.image} alt={vehicle.name} className="w-full h-32 object-cover" />
                          <div className="p-4">
                            <h3 className="font-medium">{vehicle.name}</h3>
                            <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center">
                                <EuroIcon className="w-3.5 h-3.5 mr-1 text-blue-500" />
                                {vehicle.price}
                              </div>
                              <div className="flex items-center">
                                <GaugeIcon className="w-3.5 h-3.5 mr-1 text-green-500" />
                                {formatMileage(vehicle.mileage)} km
                              </div>
                              <div className="flex items-center">
                                <CalendarIcon className="w-3.5 h-3.5 mr-1 text-purple-500" />
                                {vehicle.year}
                              </div>
                            </div>
                            <div className="mt-3 flex justify-end">
                              <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700">
                                Présélectionner
                              </button>
                            </div>
                          </div>
                        </div>)}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Liens de Recherche
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {searchLinks.map(link => <a key={link.id} href={link.url} className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-md text-sm hover:bg-blue-200 dark:hover:bg-blue-800">
                          {link.name}
                        </a>)}
                    </div>
                  </div>
                </div>}
              {/* Étape 2: Sélection Client */}
              {activeTab === 2 && <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      Sélection des véhicules (max 3)
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Veuillez sélectionner jusqu'à 3 véhicules qui vous
                      intéressent.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {vehicleOptions.map(vehicle => <div key={vehicle.id} className={`border rounded-lg overflow-hidden ${selectedVehicles.includes(vehicle.id) ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-200 dark:border-gray-700'}`}>
                        <img src={vehicle.image} alt={vehicle.name} className="w-full h-32 object-cover" />
                        <div className="p-4">
                          <h3 className="font-medium">{vehicle.name}</h3>
                          <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center">
                              <EuroIcon className="w-3.5 h-3.5 mr-1 text-blue-500" />
                              {vehicle.price}
                            </div>
                            <div className="flex items-center">
                              <GaugeIcon className="w-3.5 h-3.5 mr-1 text-green-500" />
                              {formatMileage(vehicle.mileage)} km
                            </div>
                            <div className="flex items-center">
                              <CalendarIcon className="w-3.5 h-3.5 mr-1 text-purple-500" />
                              {vehicle.year}
                            </div>
                          </div>
                          <div className="mt-3 flex items-center">
                            <input type="checkbox" id={`select-${vehicle.id}`} checked={selectedVehicles.includes(vehicle.id)} onChange={() => handleVehicleSelection(vehicle.id)} disabled={selectedVehicles.length >= 3 && !selectedVehicles.includes(vehicle.id)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
                            <label htmlFor={`select-${vehicle.id}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                              {selectedVehicles.includes(vehicle.id) ? 'Sélectionné' : 'Sélectionner ce véhicule'}
                            </label>
                          </div>
                        </div>
                      </div>)}
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedVehicles.length} sur 3 véhicules sélectionnés
                    </p>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed" disabled={selectedVehicles.length === 0}>
                      Confirmer la Sélection
                    </button>
                  </div>
                </div>}
              {/* Étape 3: Acompte & Pièce d'identité */}
              {activeTab === 3 && <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border rounded-lg p-4 border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-medium mb-4">
                        Paiement de l'Acompte (30%)
                      </h3>
                      <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                          <p className="text-sm mb-2">Montant total estimé:</p>
                          <p className="text-xl font-bold">€42,500</p>
                          <p className="text-sm mb-2 mt-4">
                            Acompte à payer (30%):
                          </p>
                          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                            €12,750
                          </p>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="deposit-paid" checked={depositPaid} onChange={() => setDepositPaid(!depositPaid)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
                          <label htmlFor="deposit-paid" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            Acompte payé
                          </label>
                        </div>
                        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center">
                          <CreditCardIcon className="w-4 h-4 mr-2" />
                          Procéder au Paiement
                        </button>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4 border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-medium mb-4">
                        Pièce d'Identité
                      </h3>
                      <div className="space-y-4">
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                          <IdCardIcon className="w-10 h-10 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            Glissez et déposez votre pièce d'identité ici, ou
                            cliquez pour parcourir
                          </p>
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            Parcourir les fichiers
                          </button>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="id-sent" checked={idCardSent} onChange={() => setIdCardSent(!idCardSent)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
                          <label htmlFor="id-sent" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            Pièce d'identité envoyée
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!depositPaid || !idCardSent}>
                      Valider et Passer à l'Étape Suivante
                    </button>
                  </div>
                </div>}
              {/* Étape 4: Checklist Garage */}
              {activeTab === 4 && <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Validation Technique des Véhicules
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Vérification technique complète des véhicules par notre
                      garage partenaire. Cliquez sur un véhicule pour voir et
                      modifier sa checklist.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {vehiclesChecklist.map(vehicle => <VehicleChecklistCard key={vehicle.id} id={vehicle.id} name={vehicle.name} image={vehicle.image} mileage={vehicle.mileage} year={vehicle.year} price={vehicle.price} checklistItems={vehicle.checklistItems} onClick={() => handleOpenVehicleChecklist(vehicle.id)} />)}
                  </div>
                  <div className="flex justify-end">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Valider toutes les Checklists
                    </button>
                  </div>
                </div>}
              {/* Étape 5: Documents & Paiement Final */}
              {activeTab === 5 && <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        Documents Finaux
                      </h3>
                      <div className="space-y-3">
                        <div className="border rounded-md p-3 border-gray-200 dark:border-gray-700 flex justify-between items-center">
                          <div className="flex items-center">
                            <FileIcon className="w-5 h-5 text-blue-500 mr-2" />
                            <span>Contrat de vente</span>
                          </div>
                          <button className="text-xs text-blue-600 dark:text-blue-400 underline">
                            Télécharger
                          </button>
                        </div>
                        <div className="border rounded-md p-3 border-gray-200 dark:border-gray-700 flex justify-between items-center">
                          <div className="flex items-center">
                            <FileIcon className="w-5 h-5 text-blue-500 mr-2" />
                            <span>Certificat d'immatriculation</span>
                          </div>
                          <button className="text-xs text-blue-600 dark:text-blue-400 underline">
                            Télécharger
                          </button>
                        </div>
                        <div className="border rounded-md p-3 border-gray-200 dark:border-gray-700 flex justify-between items-center">
                          <div className="flex items-center">
                            <FileIcon className="w-5 h-5 text-blue-500 mr-2" />
                            <span>Rapport CarVertical</span>
                          </div>
                          <button className="text-xs text-blue-600 dark:text-blue-400 underline">
                            Télécharger
                          </button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        Paiement Final
                      </h3>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">
                              Prix du véhicule
                            </span>
                            <span className="font-medium">€42,500</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">
                              Acompte déjà payé
                            </span>
                            <span className="font-medium">-€12,750</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">
                              Frais d'importation
                            </span>
                            <span className="font-medium">€3,200</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">
                              Frais d'immatriculation
                            </span>
                            <span className="font-medium">€850</span>
                          </div>
                          <div className="border-t dark:border-gray-600 pt-2 mt-2 flex justify-between">
                            <span className="font-medium">
                              Montant restant à payer
                            </span>
                            <span className="font-bold text-lg">€33,800</span>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="flex items-center mb-3">
                            <input type="checkbox" id="final-payment" checked={finalPaymentDone} onChange={() => setFinalPaymentDone(!finalPaymentDone)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
                            <label htmlFor="final-payment" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                              Paiement final effectué
                            </label>
                          </div>
                          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center">
                            <CreditCardIcon className="w-4 h-4 mr-2" />
                            Procéder au Paiement Final
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>}
              {/* Étape 6: Livraison */}
              {activeTab === 6 && <div className="space-y-6">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                      <CheckCircleIcon className="w-6 h-6 text-green-500 mr-3 mt-0.5" />
                      <div>
                        <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-1">
                          Projet finalisé
                        </h3>
                        <p className="text-sm text-green-700 dark:text-green-400">
                          Toutes les étapes ont été complétées avec succès. Le
                          véhicule est prêt à être livré.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border rounded-lg p-4 border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-medium mb-4">
                        Détails de Livraison
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Date de livraison
                          </span>
                          <span className="font-medium">15/10/2023</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Lieu de livraison
                          </span>
                          <span className="font-medium">À domicile</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Adresse
                          </span>
                          <span className="font-medium">
                            123 Rue de Paris, 75001 Paris
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Statut
                          </span>
                          <span className="font-medium text-green-600 dark:text-green-400">
                            Confirmé
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4 border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-medium mb-4">
                        Récapitulatif Véhicule
                      </h3>
                      <div className="flex mb-4">
                        <img src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="BMW X3" className="w-24 h-24 object-cover rounded-md mr-4" />
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
                </div>}
            </div>
          </div>
        </div>
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Action Buttons */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
              Actions
            </h3>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <PencilIcon className="w-4 h-4 mr-2" />
                Modifier Client
              </button>
              <button className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <ArchiveIcon className="w-4 h-4 mr-2" />
                Archiver Client
              </button>
              <button className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <BellIcon className="w-4 h-4 mr-2" />
                Envoyer Notification
              </button>
            </div>
          </div>
          {/* Timeline */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
              Historique
            </h3>
            <div className="relative pl-6 space-y-4">
              {clientData.timeline.map((event, index) => <div key={event.id} className="relative">
                  <div className="absolute -left-6 mt-1.5">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    {index < clientData.timeline.length - 1 && <div className="absolute top-3 left-1.5 w-0.5 h-full -ml-px bg-gray-300 dark:bg-gray-600"></div>}
                  </div>
                  <div>
                    <p className="text-sm">{event.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <ClockIcon className="w-3 h-3 mr-1" />
                      {event.date} à {event.time}
                    </p>
                  </div>
                </div>)}
            </div>
          </div>
        </div>
      </div>
      {/* Vehicle Checklist Modal */}
      {selectedVehicle && <VehicleChecklistModal isOpen={!!selectedChecklistVehicle} onClose={handleCloseVehicleChecklist} vehicleName={selectedVehicle.name} vehicleImage={selectedVehicle.image} vehicleYear={selectedVehicle.year} vehicleMileage={selectedVehicle.mileage} checklistItems={selectedVehicle.checklistItems} onUpdateStatus={(itemId, status) => handleChecklistStatusUpdate(selectedVehicle.id, itemId, status)} onUpdateComment={(itemId, comment) => handleChecklistCommentUpdate(selectedVehicle.id, itemId, comment)} />}
    </div>;
};
export default ClientDetail;