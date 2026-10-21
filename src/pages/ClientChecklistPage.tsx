import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, Car, Check, ChevronDown, Clock3, ExternalLink, Loader2, Minus, ShieldCheck, X } from 'lucide-react';
import { clientPortalPath } from '../utils/clientPortal';
import { CHECKLIST_STATUS_LABELS } from '../utils/vehicleChecklist';
import toast from 'react-hot-toast';

interface ChecklistItem { id: number; name: string; status: string; }
interface Vehicle { id: number; title: string | null; link: string | null; selected_by: string; checklist: ChecklistItem[];checklist_version:string;can_choose_final:boolean; }
interface FinalChoice {vehicle_id:number;title:string|null;revision:number;chosen_at:string;needs_reconfirmation:boolean;}
interface Dossier { client: { name: string; step: number }; vehicles: Vehicle[];final_choice:FinalChoice|null; }
const statuses = {
  validated: { label: CHECKLIST_STATUS_LABELS.validated, icon: Check, color: 'bg-emerald-50 text-emerald-700' },
  pending: { label: CHECKLIST_STATUS_LABELS.pending, icon: Clock3, color: 'bg-gray-100 text-gray-500' },
  issue: { label: CHECKLIST_STATUS_LABELS.issue, icon: AlertCircle, color: 'bg-orange-50 text-orange-700' },
  rejected: { label: CHECKLIST_STATUS_LABELS.rejected, icon: X, color: 'bg-red-50 text-red-700' },
  not_applicable: { label: CHECKLIST_STATUS_LABELS.not_applicable, icon: Minus, color: 'bg-gray-100 text-gray-500' },
};

