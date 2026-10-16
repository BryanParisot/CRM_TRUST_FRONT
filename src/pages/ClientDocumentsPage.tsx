import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Download, FileText, ExternalLink } from 'lucide-react';
import { finalDocuments } from '../components/SettlementPanel';
export default function ClientDocumentsPage(){
  const {token}=useParams();
  const [info,setInfo]=useState<any>(null);
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(true);
  useEffect(()=>{
    let active=true;
    const load=async()=>{
      try{
        const res=await fetch(`http://localhost:3000/api/clients/public/${token}/documents`);
        const data=await res.json();if(!res.ok)throw new Error(data.message);
        if(active){setInfo(data);setError('');}
      }catch(err){if(active)setError((err as Error).message);}finally{if(active)setLoading(false);}
    };
    load();const timer=setInterval(load,5000);
    return()=>{active=false;clearInterval(timer);};
  },[token]);
  if(loading)return <p className="p-10 text-center">Chargement…</p>;
  if(!info)return <p role="alert" className="p-10 text-center text-red-600">{error}</p>;
  return <main className="px-4 py-6 sm:py-8"><div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
    <h1 className="text-2xl font-semibold">Mes documents</h1><p className="mt-2 text-gray-500">Retrouvez vos CGV, votre facture et les documents de votre véhicule.</p>
    {error&&<p role="alert" className="mt-4 text-red-600">{error}</p>}
    <div className="mt-6 space-y-4">{[{kind:'cgv',label:'Mes CGV signées'},{kind:'invoice',label:'Ma facture d’acompte'},...(info.step>=5?finalDocuments:[])].map(({kind,label})=><section key={kind} className="border rounded-xl p-5">
      <h2 className="flex items-center gap-2 font-semibold"><FileText size={20}/>{label}</h2>
      {(info[kind]||info.final_documents?.some((document:any)=>document.kind===kind))?<a href={`http://localhost:3000/api/clients/public/${token}/documents/${kind}`} className="mt-4 flex items-center gap-2 text-blue-600"><Download size={18}/>Télécharger le PDF</a>:<p className="mt-3 text-sm text-gray-500">{kind==='cgv'?'Votre document signé sera disponible ici dès son ajout par votre conseiller.':kind!=='invoice'?'Votre conseiller prépare ce document.':!info.payment_confirmed_at?'Votre facture sera disponible après confirmation de réception du paiement par votre conseiller.':'Votre paiement est confirmé. Votre conseiller prépare la facture.'}</p>}
      {kind==='cgv'&&info.signature_url&&!info.cgv&&<a href={info.signature_url} target="_blank" rel="noopener noreferrer" className="mt-4 flex gap-2 items-center text-blue-600">Signer mes CGV sur Youtrust<ExternalLink size={16}/></a>}
      {kind==='cgv'&&info.cgv_template&&!info.cgv&&<a href={`http://localhost:3000/api/clients/public/${token}/documents/cgv-template`} className="mt-4 flex items-center gap-2 text-blue-600"><Download size={18}/>Consulter le modèle de CGV (non signé)</a>}
    </section>)}</div>
    <Link to={`/client-link/${token}/overview`} className="block mt-6 text-sm text-gray-500 underline">Retour à mon dossier</Link>
  </div></main>;
}
