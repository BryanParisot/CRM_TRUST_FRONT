import {Loader2, Pencil, Plus} from 'lucide-react';
import {useState, type FormEvent} from 'react';
import toast from 'react-hot-toast';

export interface VehicleCriteriaData {
  budget?: string | number | null;
  max_km?: string | number | null;
  premiere_immat?: string | null;
  couleur?: string | null;
  carburant?: string | null;
  boite?: string | null;
  puissance_min?: string | number | null;
}
export interface SavedVehicleCriteria {
  budget: number | null;
  max_km: number | null;
  premiere_immat: string | null;
  couleur: string;
  carburant: string;
  boite: string;
  puissance_min: number | null;
}
interface Props {
  clientId: string | number;
  value: VehicleCriteriaData;
  canEdit: boolean;
  onSaved: (value: SavedVehicleCriteria) => void;
}
const emptyDraft = {budget: '', max_km: '', premiere_immat: '', couleur: '', carburant: '', boite: '', puissance_min: ''};
const input = 'mt-1.5 w-full min-w-0 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200';
const positiveText = (value: string | number | null | undefined) => value != null && Number(value) > 0 ? String(value) : '';
const numberText = (value: string | number | null | undefined) => value != null && String(value).trim() !== '' && Number.isFinite(Number(value)) ? String(value) : '';
const withUnit = (value: string | number | null | undefined, unit: string) => numberText(value) !== '' ? `${Number(value).toLocaleString('fr-FR')} ${unit}` : '';