export default function ClientChecklistPage() {
  const { token } = useParams();
  const tokenRef=useRef(token);tokenRef.current=token;
  const navigate = useNavigate();
  const [data, setData] = useState<Dossier | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);
  const [choiceDraft,setChoiceDraft]=useState<{vehicle_id:number;checklist_version:string;expected_revision:number;acknowledged_checks:boolean}|null>(null);
  const [choiceError,setChoiceError]=useState('');const [saving,setSaving]=useState(false);
  const savingRef=useRef(false);const requestVersion=useRef(0);
  const previousStep = useRef<number|null>(null);
  useEffect(() => {
    const controller = new AbortController();
    let fetching = false;
    setData(null); setLoading(true); setError('');setChoiceDraft(null);setChoiceError('');previousStep.current=null;
    const refresh = async () => {
      if (fetching||savingRef.current) return;
      fetching = true;
      const version=++requestVersion.current;
      try {
        const response = await fetch(`http://localhost:3000/api/clients/public/${token}`, { signal: controller.signal, cache: 'no-store' });
        const value: Dossier & { message?: string } = await response.json();
        if (!response.ok) {
          if (response.status === 404 && !controller.signal.aborted) setData(null);
          throw new Error(value.message || 'Impossible de mettre à jour les contrôles.');
        }
        if (controller.signal.aborted||version!==requestVersion.current) return;
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

  const confirmChoice=async(event:React.FormEvent)=>{
    event.preventDefault();if(!choiceDraft||savingRef.current)return;
    savingRef.current=true;setSaving(true);setChoiceError('');++requestVersion.current;
    try{
      const response=await fetch(`http://localhost:3000/api/clients/public/${token}/final-vehicle`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(choiceDraft)});
      const result=await response.json();if(!response.ok)throw new Error(result.message||'Enregistrement impossible.');
      if(tokenRef.current!==token)return;
      setData(previous=>previous?{...previous,final_choice:result.final_choice}:previous);setChoiceDraft(null);toast.success('Votre choix a été transmis à votre conseiller.');
    }catch(error){if(tokenRef.current===token)setChoiceError((error as Error).message);}finally{savingRef.current=false;setSaving(false);}
  };

  if (loading) return <main className="flex min-h-screen items-center justify-center gap-2 bg-gray-50 p-6 text-sm text-gray-500"><Loader2 size={18} className="animate-spin motion-reduce:animate-none"/>Chargement des contrôles…</main>;
  if (!data) return <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6"><div className="max-w-md rounded-2xl border border-gray-200 bg-white p-6 text-center"><p role="alert" className="text-sm text-red-600">{error || 'Dossier indisponible.'}</p><button onClick={() => setAttempt(value => value + 1)} className="mt-4 text-sm font-semibold text-blue-600">Réessayer</button></div></main>;
  const vehicles = data.vehicles.filter(vehicle => vehicle.selected_by === 'client');
  return <main className="px-4 py-6 text-gray-900 sm:py-8"><div className="mx-auto max-w-3xl space-y-6">
    <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-7">
      <div className="flex items-start gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><ShieldCheck size={23}/></span><div><p className="text-xs font-semibold uppercase tracking-widest text-blue-600">Étape 4 · Contrôles</p><h1 className="mt-2 text-xl font-semibold">Le suivi des contrôles</h1><p className="mt-2 text-sm leading-6 text-gray-500">Comparez les contrôles des véhicules retenus, puis confirmez celui que vous souhaitez choisir définitivement.</p></div></div>
      <p className="mt-5 border-t border-gray-100 pt-4 text-xs text-gray-400">Mise à jour automatique toutes les 5 secondes.</p>
      {data.client.step > 4 && <Link to={`/client-link/${token}`} className="mt-4 inline-block text-sm font-medium text-blue-600">Revenir à l’étape actuelle de mon dossier →</Link>}
    </section>
    {error && <p role="alert" className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"><AlertCircle size={18} className="shrink-0"/>{error} Les derniers contrôles reçus restent affichés.</p>}
    {choiceError&&<p role="alert" className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">{choiceError}</p>}
    {data.final_choice&&<div role="status" className={`rounded-xl border p-4 ${data.final_choice.needs_reconfirmation?'border-amber-200 bg-amber-50 text-amber-800':'border-emerald-200 bg-emerald-50 text-emerald-800'}`}><p className="flex items-start gap-2 text-sm font-semibold"><Check size={18} className="shrink-0"/>{data.final_choice.needs_reconfirmation?'Choix à reconfirmer':'Votre choix définitif'} : {data.final_choice.title||'Annonce véhicule'}</p><p className="mt-2 text-xs leading-5">{data.final_choice.needs_reconfirmation?'Les contrôles ont été mis à jour depuis votre choix. Consultez-les à nouveau avant de reconfirmer ce véhicule.':'Votre conseiller a été informé. Votre choix est verrouillé ; les autres véhicules restent consultables.'}</p></div>}
    {!vehicles.length && <section className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center"><Car size={28} className="mx-auto text-gray-300"/><h2 className="mt-4 font-semibold">Votre suivi se prépare</h2><p className="mt-2 text-sm leading-6 text-gray-500">Les véhicules retenus et leurs contrôles apparaîtront ici dès leur préparation par votre conseiller.</p></section>}
    {vehicles.map(vehicle => {
      const checks = vehicle.checklist || [];
      const validated = checks.filter(item => item.status === 'validated').length;
      const applicable = checks.filter(item => item.status !== 'not_applicable').length;
      const issue = checks.some(item => ['issue', 'rejected'].includes(item.status));
      const finished = checks.length > 0 && checks.every(item => ['validated', 'not_applicable'].includes(item.status));
      const label = !checks.length ? 'À préparer' : issue ? 'Point à vérifier' : finished ? 'Contrôles renseignés' : 'En cours';
      const chosen=data.final_choice?.vehicle_id===vehicle.id;
      const draft=choiceDraft?.vehicle_id===vehicle.id?choiceDraft:null;
      const stale=Boolean(draft&&(draft.checklist_version!==vehicle.checklist_version||draft.expected_revision!==(data.final_choice?.revision||0)));
      return <article key={vehicle.id} data-checklist-vehicle={vehicle.id} data-final-choice={chosen} className={`overflow-hidden rounded-2xl border bg-white ${chosen?'border-emerald-300':'border-gray-200'}`}>
        <details className="group">
          <summary aria-label={`Contrôles de ${vehicle.title||'ce véhicule'}`} className="cursor-pointer list-none rounded-2xl p-5 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400 sm:p-6 [&::-webkit-details-marker]:hidden">
            <div className="flex items-start justify-between gap-3"><div className="min-w-0 flex-1"><h2 className="break-words text-base font-semibold">{vehicle.title || 'Annonce véhicule'}</h2><div className="mt-2 flex flex-wrap items-center gap-2"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${issue?'bg-amber-50 text-amber-700':finished?'bg-emerald-50 text-emerald-700':'bg-gray-100 text-gray-500'}`}>{finished?<Check size={13}/>:<Clock3 size={13}/>} {label}</span>{chosen&&<span className={`text-xs font-semibold ${data.final_choice?.needs_reconfirmation?'text-amber-700':'text-emerald-700'}`}>{data.final_choice?.needs_reconfirmation?'Choix à reconfirmer':'Votre véhicule choisi'}</span>}</div></div><ChevronDown aria-hidden="true" size={20} className="mt-0.5 shrink-0 text-gray-400 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"/></div>
            {checks.length>0&&<p className="mt-3 text-xs text-gray-500">{applicable?`${validated}/${applicable} points validés`:'Aucun point applicable'}</p>}
          </summary>
          <div className="border-t border-gray-100">
        <div className="px-5 pb-5 pt-2 sm:px-6">
          {vehicle.link && <a href={vehicle.link} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-start gap-2 text-sm leading-6 text-blue-600 hover:underline"><ExternalLink size={16} className="mt-1 shrink-0"/><span className="break-all">{vehicle.link}</span></a>}
          {checks.length > 0 && <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-emerald-500 transition-[width] duration-500 motion-reduce:transition-none" style={{width:`${applicable?validated/applicable*100:0}%`}}/></div>}
        </div>
        {checks.length ? <ul className="divide-y divide-gray-100">{checks.map(item => {
          const status = statuses[item.status as keyof typeof statuses] || statuses.pending;
          const Icon = status.icon;
          return <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6"><span className="min-w-0 flex-1 break-words text-sm text-gray-700">{item.name}</span><span className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium ${status.color}`}><Icon size={14}/>{status.label}</span></li>;
        })}</ul> : <p className="px-5 py-6 text-sm leading-6 text-gray-500 sm:px-6">Votre conseiller prépare la checklist de ce véhicule. Les points de contrôle apparaîtront ici dès leur enregistrement.</p>}
        {data.client.step===4&&<footer className="border-t border-gray-100 p-5 sm:px-6">
          {data.final_choice&&!chosen?<p className="text-sm text-gray-500">Véhicule non retenu pour la suite du dossier.</p>:draft?<form onSubmit={confirmChoice} className="space-y-4">
            <p className="text-sm font-semibold">Confirmer {vehicle.title||'ce véhicule'} comme choix définitif ?</p>
            {!data.final_choice&&<p className="text-xs leading-5 text-gray-500">Après confirmation, vous ne pourrez plus sélectionner un autre véhicule.</p>}
            {issue&&<p className="rounded-lg bg-orange-50 p-3 text-xs leading-5 text-orange-800">Ce véhicule comporte des points à corriger ou non validés. Prenez-en connaissance avec votre conseiller avant de confirmer.</p>}
            <label className="flex items-start gap-2 text-sm text-gray-600"><input type="checkbox" required checked={draft.acknowledged_checks} disabled={saving} onChange={event=>setChoiceDraft({...draft,acknowledged_checks:event.target.checked})} className="mt-0.5"/>J’ai consulté les contrôles de ce véhicule et je confirme mon choix.</label>
            {stale&&<p role="alert" className="text-xs text-amber-700">Les informations ont changé. Annulez puis consultez les derniers contrôles avant de confirmer à nouveau.</p>}
            <div className="flex flex-wrap gap-3"><button disabled={saving||stale||!draft.acknowledged_checks} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40">{saving&&<Loader2 size={15} className="animate-spin"/>}Confirmer mon choix</button><button type="button" disabled={saving} onClick={()=>{setChoiceDraft(null);setChoiceError('');}} className="px-3 py-2 text-sm text-gray-500">Annuler</button></div>
          </form>:chosen&&!data.final_choice?.needs_reconfirmation?<p className="flex items-center gap-2 text-sm font-semibold text-emerald-700"><Check size={17}/>Véhicule choisi définitivement</p>:<><button disabled={saving||!vehicle.can_choose_final} onClick={()=>{setChoiceError('');setChoiceDraft({vehicle_id:vehicle.id,checklist_version:vehicle.checklist_version,expected_revision:data.final_choice?.revision||0,acknowledged_checks:false});}} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40">{chosen?'Reconfirmer ce véhicule':'Choisir ce véhicule'}</button>{!vehicle.can_choose_final&&<p className="mt-2 text-xs leading-5 text-gray-500">Le choix sera disponible lorsque tous les points de contrôle de ce véhicule seront renseignés.</p>}</>}
        </footer>}
          </div>
        </details>
      </article>;
    })}
  </div></main>;
}
