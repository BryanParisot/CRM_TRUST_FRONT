import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { clientPortalPath } from '../utils/clientPortal';
import { Check, ExternalLink, ArrowRight, Copy, FileText, Upload, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const required = [{kind:'cni_front',label:'Carte d’identité — recto'}, {kind:'cni_back',label:'Carte d’identité — verso'}, {kind:'license',label:'Permis de conduire'}, {kind:'address',label:'Justificatif de domicile'}];
export default function ClientPaymentPage() {
  const {token}=useParams();
  const navigate=useNavigate();
  const [data,setData]=useState<any>(null);
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(true);
  const [step,setStep]=useState(1);
  const [busy,setBusy]=useState(false);
  const [uploadingKind,setUploadingKind]=useState<string|null>(null);
  const [uploadError,setUploadError]=useState<{kind:string;message:string}|null>(null);
  const [lastUpload,setLastUpload]=useState<{kind:string;name:string;sequence:number}|null>(null);
  const previousAllowed=useRef<number|null>(null);
  const refreshVersion=useRef(0);
  const uploading=useRef(false);
  const reduceMotion=useReducedMotion();
  const load=async()=>{
    const [documents,client]=await Promise.all([
      fetch(`http://localhost:3000/api/clients/public/${token}/documents`),
      fetch(`http://localhost:3000/api/clients/public/${token}`),
    ]);
    const docs=await documents.json();const details=await client.json();
    if(!documents.ok || !client.ok)throw new Error(docs.message||details.message||'Lien invalide.');
    return {...docs,client:details.client,vehicles:details.vehicles.filter((v:any)=>v.selected_by==='client')};
  };
  useEffect(()=>{
    let active=true;
    const refresh=async()=>{
      if(uploading.current)return;
      const version=++refreshVersion.current;
      try{const value=await load();if(active&&version===refreshVersion.current){setData(value);setError('');}}catch(err){if(active&&version===refreshVersion.current)setError((err as Error).message);}finally{if(active)setLoading(false);}
    };
    refresh();const timer=setInterval(refresh,5000);
    return()=>{active=false;clearInterval(timer);};
  },[token]);
  const signed=Boolean(data?.signature_confirmed_at);
  useEffect(()=>{
    if(data?.client.step>=4)navigate(clientPortalPath(token!,data.client.step),{replace:true});
  },[data?.client.step,token,navigate]);
  const complete=required.every(item=>data?.identity.some((doc:any)=>doc.kind===item.kind));
  const allowed=!signed?1:!complete?2:3;
  useEffect(()=>{
    if(!data)return;
    const previous=previousAllowed.current;
    // Keep the last successful upload visible until the client chooses to continue.
    if(previous===null||allowed<previous||(previous===1&&allowed===2))setStep(allowed);
    previousAllowed.current=allowed;
  },[allowed,Boolean(data)]);
  const upload=async(kind:string,file?:File)=>{
    if(!file)return;
    if(uploading.current)return;
    if(file.size>10*1024*1024){setUploadError({kind,message:'Le fichier dépasse 10 Mo. Choisissez un fichier plus léger.'});return;}
    uploading.current=true;++refreshVersion.current;
    setUploadingKind(kind);setUploadError(null);
    setBusy(true);
    try{
      const type=file.type|| (file.name.toLowerCase().endsWith('.pdf')?'application/pdf':'application/octet-stream');
      const res=await fetch(`http://localhost:3000/api/clients/public/${token}/identity/${kind}`,{method:'PUT',headers:{'Content-Type':type},body:file});
      const value=await res.json();if(!res.ok)throw new Error(value.message);
      ++refreshVersion.current;
      setUploadingKind(null);
      setData((current:any)=>({...current,identity:[...current.identity.filter((doc:any)=>doc.kind!==kind),{kind}]}));
      setLastUpload({kind,name:file.name,sequence:Date.now()});setError('');
      // The upload is already saved: a failed refresh must not be reported as a failed upload.
      try{setData(await load());}catch{setError('Votre document est enregistré. Le suivi se mettra à jour automatiquement.');}
    }catch(err){setUploadError({kind,message:(err as Error).message});}finally{uploading.current=false;setUploadingKind(null);setBusy(false);}
  };
  const declare=async()=>{
    setBusy(true);
    try{
      const res=await fetch(`http://localhost:3000/api/clients/public/${token}/payment-declaration`,{method:'POST'});
      const value=await res.json();if(!res.ok)throw new Error(value.message);
      setData(await load());toast.success(value.message);
    }catch(err){toast.error((err as Error).message);}finally{setBusy(false);}
  };
  if(loading)return <p className="p-10 text-center">Chargement…</p>;
  if(!data)return <p role="alert" className="p-10 text-center text-red-600">{error}</p>;
  return <main className="px-4 py-6 text-gray-900 sm:py-8"><div className="mx-auto max-w-3xl">
    <h1 className="sr-only">Signature, justificatifs et acompte</h1>
    <nav aria-label="Étapes du dossier" className="grid grid-cols-3 gap-2 mb-6">{['Signature','Justificatifs','Acompte'].map((label,i)=><button key={label} disabled={i+1>allowed} aria-current={step===i+1?'step':undefined} onClick={()=>setStep(i+1)} className={`rounded-xl p-3 text-sm text-left border ${step===i+1?'bg-blue-600 text-white border-blue-600':'bg-white border-gray-200'} disabled:opacity-40`}><span className="block text-xs mb-1">Étape {i+1}</span>{label}</button>)}</nav>
    {error&&<p role="alert" className="mb-4 text-red-600">{error}</p>}
    <div role="status" aria-live="polite" aria-atomic="true">
      <AnimatePresence mode="wait" initial={false}>{lastUpload&&<motion.div key={lastUpload.sequence} initial={reduceMotion?false:{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={reduceMotion?{opacity:1}:{opacity:0}} transition={{duration:0.2}} className="mb-5 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
        <motion.span initial={reduceMotion?false:{scale:0.5}} animate={{scale:1}} transition={{type:'spring',stiffness:320,damping:18}} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
          <motion.svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><motion.path d="m5 12 4 4L19 6" initial={reduceMotion?false:{pathLength:0}} animate={{pathLength:1}} transition={{duration:0.35,delay:0.1}}/></motion.svg>
        </motion.span>
        <div className="min-w-0"><p className="text-sm font-semibold">Document bien reçu !</p><p className="mt-1 text-xs leading-5">{required.find(item=>item.kind===lastUpload.kind)?.label} enregistré. Votre conseiller peut le consulter.</p></div>
      </motion.div>}</AnimatePresence>
    </div>
    <section className="rounded-2xl bg-white border border-gray-200 p-6 sm:p-8 space-y-5">
      {step===1&&<>
        <h2 className="text-xl font-semibold">Signez vos conditions générales de vente</h2>
        <p className="text-sm text-gray-600">Lisez puis signez vos CGV sur Youtrust. {data.youtrust_enabled ? 'Revenez ensuite ici : la signature sera vérifiée automatiquement pour ouvrir l’étape suivante.' : 'Revenez ensuite dans cet espace : votre conseiller confirmera la signature pour ouvrir l’étape suivante.'}</p>
        {data.cgv_template&&<a href={`http://localhost:3000/api/clients/public/${token}/documents/cgv-template`} className="block text-sm text-blue-600 underline">Consulter les CGV</a>}
        {signed?<p className="text-green-700 flex gap-2"><Check size={20}/>Signature confirmée</p>:data.signature_url?<a href={data.signature_url} target="_blank" rel="noopener noreferrer" className="inline-flex gap-2 items-center rounded-lg bg-blue-600 text-white px-5 py-3">Signer sur Youtrust<ExternalLink size={18}/></a>:<p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">Votre conseiller prépare votre lien de signature.</p>}
        {data.signature_url&&!signed&&<p className="text-xs text-gray-500">{data.youtrust_enabled ? 'Vous avez déjà signé ? La vérification automatique peut prendre environ une minute. Cette page se met à jour toute seule.' : 'Vous avez déjà signé ? La suite sera accessible dès la confirmation par votre conseiller.'}</p>}
        {signed&&<button onClick={()=>setStep(2)} className="flex gap-2 text-blue-600">Continuer<ArrowRight size={18}/></button>}
      </>}
      {step===2&&<>
        <h2 className="text-xl font-semibold">Ajoutez vos justificatifs</h2>
        <p className="text-sm text-gray-600">Déposez les documents ci-dessous. PDF, JPG ou PNG, 10 Mo maximum par fichier.</p>
        <div className="flex items-center justify-between gap-3 text-sm"><span className="font-medium text-gray-700">{data.identity.length} document{data.identity.length>1?'s':''} sur 4 reçus</span><span className="text-xs text-gray-400">Suivi du dépôt</span></div>
        <div className="h-1.5 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-emerald-500 transition-[width] duration-500 motion-reduce:transition-none" style={{width:`${data.identity.length/4*100}%`}}/></div>
        <div className="space-y-3">{required.map(item=>{
          const present=data.identity.some((doc:any)=>doc.kind===item.kind);
          const sending=uploadingKind===item.kind;
          const recent=lastUpload?.kind===item.kind;
          const failure=uploadError?.kind===item.kind?uploadError.message:null;
          return <div key={item.kind} data-upload-kind={item.kind} aria-busy={sending} className={`rounded-xl border p-4 transition-colors motion-reduce:transition-none sm:p-5 ${failure?'border-red-200 bg-red-50/30':present?'border-emerald-200 bg-emerald-50/30':sending?'border-blue-300 bg-blue-50/30':'border-gray-200 bg-white'}`}>
            <div className="flex items-start gap-3">
              <motion.span key={`${item.kind}-${recent?lastUpload.sequence:'saved'}`} initial={recent&&!reduceMotion?{scale:0.6,opacity:0}:false} animate={{scale:1,opacity:1}} transition={{type:'spring',stiffness:350,damping:20}} className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${sending?'bg-blue-100 text-blue-600':present?'bg-emerald-100 text-emerald-700':'bg-gray-100 text-gray-400'}`}>
                {sending?<Loader2 size={20} className="animate-spin motion-reduce:animate-none"/>:present?<Check size={21} strokeWidth={2.5}/>:<FileText size={20}/>}
              </motion.span>
              <div className="min-w-0 flex-1"><p className="text-sm font-semibold">{item.label}</p><p className={`mt-1 text-xs ${present?'text-emerald-700':'text-gray-500'}`}>{sending?'Envoi en cours…':present?'Document reçu et enregistré':'À ajouter · PDF, JPG ou PNG'}</p>{recent&&present&&<p className="mt-1 truncate text-xs text-gray-500" title={lastUpload.name}>{lastUpload.name}</p>}</div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-gray-500">{present?'Un autre fichier ? Vous pouvez le remplacer.':'10 Mo maximum par fichier'}</p>
              <label className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition focus-within:ring-4 focus-within:ring-blue-100 ${busy?'cursor-wait opacity-50':'cursor-pointer'} ${present?'border border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:text-blue-600':'bg-blue-600 text-white hover:bg-blue-700'}`}>
                {sending?<Loader2 size={14} className="animate-spin motion-reduce:animate-none"/>:<Upload size={14}/>}{sending?'Envoi…':present?'Remplacer':'Ajouter le document'}
                <input aria-label={item.label} disabled={busy} type="file" accept="application/pdf,image/jpeg,image/png" className="sr-only" aria-describedby={failure?`upload-error-${item.kind}`:undefined} onChange={e=>{upload(item.kind,e.target.files?.[0]);e.target.value='';}}/>
              </label>
            </div>
            {failure&&<p id={`upload-error-${item.kind}`} role="alert" className="mt-3 flex items-start gap-2 text-xs leading-5 text-red-700"><AlertCircle size={15} className="mt-0.5 shrink-0"/>{failure}</p>}
          </div>;
        })}</div>
        {complete&&<div className="flex items-start gap-3 rounded-xl bg-emerald-50 p-4 text-emerald-800"><ShieldCheck size={20} className="shrink-0"/><div><p className="text-sm font-semibold">Tous vos justificatifs ont été reçus</p><p className="mt-1 text-xs leading-5">Votre conseiller peut maintenant les consulter. Vous pouvez passer à l’acompte.</p></div></div>}
        <button disabled={!complete||busy} onClick={()=>setStep(3)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-40">Continuer vers l’acompte<ArrowRight size={16}/></button>
      </>}
      {step===3&&<>
        <h2 className="text-xl font-semibold">Réglez votre acompte</h2>
        <p className="text-3xl font-bold text-blue-600">{Number(data.client.deposit_amount).toLocaleString('fr-FR',{style:'currency',currency:'EUR'})}</p>
        {data.vehicles.length>0&&<div className="space-y-2"><p className="text-sm text-gray-500">Véhicules retenus</p>{data.vehicles.map((v:any)=><a key={v.id} href={v.link} target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-600 break-all">{v.title} — {v.link}</a>)}</div>}
        {data.payment_confirmed_at?<div className="rounded-xl bg-green-50 p-4"><p className="text-green-700">Paiement confirmé par votre conseiller.</p><Link to={`/client-link/${token}/documents`} className="block mt-3 text-blue-600 underline">Retrouver ma facture et mes CGV</Link></div>:<>
          <div className="rounded-xl bg-gray-50 p-4 space-y-3 text-sm"><p>Bénéficiaire : <strong>AUTOIMPORT FRANCE</strong></p><p className="break-all">IBAN : <strong>FR76 1027 8065 0200 0102 0410 182</strong><button aria-label="Copier l’IBAN" className="ml-2" onClick={async()=>{try{await navigator.clipboard.writeText('FR76 1027 8065 0200 0102 0410 182');toast.success('IBAN copié.');}catch{toast.error('Copiez l’IBAN manuellement.');}}}><Copy size={16}/></button></p><p>BIC : <strong>CMCIFR2A</strong></p></div>
          {data.payment_declared_at?<p className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">Votre déclaration a été reçue. Nous attendons la confirmation de réception du virement par votre conseiller.</p>:<button disabled={busy} onClick={declare} className="rounded-lg bg-blue-600 text-white px-5 py-3 disabled:opacity-40">{busy?'Enregistrement…':'J’ai effectué le virement'}</button>}
          <p className="text-xs text-gray-500">Votre facture sera disponible dans « Mes documents » après confirmation du paiement.</p>
        </>}
      </>}
    </section>
  </div></main>;
}
