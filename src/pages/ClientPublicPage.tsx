import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { clientPortalPath } from '../utils/clientPortal';
import { Check, X, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { Proposal, decisionLabel } from '../components/ManualVehicleLinks';

export default function ClientPublicPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState<{ name: string } | null>(null);
  const [vehicles, setVehicles] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState<number | null>(null);
  const busy = useRef(false);
  useEffect(() => {
    let active = true;
    const load = async () => {
      if (busy.current) return;
      try {
        const res = await fetch(`http://localhost:3000/api/clients/public/${token}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Lien invalide.');
        if (active && data.client.step >= 3) { navigate(clientPortalPath(token!, data.client.step), { replace: true }); return; }
        if (active && !busy.current) { setClient(data.client); setVehicles(data.vehicles); setError(''); }
      } catch (err) { if (active) setError((err as Error).message); }
      finally { if (active) setLoading(false); }
    };
    load();
    const timer = setInterval(load, 5000);
    return () => { active = false; clearInterval(timer); };
  }, [token, navigate]);

  const decide = async (vehicle: Proposal, decision: 'accepted' | 'rejected') => {
    if (busy.current) return;
    busy.current = true; setSaving(vehicle.id);
    try {
      const res = await fetch(`http://localhost:3000/api/clients/public/${token}/vehicles/${vehicle.id}/decision`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ decision }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Enregistrement impossible.');
      setVehicles(prev => prev.map(v => v.id === vehicle.id ? { ...v, selected_by: data.selected_by } : v));
      toast.success('Votre choix est enregistré.');
    } catch (err) { toast.error((err as Error).message); }
    finally { busy.current = false; setSaving(null); }
  };

  if (loading) return <div className="p-10 text-center">Chargement…</div>;
  if (!client) return <div role="alert" className="p-10 text-center text-red-600">{error || 'Lien invalide.'}</div>;
  return <main className="px-4 py-6 sm:py-8">
    <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 sm:p-8 shadow-lg">
      <h1 className="text-2xl font-bold text-gray-900">Les propositions de véhicules</h1>
      <p className="mt-3 text-gray-600">Ouvrez chaque annonce, puis indiquez si le véhicule vous plaît avec ✓ ou si vous le refusez avec ✕. Vos réponses sont enregistrées immédiatement et vous pouvez changer d’avis.</p>
      {error && <p role="alert" className="mt-4 text-red-600">{error}</p>}
      {!vehicles.length && <p className="mt-8 text-gray-500">Votre conseiller prépare les propositions. Elles apparaîtront ici dès leur ajout.</p>}
      <ul className="mt-6 space-y-4">{vehicles.map(v => <li key={v.id} className="rounded-xl border p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="min-w-0 flex-1">
            <a href={v.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-semibold text-blue-600 break-all">{v.title}<ExternalLink size={16} className="shrink-0"/></a>
            <p className="mt-1 text-xs text-gray-500 break-all">{v.link}</p>
          </div>
          <div className="flex gap-2">
            <button aria-label={`Refuser ${v.title}`} aria-pressed={v.selected_by === 'rejected'} disabled={saving !== null} onClick={() => decide(v, 'rejected')} className={`rounded-lg border p-3 disabled:opacity-50 ${v.selected_by === 'rejected' ? 'bg-red-600 text-white border-red-600' : 'text-red-600 hover:bg-red-50'}`}><X size={22}/></button>
            <button aria-label={`Retenir ${v.title}`} aria-pressed={v.selected_by === 'client'} disabled={saving !== null} onClick={() => decide(v, 'accepted')} className={`rounded-lg border p-3 disabled:opacity-50 ${v.selected_by === 'client' ? 'bg-green-600 text-white border-green-600' : 'text-green-600 hover:bg-green-50'}`}><Check size={22}/></button>
          </div>
        </div>
        <p className={`mt-3 text-sm ${v.selected_by === 'client' ? 'text-green-700' : v.selected_by === 'rejected' ? 'text-red-700' : 'text-gray-500'}`} role="status">{saving === v.id ? 'Enregistrement…' : decisionLabel(v.selected_by)}</p>
      </li>)}</ul>
    </div>
  </main>;
}
