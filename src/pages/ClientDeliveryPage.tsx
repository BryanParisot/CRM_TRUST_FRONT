import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Truck } from 'lucide-react';
import DeliveryPanel from '../components/DeliveryPanel';
import { usePortalClient } from '../components/ClientPortalLayout';
import { clientPortalPath } from '../utils/clientPortal';

export default function ClientDeliveryPage(){
  const {token}=useParams();const client=usePortalClient();const navigate=useNavigate();
  useEffect(()=>{if(client.step!==6)navigate(clientPortalPath(token!,client.step),{replace:true});},[client.step,token,navigate]);
  return <main className="px-4 py-6 sm:py-8"><div className="mx-auto max-w-3xl space-y-6">
    <div className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 sm:p-7"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Truck size={23}/></span><div><p className="text-xs font-semibold uppercase tracking-widest text-blue-600">Étape 6 · Livraison</p><h1 className="mt-2 text-xl font-semibold">La remise de votre véhicule</h1><p className="mt-2 text-sm leading-6 text-gray-500">Retrouvez ici la date et le lieu de votre rendez-vous de livraison.</p></div></div>
    <DeliveryPanel token={token}/>
  </div></main>;
}
