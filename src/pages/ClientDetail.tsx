import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import ClientHeader from "../components/ClientHeader";
import ClientInfoTab from "../components/ClientInfoTab";
import ClientSelectionTab from "../components/ClientSelectionTab";
import DeliveryTab from "../components/DeliveryTab";
import DepositAndIdTab from "../components/DepositAndIdTab";
import DocumentsAndPaymentTab from "../components/DocumentsAndPaymentTab";
import GarageChecklistTab from "../components/GarageChecklistTab";
import Sidebar from "../components/Sidebar";
import TabsNavigation from "../components/TabsNavigation";
import VehicleChecklistModal from "../components/VehicleChecklistModal";

// --- Interfaces ---
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
  marque: string;
  modele: string;
  max_km: string;
  couleur: string;
  carburant: string;
  boite: string;
  puissance_min: number;
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
  status: "validated" | "pending" | "issue";
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

const vehicleChecklistData: VehicleChecklist[] = [
  {
    id: "vehicle-1",
    name: "BMW X3 xDrive30i",
    price: "€42,500",
    mileage: 25000,
    year: 2021,
    image:
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    checklistItems: [
      { id: "check-1-1", name: "Kilométrage certifié", status: "validated" },
      { id: "check-1-2", name: "Vidange à jour", status: "validated" },
      { id: "check-1-3", name: "Distribution vérifiée", status: "validated" },
      { id: "check-1-4", name: "CarVertical ajouté", status: "validated" },
      { id: "check-1-5", name: "Contrôle technique à jour", status: "validated" },
      { id: "check-1-6", name: "Freins vérifiés", status: "validated" },
      { id: "check-1-7", name: "Pneus vérifiés", status: "validated" },
      { id: "check-1-8", name: "Climatisation fonctionnelle", status: "validated" },
      { id: "check-1-9", name: "Batterie testée", status: "validated" },
    ],
  },
];

// --- Composant principal ---
const ClientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<number>(1);
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [depositPaid, setDepositPaid] = useState<boolean>(false);
  const [idCardSent, setIdCardSent] = useState<boolean>(false);
  const [vehiclesChecklist, setVehiclesChecklist] =
    useState<VehicleChecklist[]>(vehicleChecklistData);
  const [finalPaymentDone, setFinalPaymentDone] = useState<boolean>(false);
  const [selectedChecklistVehicle, setSelectedChecklistVehicle] = useState<
    string | null
  >(null);
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [vehicleOptions, setVehicleOptions] = useState<Vehicle[]>([]);

  // --- Chargement du client ---
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/clients/${id}`);
        if (!response.ok) throw new Error("Erreur lors du chargement du client");
        const data = await response.json();

        if (typeof data.timeline === "string") {
          data.timeline = JSON.parse(data.timeline);
        } else if (!data.timeline) {
          data.timeline = [];
        }

        setClientData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  // --- Chargement des véhicules selon le profil client ---
  useEffect(() => {
    if (!clientData) return;

    const fetchVehicles = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/scrape", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
          marque: clientData.marque,    
          modele: clientData.modele,             
          budget: clientData.budget,
          maxKm: clientData.max_km,
          couleur: clientData.couleur,
          puissance_min: clientData.puissance_min,
          boite: clientData.boite
          }),
        });

        if (!response.ok) {
          throw new Error("Erreur serveur: " + response.status);
        }

        const data = await response.json();
        setVehicleOptions(data);
      } catch (error) {
        console.error("Erreur fetch véhicules:", error);
      }
    };

    fetchVehicles();
  }, [clientData]);

  // --- Gestion sélection véhicules ---
  const handleVehicleSelection = (vehicleId: string) => {
    setSelectedVehicles((prev) =>
      prev.includes(vehicleId)
        ? prev.filter((id) => id !== vehicleId)
        : prev.length < 3
          ? [...prev, vehicleId]
          : prev
    );
  };

  // --- Gestion du modal checklist véhicule ---
  const handleOpenVehicleChecklist = (vehicleId: string) => {
    setSelectedChecklistVehicle(vehicleId);
  };
  const handleCloseVehicleChecklist = () => {
    setSelectedChecklistVehicle(null);
  };

  // --- Màj statut et commentaires checklist ---
  const handleChecklistStatusUpdate = (
    vehicleId: string,
    itemId: string,
    status: "validated" | "pending" | "issue"
  ) => {
    setVehiclesChecklist((prev) =>
      prev.map((vehicle) =>
        vehicle.id === vehicleId
          ? {
            ...vehicle,
            checklistItems: vehicle.checklistItems.map((item) =>
              item.id === itemId ? { ...item, status } : item
            ),
          }
          : vehicle
      )
    );
  };

  const handleChecklistCommentUpdate = (
    vehicleId: string,
    itemId: string,
    comment: string
  ) => {
    setVehiclesChecklist((prev) =>
      prev.map((vehicle) =>
        vehicle.id === vehicleId
          ? {
            ...vehicle,
            checklistItems: vehicle.checklistItems.map((item) =>
              item.id === itemId ? { ...item, comment } : item
            ),
          }
          : vehicle
      )
    );
  };

  // --- Format kilométrage ---
  const formatMileage = (mileage: number): string =>
    mileage.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  const selectedVehicle = selectedChecklistVehicle
    ? vehiclesChecklist.find((v) => v.id === selectedChecklistVehicle)
    : null;

  // --- États d’affichage ---
  if (loading) return <p className="text-center text-gray-500">Chargement du client...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!clientData) return <p className="text-center">Aucun client trouvé</p>;

  // --- Rendu principal ---
  return (
    <div className="space-y-6">
      <Breadcrumb clientId={id} clientName={clientData.name} />
      <ClientHeader clientData={clientData} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <TabsNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="p-6">
              {activeTab === 1 && (
                <ClientInfoTab
                  clientData={clientData}
                  vehicleOptions={vehicleOptions}
                  formatMileage={(n) => n.toString()}
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
