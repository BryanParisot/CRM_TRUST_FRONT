import {AlertCircle, ArrowLeft, ArrowUpRight, Car, Edit2, FileText, Loader2, Mail, Phone, Trash2, User} from 'lucide-react';
import {useEffect, useState, type ComponentProps, type ReactNode} from 'react';
import toast from 'react-hot-toast';
import {Link, useNavigate, useParams} from 'react-router-dom';
import DeleteClientModal from '../components/DeleteClientModal';
import EditClientModal from '../components/EditClientModal';
import {PIPELINE_STAGES} from '../utils/pipeline';
import {vehicleSearchLabels, type AdditionalVehicle} from '../utils/vehiclePreferences';

type EditForm = ComponentProps<typeof EditClientModal>['clientData'];
interface ClientData {
  id: number | string;
  name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
  step?: number;
  marque?: string | null;
  modele?: string | null;
  max_km?: string | number | null;
  couleur?: string | null;
  carburant?: string | null;
  boite?: string | null;
  puissance_min?: string | number | null;
  budget?: string | number | null;
  description?: string | null;
  premiere_immat?: string | null;
  additional_vehicles?: AdditionalVehicle[];
}
const primary = 'inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200';
const secondary = 'inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:border-blue-200 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300';
const panel = 'min-w-0 rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800';
const headers = () => ({Authorization: `Bearer ${localStorage.getItem('token')}`});
const asText = (value: string | number | null | undefined) => value == null ? '' : String(value);
const numberWithUnit = (value: string | number | null | undefined, unit: string) => {
  if (value == null || String(value).trim() === '' || !Number.isFinite(Number(value))) return '';
  return `${Number(value).toLocaleString('fr-FR', {maximumFractionDigits: 0})} ${unit}`;
};
function Field({label, children}: {label: string; children?: ReactNode}) {
  return <div className="min-w-0">
    <dt className="text-xs text-gray-500 dark:text-gray-400">{label}</dt>
    <dd className="mt-1.5 break-words text-sm font-medium text-gray-800 dark:text-gray-200">{children || <span className="font-normal text-gray-400 dark:text-gray-500">Non renseigné</span>}</dd>
  </div>;
}

