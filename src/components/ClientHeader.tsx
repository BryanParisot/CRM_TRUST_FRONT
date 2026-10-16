import React from 'react';

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
  vehicle: string;
  maxKm: string;
  vehicleColor: string;
  step: number;
  progress: number;
  budget: string;
  description: string;
  timeline: TimelineEvent[];
}

interface ClientHeaderProps {
  clientData: ClientData;
}

const ClientHeader: React.FC<ClientHeaderProps> = ({ clientData }) => {
  const steps=['Informations client','Propositions de véhicules','Signature & acompte','Contrôles du véhicule','Solde & documents','Livraison'];
  const words=clientData.name.trim().split(/\s+/);
  const initials=[words[0]?.[0],words.length>1?words[words.length-1]?.[0]:''].join('').toUpperCase();
  return <header className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800 sm:p-6">
    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-lg font-semibold text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">{initials}</span>
        <div className="min-w-0"><h1 className="text-xl font-semibold tracking-tight">{clientData.name}</h1><p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400"><span className="break-all">{clientData.email}</span><span>{clientData.phone}</span></p></div>
      </div>
      <div className="w-full xl:w-56 xl:shrink-0"><p className="flex justify-between gap-2 text-xs"><span className="font-medium text-gray-600 dark:text-gray-300">{steps[clientData.step-1]||'Suivi du dossier'}</span><span className="shrink-0 tabular-nums text-gray-400">{clientData.step}/6</span></p><div className="mt-2.5 grid grid-cols-6 gap-1.5" aria-label={`Étape ${clientData.step} sur 6`}>{steps.map((step,index)=><span key={step} className={`h-1.5 rounded-full ${index<clientData.step-1?'bg-emerald-400':index===clientData.step-1?'bg-blue-500':'bg-gray-100 dark:bg-gray-700'}`}/>)}</div></div>
    </div>
  </header>;
};
export default ClientHeader;
