import React, { useState } from 'react';
import { XIcon } from 'lucide-react';
interface NewClientFormData {
  name: string;
  email: string;
  phone: string;
  vehicle: string;
  budget: string;
  description: string;
}
interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewClientFormData) => void;
}
const NewClientModal: React.FC<NewClientModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState<NewClientFormData>({
    name: '',
    email: '',
    phone: '',
    vehicle: '',
    budget: '',
    description: ''
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: '',
      email: '',
      phone: '',
      vehicle: '',
      budget: '',
      description: ''
    });
  };
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold">Nouveau Client</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none">
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Nom Complet <span className="text-red-500">*</span>
              </label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                Téléphone <span className="text-red-500">*</span>
              </label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
            </div>
            <div>
              <label htmlFor="vehicle" className="block text-sm font-medium mb-1">
                Préférence de Véhicule
              </label>
              <select id="vehicle" name="vehicle" value={formData.vehicle} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                <option value="">Sélectionner un véhicule</option>
                <option value="BMW X3">BMW X3</option>
                <option value="BMW X5">BMW X5</option>
                <option value="Audi Q5">Audi Q5</option>
                <option value="Audi A6">Audi A6</option>
                <option value="Mercedes GLC">Mercedes GLC</option>
                <option value="Mercedes E-Class">Mercedes E-Class</option>
                <option value="Volvo XC60">Volvo XC60</option>
              </select>
            </div>
            <div>
              <label htmlFor="budget" className="block text-sm font-medium mb-1">
                Budget (€)
              </label>
              <input type="number" id="budget" name="budget" value={formData.budget} onChange={handleChange} placeholder="30000" className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Détails Supplémentaires
              </label>
              <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"></textarea>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 mr-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
              Annuler
            </button>
            <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Créer & Ajouter à l'Étape 1
            </button>
          </div>
        </form>
      </div>
    </div>;
};
export default NewClientModal;