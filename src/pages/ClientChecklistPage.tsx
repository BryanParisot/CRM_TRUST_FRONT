import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, Car, Check, Clock3, ExternalLink, Loader2, Minus, ShieldCheck, X } from 'lucide-react';
import { clientPortalPath } from '../utils/clientPortal';

interface ChecklistItem { id: number; name: string; status: string; }
interface Vehicle { id: number; title: string | null; link: string | null; selected_by: string; checklist: ChecklistItem[]; }
interface Dossier { client: { name: string; step: number }; vehicles: Vehicle[]; }
const statuses = {
  validated: { label: 'Validé', icon: Check, color: 'bg-emerald-50 text-emerald-700' },
  pending: { label: 'À vérifier', icon: Clock3, color: 'bg-gray-100 text-gray-500' },
  issue: { label: 'Point à vérifier', icon: AlertCircle, color: 'bg-amber-50 text-amber-700' },
  rejected: { label: 'Non validé', icon: X, color: 'bg-red-50 text-red-700' },
  not_applicable: { label: 'Non applicable', icon: Minus, color: 'bg-gray-100 text-gray-500' },
};

export default function ClientChecklistPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<Dossier | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);
  const previousStep = useRef<number|null>(null);
  useEffect(() => {
    const controller = new AbortController();
    let fetching = false;
    setData(null); setLoading(true); setError(''); previousStep.current=null;
    const refresh = async () => {
      if (fetching) return;
      fetching = true;
      try {
        const response = await fetch(`http://localhost:3000/api/clients/public/${token}`, { signal: controller.signal, cache: 'no-store' });
        const value: Dossier & { message?: string } = await response.json();
        if (!response.ok) {
          if (response.status === 404 && !controller.signal.aborted) setData(null);
          throw new Error(value.message || 'Impossible de mettre à jour les contrôles.');
        }
        if (controller.signal.aborted) return;
        if (value.client.step < 4) { navigate(clientPortalPath(token!, value.client.step), { replace: true }); return; }
        if (previousStep.current===4 && value.client.step>=5) { navigate(clientPortalPath(token!, value.client.step), { replace:true }); return; }
        previousStep.current=value.client.step;
        setData(value); setError('');
      } catch (error) {
        if (!controller.signal.aborted) setError((error as Error).message);
      } finally {
        fetching = false;
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    refresh();
    const timer = setInterval(refresh, 5000);
    window.addEventListener('focus', refresh);
    return () => { controller.abort(); clearInterval(timer); window.removeEventListener('focus', refresh); };
  }, [token, navigate, attempt]);

  if (loading) return <main className="flex min-h-screen items-center justify-center gap-2 bg-gray-50 p-6 text-sm text-gray-500"><Loader2 size={18} className="animate-spin motion-reduce:animate-none"/>Chargement des contrôles…</main>;
  if (!data) return <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6"><div className="max-w-md rounded-2xl border border-gray-200 bg-white p-6 text-center"><p role="alert" className="text-sm text-red-600">{error || 'Dossier indisponible.'}</p><button onClick={() => setAttempt(value => value + 1)} className="mt-4 text-sm font-semibold text-blue-600">Réessayer</button></div></main>;
  const vehicles = data.vehicles.filter(vehicle => vehicle.selected_by === 'client');
  return <main className="px-4 py-6 text-gray-900 sm:py-8"><div className="mx-auto max-w-3xl space-y-6">
    <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-7">
      <div className="flex items-start gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><ShieldCheck size={23}/></span><div><p className="text-xs font-semibold uppercase tracking-widest text-blue-600">Étape 4 · Contrôles</p><h1 className="mt-2 text-xl font-semibold">Le suivi des contrôles</h1><p className="mt-2 text-sm leading-6 text-gray-500">Retrouvez les vérifications enregistrées par votre conseiller pour les véhicules que vous avez retenus.</p></div></div>
      <p className="mt-5 border-t border-gray-100 pt-4 text-xs text-gray-400">Mise à jour automatique toutes les 5 secondes.</p>
      {data.client.step > 4 && <Link to={`/client-link/${token}`} className="mt-4 inline-block text-sm font-medium text-blue-600">Revenir à l’étape actuelle de mon dossier →</Link>}
    </section>
    {error && <p role="alert" className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"><AlertCircle size={18} className="shrink-0"/>{error} Les derniers contrôles reçus restent affichés.</p>}
    {!vehicles.length && <section className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center"><Car size={28} className="mx-auto text-gray-300"/><h2 className="mt-4 font-semibold">Votre suivi se prépare</h2><p className="mt-2 text-sm leading-6 text-gray-500">Les véhicules retenus et leurs contrôles apparaîtront ici dès leur préparation par votre conseiller.</p></section>}
    {vehicles.map(vehicle => {
      const checks = vehicle.checklist || [];
      const validated = checks.filter(item => item.status === 'validated').length;
      const applicable = checks.filter(item => item.status !== 'not_applicable').length;
      const issue = checks.some(item => ['issue', 'rejected'].includes(item.status));
      const finished = checks.length > 0 && checks.every(item => ['validated', 'not_applicable'].includes(item.status));
      const label = !checks.length ? 'À préparer' : issue ? 'Point à vérifier' : finished ? 'Contrôles renseignés' : 'En cours';
      return <article key={vehicle.id} data-checklist-vehicle={vehicle.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <header className="border-b border-gray-100 p-5 sm:p-6"><div className="flex flex-wrap items-start justify-between gap-3"><h2 className="min-w-0 break-words text-base font-semibold">{vehicle.title || 'Annonce véhicule'}</h2><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${issue?'bg-amber-50 text-amber-700':finished?'bg-emerald-50 text-emerald-700':'bg-gray-100 text-gray-500'}`}>{finished?<Check size={13}/>:<Clock3 size={13}/>} {label}</span></div>
          {vehicle.link && <a href={vehicle.link} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-start gap-2 text-sm leading-6 text-blue-600 hover:underline"><ExternalLink size={16} className="mt-1 shrink-0"/><span className="break-all">{vehicle.link}</span></a>}
          {checks.length > 0 && <div className="mt-5"><p className="text-xs text-gray-500">{applicable ? `${validated}/${applicable} points validés` : 'Aucun point applicable'}</p><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-emerald-500 transition-[width] duration-500 motion-reduce:transition-none" style={{width:`${applicable?validated/applicable*100:0}%`}}/></div></div>}
        </header>
        {checks.length ? <ul className="divide-y divide-gray-100">{checks.map(item => {
          const status = statuses[item.status as keyof typeof statuses] || statuses.pending;
          const Icon = status.icon;
          return <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6"><span className="min-w-0 flex-1 break-words text-sm text-gray-700">{item.name}</span><span className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium ${status.color}`}><Icon size={14}/>{status.label}</span></li>;
        })}</ul> : <p className="px-5 py-6 text-sm leading-6 text-gray-500 sm:px-6">Votre conseiller prépare la checklist de ce véhicule. Les points de contrôle apparaîtront ici dès leur enregistrement.</p>}
      </article>;
    })}
  </div></main>;
}
