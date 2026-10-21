import {PIPELINE_STAGES} from '../utils/pipeline';
import {MessageCircle} from 'lucide-react';
import {whatsappLink} from '../utils/whatsapp';

interface ClientHeaderProps {
  clientData: {
    id: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    step: number;
  };
}

export default function ClientHeader({clientData: client}: ClientHeaderProps) {
  const words = client.name.trim().split(/\s+/);
  const initials = [words[0]?.[0], words.length > 1 ? words[words.length - 1]?.[0] : ''].join('').toUpperCase();
  const stage = PIPELINE_STAGES.find(stage => stage.step === client.step);
  const whatsapp = whatsappLink(client.phone);
  const messageIconClass = 'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300';

  return <header className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800 sm:p-6">
    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-lg font-semibold text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">{initials}</span>
        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-1.5 text-xs text-gray-400">
            <span>Dossier #{client.id}</span>
            {whatsapp ? <a href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label={`Contacter ${client.name} sur WhatsApp`} title="Ouvrir la conversation WhatsApp" className={`${messageIconClass} hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400`}><MessageCircle size={14} strokeWidth={1.7}/></a> : <button type="button" disabled aria-label="WhatsApp indisponible : renseignez un numéro de téléphone valide" title="Renseignez un numéro de téléphone valide pour ouvrir WhatsApp" className={`${messageIconClass} cursor-not-allowed opacity-40`}><MessageCircle size={14} strokeWidth={1.7}/></button>}
          </div>
          <h1 className="break-words text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">{client.name}</h1><p className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">{client.email && <a href={`mailto:${client.email}`} className="break-all hover:text-blue-600 dark:hover:text-blue-300">{client.email}</a>}{client.phone && <a href={`tel:${client.phone.replace(/\s/g, '')}`} className="hover:text-blue-600 dark:hover:text-blue-300">{client.phone}</a>}</p>
        </div>
      </div>
      <div className="w-full xl:w-60 xl:shrink-0">
        <div className="flex items-center justify-between gap-3"><span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium ${stage?.badge || 'bg-gray-100 text-gray-500'}`}><span className={`h-1.5 w-1.5 rounded-full ${stage?.accent || 'bg-gray-400'}`}/>{stage?.title || 'Suivi du dossier'}</span><span className="shrink-0 text-xs tabular-nums text-gray-400">{client.step}/{PIPELINE_STAGES.length}</span></div>
        <div className="mt-3 grid grid-cols-6 gap-1.5" aria-label={`Étape ${client.step} sur ${PIPELINE_STAGES.length}`}>{PIPELINE_STAGES.map(item => <span key={item.step} className={`h-1 rounded-full ${stage && item.step <= stage.step ? stage.accent : 'bg-gray-100 dark:bg-gray-700'}`}/>)}</div>
      </div>
    </div>
  </header>;
}
