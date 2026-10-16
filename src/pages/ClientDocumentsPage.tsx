import { Link, Navigate, useParams } from 'react-router-dom';
import { Download, FileText } from 'lucide-react';
import { usePortalClient, usePortalDocuments } from '../components/ClientPortalLayout';
import { availableClientDocuments } from '../utils/clientDocuments';
import { currentClientStepPath } from '../utils/clientPortal';

export default function ClientDocumentsPage(){
  const {token}=useParams();
  const client=usePortalClient();
  const {info,error,retry}=usePortalDocuments();
  if(!info)return <div className="p-10 text-center text-sm text-gray-500">{error?<><p role="alert" className="text-red-600">{error}</p><button onClick={retry} className="mt-4 text-blue-600">Réessayer</button></>:'Chargement…'}</div>;
  const documents=availableClientDocuments(info);
  if(!documents.length&&!error)return <Navigate to={currentClientStepPath(token!,client.step)} replace/>;
  return <main className="px-4 py-6 sm:py-8"><div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
    <h1 className="text-2xl font-semibold">Mes documents</h1><p className="mt-2 text-gray-500">Retrouvez les documents disponibles pour votre dossier.</p>
    {error&&<p role="alert" className="mt-4 text-red-600">{error}</p>}
    <div className="mt-6 space-y-4">{documents.map(({kind,label})=><section key={kind} className="border rounded-xl p-5">
      <h2 className="flex items-center gap-2 font-semibold"><FileText size={20}/>{label}</h2>
      <a href={`http://localhost:3000/api/clients/public/${token}/documents/${kind}`} className="mt-4 flex items-center gap-2 text-blue-600"><Download size={18}/>Télécharger le PDF</a>
    </section>)}</div>
    <Link to={`/client-link/${token}/overview`} className="block mt-6 text-sm text-gray-500 underline">Retour à mon dossier</Link>
  </div></main>;
}
