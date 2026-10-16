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
import { DEFAULT_CHECKLIST_ITEMS } from '../utils/vehicleChecklist';

// --- Interfaces ---
interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  time: string;
}

interface ClientData {
  deposit_amount: string;
  id: string;
  name: string;
  first_name?: string | null;
  last_name?: string | null;
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
  vehicle: string;
  maxKm: string;
  vehicleColor: string;
}

interface Vehicle {
  id: string;
  name: string;
  price: string;
  mileage: number;
  year: number;
  image: string;
  title: string;
  link: string;
}

interface ChecklistItem {
  id: string;
  name: string;
  status: "validated" | "pending" | "issue" | "rejected";
  comment?: string;
}

interface VehicleChecklist {
  id: string;
  name: string;
  link: string | null;
  checklistItems: ChecklistItem[];
}

// --- Composant principal ---
const ClientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [activeTab, setActiveTab] = useState<number>(1);
  const [isReady, setIsReady] = useState(false);


  const [depositPaid, setDepositPaid] = useState<boolean>(false);
  const [idCardSent, setIdCardSent] = useState<boolean>(false);

  const [vehiclesChecklist, setVehiclesChecklist] =
    useState<VehicleChecklist[]>([]);

  const [selectedChecklistVehicle, setSelectedChecklistVehicle] =
    useState<string | null>(null);

  const [clientData, setClientData] = useState<ClientData | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);


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

        // Map data to vehiclesChecklist
        const mappedChecklist: VehicleChecklist[] = data
          .filter((v: any) => v.selected_by === 'client')
          .map((v: any) => ({
            id: v.id.toString(),
            name: v.title || v.name || 'Annonce véhicule',
            link: v.link || null,
            checklistItems: (v.checklist || []).map((item: any) => ({
              id: item.id.toString(),
              name: item.name,
              status: item.status === 'rejected' ? 'issue' : item.status, // Map rejected to issue for now
              comment: item.comment
            }))
          }));
        setVehiclesChecklist(mappedChecklist);

      } catch (error) {
        console.error("Erreur fetch preselected:", error);
      }
    };

    fetchPreselectedVehicles();
  }, [clientData]);



  // ========== Mise à jour checklists ==========
  const handleChecklistStatusUpdate = (
    vehicleId: string,
    itemId: string,
    status: "validated" | "pending" | "issue" | "rejected"
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

  const handleInitializeChecklist = (vehicleId: string) => {
    setVehiclesChecklist((prev) =>
      prev.map((vehicle) =>
        vehicle.id === vehicleId
          ? {
            ...vehicle,
            checklistItems: DEFAULT_CHECKLIST_ITEMS.map((name, index) => ({
              id: `new-${vehicleId}-${index}`,
              name,
              status: 'pending' as const,
              comment: ""
            })),
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
      <Breadcrumb clientId={id || ""} clientName={clientData.name} />

      <ClientHeader clientData={clientData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <TabsNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="p-4 sm:p-6">
              {activeTab === 1 && (
                <ClientInfoTab
                  clientData={clientData}
                />
              )}

              {activeTab === 2 && (
                <ClientSelectionTab
                  clientId={clientData.id}
                  canAdd={clientData.step === 2}
                />
              )}

              {activeTab === 3 && (
                <DepositAndIdTab
                  clientId={clientData.id}
                  depositAmount={clientData.deposit_amount}
                  canEditAmount={clientData.step === 3}
                  onAmountChanged={(amount) => setClientData(prev => prev ? { ...prev, deposit_amount: amount } : prev)}
                  depositPaid={depositPaid}
                  setDepositPaid={setDepositPaid}
                  idCardSent={idCardSent}
                  setIdCardSent={setIdCardSent}
                  clientIdentity={{}}
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
                  clientId={clientData.id}
                />
              )}

              {activeTab === 6 && <DeliveryTab clientId={clientData.id} />}
            </div>
          </div>
        </div>

        <Sidebar clientData={clientData} />
      </div>

      {selectedVehicle && (
        <VehicleChecklistModal
          isOpen={!!selectedChecklistVehicle}
          onClose={() => setSelectedChecklistVehicle(null)}
          onInitialize={() => {
            if (selectedVehicle) {
              handleInitializeChecklist(selectedVehicle.id);
            }
          }}
          onSave={async () => {
            if (!selectedVehicle) return;
            try {
              const payload = {
                checks: selectedVehicle.checklistItems.map(item => ({
                  name: item.name,
                  status: item.status === 'issue' ? 'rejected' : item.status // Map issue back to rejected for API
                }))
              };

              const res = await fetch(`http://localhost:3000/api/clients/vehicle/${selectedVehicle.id}/checks`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(payload)
              });

              if (!res.ok) {
                throw new Error('Failed to save checklist');
              }

              // Optional: Show success message or refresh data
              console.log('Checklist saved successfully');
            } catch (error) {
              console.error('Error saving checklist:', error);
              alert('Erreur lors de la sauvegarde de la checklist');
            }
          }}
          vehicleName={selectedVehicle.name}
          vehicleLink={selectedVehicle.link}
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
