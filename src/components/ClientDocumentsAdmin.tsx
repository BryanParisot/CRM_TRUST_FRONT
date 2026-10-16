import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { ArrowRight, Check, Clock3, Download, ExternalLink, FileCheck2, FileText, Fingerprint, Loader2, RefreshCw, ShieldCheck, Upload, Wallet, AlertCircle, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ClientDocumentsAdmin({clientId, onPaymentChanged, depositContent}:{clientId:string;onPaymentChanged:(paid:boolean)=>void;depositContent:ReactNode}) {
  const [info,setInfo] = useState<any>(null);
  const [url,setUrl] = useState('');
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState('');
  const [openingDocument,setOpeningDocument] = useState<string|null>(null);
  const headers = {Authorization:`Bearer ${localStorage.getItem('token')}`};
  const load = useCallback(async (signal?:AbortSignal) => {
    const res=await fetch(`http://localhost:3000/api/clients/${clientId}/documents`,{headers:{Authorization:`Bearer ${localStorage.getItem('token')}`},signal,cache:'no-store'});
    const data=await res.json();
    if(!res.ok)throw new Error(data.message);
    setInfo(data);setError('');onPaymentChanged(Boolean(data.payment_confirmed_at));
  },[clientId,onPaymentChanged]);
  useEffect(()=>{setUrl(info?.signature_url || '');},[info?.signature_url]);
  useEffect(()=>{
    const controller=new AbortController();
    setInfo(null);setError('');
    const refresh=()=>{load(controller.signal).catch(err=>{if(!controller.signal.aborted)setError(err.message);});};
    refresh();const timer=setInterval(refresh,5000);
    window.addEventListener('focus',refresh);
    return()=>{controller.abort();clearInterval(timer);window.removeEventListener('focus',refresh);};
  },[load]);
  const save = async (body:object) => {
    setBusy(true);
    try {
      const res=await fetch(`http://localhost:3000/api/clients/${clientId}/document-settings`,{method:'PATCH',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify(body)});
      const data=await res.json();if(!res.ok)throw new Error(data.message);
      await load();toast.success('Dossier enregistré.');
    }catch(err){toast.error((err as Error).message);}finally{setBusy(false);}
  };
  const prepareSignature=async()=>{
    setBusy(true);
    try{
      const res=await fetch(`http://localhost:3000/api/clients/${clientId}/youtrust`,{method:'POST',headers});
      const data=await res.json();if(!res.ok)throw new Error(data.message);
      await load();toast.success('Signature Youtrust prête.');
    }catch(err){await load().catch(()=>{});toast.error((err as Error).message);}finally{setBusy(false);}
  };
  const uploadInvoice = async(file?:File)=>{
    if(!file)return;
    if(file.size>10*1024*1024){toast.error('Le PDF dépasse 10 Mo.');return;}
    setBusy(true);
    try {
      const path=`${clientId}/documents/invoice`;
      const res=await fetch(`http://localhost:3000/api/clients/${path}`,{method:'PUT',headers:{...headers,'Content-Type':'application/pdf'},body:file});
      const data=await res.json();if(!res.ok)throw new Error(data.message);
      await load();toast.success('PDF enregistré.');
    }catch(err){toast.error((err as Error).message);}finally{setBusy(false);}
  };
  const openIdentity = async(kind:string,preview=false)=>{
    // Open synchronously so the browser does not block the preview after the fetch.
    const previewWindow=preview?window.open('about:blank','_blank'):null;
    if(preview&&!previewWindow){toast.error('Autorisez l’ouverture d’un nouvel onglet pour consulter le document.');return;}
    if(previewWindow)previewWindow.opener=null;
    setOpeningDocument(kind);
    try {
      const res=await fetch(`http://localhost:3000/api/clients/${clientId}/identity/${kind}`,{headers});
      if(!res.ok)throw new Error('Justificatif indisponible.');
      const blob=await res.blob();const url=URL.createObjectURL(blob);
      if(previewWindow){
        if(previewWindow.closed){URL.revokeObjectURL(url);return;}
        previewWindow.location.replace(url);
        const timer=setInterval(()=>{if(previewWindow.closed){clearInterval(timer);URL.revokeObjectURL(url);}},1000);
      }else{
        const anchor=document.createElement('a');anchor.href=url;anchor.download=`${kind}.${blob.type==='application/pdf'?'pdf':blob.type==='image/png'?'png':'jpg'}`;anchor.click();
        setTimeout(()=>URL.revokeObjectURL(url),1000);
      }
    }catch(err){previewWindow?.close();toast.error((err as Error).message);}finally{setOpeningDocument(null);}
  };
  if(!info)return <div className="flex min-h-48 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900/40">{error?<div role="alert" className="space-y-3 text-center"><p className="text-sm text-red-600">{error}</p><button onClick={()=>load().catch(err=>setError(err.message))} className="text-sm font-medium text-blue-600">Réessayer</button></div>:<p className="flex items-center gap-2 text-sm text-gray-500"><Loader2 size={18} className="animate-spin"/>Chargement du dossier…</p>}</div>;
  const identityItems = [['cni_front','Carte d’identité','Recto'],['cni_back','Carte d’identité','Verso'],['license','Permis de conduire','Document complet'],['address','Justificatif de domicile','Document complet']];
  const received=identityItems.filter(([kind])=>info?.identity?.some((doc:any)=>doc.kind===kind)).length;
  const signed=Boolean(info?.signature_confirmed_at);
  const paid=Boolean(info?.payment_confirmed_at);
  const completed=Number(signed)+Number(received===4)+Number(paid);
  const signatureLabel:Record<string,string>={draft:'À préparer',ongoing:'En attente',approval:'En approbation',expired:'Expirée',declined:'Refusée',canceled:'Annulée',failed:'À reprendre',uncertain:'À vérifier'};
  const primary='inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-wait disabled:opacity-50';
  const secondary='inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700';
  const badge=(done:boolean,label:string)=> <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${done?'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300':'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300'}`}>{done?<Check size={12}/>:<Clock3 size={12}/>} {label}</span>;
  const nextAction=!signed?'Faire signer les CGV':received<4?'Attendre les justificatifs du client':!paid?'Vérifier la réception du virement':!info?.invoice?'Ajouter la facture d’acompte':'Le dossier est à jour';
  return <div className="space-y-5 text-gray-900 dark:text-gray-100">
    <header className="rounded-2xl border border-gray-200 bg-gray-50/70 p-5 dark:border-gray-700 dark:bg-gray-900/40 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">Suivi du parcours client</p><h3 className="mt-2 text-xl font-semibold tracking-tight">Signature, documents & acompte</h3><p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">Les trois étapes pour finaliser le dossier.</p></div>
        {info?.youtrust_enabled&&info.youtrust_environment==='sandbox'&&<span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">Test sandbox</span>}
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2" aria-label="Progression du dossier">{[{label:'Signature',done:signed},{label:'Justificatifs',done:received===4},{label:'Acompte',done:paid}].map((item,i)=><div key={item.label} className="min-w-0"><div className={`h-1.5 rounded-full ${item.done?'bg-emerald-500':'bg-gray-200 dark:bg-gray-700'}`}/><p className="mt-2 flex items-center gap-1.5 text-xs font-medium sm:text-sm"><span className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] ${item.done?'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300':'bg-white text-gray-500 dark:bg-gray-700 dark:text-gray-300'}`}>{item.done?<Check size={12}/>:i+1}</span><span className="sm:hidden">{item.label==='Justificatifs'?'Pièces':item.label}</span><span className="hidden sm:inline">{item.label}</span></p></div>)}</div>
      <div className="mt-5 flex items-center gap-2 border-t border-gray-200 pt-4 text-sm dark:border-gray-700"><ArrowRight size={16} className="shrink-0 text-blue-600"/><p className="font-medium">{nextAction}</p><span className="ml-auto shrink-0 text-xs tabular-nums text-gray-400">{completed}/3</span></div>
    </header>
    {error&&<p role="alert" className="flex items-start gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700"><AlertCircle size={18} className="shrink-0"/>{error}</p>}

    <section aria-labelledby="signature-heading" className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 dark:border-gray-700"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300"><FileCheck2 size={20}/></span><div><p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Étape 01</p><h4 id="signature-heading" className="font-semibold">Conditions générales de vente</h4></div></div>{badge(signed,signed?'Signées':signatureLabel[info.youtrust?.status] || (info.signature_url?'En attente':'À préparer'))}</div>
      <div className="space-y-4 p-5">
        {info?.youtrust_enabled?<>
          <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">{signed?'Les CGV signées ont été enregistrées dans l’espace client.':info.signature_url?'Le lien est prêt. Le client signe depuis son espace, puis ses justificatifs se débloquent automatiquement.':'Créez l’invitation à partir des coordonnées du dossier. Youtrust prend ensuite le relais pour la signature.'}</p>
          {info.youtrust_error&&<div role="alert" className="flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 p-3 text-sm leading-6 text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200"><AlertCircle size={17} className="mt-0.5 shrink-0"/>{info.youtrust_error}</div>}
          <div className="flex flex-wrap items-center gap-3">
            {!signed&&!info.signature_url&&<button disabled={busy} onClick={prepareSignature} className={primary}>{busy?<Loader2 size={16} className="animate-spin"/>:<FileCheck2 size={16}/>} {busy?'Préparation…':'Créer le lien de signature'}</button>}
            {info.signature_url&&<a href={info.signature_url} target="_blank" rel="noopener noreferrer" className={secondary}>Ouvrir la signature<ExternalLink size={15}/></a>}
            {!signed&&info.youtrust?.request_id&&<button disabled={busy} onClick={prepareSignature} className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 disabled:opacity-50"><RefreshCw size={14} className={busy?'animate-spin':''}/>Actualiser la signature</button>}
            {signed&&<span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-300"><ShieldCheck size={18}/>Signature confirmée par Youtrust</span>}
          </div>
        </>:<>
          <form onSubmit={e=>{e.preventDefault();save({signature_url:url.trim()});}} className="space-y-3"><label className="block text-sm font-medium">Lien de signature du client<input type="url" value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://…" className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-600 dark:bg-gray-900"/></label><button disabled={busy} className={secondary}>Enregistrer le lien</button></form>
          <label className="flex items-center gap-3 text-sm"><input type="checkbox" aria-label="Confirmer la signature des CGV" disabled={busy||!info||(!info.cgv&&!signed)} checked={signed} onChange={e=>save({signature_confirmed:e.target.checked})}/>Je confirme la signature des CGV</label>
        </>}
      </div>
    </section>

    <section aria-labelledby="identity-heading" className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 dark:border-gray-700"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300"><Fingerprint size={20}/></span><div><p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Étape 02</p><h4 id="identity-heading" className="font-semibold">Justificatifs du client</h4></div></div>{badge(received===4,`${received}/4 reçus`)}</div>
      <div className="space-y-4 p-5"><p className="text-sm leading-6 text-gray-500 dark:text-gray-400">{signed?'Les pièces déposées par le client apparaissent ici pour consultation.':'Le dépôt des pièces sera accessible au client après la signature des CGV.'}</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{identityItems.map(([kind,label,detail])=>{
          const document=info?.identity?.find((doc:any)=>doc.kind===kind);
          const pending=openingDocument===kind;
          return <div key={kind} data-identity-kind={kind} className={`rounded-xl border p-4 ${document?'border-emerald-200 bg-emerald-50/30 dark:border-emerald-800 dark:bg-emerald-900/10':'border-dashed border-gray-200 bg-gray-50/60 dark:border-gray-700 dark:bg-gray-900/30'}`}>
            <div className="flex items-start gap-3">
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${document?'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300':'bg-gray-100 text-gray-400 dark:bg-gray-800'}`}>{document?<FileCheck2 size={19}/>:<FileText size={19}/>}</span>
              <div className="min-w-0 flex-1"><p className="text-sm font-semibold">{label}</p><p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{detail}</p></div>
              {document&&<Check size={16} className="shrink-0 text-emerald-600" aria-label="Reçu"/>}
            </div>
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">{document?`Reçu le ${new Date(document.updated_at).toLocaleString('fr-FR',{dateStyle:'short',timeStyle:'short'})}`:'En attente du dépôt du client'}</p>
            {document&&<div className="mt-3 flex flex-wrap items-center gap-2">
              <button disabled={Boolean(openingDocument)} aria-label={`Consulter ${label} ${detail}`} onClick={()=>openIdentity(kind,true)} className={`${secondary} !px-3 !py-2 !text-xs`}>{pending?<Loader2 size={14} className="animate-spin"/>:<Eye size={14}/>}Consulter</button>
              <button disabled={Boolean(openingDocument)} aria-label={`Télécharger ${label} ${detail}`} onClick={()=>openIdentity(kind)} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 disabled:opacity-50 dark:text-blue-300 dark:hover:bg-blue-900/30"><Download size={14}/>Télécharger</button>
            </div>}
          </div>;
        })}</div>
        <p className="text-xs text-gray-400">Mise à jour automatique toutes les 5 secondes.</p>
        <button disabled={busy} onClick={()=>load().catch(err=>toast.error(err.message))} className="inline-flex items-center gap-2 text-xs font-medium text-gray-500 transition hover:text-blue-600 disabled:opacity-50 dark:text-gray-400 dark:hover:text-blue-300"><RefreshCw size={13}/>Actualiser les documents</button>
      </div>
    </section>

    <section aria-labelledby="payment-heading" className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 dark:border-gray-700"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300"><Wallet size={20}/></span><div><p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Étape 03</p><h4 id="payment-heading" className="font-semibold">Acompte & facture</h4></div></div>{badge(paid,paid?'Paiement confirmé':info?.payment_declared_at?'Virement déclaré':'À recevoir')}</div>
      <div className="space-y-5 p-5">
        {depositContent}
        <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${paid?'border-emerald-200 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-900/20':'border-gray-200 hover:border-blue-200 dark:border-gray-700'}`}><input type="checkbox" aria-label="Confirmer la réception du paiement" disabled={busy||!info} checked={paid} onChange={e=>save({payment_confirmed:e.target.checked})} className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-blue-600"/><span><span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">{paid?'Réception du paiement confirmée':'Confirmer la réception du virement'}</span><span className="mt-1 block text-xs leading-5 text-gray-500 dark:text-gray-400">{info?.payment_declared_at&&!paid?'Le client a déclaré son virement. Vérifiez sa réception avant de confirmer.':'Cette confirmation rend la facture disponible dans l’espace client.'}</span></span></label>
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-gray-200 p-4 dark:border-gray-700"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300"><FileText size={20}/></span><div className="min-w-0 flex-1"><p className="text-sm font-semibold">Facture d’acompte</p><p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">{info?.invoice?(paid?'Disponible dans l’espace client':'PDF ajouté · En attente de confirmation du paiement'):'Ajoutez le PDF à remettre au client.'}</p></div><label className={`${secondary} cursor-pointer focus-within:ring-4 focus-within:ring-blue-100`}><Upload size={15}/>{busy?'Envoi…':info?.invoice?'Remplacer':'Ajouter le PDF'}<input aria-label="Importer la facture" disabled={busy} type="file" accept="application/pdf,.pdf" className="sr-only" onChange={e=>{uploadInvoice(e.target.files?.[0]);e.target.value='';}}/></label></div>
        <p className="flex items-center gap-1.5 text-xs text-gray-400"><ShieldCheck size={13}/>PDF uniquement · 10 Mo maximum</p>
      </div>
    </section>
  </div>;
}
