import React from 'react';
import { FileIcon, CreditCardIcon } from 'lucide-react';

interface DocumentsAndPaymentTabProps {
  finalPaymentDone: boolean;
  setFinalPaymentDone: (value: boolean) => void;
}

const DocumentsAndPaymentTab: React.FC<DocumentsAndPaymentTabProps> = ({
  finalPaymentDone,
  setFinalPaymentDone,
}) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Documents Finaux</h3>
        <div className="space-y-3">
          {[
            { name: 'Contrat de vente' },
            { name: "Certificat d'immatriculation" },
            { name: 'Rapport CarVertical' },
          ].map(doc => (
            <div
              key={doc.name}
              className="border rounded-md p-3 border-gray-200 dark:border-gray-700 flex justify-between items-center"
            >
              <div className="flex items-center">
                <FileIcon className="w-5 h-5 text-blue-500 mr-2" />
                <span>{doc.name}</span>
              </div>
              <button className="text-xs text-blue-600 dark:text-blue-400 underline">
                Télécharger
              </button>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium mb-4">Paiement Final</h3>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="space-y-3">
            {[
              { label: 'Acompte déjà payé', value: '450 €' },
              { label: "Frais d'importation", value: '1,200 €' },
              { label: "Formule import export", value: '1,050 €' },
            ].map(item => (
              <div key={item.label} className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
            <div className="border-t dark:border-gray-600 pt-2 mt-2 flex justify-between">
              <span className="font-medium">Montant restant à payer</span>
              <span className="font-bold text-lg">2,700 €</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center mb-3">
              <input
                type="checkbox"
                id="final-payment"
                checked={finalPaymentDone}
                onChange={() => setFinalPaymentDone(!finalPaymentDone)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="final-payment"
                className="ml-2 text-sm text-gray-700 dark:text-gray-300"
              >
                Paiement final effectué
              </label>
            </div>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center">
              <CreditCardIcon className="w-4 h-4 mr-2" />
              Procéder au Paiement Final
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default DocumentsAndPaymentTab;