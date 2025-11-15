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
  const [isReady, setIsReady] = useState(false);

  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [depositPaid, setDepositPaid] = useState<boolean>(false);
  const [idCardSent, setIdCardSent] = useState<boolean>(false);

  const [vehiclesChecklist, setVehiclesChecklist] =
    useState<VehicleChecklist[]>(vehicleChecklistData);

  const [finalPaymentDone, setFinalPaymentDone] = useState<boolean>(false);
  const [selectedChecklistVehicle, setSelectedChecklistVehicle] =
    useState<string | null>(null);

  const [clientData, setClientData] = useState<ClientData | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [vehicleOptions, setVehicleOptions] = useState<Vehicle[]>([]);
  const [vehiclePreSelect, setvehiclePreSelect] = useState<Vehicle[]>([]);
  console.log(id);
  // ========== Sync activeTab avec step stocké en BDD ==========
  useEffect(() => {
    if (clientData) {
      setActiveTab(clientData.step);
      setIsReady(true);
    }
  }, [clientData]);

  // ========== Fetch Client ==========
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/clients/${id}`);
        if (!res.ok) throw new Error("Erreur lors du chargement du client");

        const data = await res.json();

        if (typeof data.timeline === "string") {
          data.timeline = JSON.parse(data.timeline);
        }
        if (!data.timeline) data.timeline = [];

        setClientData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  // ========== Fetch véhicules dynamiques ==========
  useEffect(() => {
    if (!clientData) return;

    const fetchVehicles = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/scrape", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            marque: clientData.marque,
            modele: clientData.modele,
            budget: clientData.budget,
            maxKm: clientData.max_km,
            couleur: clientData.couleur,
            fuel: clientData.carburant,
            puissance_min: clientData.puissance_min,
            boite: clientData.boite,
          }),
        });

        const data = await res.json();
        setVehicleOptions(data);
      } catch (error) {
        console.error("Erreur fetch véhicules:", error);
      }
    };

    fetchVehicles();
  }, [clientData]);


  useEffect(() => {
    if (!clientData) return;

    const fetchPreselectedVehicles = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/vehicles/client/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await res.json();
        console.log(data);
        setvehiclePreSelect(data);
      } catch (error) {
        console.error("Erreur fetch preselected:", error);
      }
    };

    fetchPreselectedVehicles();
  }, [clientData]);

  // ========== Sélection véhicules ==========
  const handleVehicleSelection = (vehicleId: string) => {
    setSelectedVehicles((prev) =>
      prev.includes(vehicleId)
        ? prev.filter((id) => id !== vehicleId)
        : prev.length < 3
          ? [...prev, vehicleId]
          : prev
    );
  };

  // ========== Mise à jour checklists ==========
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

  // ========== Utilitaire format ==========  
  const formatMileage = (mileage: number): string =>
    mileage.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  const selectedVehicle = selectedChecklistVehicle
    ? vehiclesChecklist.find((v) => v.id === selectedChecklistVehicle)
    : null;

  // ========== Loading / Error ==========
  if (loading) return <p className="text-center text-gray-500">Chargement du client...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!clientData) return <p className="text-center">Aucun client trouvé</p>;
  if (!isReady) return <p className="text-center text-gray-500">Chargement de la fiche...</p>;

  // ========== Rendu principal ==========
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
                  vehicleOptions={vehiclePreSelect}
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
                  handleOpenVehicleChecklist={setSelectedChecklistVehicle}
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
          onClose={() => setSelectedChecklistVehicle(null)}
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
