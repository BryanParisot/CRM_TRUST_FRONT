import {ArrowLeft, ArrowRight, ArrowUpRight, Car, CheckCircle2, ChevronDown, Clock3, Copy, Pencil, Trash2} from 'lucide-react';
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import DeleteClientModal from "./DeleteClientModal";
import {PIPELINE_STAGES} from '../utils/pipeline';

interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  time: string;
}

interface ClientData {
  id: string;
  name: string;
  step: number;
  timeline: TimelineEvent[];
}

interface Vehicle {
  id: number;
  title: string;
  link: string;
  price: string;
  mileage: string;
  image: string;
  selected_by?: string; // IMPORTANT
  is_final_choice?:boolean;
  final_choice_needs_reconfirmation?:boolean;
}

interface SidebarProps {
  clientData: ClientData;
  onEdit: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ clientData, onEdit }) => {
  const navigate = useNavigate();
  const [selectedVehicles, setSelectedVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [linkLoading, setLinkLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // ==========================================
  // 🔵 LOAD PRE-SELECTED VEHICLES
  // ==========================================
  useEffect(() => {
    let isMounted = true;

    const fetchPreselectedVehicles = async () => {
      try {
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
    const timer = setInterval(fetchPreselectedVehicles, 5000);
    window.addEventListener('vehicles-updated', fetchPreselectedVehicles);
    return () => {
      isMounted = false;
      clearInterval(timer);
      window.removeEventListener('vehicles-updated', fetchPreselectedVehicles);
    };
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
      window.dispatchEvent(new Event("vehicles-updated"));
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

  // Étape 2 → impossible si aucun véhicule sélectionné par le client
  const clientHasSelected = selectedVehicles.some(v => v.selected_by === "client");
  const lockStep2 = clientData.step === 2 && !clientHasSelected;
  const lockStep4=clientData.step===4&&!selectedVehicles.some(vehicle=>vehicle.is_final_choice&&!vehicle.final_choice_needs_reconfirmation);

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

      const result=await res.json();if (!res.ok) throw new Error(result.message||'Impossible de revenir à cette étape.');

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

      const result=await res.json();if (!res.ok) throw new Error(result.message||'Impossible de valider cette étape.');

      toast.success(`Étape ${nextStep} validée 👍`);
      window.location.reload();
    } catch(error) {
      toast.error((error as Error).message);
    } finally {
      setUpdating(false);
    }
  };

  // ==========================================
  // 🗑️ DELETE CLIENT
  // ==========================================
  const handleDeleteClient = async () => {
    try {
      setIsDeleting(true);

      const res = await fetch(
        `http://localhost:3000/api/clients/${clientData.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) throw new Error("Erreur lors de la suppression");

      toast.success("Client supprimé avec succès ✅");
      setShowDeleteModal(false);

      // Redirect to clients list
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression ❌");
    } finally {
      setIsDeleting(false);
    }
  };

  const stage = PIPELINE_STAGES.find(stage => stage.step === clientData.step);
  const previousStage = PIPELINE_STAGES.find(stage => stage.step === clientData.step - 1);
  const nextStage = PIPELINE_STAGES.find(stage => stage.step === clientData.step + 1);
  const blocked = lockStep2 || lockStep4;
  const nextLabel = [
    'Valider et passer aux propositions',
    'Passer à la signature',
    'Passer aux contrôles',
    'Passer au solde',
    'Passer à la livraison',
  ][clientData.step - 1];
  const finalChoice = selectedVehicles.find(vehicle => vehicle.is_final_choice);
  const iconButton = 'inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 disabled:opacity-40 dark:hover:bg-gray-700 dark:hover:text-blue-300';
  const secondary = 'inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-medium text-gray-600 transition hover:border-blue-200 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:text-blue-300';

  return <aside aria-label="Actions et suivi du dossier" className="min-w-0 space-y-5">
    <section aria-labelledby="dossier-actions-title" className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="p-5">
        <div className="flex items-center justify-between gap-3"><h2 id="dossier-actions-title" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Suivi du dossier</h2><span className="text-xs tabular-nums text-gray-400">{clientData.step}/{PIPELINE_STAGES.length}</span></div>
        <span className={`mt-4 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium ${stage?.badge || 'bg-gray-100 text-gray-500'}`}><span className={`h-1.5 w-1.5 rounded-full ${stage?.accent || 'bg-gray-400'}`}/>{stage?.title || 'Étape en cours'}</span>
        {nextStage ? <>
          <p className="mt-3 text-xs leading-5 text-gray-500 dark:text-gray-400">{clientData.step === 1 ? 'Confirmez les critères avant de proposer les annonces au client.' : `Étape suivante : ${nextStage.title}`}</p>
          <button type="button" onClick={handleValidateStep} disabled={updating || blocked} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold leading-5 text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-40 dark:focus-visible:ring-blue-900">
            {updating ? <><ClipLoader size={16} color="#fff"/>Mise à jour…</> : <>{nextLabel}<ArrowRight size={16} className="shrink-0"/></>}
          </button>
          {lockStep4 && <p role="status" className="mt-3 flex items-start gap-2 text-xs leading-5 text-gray-500 dark:text-gray-400"><Clock3 size={14} className="mt-0.5 shrink-0"/>Le client doit confirmer son choix définitif après les contrôles.</p>}
        </> : <p className="mt-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400"><CheckCircle2 size={15}/>Dernière étape du parcours</p>}
        {previousStage && <button type="button" onClick={handleDowngradeStep} disabled={updating} title={`Revenir à l’étape ${previousStage.step} : ${previousStage.title}`} className={`mt-2 ${secondary}`}><ArrowLeft size={14} className="shrink-0"/>Revenir à l’étape précédente</button>}
      </div>
      <div className="space-y-3 border-t border-gray-100 p-4 dark:border-gray-700">
        {clientData.step > 1 && <div>
          <button type="button" onClick={handleGenerateLink} disabled={loading || noVehicle || linkLoading} className={secondary}>{linkLoading ? <ClipLoader size={14} color="#64748b"/> : <Copy size={14}/>}Copier le lien client</button>
          {generatedLink && <p className="mt-2 break-all text-[11px] leading-5 text-gray-400">{generatedLink}</p>}
        </div>}
        <div className="flex items-center justify-between gap-3">
          <Link to={`/client/${clientData.id}/profile`} className="inline-flex items-center gap-1.5 rounded text-xs font-medium text-gray-500 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 dark:text-gray-400 dark:hover:text-blue-300">Voir la fiche client<ArrowUpRight size={13}/></Link>
          <div className="flex gap-1"><button type="button" onClick={onEdit} aria-label="Modifier le client" title="Modifier le client" className={iconButton}><Pencil size={15}/></button><button type="button" onClick={() => setShowDeleteModal(true)} aria-label="Supprimer le client" title="Supprimer le client" className={`${iconButton} hover:!bg-red-50 hover:!text-red-600 dark:hover:!bg-red-900/20`}><Trash2 size={15}/></button></div>
        </div>
      </div>
    </section>

    {clientData.step > 1 && <details open className="group overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <summary className="flex cursor-pointer list-none items-center gap-2.5 px-4 py-4 text-sm font-semibold text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-300 dark:text-gray-100 [&::-webkit-details-marker]:hidden"><Car size={16} className="shrink-0 text-gray-400"/><span className="min-w-0 flex-1">Véhicules proposés</span><span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-xs font-medium tabular-nums text-gray-500 dark:bg-gray-700 dark:text-gray-300">{selectedVehicles.length}</span><ChevronDown size={15} className="shrink-0 text-gray-400 transition group-open:rotate-180"/></summary>
      <div className="space-y-2 border-t border-gray-100 p-3 dark:border-gray-700">
        {loading ? <div className="flex justify-center py-4"><ClipLoader size={22} color="#2563EB"/></div> : !selectedVehicles.length ? <p className="px-1 py-3 text-xs text-gray-400">Aucune annonce ajoutée pour le moment.</p> : selectedVehicles.map(vehicle => {
          const notChosen = Boolean(finalChoice) && !vehicle.is_final_choice;
          return <div key={vehicle.id} data-proposal-not-chosen={notChosen} className={`flex items-start gap-2 rounded-lg border p-3 ${notChosen ? 'border-gray-200 bg-gray-50 opacity-60 dark:border-gray-700 dark:bg-gray-900/50' : 'border-gray-100 dark:border-gray-700'}`}>
            <div className="min-w-0 flex-1"><a href={vehicle.link} target="_blank" rel="noopener noreferrer" className="break-words text-xs font-medium leading-5 text-blue-600 hover:underline dark:text-blue-300">{vehicle.title}</a><p className="mt-1 text-[11px] leading-5 text-gray-400">{vehicle.selected_by === 'client' ? 'Retenu par le client' : vehicle.selected_by === 'rejected' ? 'Refusé par le client' : 'En attente du client'}</p>{vehicle.is_final_choice && <p className={`mt-2 text-[11px] font-semibold ${vehicle.final_choice_needs_reconfirmation ? 'text-amber-600 dark:text-amber-300' : 'text-emerald-600 dark:text-emerald-300'}`}>{vehicle.final_choice_needs_reconfirmation ? 'Choix à reconfirmer' : 'Choix définitif du client'}</p>}</div>
            <button type="button" onClick={() => handleRemoveVehicle(vehicle.id)} disabled={vehicle.is_final_choice} aria-label={`Supprimer la proposition ${vehicle.title}`} title={vehicle.is_final_choice ? 'Véhicule choisi définitivement' : 'Supprimer cette proposition'} className={`${iconButton} shrink-0 hover:!text-red-600`}><Trash2 size={14}/></button>
          </div>;
        })}
      </div>
    </details>}

    {clientData.timeline.length > 0 && <section className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Historique</h3>
      <ol className="mt-4 space-y-4">{clientData.timeline.map(event => <li key={event.id} className="border-l-2 border-gray-100 pl-3 dark:border-gray-700"><p className="text-xs leading-5 text-gray-700 dark:text-gray-200">{event.title}</p><p className="mt-1 flex items-center gap-1.5 text-[11px] text-gray-400"><Clock3 size={12}/>{event.date} à {event.time}</p></li>)}</ol>
    </section>}

    <DeleteClientModal isOpen={showDeleteModal} onClose={() => {if (!isDeleting) setShowDeleteModal(false);}} onConfirm={handleDeleteClient} clientName={clientData.name} isDeleting={isDeleting}/>
  </aside>;
};

export default Sidebar;
