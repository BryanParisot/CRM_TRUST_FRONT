import {
  ArchiveIcon,
  BellIcon,
  CarIcon,
  CheckCircle2Icon,
  ClockIcon,
  Paperclip,
  PencilIcon,
  XIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

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
  step: number;
  progress: number;
  budget: string;
  description: string;
  timeline: TimelineEvent[];
}

interface Vehicle {
  id: number;
  title: string;
  price: string;
  mileage: string;
  image: string;
  selected_by?: string; // IMPORTANT
}

interface SidebarProps {
  clientData: ClientData;
}

const Sidebar: React.FC<SidebarProps> = ({ clientData }) => {
  const [selectedVehicles, setSelectedVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [linkLoading, setLinkLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  // ==========================================
  // 🔵 LOAD PRE-SELECTED VEHICLES
  // ==========================================
  useEffect(() => {
    let isMounted = true;

    const fetchPreselectedVehicles = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000/api/vehicles/client/${clientData.id}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );

        if (!response.ok) throw new Error("Erreur serveur");

        const data = await response.json();
        if (isMounted) {
          setSelectedVehicles(data);
        }
      } catch (error) {
        toast.error("Erreur de chargement des véhicules ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchPreselectedVehicles();
    return () => { isMounted = false };
  }, [clientData.id]);

  // ==========================================
  // 🔴 DELETE VEHICLE
  // ==========================================
  const handleRemoveVehicle = async (vehicleId: number) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/vehicles/${vehicleId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (!response.ok) throw new Error("Erreur suppression");

      setSelectedVehicles(prev => prev.filter(v => v.id !== vehicleId));
      toast.success("Véhicule supprimé 🚗");
    } catch {
      toast.error("Erreur lors de la suppression ❌");
    }
  };

  // ==========================================
  // 🚫 CONDITIONS BLOQUANTES
  // ==========================================

  // Aperçu client : au moins un véhicule sélectionné + envoyé au client
  const noVehicle = selectedVehicles.length === 0;

  // Étape 1 → impossible si aucun véhicule pré-sélectionné
  const lockStep1 = clientData.step === 1 && noVehicle;

  // Étape 2 → impossible si aucun véhicule sélectionné par le client
  const clientHasSelected = selectedVehicles.some(v => v.selected_by === "client");
  const lockStep2 = clientData.step === 2 && !clientHasSelected;

  // ==========================================
  // 🔗 GENERATE CLIENT LINK
  // ==========================================
  const handleGenerateLink = async () => {
    if (noVehicle) {
      toast.error("Ajoutez au moins un véhicule avant de générer le lien.");
      return;
    }

    try {
      setLinkLoading(true);
      const res = await fetch(
        `http://localhost:3000/api/clients/${clientData.id}/generate-link`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur serveur");

      setGeneratedLink(data.link);

      try {
        await navigator.clipboard.writeText(data.link);
        toast.success("Lien généré et copié 📋");
      } catch {
        toast.success("Lien généré (copie manuelle requise)");
      }
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la génération du lien.");
    } finally {
      setLinkLoading(false);
    }
  };

  // ==========================================
  // 🔽 DOWNGRADE STEP
  // ==========================================
  const handleDowngradeStep = async () => {
    if (clientData.step === 1) {
      toast.error("Impossible de descendre en dessous de l’étape 1.");
      return;
    }

    const previousStep = clientData.step - 1;

    try {
      setUpdating(true);

      const res = await fetch(
        `http://localhost:3000/api/clients/${clientData.id}/steps`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            to_step: previousStep,
            changed_by: "admin",
          }),
        }
      );

      if (!res.ok) throw new Error();

      toast.success(`Étape rétrogradée vers ${previousStep}`);
      window.location.reload();
    } catch {
      toast.error("Erreur lors de la rétrogradation ❌");
    } finally {
      setUpdating(false);
    }
  };

  // ==========================================
  // 🟢 VALIDATE STEP
  // ==========================================
  const handleValidateStep = async () => {
    const nextStep = clientData.step + 1;

    // Blocage étape 1
    if (lockStep1) {
      toast.error("Vous devez présélectionner au moins un véhicule.");
      return;
    }

    // Blocage étape 2
    if (lockStep2) {
      toast.error("Le client doit sélectionner au moins un véhicule.");
      return;
    }

    try {
      setUpdating(true);

      const res = await fetch(
        `http://localhost:3000/api/clients/${clientData.id}/steps`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            to_step: nextStep,
            changed_by: "admin",
          }),
        }
      );

      if (!res.ok) throw new Error();

      toast.success(`Étape ${nextStep} validée 👍`);
      window.location.reload();
    } catch {
      toast.error("Erreur lors de la validation ❌");
    } finally {
      setUpdating(false);
    }
  };

  // ==========================================
  // 🖼️ RENDER
  // ==========================================
  return (
    <div className="space-y-6">

      {/* ACTIONS */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
          Actions
        </h3>

        <div className="space-y-2">

          {/* GENERATE LINK */}
          <button
            onClick={handleGenerateLink}
            disabled={noVehicle || linkLoading}
            className={`w-full flex items-center justify-center py-2 px-4 border rounded-md transition ${noVehicle || linkLoading
                ? "text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed"
                : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
          >
            {linkLoading ? (
              <ClipLoader size={16} color="#4B5563" className="mr-2" />
            ) : (
              <Paperclip className="w-4 h-4 mr-2" />
            )}
            Générer et envoyer le lien
          </button>

          {generatedLink && (
            <p className="mt-1 text-[11px] text-gray-500 break-all">
              Lien client : {generatedLink}
            </p>
          )}

          {/* MODIFY */}
          <button className="w-full flex items-center justify-center py-2 px-4 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <PencilIcon className="w-4 h-4 mr-2" />
            Modifier Client
          </button>

          {/* ARCHIVE */}
          <button className="w-full flex items-center justify-center py-2 px-4 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <ArchiveIcon className="w-4 h-4 mr-2" />
            Archiver Client
          </button>

          {/* NOTIF */}
          <button className="w-full flex items-center justify-center py-2 px-4 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <BellIcon className="w-4 h-4 mr-2" />
            Envoyer Notification
          </button>

          {/* VALIDATION BUTTONS */}
          <div className="flex flex-row gap-2 justify-center h-full">

            {clientData.step > 1 && (
              <button
                onClick={handleDowngradeStep}
                disabled={updating || clientData.step === 1}
                className="w-full flex items-center justify-center py-2 px-4 rounded-md bg-red-500 text-white hover:bg-red-600 transition disabled:bg-red-300"
              >
                Rétrograder étape
              </button>
            )}

            {/* VALIDATE */}
            <button
              onClick={handleValidateStep}
              disabled={updating || lockStep1 || lockStep2}
              className={`w-full flex items-center justify-center py-2 px-4 rounded-md text-white transition ${updating || lockStep1 || lockStep2
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {updating ? (
                <ClipLoader size={16} color="#fff" />
              ) : (
                <CheckCircle2Icon className="w-4 h-4 mr-2" />
              )}

              {updating
                ? "Validation..."
                : lockStep1
                  ? "Présélection requise"
                  : lockStep2
                    ? "Choix client requis"
                    : `Valider étape ${clientData.step}`}
            </button>

          </div>
        </div>
      </div>

      {/* VEHICLE LIST */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center">
          <CarIcon className="w-4 h-4 mr-2 text-blue-500" />
          Véhicules présélectionnés ({selectedVehicles.length})
        </h3>

        {loading ? (
          <div className="flex justify-center py-6">
            <ClipLoader size={28} color="#2563EB" />
          </div>
        ) : selectedVehicles.length === 0 ? (
          <p className="text-xs text-center text-gray-400">
            Aucun véhicule présélectionné.
          </p>
        ) : (
          <div className="space-y-3">
            {selectedVehicles.map((v) => (
              <div
                key={v.id}
                className="group relative flex items-center space-x-3 border rounded-lg p-2 hover:shadow-md transition"
              >
                <button
                  onClick={() => handleRemoveVehicle(v.id)}
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                >
                  <XIcon className="w-3 h-3" />
                </button>

                <img
                  src={v.image}
                  alt={v.title}
                  className="w-16 h-12 object-cover rounded-md"
                />

                <div className="flex-1">
                  <p className="text-sm font-medium truncate">{v.title}</p>
                  <p className="text-xs text-gray-500">
                    {v.price} • {v.mileage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TIMELINE */}
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
                  <div className="absolute top-3 left-1.5 w-0.5 bg-gray-300 h-full"></div>
                )}
              </div>

              <div>
                <p className="text-sm">{event.title}</p>
                <p className="text-xs text-gray-500 flex items-center">
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
};

export default Sidebar;
