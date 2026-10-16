import { Link, useNavigate, useParams } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import SettlementPanel from '../components/SettlementPanel';
import { clientPortalPath } from '../utils/clientPortal';

export default function ClientSettlementPage(){
  const {token}=useParams();const navigate=useNavigate();
  return <main className="px-4 py-6 text-gray-900 sm:py-8"><div className="mx-auto max-w-3xl space-y-6">
    <div className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 sm:p-7"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><ShieldCheck size={23}/></span><div><p className="text-xs font-semibold uppercase tracking-widest text-blue-600">Étape 5 · Solde & documents</p><h1 className="mt-2 text-xl font-semibold">Finalisons votre prestation</h1><p className="mt-2 text-sm leading-6 text-gray-500">Retrouvez le solde de votre prestation et les documents du véhicule. Votre acompte confirmé est déjà pris en compte.</p></div></div>
    <SettlementPanel token={token} onLoaded={info=>{if(info.client.step!==5)navigate(clientPortalPath(token!,info.client.step),{replace:true});}}/>
    <nav className="flex flex-wrap justify-between gap-3 text-sm text-blue-600"><Link to={`/client-link/${token}/checklist`}>Revoir les contrôles du véhicule</Link><Link to={`/client-link/${token}/overview`}>Retour à mon dossier</Link></nav>
  </div></main>;
}