export default function ClientProfile() {
  const {id} = useParams<{id: string}>();
  const navigate = useNavigate();
  const [record, setRecord] = useState<{id: string; data: ClientData} | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const client = record && record.id === id ? record.data : null;

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    setShowEdit(false);
    setShowDelete(false);
    async function load() {
      try {
        const response = await fetch(`http://localhost:3000/api/clients/${id}`, {headers: headers(), signal: controller.signal, cache: 'no-store'});
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Impossible de charger cette fiche client.');
        if (!controller.signal.aborted) setRecord({id: id!, data});
      } catch (error) {
        if (!controller.signal.aborted) setError((error as Error).message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [id, retry]);

  const updateClient = async (form: EditForm) => {
    if (!client || updating) return;
    setUpdating(true);
    try {
      const body = {...form, vehicle_color: form.couleur, first_registration: form.premiere_immat,
        budget: form.budget === '' ? null : Number(form.budget),
        max_km: form.max_km === '' ? null : Number(form.max_km),
        puissance_min: form.puissance_min === '' ? null : Number(form.puissance_min)};
      const response = await fetch(`http://localhost:3000/api/clients/${id}`, {method: 'PATCH', headers: {...headers(), 'Content-Type': 'application/json'}, body: JSON.stringify(body)});
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Impossible de modifier le client.');
      setRecord(previous => previous && previous.id === id ? {id: previous.id, data: {...previous.data, ...body, name: `${form.first_name.trim()} ${form.last_name.trim()}`}} : previous);
      setShowEdit(false);
      toast.success('Client modifié.');
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setUpdating(false);
    }
  };
  const deleteClient = async () => {
    if (!client || deleting) return;
    setDeleting(true);
    try {
      const response = await fetch(`http://localhost:3000/api/clients/${id}`, {method: 'DELETE', headers: headers()});
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Impossible de supprimer le client.');
      toast.success('Client supprimé.');
      navigate('/clients');
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setDeleting(false);
    }
  };

  const back = <Link to="/clients" className="inline-flex items-center gap-2 rounded text-sm text-gray-500 transition hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 dark:text-gray-400 dark:hover:text-blue-300"><ArrowLeft size={16}/>Tous les clients</Link>;
  if (loading || (!client && !error)) return <section className="space-y-5">{back}<div role="status" className="flex min-h-64 items-center justify-center gap-2 text-sm text-gray-500"><Loader2 size={20} className="animate-spin"/>Chargement de la fiche client…</div></section>;
  if (error || !client) return <section className="space-y-5">{back}<div role="alert" className={`${panel} flex flex-col items-center gap-4 p-8 text-center`}><AlertCircle size={24} className="text-red-500"/><p className="text-sm text-gray-600 dark:text-gray-300">{error || 'Client introuvable.'}</p><button onClick={() => setRetry(value => value + 1)} className={secondary}>Réessayer</button></div></section>;

  const name = client.name?.trim() || [client.first_name, client.last_name].filter(Boolean).join(' ') || 'Client';
  const words = name.split(/\s+/);
  const initials = [words[0]?.[0], words.length > 1 ? words[words.length - 1]?.[0] : ''].join('').toUpperCase();
  const stage = PIPELINE_STAGES.find(stage => stage.step === client.step);
  const editData: EditForm = {
    name, first_name: client.first_name || '', last_name: client.last_name || '',
    email: client.email || '', phone: client.phone || '', marque: client.marque || '', modele: client.modele || '',
    budget: asText(client.budget), max_km: asText(client.max_km), carburant: client.carburant || '', boite: client.boite || '',
    puissance_min: asText(client.puissance_min), couleur: client.couleur || '', description: client.description || '', premiere_immat: client.premiere_immat || '',
  };

  return <section className="min-w-0 space-y-5">
    {back}
    <header className={panel}>
      <div className="flex flex-wrap items-center justify-between gap-5 p-5 sm:p-6">
        <div className="flex min-w-0 flex-1 basis-64 items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-lg font-semibold text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">{initials}</span>
          <div className="min-w-0"><p className="mb-1 text-xs text-gray-400">Fiche client · Dossier #{client.id}</p><h1 className="break-words text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">{name}</h1></div>
        </div>
        <div className="grid w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 sm:flex sm:w-auto sm:flex-wrap">
          <Link to={`/client/${id}`} className={primary}>Ouvrir le dossier<ArrowUpRight size={16}/></Link>
          <button onClick={() => setShowEdit(true)} aria-label="Modifier le client" title="Modifier le client" className={secondary}><Edit2 size={15}/><span className="hidden sm:inline">Modifier</span></button>
          <button onClick={() => setShowDelete(true)} aria-label={`Supprimer ${name}`} title="Supprimer le client" className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 transition hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 dark:hover:bg-red-900/20"><Trash2 size={16}/></button>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 px-5 py-4 dark:border-gray-700 sm:px-6">
        <div className="flex flex-wrap items-center gap-3"><span className={`inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium ${stage?.badge || 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300'}`}><span className={`h-1.5 w-1.5 rounded-full ${stage?.accent || 'bg-gray-400'}`}/>{stage?.title || 'Étape à préciser'}</span>{stage && <p className="text-xs text-gray-500 dark:text-gray-400">{stage.description}</p>}</div>
        <div className="flex items-center gap-3"><span className="text-xs tabular-nums text-gray-400">{stage ? `Étape ${stage.step} sur ${PIPELINE_STAGES.length}` : 'Parcours à préciser'}</span><div className="grid w-28 grid-cols-6 gap-1" aria-hidden="true">{PIPELINE_STAGES.map(item => <span key={item.step} className={`h-1 rounded-full ${stage && item.step <= stage.step ? stage.accent : 'bg-gray-100 dark:bg-gray-700'}`}/>)}</div></div>
      </div>
    </header>

    <div className="grid items-start gap-5 lg:grid-cols-3">
      <section aria-labelledby="contact-title" className={panel}>
        <div className="flex items-center gap-2.5 border-b border-gray-100 px-5 py-4 dark:border-gray-700"><User size={17} className="text-gray-400"/><h2 id="contact-title" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Coordonnées</h2></div>
        <dl className="space-y-5 p-5">
          <div className="grid grid-cols-2 gap-4"><Field label="Prénom">{client.first_name}</Field><Field label="Nom">{client.last_name}</Field></div>
          <Field label="Email">{client.email && <a href={`mailto:${client.email}`} className="inline-flex max-w-full items-start gap-2 hover:text-blue-600 dark:hover:text-blue-300"><Mail size={14} className="mt-0.5 shrink-0 text-gray-400"/><span className="min-w-0 break-all">{client.email}</span></a>}</Field>
          <Field label="Téléphone">{client.phone && <a href={`tel:${client.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-300"><Phone size={14} className="shrink-0 text-gray-400"/>{client.phone}</a>}</Field>
        </dl>
      </section>

      <div className="min-w-0 space-y-5 lg:col-span-2">
        <section aria-labelledby="vehicle-title" className={panel}>
          <div className="flex items-center gap-2.5 border-b border-gray-100 px-5 py-4 dark:border-gray-700"><Car size={17} className="text-gray-400"/><h2 id="vehicle-title" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Recherche de véhicule</h2></div>
          <div className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-900/50">
              <div className="min-w-0"><p className="text-xs text-gray-500 dark:text-gray-400">Véhicules envisagés</p><p className="mt-1.5 break-words text-base font-semibold text-gray-800 dark:text-gray-100">{vehicleSearchLabels(client).join(' / ') || 'Véhicule à définir'}</p></div>
              <div><p className="text-xs text-gray-500 dark:text-gray-400">Budget véhicule</p><p className="mt-1.5 text-base font-semibold tabular-nums text-gray-800 dark:text-gray-100">{numberWithUnit(client.budget, '€') || 'À définir'}</p></div>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
              <Field label="Kilométrage maximum">{numberWithUnit(client.max_km, 'km')}</Field>
              <Field label="Année minimum">{client.premiere_immat}</Field>
              <Field label="Couleur">{client.couleur}</Field>
              <Field label="Carburant">{client.carburant}</Field>
              <Field label="Boîte de vitesses">{client.boite}</Field>
              <Field label="Puissance minimale">{numberWithUnit(client.puissance_min, 'CV')}</Field>
            </dl>
          </div>
        </section>
        <section aria-labelledby="notes-title" className={panel}>
          <div className="flex items-center gap-2.5 border-b border-gray-100 px-5 py-4 dark:border-gray-700"><FileText size={17} className="text-gray-400"/><h2 id="notes-title" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Notes & précisions</h2></div>
          <p className={`whitespace-pre-wrap break-words p-5 text-sm leading-6 ${client.description?.trim() ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}>{client.description?.trim() || 'Aucune note pour ce dossier.'}</p>
        </section>
      </div>
    </div>

    <EditClientModal isOpen={showEdit} onClose={() => {if (!updating) setShowEdit(false);}} onSubmit={updateClient} clientData={editData} isUpdating={updating}/>
    <DeleteClientModal isOpen={showDelete} onClose={() => {if (!deleting) setShowDelete(false);}} onConfirm={deleteClient} clientName={name} isDeleting={deleting}/>
  </section>;
}
