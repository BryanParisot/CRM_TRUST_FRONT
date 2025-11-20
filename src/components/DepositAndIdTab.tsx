import {
  CheckCircle2Icon,
  CreditCardIcon,
  EyeIcon,
  IdCardIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import React, { useRef } from "react";

interface DepositAndIdTabProps {
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
  depositPaid,
  setDepositPaid,
  idCardSent,
  setIdCardSent,

  clientIdentity,
  depositProofUrl,
}) => {
  const adminUploadFront = useRef<HTMLInputElement>(null);
  const adminUploadBack = useRef<HTMLInputElement>(null);

  const handleAdminUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Tu feras l'appel API ici
    console.log("Admin uploaded:", file);
  };

  return (
    <div className="space-y-8">

      {/* ===================== ACCOMPTE ===================== */}
      <div className="border rounded-xl p-6 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <CreditCardIcon className="w-6 h-6 text-blue-600" />
          Paiement de l'Acompte (30%)
        </h3>

        <div className="space-y-4">

          {/* Montants */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex justify-between items-center">
            <div>
              <p className="text-sm">Acompte à régler :</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">
                450 €
              </p>
            </div>

            {depositPaid ? (
              <span className="text-green-600 font-medium flex items-center gap-2">
                <CheckCircle2Icon className="w-5 h-5" /> Payé
              </span>
            ) : (
              <span className="text-red-500 font-medium flex items-center gap-2">
                <XIcon className="w-5 h-5" /> En attente
              </span>
            )}
          </div>

          {/* Preuve client */}
          {depositProofUrl ? (
            <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
              <p className="mb-2 font-medium">Preuve de paiement envoyée :</p>
              <a
                href={depositProofUrl}
                target="_blank"
                className="text-blue-600 underline flex items-center gap-2"
              >
                <EyeIcon className="w-4 h-4" />
                Voir la preuve
              </a>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Aucune preuve envoyée par le client.
            </p>
          )}

          {/* Admin validation */}
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              id="deposit-paid"
              checked={depositPaid}
              onChange={() => setDepositPaid(!depositPaid)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <label htmlFor="deposit-paid" className="ml-2 text-sm">
              Acompte confirmé par l’admin
            </label>
          </div>
        </div>
      </div>

      {/* ===================== IDENTITÉ ===================== */}
      <div className="border rounded-xl p-6 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <IdCardIcon className="w-6 h-6 text-blue-600" />
          Pièce d'identité du client
        </h3>

        <div className="space-y-4">
          {/* Recto */}
          <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
            <p className="font-medium mb-2">Recto :</p>

            <a
              href='https://via.placeholder.com/400x250.png?text=Recto+ID+Client'
              target="_blank"
              className="flex items-center gap-2 text-blue-600 underline"
            >
              <EyeIcon className="w-4 h-4" /> Voir le recto
            </a>
            <p className="text-gray-500 text-sm">Non envoyé par le client.</p>

            <button
              className="mt-3 px-3 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-md flex items-center gap-2"
              onClick={() => adminUploadFront.current?.click()}
            >
              <UploadIcon className="w-4 h-4" />
              Envoyer un recto depuis l'admin
            </button>
            <input
              ref={adminUploadFront}
              type="file"
              className="hidden"
              onChange={handleAdminUpload}
            />
          </div>

          {/* Verso */}
          <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
            <p className="font-medium mb-2">Verso :</p>

            <a
              href='https://via.placeholder.com/400x250.png?text=Verso+ID+Client'
              target="_blank"
              className="flex items-center gap-2 text-blue-600 underline"
            >
              <EyeIcon className="w-4 h-4" /> Voir le verso
            </a>
            <p className="text-gray-500 text-sm">Non envoyé par le client.</p>

            <button
              className="mt-3 px-3 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-md flex items-center gap-2"
              onClick={() => adminUploadBack.current?.click()}
            >
              <UploadIcon className="w-4 h-4" />
              Envoyer un verso depuis l'admin
            </button>
            <input
              ref={adminUploadBack}
              type="file"
              className="hidden"
              onChange={handleAdminUpload}
            />
          </div>

          {/* Validation admin */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="id-sent"
              checked={idCardSent}
              onChange={() => setIdCardSent(!idCardSent)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <label htmlFor="id-sent" className="ml-2 text-sm">
              Identité vérifiée par l’admin
            </label>
          </div>

          <p className="text-xs text-gray-400">
            Envoyé le :
          </p>

        </div>
      </div>

      {/* ===================== BOUTON ===================== */}
      <div className="flex justify-end">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!depositPaid || !idCardSent}
        >
          Valider et passer à l’étape suivante
        </button>
      </div>
    </div>
  );
};

export default DepositAndIdTab;
