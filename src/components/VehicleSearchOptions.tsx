import {Car, Loader2, Pencil, Plus, Trash2} from 'lucide-react';
import {useId, useState, type FormEvent, type ReactNode} from 'react';
import toast from 'react-hot-toast';
import vehicleData from '../data/vehicles.json';
import type {AdditionalVehicle} from '../utils/vehiclePreferences';

interface Props {
  clientId: string | number;
  primary: string;
  vehicles: AdditionalVehicle[];
  canEdit: boolean;
  budgetLabel: string;
  children: ReactNode;
  onChanged: (vehicles: AdditionalVehicle[]) => void;
}
const normalize = (value: string) => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').trim().toLocaleLowerCase('fr');
const input = 'mt-1.5 w-full min-w-0 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200';

export default function VehicleSearchOptions({clientId, primary, vehicles, canEdit, budgetLabel, children, onChanged}: Props) {
  const [draft, setDraft] = useState<{id: number | null; marque: string; modele: string} | null>(null);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState<number | null>(null);
  const [error, setError] = useState('');
  const inputId = useId();
  const models = vehicleData.find(brand => normalize(brand.brand) === normalize(draft?.marque || ''))?.models || [];
  const busy = saving || removing !== null;
  const open = (vehicle?: AdditionalVehicle) => {
    setDraft(vehicle ? {...vehicle} : {id: null, marque: '', modele: ''});
    setError('');
  };
  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!draft || busy) return;
    setSaving(true);setError('');
    try {
      const response = await fetch(`http://localhost:3000/api/clients/${clientId}/vehicle-preferences${draft.id ? `/${draft.id}` : ''}`, {
        method: draft.id ? 'PATCH' : 'POST',
        headers: {'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}`},
        body: JSON.stringify({marque: draft.marque.trim(), modele: draft.modele.trim()}),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Impossible d’enregistrer le véhicule.');
      onChanged(data.additional_vehicles);setDraft(null);
      toast.success(draft.id ? 'Véhicule recherché modifié.' : 'Véhicule ajouté à la recherche.');
    } catch (error) {setError((error as Error).message);} finally {setSaving(false);}
  };
  const remove = async (vehicle: AdditionalVehicle) => {
    if (busy) return;
    setRemoving(vehicle.id);setError('');
    try {
      const response = await fetch(`http://localhost:3000/api/clients/${clientId}/vehicle-preferences/${vehicle.id}`, {
        method: 'DELETE', headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Impossible de retirer le véhicule.');
      onChanged(data.additional_vehicles);
      toast.success('Véhicule retiré de la recherche.');
    } catch (error) {setError((error as Error).message);} finally {setRemoving(null);}
  };

  return <section aria-labelledby="step-one-search" className="min-w-0 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
    <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-3.5 dark:border-gray-700 sm:px-5">
      <div className="flex min-w-0 items-center gap-2.5"><Car size={17} className="shrink-0 text-gray-400"/><h3 id="step-one-search" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Recherche de véhicule</h3></div>
      {canEdit && <button type="button" aria-label="Ajouter un autre véhicule" title="Ajouter un autre véhicule" disabled={busy || Boolean(draft)} onClick={() => open()} className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-xs font-semibold text-blue-600 transition hover:border-blue-300 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 disabled:opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-blue-300 dark:hover:bg-gray-700"><Plus size={15}/><span className="hidden sm:inline">Ajouter un autre véhicule</span></button>}
    </div>
    <div className="p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-900/50">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Véhicules envisagés</p>
        <div><p className="text-xs text-gray-500 dark:text-gray-400">Budget véhicule</p><p className="mt-1.5 text-base font-semibold tabular-nums text-gray-800 dark:text-gray-100">{budgetLabel}</p></div>
      </div>
      <div className="mt-4 space-y-3">
    <ul aria-label="Véhicules recherchés" className="divide-y divide-gray-100 rounded-lg border border-gray-200 dark:divide-gray-700 dark:border-gray-700">
      {primary && <li className="break-words px-3 py-3 text-sm font-medium text-gray-800 dark:text-gray-100">{primary}</li>}
      {vehicles.map(vehicle => {
        const label = [vehicle.marque, vehicle.modele].filter(Boolean).join(' ');
        return <li key={vehicle.id} className="flex min-w-0 items-center justify-between gap-3 px-3 py-2"><span className="min-w-0 break-words text-sm font-medium text-gray-800 dark:text-gray-100">{label}</span>{canEdit && <div className="flex shrink-0 gap-1"><button type="button" aria-label={`Modifier ${label}`} title="Modifier ce véhicule recherché" disabled={busy || Boolean(draft)} onClick={() => open(vehicle)} className="rounded-lg p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 disabled:opacity-40 dark:hover:bg-gray-700"><Pencil size={14}/></button><button type="button" aria-label={`Retirer ${label}`} title="Retirer ce véhicule de la recherche" disabled={busy || Boolean(draft)} onClick={() => remove(vehicle)} className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 disabled:opacity-40 dark:hover:bg-gray-700">{removing === vehicle.id ? <Loader2 size={14} className="animate-spin"/> : <Trash2 size={14}/>}</button></div>}</li>;
      })}
      {!primary && !vehicles.length && <li className="px-3 py-3 text-sm text-gray-400">Véhicule à définir</li>}
    </ul>
    {canEdit && draft && <form aria-label={draft.id ? 'Modifier un véhicule recherché' : 'Ajouter un véhicule recherché'} onSubmit={save} className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 dark:border-blue-900 dark:bg-gray-900/40">
      <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100">{draft.id ? 'Modifier le véhicule recherché' : 'Autre véhicule envisagé'}</h4>
      <div className="mt-3 grid min-w-0 gap-3 sm:grid-cols-2">
        <label htmlFor={`${inputId}-brand`} className="min-w-0 text-xs text-gray-500 dark:text-gray-400">Marque<input id={`${inputId}-brand`} autoFocus required maxLength={255} list={`${inputId}-brands`} value={draft.marque} onChange={event => setDraft({...draft, marque: event.target.value, modele: ''})} disabled={saving} placeholder="Ex. Audi" className={input}/><datalist id={`${inputId}-brands`}>{vehicleData.map(brand => <option key={brand.brand} value={brand.brand}/>)}</datalist></label>
        <label htmlFor={`${inputId}-model`} className="min-w-0 text-xs text-gray-500 dark:text-gray-400">Modèle (facultatif)<input id={`${inputId}-model`} maxLength={255} list={`${inputId}-models`} value={draft.modele} onChange={event => setDraft({...draft, modele: event.target.value})} disabled={saving} placeholder="Ex. Q7" className={input}/><datalist id={`${inputId}-models`}>{models.map(model => <option key={model} value={model}/>)}</datalist></label>
      </div>
      <p className="mt-3 text-xs leading-5 text-gray-400">Le budget et les critères ci-dessous s’appliquent à ces véhicules.</p>
      <div className="mt-4 flex flex-wrap gap-2"><button disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 disabled:opacity-50">{saving && <Loader2 size={14} className="animate-spin"/>}{saving ? 'Enregistrement…' : 'Enregistrer le véhicule'}</button><button type="button" disabled={saving} onClick={() => {setDraft(null);setError('');}} className="rounded-lg px-3 py-2 text-xs font-medium text-gray-500 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 dark:text-gray-300 dark:hover:bg-gray-800">Annuler</button></div>
    </form>}
    {error && <p role="alert" className="text-xs leading-5 text-red-600 dark:text-red-400">{error}</p>}
      </div>
      {children}
    </div>
  </section>;
}
