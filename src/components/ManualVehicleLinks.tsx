import { useEffect, useState } from 'react';
import { ExternalLink, Plus, Check, X, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export interface Proposal {
  id: number;
  title: string;
  link: string;
  selected_by: string;
}
export const decisionLabel = (value: string) => value === 'client' ? 'Retenu par le client' : value === 'rejected' ? 'Refusé par le client' : 'En attente du client';

export default function ManualVehicleLinks({ clientId, canAdd = false }: { clientId: string; canAdd?: boolean }) {
  const [vehicles, setVehicles] = useState<Proposal[]>([]);
  const [link, setLink] = useState('');
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/vehicles/client/${clientId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        if (!res.ok) throw new Error('Impossible de charger les propositions.');
        const data = await res.json();
        if (active) { setVehicles(data); setError(''); }
      } catch (err) { if (active) setError((err as Error).message); }
    };
    load();
    const timer = setInterval(load, 5000);
    window.addEventListener('vehicles-updated', load);
    return () => { active = false; clearInterval(timer); window.removeEventListener('vehicles-updated', load); };
  }, [clientId]);

  const add = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const url = new URL(link.trim());
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Utilisez un lien http:// ou https://.');
      const res = await fetch('http://localhost:3000/api/vehicles/preselect', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ client_id: clientId, vehicles: [{ link: url.href, title: title.trim() || url.hostname }] }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setLink(''); setTitle('');
      window.dispatchEvent(new Event('vehicles-updated'));
      toast.success('Lien ajouté au dossier client.');
    } catch (err) { toast.error((err as Error).message); }
    finally { setSaving(false); }
  };

  return <section className="space-y-4">
    <div><h3 className="text-lg font-semibold">Propositions de véhicules</h3>
      <p className="text-sm text-gray-500">Après validation des critères, ajoutez les annonces trouvées lors de votre recherche. Partagez ensuite le lien personnalisé depuis le panneau du dossier.</p></div>
    {canAdd ? <form onSubmit={add} className="space-y-3 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <label className="block text-sm">Lien de l’annonce
        <input required type="url" value={link} onChange={e => setLink(e.target.value)} placeholder="https://…" className="mt-1 w-full rounded-lg border p-2 dark:bg-gray-900 dark:border-gray-700" /></label>
      <label className="block text-sm">Nom du véhicule (facultatif)
        <input value={title} onChange={e => setTitle(e.target.value)} maxLength={512} placeholder="Ex. Renault Clio — annonce 1" className="mt-1 w-full rounded-lg border p-2 dark:bg-gray-900 dark:border-gray-700" /></label>
      <button disabled={saving} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"><Plus size={16}/>{saving ? 'Ajout…' : 'Ajouter le lien'}</button>
    </form> : <p className="text-sm text-gray-500">L’ajout de liens est disponible lorsque le dossier est à l’étape 2.</p>}
    {error && <p role="alert" className="text-red-600">{error}</p>}
    {!error && !vehicles.length && <p className="text-sm text-gray-500">Aucune proposition pour le moment.</p>}
    <ul className="space-y-3">{vehicles.map(v => <li key={v.id} className="rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <a href={v.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 font-medium break-all">{v.title}<ExternalLink size={16}/></a>
      <p className="mt-1 text-xs text-gray-500 break-all">{v.link}</p>
      <p className={`mt-3 flex items-center gap-2 text-sm ${v.selected_by === 'client' ? 'text-green-600' : v.selected_by === 'rejected' ? 'text-red-600' : 'text-gray-500'}`}>
        {v.selected_by === 'client' ? <Check size={16}/> : v.selected_by === 'rejected' ? <X size={16}/> : <Clock size={16}/>}{decisionLabel(v.selected_by)}
      </p>
    </li>)}</ul>
  </section>;
}
