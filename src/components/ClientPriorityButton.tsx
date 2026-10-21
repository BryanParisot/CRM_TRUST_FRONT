import {Flag, Loader2} from 'lucide-react';
import {useState} from 'react';
import toast from 'react-hot-toast';

interface Props {
  clientId: string | number;
  clientName: string;
  priority: boolean;
  disabled?: boolean;
  onChanged: (priority: boolean) => void;
}

export default function ClientPriorityButton({clientId, clientName, priority, disabled = false, onChanged}: Props) {
  const [saving, setSaving] = useState(false);
  const toggle = async () => {
    if (saving || disabled) return;
    setSaving(true);
    try {
      const response = await fetch(`http://localhost:3000/api/clients/${clientId}/priority`, {
        method: 'PATCH', headers: {'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}`},
        body: JSON.stringify({is_priority: !priority}),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Impossible de modifier la priorité.');
      onChanged(data.is_priority);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return <button type="button" aria-label={priority ? `Retirer la priorité de ${clientName}` : `Marquer ${clientName} comme prioritaire`} aria-pressed={priority} aria-busy={saving} disabled={disabled || saving} title={priority ? 'Dossier prioritaire · Cliquer pour retirer' : 'Marquer comme prioritaire'} onClick={event => {event.stopPropagation();toggle();}} className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 disabled:cursor-wait disabled:opacity-50 ${priority ? 'bg-amber-50/70 text-amber-600 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:bg-amber-900/40' : 'text-gray-300 hover:bg-gray-50 hover:text-amber-500 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-amber-400'}`}>
    {saving ? <Loader2 size={14} className="animate-spin"/> : <Flag size={14} strokeWidth={1.7} className={priority ? 'fill-amber-100 dark:fill-amber-900/40' : ''}/>}
  </button>;
}
