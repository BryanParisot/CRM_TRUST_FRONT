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
  price: string;
  mileage: number;
  year: number;
  image: string;
  checklistItems: ChecklistItem[];
}

const DEFAULT_CHECKLIST_ITEMS = [
  { name: "Kilométrage certifié", status: "validated" },
  { name: "Vidange à jour", status: "validated" },
  { name: "Distribution vérifiée", status: "pending" },
  { name: "CarVertical ajouté", status: "validated" },
  { name: "Contrôle technique à jour", status: "validated" },
  { name: "Freins vérifiés", status: "rejected" },
  { name: "Pneus vérifiés", status: "validated" },
  { name: "Climatisation fonctionnelle", status: "validated" },
  { name: "Batterie testée", status: "pending" }
] as const;

// --- Composant principal ---
const ClientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [activeTab, setActiveTab] = useState<number>(1);
  const [isReady, setIsReady] = useState(false);


  const [depositPaid, setDepositPaid] = useState<boolean>(false);
  const [idCardSent, setIdCardSent] = useState<boolean>(false);

  const [vehiclesChecklist, setVehiclesChecklist] =
    useState<VehicleChecklist[]>([]);

  const [finalPaymentDone, setFinalPaymentDone] = useState<boolean>(false);
  const [selectedChecklistVehicle, setSelectedChecklistVehicle] =
    useState<string | null>(null);

  const [clientData, setClientData] = useState<ClientData | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [vehicleOptions, setVehicleOptions] = useState<Vehicle[]>([]);
  const [vehiclePreSelect, setvehiclePreSelect] = useState<Vehicle[]>([]);
  console.log(vehiclePreSelect)
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
        setvehiclePreSelect(data);
        console.log(vehiclePreSelect)
      } catch (error) {
        console.error("Erreur fetch preselected:", error);
      }
    };

    fetchPreselectedVehicles();
  }, [clientData]);

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

        // Map data to vehiclesChecklist
        const mappedChecklist: VehicleChecklist[] = data
          .filter((v: any) => v.selected_by === 'client')
          .map((v: any) => ({
            id: v.id.toString(),
            name: v.title || v.name, // Handle title or name
            price: v.price,
            mileage: typeof v.mileage === 'string' ? parseInt(v.mileage.replace(/\D/g, '')) : v.mileage, // Ensure number
            year: v.year ? (typeof v.year === 'string' && v.year.includes('/') ? parseInt(v.year.split('/')[1]) : parseInt(v.year)) : 2020, // Parse year if needed
            image: v.image,
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
            checklistItems: DEFAULT_CHECKLIST_ITEMS.map((item, index) => ({
              id: `new-${vehicleId}-${index}`,
              name: item.name,
              status: item.status === 'rejected' ? 'issue' : item.status as "validated" | "pending" | "issue",
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

  // ========== Utilitaire format ==========  
  const formatMileage = (mileage: number | string | undefined | null): string => {
    if (mileage === undefined || mileage === null) return "N/A";
    return mileage.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
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

            <div className="p-6">
              {activeTab === 1 && (
                <ClientInfoTab
                  clientData={clientData}
                  vehicleOptions={vehicleOptions}
                  formatMileage={(n) => n ? n.toString() : "N/A"}
                />
              )}

              {activeTab === 2 && (
                <ClientSelectionTab
                  vehicleOptions={vehiclePreSelect}
                  formatMileage={formatMileage}
                />
              )}

              {activeTab === 3 && (
                <DepositAndIdTab
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
