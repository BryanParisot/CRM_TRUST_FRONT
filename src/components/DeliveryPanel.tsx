import { useCallback, useEffect, useRef, useState } from 'react';
import { CalendarDays, MapPin, PenLine, Loader2, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface DeliveryInfo {
  client:{name:string;step:number};
  delivery:{delivery_date:string;address:string;revision:number;updated_at:string}|null;
  default_address:string;
}
export function formatDeliveryDate(date:string){
  return new Intl.DateTimeFormat('fr-FR',{dateStyle:'full',timeZone:'UTC'}).format(new Date(`${date}T12:00:00Z`));
}
export default function DeliveryPanel({clientId,token}:{clientId?:string;token?:string}){
  const admin=Boolean(clientId);
  const endpoint=`http://localhost:3000/api/clients/${admin?clientId:`public/${token}`}/delivery`;
  const [record,setRecord]=useState<{endpoint:string;info:DeliveryInfo}|null>(null);
  const info=record?.endpoint===endpoint?record.info:null;
  const [error,setError]=useState('');const [busy,setBusy]=useState(false);const [editing,setEditing]=useState(false);
  const [date,setDate]=useState('');const [address,setAddress]=useState('');const [revision,setRevision]=useState(0);
  const pending=useRef(false);const sequence=useRef(0);
  const load=useCallback(async(signal?:AbortSignal)=>{
    const version=++sequence.current;
    const response=await fetch(endpoint,{headers:clientId?{Authorization:`Bearer ${localStorage.getItem('token')}`}:{},signal,cache:'no-store'});
    const data=await response.json();
    if(!response.ok){if([401,403,404].includes(response.status)&&version===sequence.current&&!signal?.aborted)setRecord(null);throw new Error(data.message||'Livraison indisponible.');}
    if(version===sequence.current&&!signal?.aborted){setRecord({endpoint,info:data});setError('');}
  },[endpoint,clientId]);
  useEffect(()=>{
    const controller=new AbortController();setRecord(null);setError('');setEditing(false);
    const refresh=()=>{if(!pending.current)load(controller.signal).catch(error=>{if(!controller.signal.aborted)setError(error.message);});};
    refresh();const timer=setInterval(refresh,5000);window.addEventListener('focus',refresh);
    return()=>{controller.abort();clearInterval(timer);window.removeEventListener('focus',refresh);};
  },[load]);
  const edit=()=>{
    if(!info)return;
    setDate(info.delivery?.delivery_date||'');setAddress(info.delivery?.address||info.default_address);setRevision(info.delivery?.revision||0);setEditing(true);
  };
  const save=async(event:React.FormEvent)=>{
    event.preventDefault();if(pending.current)return;
    pending.current=true;++sequence.current;setBusy(true);
    try{
      const response=await fetch(endpoint,{method:'PATCH',headers:{Authorization:`Bearer ${localStorage.getItem('token')}`,'Content-Type':'application/json'},body:JSON.stringify({delivery_date:date,address:address.trim(),revision})});
      const data=await response.json();if(!response.ok)throw new Error(data.message||'Enregistrement impossible.');
      setRecord({endpoint,info:data});setError('');setEditing(false);toast.success('Informations de livraison enregistrées.');
    }catch(error){toast.error((error as Error).message);await load().catch(()=>{});}finally{pending.current=false;setBusy(false);}
  };
  if(!info)return <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">{error?<><p role="alert" className="text-sm text-red-600">{error}</p><button onClick={()=>load().catch(error=>setError(error.message))} className="mt-4 text-sm font-medium text-blue-600">Réessayer</button></>:<p className="flex items-center justify-center gap-2 text-sm text-gray-500"><Loader2 size={18} className="animate-spin"/>Chargement de la livraison…</p>}</div>;
  const canEdit=admin&&info.client.step===6;
  const stale=revision!==(info.delivery?.revision||0);
  const primary='inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 disabled:opacity-50';
  const secondary='inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 hover:border-blue-300 hover:text-blue-600 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300';
  const field='mt-2 block w-full rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-600 dark:bg-gray-900';
  return <div className="space-y-4 text-gray-900 dark:text-gray-100">
    {error&&<p role="alert" className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">{error}</p>}
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-5 dark:border-gray-700"><h2 className="flex items-center gap-2 font-semibold"><CalendarDays size={20} className="text-blue-600"/>Informations de livraison</h2><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${info.delivery?'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300':'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300'}`}>{info.delivery?'Planifiée':'À planifier'}</span></header>
      <div className="space-y-5 p-5 sm:p-6">
        {editing?<form onSubmit={save} className="space-y-4">
          <label className="block text-sm font-medium">Date de livraison<input autoFocus required aria-label="Date de livraison" type="date" value={date} disabled={busy} onChange={event=>setDate(event.target.value)} className={field}/></label>
          <label className="block text-sm font-medium">Adresse de livraison<textarea required minLength={3} maxLength={500} aria-label="Adresse de livraison" value={address} disabled={busy} rows={3} onChange={event=>setAddress(event.target.value)} className={field}/></label>
          <p className="text-xs leading-5 text-gray-500 dark:text-gray-400">Lieu proposé : siège social à Avricourt. Vous pouvez préciser ou modifier l’adresse pour ce dossier.</p>
          {stale&&<p role="alert" className="text-xs leading-5 text-amber-700">Les informations ont changé. Annulez puis rouvrez le formulaire pour reprendre la dernière version.</p>}
          <div className="flex flex-wrap gap-2"><button disabled={busy||stale||!canEdit} className={primary}>{busy?<Loader2 size={16} className="animate-spin"/>:<Check size={16}/>}Enregistrer la livraison</button><button type="button" disabled={busy} onClick={()=>setEditing(false)} className={secondary}>Annuler</button></div>
        </form>:<>
          <dl className="space-y-5"><div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300"><CalendarDays size={20}/></span><div className="min-w-0"><dt className="text-xs text-gray-500 dark:text-gray-400">Date de livraison</dt><dd data-delivery-date className="mt-1 text-base font-semibold">{info.delivery?formatDeliveryDate(info.delivery.delivery_date):'À définir'}</dd></div></div>
          <div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300"><MapPin size={20}/></span><div className="min-w-0"><dt className="text-xs text-gray-500 dark:text-gray-400">{info.delivery?'Adresse de livraison':'Lieu prévu'}</dt><dd data-delivery-address className="mt-1 whitespace-pre-wrap break-words text-sm font-medium leading-6">{info.delivery?.address||info.default_address}</dd></div></div></dl>
          {!info.delivery&&<p className="rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-500 dark:bg-gray-900 dark:text-gray-400">{admin?'Renseignez la date et l’adresse de remise du véhicule. Elles seront visibles dans l’espace client dès l’enregistrement.':'Votre conseiller prépare votre rendez-vous de livraison. La date apparaîtra ici dès son enregistrement.'}</p>}
          {canEdit&&<button disabled={busy} onClick={edit} className={info.delivery?secondary:primary}><PenLine size={15}/>{info.delivery?'Modifier la livraison':'Renseigner la livraison'}</button>}
        </>}
      </div>
    </section>
  </div>;
}
