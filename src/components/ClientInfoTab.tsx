import {FileText, Mail, Pencil, Phone, User} from 'lucide-react';
import type {ReactNode} from 'react';
import VehicleSearchOptions from './VehicleSearchOptions';
import type {AdditionalVehicle} from '../utils/vehiclePreferences';
import VehicleSearchCriteria, {type SavedVehicleCriteria} from './VehicleSearchCriteria';

interface ClientInfoTabProps {
  clientData: {
    id: string | number;
    step: number;
    additional_vehicles?: AdditionalVehicle[];
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
    phone?: string | null;
    marque?: string | null;
    modele?: string | null;
    budget?: string | number | null;
    max_km?: string | number | null;
    premiere_immat?: string | null;
    couleur?: string | null;
    carburant?: string | null;
    boite?: string | null;
    puissance_min?: string | number | null;
    description?: string | null;
    deliveryOption?: string | null;
  };
  onEdit: () => void;
  onVehiclesChanged: (vehicles: AdditionalVehicle[]) => void;
  onCriteriaChanged: (criteria: SavedVehicleCriteria) => void;
}

function Field({label, children}: {label: string; children?: ReactNode}) {
  return <div className="min-w-0">
    <dt className="text-xs text-gray-500 dark:text-gray-400">{label}</dt>
    <dd className="mt-1.5 break-words text-sm font-medium text-gray-800 dark:text-gray-200">{children || <span className="font-normal text-gray-400 dark:text-gray-500">Non renseigné</span>}</dd>
  </div>;
}

const numberWithUnit = (value: string | number | null | undefined, unit: string) => {
  if (value == null || String(value).trim() === '' || !Number.isFinite(Number(value))) return '';
  return `${Number(value).toLocaleString('fr-FR', {maximumFractionDigits: 0})} ${unit}`;
};
const panel = 'min-w-0 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700';
const heading = 'flex items-center gap-2.5 border-b border-gray-100 px-4 py-3.5 dark:border-gray-700 sm:px-5';

export default function ClientInfoTab({clientData: client, onEdit, onVehiclesChanged, onCriteriaChanged}: ClientInfoTabProps) {
  const vehicle = [client.marque, client.modele].filter(Boolean).join(' ');

  return <div className="min-w-0 space-y-5">
    <section aria-labelledby="step-one-contact" className={panel}>
      <div className={`${heading} justify-between`}>
        <div className="flex items-center gap-2.5"><User size={17} className="shrink-0 text-gray-400"/><h3 id="step-one-contact" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Coordonnées</h3></div>
        <button type="button" onClick={onEdit} aria-label="Modifier les informations" title="Modifier les informations" className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-xs font-semibold text-gray-600 transition hover:border-blue-200 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:text-blue-300"><Pencil size={14}/><span className="hidden sm:inline">Modifier les informations</span></button>
      </div>
      <dl className="grid grid-cols-1 gap-x-6 gap-y-5 p-4 sm:grid-cols-2 sm:p-5">
        <div className="grid grid-cols-2 gap-6 sm:col-span-2">
          <Field label="Prénom">{client.first_name}</Field>
          <Field label="Nom">{client.last_name}</Field>
        </div>
        <Field label="Email">{client.email && <a href={`mailto:${client.email}`} className="inline-flex max-w-full items-start gap-2 hover:text-blue-600 dark:hover:text-blue-300"><Mail size={14} className="mt-0.5 shrink-0 text-gray-400"/><span className="min-w-0 break-all">{client.email}</span></a>}</Field>
        <Field label="Téléphone">{client.phone && <a href={`tel:${client.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-300"><Phone size={14} className="shrink-0 text-gray-400"/>{client.phone}</a>}</Field>
      </dl>
    </section>

    <VehicleSearchOptions key={client.id} clientId={client.id} primary={vehicle} vehicles={client.additional_vehicles || []} canEdit={client.step === 1} onChanged={onVehiclesChanged} budgetLabel={Number(client.budget) > 0 ? numberWithUnit(client.budget, '€') : 'À définir'}>
      <VehicleSearchCriteria clientId={client.id} value={client} canEdit={client.step === 1} onSaved={onCriteriaChanged}/>
      {client.deliveryOption && <dl className="mt-5"><Field label="Option de livraison">{client.deliveryOption}</Field></dl>}
    </VehicleSearchOptions>

    <section aria-labelledby="step-one-notes" className={panel}>
      <div className={heading}><FileText size={17} className="shrink-0 text-gray-400"/><h3 id="step-one-notes" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Notes du premier échange</h3></div>
      <p className={`whitespace-pre-wrap break-words p-4 text-sm leading-6 sm:p-5 ${client.description?.trim() ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}>{client.description?.trim() || 'Aucune précision pour le moment.'}</p>
    </section>
  </div>;
}