export default function VehicleSearchCriteria({clientId, value, canEdit, onSaved}: Props) {
  const [draft, setDraft] = useState<typeof emptyDraft | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const hasCriteria = Boolean(positiveText(value.budget) || positiveText(value.max_km) || positiveText(value.premiere_immat) || positiveText(value.puissance_min) || value.couleur || value.carburant || value.boite);
  const open = () => {
    setDraft({budget: positiveText(value.budget), max_km: hasCriteria ? numberText(value.max_km) : '', premiere_immat: positiveText(value.premiere_immat), puissance_min: hasCriteria ? numberText(value.puissance_min) : '', couleur: value.couleur || '', carburant: value.carburant || '', boite: value.boite || ''});
    setError('');
  };
  const change = (field: keyof typeof emptyDraft, text: string) => setDraft(previous => previous ? {...previous, [field]: text} : previous);
  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!draft || saving) return;
    setSaving(true);setError('');
    const criteria: SavedVehicleCriteria = {
      budget: draft.budget.trim() === '' ? null : Number(draft.budget),
      max_km: draft.max_km.trim() === '' ? null : Number(draft.max_km),
      puissance_min: draft.puissance_min.trim() === '' ? null : Number(draft.puissance_min),
      premiere_immat: draft.premiere_immat.trim() || null,
      couleur: draft.couleur.trim(), carburant: draft.carburant, boite: draft.boite,
    };
    try {
      const response = await fetch(`http://localhost:3000/api/clients/${clientId}`, {
        method: 'PATCH', headers: {'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}`},
        body: JSON.stringify({...criteria, vehicle_color: criteria.couleur, first_registration: criteria.premiere_immat}),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Impossible d’enregistrer les critères.');
      onSaved(criteria);setDraft(null);toast.success('Critères de recherche enregistrés.');
    } catch (error) {setError((error as Error).message);} finally {setSaving(false);}
  };
  const fields = [
    {label: 'Kilométrage maximum', value: hasCriteria ? withUnit(value.max_km, 'km') : ''},
    {label: 'Année minimum', value: positiveText(value.premiere_immat)},
    {label: 'Couleur', value: value.couleur},
    {label: 'Carburant', value: value.carburant},
    {label: 'Boîte de vitesses', value: value.boite},
    {label: 'Puissance minimale', value: hasCriteria ? withUnit(value.puissance_min, 'CV') : ''},
  ];

  return <div className="mt-5 border-t border-gray-100 pt-4 dark:border-gray-700">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Critères de recherche</h4>
      {canEdit && !draft && <button type="button" onClick={open} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-xs font-semibold text-blue-600 transition hover:border-blue-300 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 dark:border-gray-600 dark:bg-gray-800 dark:text-blue-300 dark:hover:bg-gray-700">{hasCriteria ? <Pencil size={14}/> : <Plus size={14}/>}{hasCriteria ? 'Modifier les critères' : 'Ajouter les critères'}</button>}
    </div>
    {canEdit && draft ? <form aria-label="Critères de recherche du véhicule" onSubmit={save} className="mt-4 rounded-xl border border-blue-100 bg-blue-50/40 p-4 dark:border-blue-900 dark:bg-gray-900/40">
      <div className="grid min-w-0 gap-4 sm:grid-cols-2">
        {([
          {field: 'budget', label: 'Budget véhicule (€)', min: 0.01, max: 9999999999.99, step: '0.01', placeholder: 'Ex. 25 000'},
          {field: 'max_km', label: 'Kilométrage maximum (km)', min: 0, max: 2147483647, step: '1', placeholder: 'Ex. 60 000'},
          {field: 'premiere_immat', label: 'Année minimum', min: 1900, max: 2100, step: '1', placeholder: 'Ex. 2020'},
          {field: 'puissance_min', label: 'Puissance minimale (CV)', min: 0, max: 2147483647, step: '1', placeholder: 'Ex. 120'},
        ] as const).map((field, index) => <label key={field.field} className="min-w-0 text-xs text-gray-500 dark:text-gray-400">{field.label}<input autoFocus={index === 0} name={field.field} type="number" min={field.min} max={field.max} step={field.step} value={draft[field.field]} onChange={event => change(field.field, event.target.value)} disabled={saving} placeholder={field.placeholder} className={input}/></label>)}
        <label className="min-w-0 text-xs text-gray-500 dark:text-gray-400">Carburant<select name="carburant" value={draft.carburant} onChange={event => change('carburant', event.target.value)} disabled={saving} className={input}><option value="">Non précisé</option>{['Essence', 'Diesel', 'Hybride', 'Électrique'].map(fuel => <option key={fuel}>{fuel}</option>)}</select></label>
        <label className="min-w-0 text-xs text-gray-500 dark:text-gray-400">Boîte de vitesses<select name="boite" value={draft.boite} onChange={event => change('boite', event.target.value)} disabled={saving} className={input}><option value="">Non précisée</option><option>Manuelle</option><option>Automatique</option></select></label>
        <label className="min-w-0 text-xs text-gray-500 dark:text-gray-400 sm:col-span-2">Couleur<input name="couleur" value={draft.couleur} maxLength={255} onChange={event => change('couleur', event.target.value)} disabled={saving} placeholder="Ex. Gris, noir ou sans préférence" className={input}/></label>
      </div>
      <p className="mt-3 text-xs leading-5 text-gray-400">Ces critères sont communs aux véhicules envisagés. Tous les champs sont facultatifs.</p>
      <div className="mt-4 flex flex-wrap gap-2"><button disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 disabled:opacity-50">{saving && <Loader2 size={14} className="animate-spin"/>}{saving ? 'Enregistrement…' : 'Enregistrer les critères'}</button><button type="button" disabled={saving} onClick={() => {setDraft(null);setError('');}} className="rounded-lg px-3 py-2 text-xs font-medium text-gray-500 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 dark:text-gray-300 dark:hover:bg-gray-800">Annuler</button></div>
    </form> : <dl className="mt-4 grid grid-cols-2 gap-x-5 gap-y-5 xl:grid-cols-3">{fields.map(field => <div key={field.label} className="min-w-0"><dt className="text-xs text-gray-500 dark:text-gray-400">{field.label}</dt><dd className={`mt-1.5 break-words text-sm ${field.value ? 'font-medium text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500'}`}>{field.value || 'Non renseigné'}</dd></div>)}</dl>}
    {error && <p role="alert" className="mt-3 text-xs text-red-600 dark:text-red-400">{error}</p>}
  </div>;
}
