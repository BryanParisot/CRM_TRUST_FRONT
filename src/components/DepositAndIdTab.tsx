import React from 'react';
import { CreditCardIcon, IdCardIcon } from 'lucide-react';

interface DepositAndIdTabProps {
  depositPaid: boolean;
  setDepositPaid: (value: boolean) => void;
  idCardSent: boolean;
  setIdCardSent: (value: boolean) => void;
}

const DepositAndIdTab: React.FC<DepositAndIdTabProps> = ({
  depositPaid,
  setDepositPaid,
  idCardSent,
  setIdCardSent,
}) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="border rounded-lg p-4 border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium mb-4">Paiement de l'Acompte (30%)</h3>
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
            <p className="text-sm mb-2">Montant total estimé:</p>
            <p className="text-xl font-bold">€42,500</p>
            <p className="text-sm mb-2 mt-4">Acompte à payer (30%):</p>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
              €12,750
            </p>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="deposit-paid"
              checked={depositPaid}
              onChange={() => setDepositPaid(!depositPaid)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="deposit-paid"
              className="ml-2 text-sm text-gray-700 dark:text-gray-300"
            >
              Acompte payé
            </label>
          </div>
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center">
            <CreditCardIcon className="w-4 h-4 mr-2" />
            Procéder au Paiement
          </button>
        </div>
      </div>
      <div className="border rounded-lg p-4 border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium mb-4">Pièce d'Identité</h3>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
            <IdCardIcon className="w-10 h-10 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Glissez et déposez votre pièce d'identité ici, ou cliquez pour parcourir
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Parcourir les fichiers
            </button>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="id-sent"
              checked={idCardSent}
              onChange={() => setIdCardSent(!idCardSent)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="id-sent"
              className="ml-2 text-sm text-gray-700 dark:text-gray-300"
            >
              Pièce d'identité envoyée
            </label>
          </div>
        </div>
      </div>
    </div>
    <div className="flex justify-end">
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!depositPaid || !idCardSent}
      >
        Valider et Passer à l'Étape Suivante
      </button>
    </div>
  </div>
);

export default DepositAndIdTab;