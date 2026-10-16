import { useCallback, useEffect, useRef, useState } from 'react';
import { Download, FileText, Loader2, PenLine, Check, Wallet, Upload, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const finalDocuments = [
  {kind:'sales_contract',label:'Contrat de vente'},
  {kind:'registration',label:'Certificat d’immatriculation'},
  {kind:'cebia_report',label:'Rapport CEBIA'},
];
export const euros = (amount:string|number) => Number(amount).toLocaleString('fr-FR',{style:'currency',currency:'EUR'});
interface Settlement {
  client:{name:string;step:number}; items:{label:string;amount:string}[]; revision:number;
  total_amount:string|null; deposit_requested_amount:string; deposit_paid_amount:string;
  deposit_confirmed_at:string|null; balance_due:string|null; remaining_amount:string|null; credit_amount:string;
  final_payment_declared_at:string|null; final_payment_confirmed_at:string|null;
  documents:{kind:string;updated_at:string}[];
}

export default function SettlementPanel({clientId,token,onLoaded}:{clientId?:string;token?:string;onLoaded?:(info:Settlement)=>void}) {
  const admin=Boolean(clientId);
  const endpoint=`http://localhost:3000/api/clients/${admin?clientId:`public/${token}`}/settlement`;
  const [info,setInfo]=useState<Settlement|null>(null);
  const [error,setError]=useState('');
  const [busy,setBusy]=useState(false);
  const [editing,setEditing]=useState(false);
  const [editingRevision,setEditingRevision]=useState(0);
  const [amount,setAmount]=useState('');
  const pending=useRef(false);
  const sequence=useRef(0);
  const onLoadedRef=useRef(onLoaded);onLoadedRef.current=onLoaded;
  const auth=()=>admin?{Authorization:`Bearer ${localStorage.getItem('token')}`} : {};
  const load=useCallback(async(signal?:AbortSignal)=>{
    const version=++sequence.current;
    const response=await fetch(endpoint,{headers:clientId?{Authorization:`Bearer ${localStorage.getItem('token')}`}:{},cache:'no-store',signal});
    const data=await response.json();if(!response.ok)throw new Error(data.message||'Récapitulatif indisponible.');
    if(version===sequence.current&&!signal?.aborted){setInfo(data);setError('');onLoadedRef.current?.(data);}
    return data as Settlement;
  },[endpoint,clientId]);
  useEffect(()=>{
    const controller=new AbortController();setInfo(null);setError('');setEditing(false);
    const refresh=()=>{if(!pending.current)load(controller.signal).catch(error=>{if(!controller.signal.aborted)setError(error.message);});};
    refresh();const timer=setInterval(refresh,5000);window.addEventListener('focus',refresh);
    return()=>{controller.abort();clearInterval(timer);window.removeEventListener('focus',refresh);};
  },[load]);
  const mutate=async(body:object,declare=false)=>{
    if(pending.current)return;
    pending.current=true;++sequence.current;setBusy(true);
    try{
      const response=await fetch(declare?`http://localhost:3000/api/clients/public/${token}/final-payment-declaration`:endpoint,{method:declare?'POST':'PATCH',headers:{...auth(),'Content-Type':'application/json'},body:JSON.stringify(body)});
      const data=await response.json();if(!response.ok)throw new Error(data.message||'Enregistrement impossible.');
      setInfo(data);setError('');onLoadedRef.current?.(data);setEditing(false);
      toast.success(declare?'Virement déclaré. Votre conseiller vérifiera sa réception.':'Récapitulatif enregistré.',{position:admin?'top-right':'bottom-center'});
    }catch(error){toast.error((error as Error).message,{position:admin?'top-right':'bottom-center'});await load().catch(()=>{});}finally{pending.current=false;setBusy(false);}
  };
  const upload=async(kind:string,file?:File)=>{
    if(!file||pending.current)return;
    if(file.size>10*1024*1024){toast.error('Le PDF dépasse 10 Mo.');return;}
    pending.current=true;++sequence.current;setBusy(true);
    try{
      const response=await fetch(`http://localhost:3000/api/clients/${clientId}/documents/${kind}`,{method:'PUT',headers:{...auth(),'Content-Type':'application/pdf'},body:file});
      const data=await response.json();if(!response.ok)throw new Error(data.message);
      toast.success('Document enregistré.');await load().catch(()=>setError('Le document est enregistré. Le suivi se mettra à jour automatiquement.'));
    }catch(error){toast.error((error as Error).message);}finally{pending.current=false;setBusy(false);}
  };
  const download=async(kind:string)=>{
    try{
      const response=await fetch(`http://localhost:3000/api/clients/${admin?clientId:`public/${token}`}/documents/${kind}`,{headers:auth()});
      if(!response.ok){const data=await response.json();throw new Error(data.message);}
      const blob=await response.blob();const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=`${kind}.pdf`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    }catch(error){toast.error((error as Error).message,{position:admin?'top-right':'bottom-center'});}
  };
  const primary='inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-50';
  const secondary='inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 hover:border-blue-300 hover:text-blue-600 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300';
  if(!info)return <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">{error?<><p role="alert" className="text-sm text-red-600">{error}</p><button className="mt-4 text-sm text-blue-600" onClick={()=>load().catch(error=>setError(error.message))}>Réessayer</button></>:<p className="flex items-center justify-center gap-2 text-sm text-gray-500"><Loader2 size={18} className="animate-spin"/>Chargement du récapitulatif…</p>}</div>;
  const paid=Boolean(info.final_payment_confirmed_at);
  const ready=info.total_amount!==null;
  const canEdit=admin&&info.client.step===5;
  return <div className="space-y-5 text-gray-900 dark:text-gray-100">
    {error&&<p role="alert" className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">{error}</p>}
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-5 dark:border-gray-700"><h2 className="flex items-center gap-2 font-semibold"><Wallet size={20} className="text-blue-600"/>Solde de la prestation</h2>{canEdit&&!paid&&!editing&&<button disabled={busy} className={secondary} onClick={()=>{setAmount(info.total_amount??'');setEditingRevision(info.revision);setEditing(true);}}><PenLine size={14}/>{ready?'Modifier le prix':'Renseigner le prix'}</button>}</header>
      <div className="space-y-5 p-5 sm:p-6">
        <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">Le récapitulatif de votre prestation d’accompagnement Cartrust.</p>
        {editing&&<form className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 dark:border-blue-900 dark:bg-blue-900/10" onSubmit={event=>{event.preventDefault();mutate({items:[{label:'Prestation Cartrust',amount:amount.trim().replace(',','.')}],revision:editingRevision});}}>
          <label className="block text-sm font-medium">Prix total de la prestation (€)<input required aria-label="Prix total de la prestation" type="text" inputMode="decimal" value={amount} onChange={event=>setAmount(event.target.value)} disabled={busy} className="mt-2 w-full rounded-lg border border-gray-200 bg-white p-3 text-base outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-600 dark:bg-gray-900"/></label>
          <p className="mt-2 text-xs leading-5 text-gray-500 dark:text-gray-400">Saisissez le prix complet de la prestation. L’acompte reçu sera déduit automatiquement.{info.final_payment_declared_at?' Une modification remettra la déclaration de virement du solde en attente.':''}</p>
          {info.revision!==editingRevision&&<p role="alert" className="mt-3 text-xs text-amber-700">Le récapitulatif a changé. Annulez la saisie puis rouvrez le formulaire pour vérifier le prix actuel.</p>}
          <div className="mt-4 flex flex-wrap gap-2"><button disabled={busy||info.revision!==editingRevision} className={primary}>{busy?'Enregistrement…':'Enregistrer le prix'}</button><button type="button" disabled={busy} className={secondary} onClick={()=>setEditing(false)}>Annuler</button></div>
        </form>}
        <dl className="space-y-4 text-sm">
          <div className="flex items-start justify-between gap-4"><dt className="text-gray-500 dark:text-gray-400">Prix total de la prestation</dt><dd data-total-amount className="shrink-0 font-semibold">{ready?euros(info.total_amount!):'À renseigner'}</dd></div>
          <div className="flex items-start justify-between gap-4"><dt><span className="text-gray-500 dark:text-gray-400">Acompte reçu · étape 3</span><span className={`mt-1 flex items-center gap-1 text-xs ${info.deposit_confirmed_at?'text-emerald-700 dark:text-emerald-300':'text-amber-700 dark:text-amber-300'}`}>{info.deposit_confirmed_at?<><Check size={12}/>Réception confirmée</>:'En attente de confirmation'}</span></dt><dd data-deposit-paid className="shrink-0 font-semibold">{info.deposit_confirmed_at?`− ${euros(info.deposit_paid_amount)}`:euros(0)}</dd></div>
          {!info.deposit_confirmed_at&&<div className="rounded-lg bg-gray-50 p-3 text-xs leading-5 text-gray-500 dark:bg-gray-900 dark:text-gray-400">Acompte prévu : {euros(info.deposit_requested_amount)}. Il sera déduit dès confirmation de sa réception par votre conseiller.</div>}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-4 dark:border-gray-700"><dt className="font-semibold">{paid?'Solde de la prestation réglé':'Solde à régler'}</dt><dd data-balance-due className="text-2xl font-semibold tracking-tight text-blue-600 dark:text-blue-400">{ready?euros(info.balance_due!):'À préparer'}</dd></div>
          {paid&&<div className="flex items-center justify-between gap-3 text-emerald-700 dark:text-emerald-300"><dt>Reste à payer</dt><dd className="font-semibold">{euros(info.remaining_amount!)}</dd></div>}
        </dl>
        {!ready&&<p className="rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-500 dark:bg-gray-900 dark:text-gray-400">{admin?'Renseignez le prix de la prestation pour préparer le solde du client.':'Votre conseiller prépare le prix final de la prestation. Le solde apparaîtra ici dès son enregistrement.'}</p>}
        {Number(info.credit_amount)>0&&<p className="flex items-start gap-2 rounded-xl bg-amber-50 p-4 text-sm text-amber-800"><AlertCircle size={18} className="shrink-0"/>Un trop-perçu de {euros(info.credit_amount)} est à régulariser avec votre conseiller.</p>}
        {ready&&info.balance_due==='0.00'&&!paid&&<p className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">La prestation est couverte par l’acompte reçu. Aucun solde supplémentaire à régler.</p>}
        {ready&&info.balance_due!=='0.00'&&(admin?<div className="space-y-3">
          {info.final_payment_declared_at&&!paid&&<p className="rounded-xl bg-blue-50 p-4 text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-200">Le client a déclaré le virement du solde. Vérifiez sa réception avant de confirmer.</p>}
          <label className="flex items-start gap-3 rounded-xl border border-gray-200 p-4 text-sm dark:border-gray-700"><input type="checkbox" aria-label="Confirmer la réception du solde" checked={paid} disabled={!canEdit||busy} onChange={event=>mutate({payment_confirmed:event.target.checked,revision:info.revision,balance_due:info.balance_due})} className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600"/><span><span className="block font-semibold">{paid?'Réception du solde confirmée':'Confirmer la réception du solde'}</span><span className="mt-1 block text-xs leading-5 text-gray-500 dark:text-gray-400">Cette confirmation enregistre la réception du paiement de la prestation.</span></span></label>
        </div>:paid?<p role="status" className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800"><Check size={18}/>Le règlement du solde est confirmé par votre conseiller.</p>:info.final_payment_declared_at?<p role="status" className="rounded-xl bg-blue-50 p-4 text-sm leading-6 text-blue-800">Votre déclaration a été reçue. Votre conseiller vérifiera la réception du virement.</p>:<div className="space-y-3"><p className="text-sm leading-6 text-gray-500">Utilisez les coordonnées bancaires communiquées par votre conseiller pour régler le solde.</p><button className={primary} disabled={busy||info.client.step!==5} onClick={()=>mutate({revision:info.revision,balance_due:info.balance_due},true)}>{busy?<Loader2 size={16} className="animate-spin"/>:<Check size={16}/>}J’ai effectué le virement du solde</button></div>)}
      </div>
    </section>
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"><header className="border-b border-gray-100 p-5 dark:border-gray-700"><h2 className="flex items-center gap-2 font-semibold"><FileText size={20} className="text-blue-600"/>Documents du véhicule</h2><p className="mt-2 text-xs leading-5 text-gray-500 dark:text-gray-400">{admin?'Les PDF ajoutés sont accessibles au client à partir de l’étape 5.':'Les documents apparaissent ici au fur et à mesure de leur ajout par votre conseiller.'}</p></header><div className="divide-y divide-gray-100 dark:divide-gray-700">{finalDocuments.map(document=>{
      const received=info.documents.some(item=>item.kind===document.kind);
      return <div key={document.kind} className="flex flex-wrap items-center justify-between gap-3 p-5"><div className="min-w-0"><h3 className="text-sm font-medium">{document.label}</h3><p className={`mt-1 text-xs ${received?'text-emerald-700 dark:text-emerald-300':'text-gray-400'}`}>{received?'Disponible':'En préparation'}</p></div><div className="flex flex-wrap items-center gap-2">{received&&<button aria-label={`Télécharger ${document.label}`} onClick={()=>download(document.kind)} className={secondary}><Download size={14}/>Télécharger</button>}{canEdit&&<label className={`${secondary} cursor-pointer focus-within:ring-2 focus-within:ring-blue-300`}><Upload size={14}/>{received?'Remplacer':'Ajouter le PDF'}<input aria-label={`Importer ${document.label}`} type="file" accept="application/pdf,.pdf" disabled={busy} className="sr-only" onChange={event=>{upload(document.kind,event.target.files?.[0]);event.target.value='';}}/></label>}</div></div>;
    })}</div></section>
  </div>;
}
