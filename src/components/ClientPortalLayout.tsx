import { createContext, useContext, useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';
import { ArrowRight, Car, FileText, LayoutDashboard, Loader2 } from 'lucide-react';
import { currentClientStepPath } from '../utils/clientPortal';

export interface PortalClient {
  id:number;name:string;first_name:string|null;last_name:string|null;
  email:string|null;phone:string|null;step:number;deposit_amount:string;
  marque:string|null;modele:string|null;couleur:string|null;carburant:string|null;
  premiere_immat:string|null;budget:string|null;max_km:number|null;
  description:string|null;puissance_min:number|null;boite:string|null;
}
const PortalContext=createContext<PortalClient|null>(null);
export const usePortalClient=()=>{
  const client=useContext(PortalContext);
  if(!client)throw new Error('Dossier client indisponible.');
  return client;
};

export default function ClientPortalLayout(){
  const {token}=useParams();const location=useLocation();
  const [record,setRecord]=useState<{token:string|undefined;client:PortalClient}|null>(null);
  const client=record&&record.token===token?record.client:null;
  const [error,setError]=useState('');const [attempt,setAttempt]=useState(0);
  useEffect(()=>{
    const controller=new AbortController();let pending=false;
    setRecord(null);setError('');
    const refresh=async()=>{
      if(pending)return;pending=true;
      try{
        const response=await fetch(`http://localhost:3000/api/clients/public/${token}`,{signal:controller.signal,cache:'no-store'});
        const data=await response.json();
        if(!response.ok){if(response.status===404&&!controller.signal.aborted)setRecord(null);throw new Error(data.message||'Dossier indisponible.');}
        if(!controller.signal.aborted){setRecord({token,client:data.client});setError('');}
      }catch(error){if(!controller.signal.aborted)setError((error as Error).message);}finally{pending=false;}
    };
    refresh();const timer=setInterval(refresh,5000);window.addEventListener('focus',refresh);
    return()=>{controller.abort();clearInterval(timer);window.removeEventListener('focus',refresh);};
  },[token,attempt]);
  useEffect(()=>{
    if(!client)return;
    if(location.hash){const frame=requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView({block:'start'}));return()=>cancelAnimationFrame(frame);}
    window.scrollTo({top:0});
  },[location.pathname,location.hash,Boolean(client)]);
  if(!client)return <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6 text-center text-sm text-gray-500">{error?<div><p role="alert" className="text-red-600">{error}</p><button onClick={()=>setAttempt(value=>value+1)} className="mt-4 font-semibold text-blue-600">Réessayer</button></div>:<p className="flex items-center gap-2"><Loader2 size={18} className="animate-spin"/>Chargement de votre espace…</p>}</main>;
  const overview=`/client-link/${token}/overview`;
  const links=[{href:overview,label:'Mon dossier',icon:LayoutDashboard},{href:currentClientStepPath(token!,client.step),label:'Étape en cours',icon:ArrowRight},{href:`/client-link/${token}/documents`,label:'Mes documents',icon:FileText}];
  return <PortalContext.Provider value={client}><div className="min-h-screen bg-gray-50 text-gray-900">
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-3xl px-4 py-4">
        <div className="flex items-center justify-between gap-4"><Link to={overview} aria-label="Accueil de mon espace client" className="inline-flex shrink-0 items-center gap-2.5"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white"><Car size={20}/></span><span className="text-sm font-semibold tracking-wide">Cartrust<span className="block text-[10px] font-medium tracking-normal text-gray-400">Votre espace client</span></span></Link><p className="min-w-0 truncate text-right text-sm font-medium text-gray-600" title={client.name}>{client.name}</p></div>
        <nav aria-label="Navigation de l’espace client" className="mt-4 grid grid-cols-3 gap-1 rounded-xl bg-gray-50 p-1">{links.map(({href,label,icon:Icon})=>{
          const active=label==='Mon dossier' ? location.pathname===overview && (location.hash!=='#progress'||currentClientStepPath(token!,client.step)!==`${overview}#progress`) : location.pathname+location.hash===href;
          return <Link key={label} to={href} aria-current={active?'page':undefined} className={`flex min-w-0 items-center justify-center gap-1.5 rounded-lg px-1.5 py-2.5 text-center text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 sm:text-sm ${active?'bg-white text-blue-600 shadow-sm':'text-gray-500 hover:bg-white hover:text-gray-900'}`}><Icon size={15} className="shrink-0"/><span>{label}</span></Link>;
        })}</nav>
        {error&&<p role="alert" className="mt-3 text-xs text-amber-700">Le suivi ne peut pas être actualisé pour le moment. Les dernières informations restent affichées.</p>}
      </div>
    </header>
    <Outlet/>
  </div></PortalContext.Provider>;
}
