import { X } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import vehicleData from '../data/vehicles.json';

interface EditClientFormData {
    name: string;
    email: string;
    phone: string;
    marque: string;
    modele: string;
    budget: string;
    max_km: string;
    carburant: string;
    boite: string;
    puissance_min: string;
    couleur: string;
    description: string;
    premiere_immat: string;
}

interface EditClientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: EditClientFormData) => void;
    clientData: EditClientFormData;
    isUpdating?: boolean;
}

const EditClientModal: React.FC<EditClientModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    clientData,
    isUpdating = false,
}) => {
    const [formData, setFormData] = useState<EditClientFormData>(clientData);

    // Update form when clientData changes
    useEffect(() => {
        setFormData(clientData);
    }, [clientData]);

    // Get available models based on selected marque
    const availableModels = useMemo(() => {
        const selectedBrand = vehicleData.find(v => v.brand === formData.marque);
        return selectedBrand ? selectedBrand.models : [];
    }, [formData.marque]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            // Reset model if marque changes
            if (name === 'marque' && value !== prev.marque) {
                return { ...prev, [name]: value, modele: '' };
            }
            return { ...prev, [name]: value };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-4 flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Modifier Client</h2>
                    <button
                        onClick={onClose}
                        disabled={isUpdating}
                        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-6">
                        {/* Informations de base */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                Informations de base
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                                        Nom Complet <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        disabled={isUpdating}
                                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        disabled={isUpdating}
                                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium mb-1">
                                        Téléphone <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        disabled={isUpdating}
                                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="budget" className="block text-sm font-medium mb-1">
                                        Budget (€)
                                    </label>
                                    <input
                                        type="text"
                                        id="budget"
                                        name="budget"
                                        value={formData.budget}
                                        onChange={handleChange}
                                        disabled={isUpdating}
                                        placeholder="30000"
                                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Préférences véhicule */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                Préférences véhicule
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="marque" className="block text-sm font-medium mb-1">
                                        Marque
                                    </label>
                                    <select
                                        id="marque"
                                        name="marque"
                                        value={formData.marque}
                                        onChange={handleChange}
                                        disabled={isUpdating}
                                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50"
                                    >
                                        <option value="">Sélectionner une marque</option>
                                        {vehicleData.map((v, index) => (
                                            <option key={index} value={v.brand}>{v.brand}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="modele" className="block text-sm font-medium mb-1">
                                        Modèle
                                    </label>
                                    <select
                                        id="modele"
                                        name="modele"
                                        value={formData.modele}
                                        onChange={handleChange}
                                        disabled={isUpdating || !formData.marque}
                                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <option value="">Sélectionner un modèle</option>
                                        {availableModels.map((model, index) => (
                                            <option key={index} value={model}>{model}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="max_km" className="block text-sm font-medium mb-1">
                                        Kilométrage Max
                                    </label>
                                    <input
                                        type="text"
                                        id="max_km"
                                        name="max_km"
                                        value={formData.max_km}
                                        onChange={handleChange}
                                        disabled={isUpdating}
                                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="couleur" className="block text-sm font-medium mb-1">
                                        Couleur
                                    </label>
                                    <input
                                        type="text"
                                        id="couleur"
                                        name="couleur"
                                        value={formData.couleur}
                                        onChange={handleChange}
                                        disabled={isUpdating}
                                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Caractéristiques techniques */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                Caractéristiques techniques
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="carburant" className="block text-sm font-medium mb-1">
                                        Carburant
                                    </label>
                                    <select
                                        id="carburant"
                                        name="carburant"
                                        value={formData.carburant}
                                        onChange={handleChange}
                                        disabled={isUpdating}
                                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50"
                                    >
                                        <option value="">Sélectionner</option>
                                        <option value="Essence">Essence</option>
                                        <option value="Diesel">Diesel</option>
                                        <option value="Hybride">Hybride</option>
                                        <option value="Électrique">Électrique</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="boite" className="block text-sm font-medium mb-1">
                                        Boîte de vitesse
                                    </label>
                                    <select
                                        id="boite"
                                        name="boite"
                                        value={formData.boite}
                                        onChange={handleChange}
                                        disabled={isUpdating}
                                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50"
                                    >
                                        <option value="">Sélectionner</option>
                                        <option value="Manuelle">Manuelle</option>
                                        <option value="Automatique">Automatique</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="puissance_min" className="block text-sm font-medium mb-1">
                                        Puissance Min (CV)
                                    </label>
                                    <input
                                        type="number"
                                        id="puissance_min"
                                        name="puissance_min"
                                        value={formData.puissance_min}
                                        onChange={handleChange}
                                        disabled={isUpdating}
                                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="premiere_immat" className="block text-sm font-medium mb-1">
                                        Année Min
                                    </label>
                                    <input
                                        type="number"
                                        id="premiere_immat"
                                        name="premiere_immat"
                                        value={formData.premiere_immat}
                                        onChange={handleChange}
                                        disabled={isUpdating}
                                        placeholder="2018"
                                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium mb-1">
                                Détails Supplémentaires
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                disabled={isUpdating}
                                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50"
                            ></textarea>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isUpdating}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={isUpdating}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isUpdating ? "Enregistrement..." : "Enregistrer"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditClientModal;
