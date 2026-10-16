import {
  PenLine,
  EyeIcon,
} from "lucide-react";
import React, { useState } from "react";
import toast from 'react-hot-toast';
import ClientDocumentsAdmin from './ClientDocumentsAdmin';

interface DepositAndIdTabProps {
  clientId: string;
  depositAmount: string;
  canEditAmount: boolean;
  onAmountChanged: (amount: string) => void;
  depositPaid: boolean;
  setDepositPaid: (value: boolean) => void;
  idCardSent: boolean;
  setIdCardSent: (value: boolean) => void;

  // 👇 AJOUT : données envoyées par le client
  clientIdentity: {
    frontUrl?: string;
    backUrl?: string;
  };

  depositProofUrl?: string; // preuve de paiement éventuelle
}

const DepositAndIdTab: React.FC<DepositAndIdTabProps> = ({
  clientId, depositAmount, canEditAmount, onAmountChanged,
  depositPaid, setDepositPaid,
  depositProofUrl,
}) => {
  const [editing, setEditing] = useState(false);
  const [amount, setAmount] = useState('');
  const [savingAmount, setSavingAmount] = useState(false);
  const saveAmount = async (event: React.FormEvent) => {
    event.preventDefault();
    setSavingAmount(true);
    try {
      const res = await fetch(`http://localhost:3000/api/clients/${clientId}/deposit`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ deposit_amount: amount.trim().replace(',', '.') }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      onAmountChanged(data.deposit_amount);
      setEditing(false);
      toast.success('Montant de l’acompte enregistré.');
    } catch (err) { toast.error((err as Error).message); }
    finally { setSavingAmount(false); }
  };

  const depositContent = <div className="space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-900/50">
      <div><p className="text-xs font-medium text-gray-500 dark:text-gray-400">Acompte demandé</p><p className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">{Number(depositAmount ?? 450).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p></div>
      {canEditAmount&&!depositPaid&&!editing&&<button onClick={()=>{setAmount(String(depositAmount??'450.00'));setEditing(true);}} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 hover:border-blue-300 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"><PenLine size={14}/>Modifier l’acompte</button>}
    </div>
    {editing&&<form onSubmit={saveAmount} className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 dark:border-blue-900 dark:bg-gray-900">
      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300">Montant de l’acompte (€)<input autoFocus aria-label="Montant de l’acompte" required type="text" inputMode="decimal" value={amount} onChange={e=>setAmount(e.target.value)} disabled={savingAmount} className="mt-2 block w-full rounded-lg border border-gray-200 bg-white p-2.5 text-base outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-600 dark:bg-gray-800"/></label>
      <div className="mt-3 flex gap-2"><button disabled={savingAmount} className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50">{savingAmount?'Enregistrement…':'Enregistrer'}</button><button type="button" disabled={savingAmount} onClick={()=>setEditing(false)} className="rounded-lg px-3 py-2 text-xs font-medium text-gray-500 hover:bg-white dark:hover:bg-gray-800">Annuler</button></div>
    </form>}
    {depositProofUrl&&<a href={depositProofUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-blue-600"><EyeIcon size={16}/>Voir la preuve de paiement</a>}
  </div>;
  return <ClientDocumentsAdmin clientId={clientId} onPaymentChanged={setDepositPaid} depositContent={depositContent} />;
};
export default DepositAndIdTab;
