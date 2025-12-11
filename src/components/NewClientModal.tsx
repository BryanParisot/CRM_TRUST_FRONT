import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Car,
  Check,
  FileText,
  Fuel,
  Gauge,
  Mail,
  Palette,
  Phone,
  Settings,
  User,
  Wallet,
  X
} from 'lucide-react';
import React, { useState, useMemo } from 'react';
import vehicleData from '../data/vehicles.json';

export interface NewClientFormData {
  // Step 1: Client Info
  name: string;
  email: string;
  phone: string;
  date_of_birth: string;

  // Step 2: Vehicle Request
  marque: string;
  modele: string;
  budget: string;
  max_km: string;
  first_registration: string; // was year
  carburant: string;        // was fuel
  boite: string;            // was gearbox
  vehicle_color: string;    // was color
  puissance_min: string;    // was min_power
  description: string;
}

export interface ClientSubmissionData {
  name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  marque: string;
  modele: string;
  budget: number;
  max_km: number;
  first_registration: number;
  carburant: string;
  boite: string;
  vehicle_color: string;
  puissance_min: number;
  description: string;
}

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClientSubmissionData) => void;
}

const NewClientModal: React.FC<NewClientModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [formData, setFormData] = useState<NewClientFormData>({
    name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    marque: '',
    modele: '',
    budget: '',
    max_km: '',
    first_registration: '',
    carburant: '',
    boite: '',
    vehicle_color: '',
    puissance_min: '',
    description: ''
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Get available models based on selected marque
  const availableModels = useMemo(() => {
    const selectedBrand = vehicleData.find(v => v.brand === formData.marque);
    return selectedBrand ? selectedBrand.models : [];
  }, [formData.marque]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      // Reset model if marque changes
      if (name === 'marque' && value !== prev.marque) {
        return { ...prev, [name]: value, modele: '' };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleNext = () => {
    if (step === 1) {
      // Basic validation for step 1
      if (formData.name && formData.email && formData.phone) {
        setDirection(1);
        setStep(2);
      }
    }
  };

  const handleBack = () => {
    setDirection(-1);
    setStep(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert numeric fields
    const submissionData: ClientSubmissionData = {
      ...formData,
      budget: Number(formData.budget) || 0,
      max_km: Number(formData.max_km) || 0,
      first_registration: Number(formData.first_registration) || 0,
      puissance_min: Number(formData.puissance_min) || 0,
    };

    onSubmit(submissionData);

    // Reset form after submit
    setFormData({
      name: '', email: '', phone: '', date_of_birth: '',
      marque: '', modele: '', budget: '', max_km: '',
      first_registration: '', carburant: '', boite: '', vehicle_color: '',
      puissance_min: '', description: ''
    });
    setStep(1);
  };

  const inputClasses = (fieldName: string) => `
    w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border rounded-xl outline-none transition-all duration-300
    ${focusedField === fieldName
      ? 'border-blue-500 ring-2 ring-blue-500/20 bg-white dark:bg-gray-700'
      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'}
  `;

  const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1";

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  };

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white overflow-hidden shrink-0">
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <h2 className="text-2xl font-bold">Nouveau Client</h2>
                    <p className="text-blue-100 text-sm mt-1">
                      {step === 1 ? "Étape 1 : Informations personnelles" : "Étape 2 : Recherche de véhicule"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                    <span className={`w-2 h-2 rounded-full ${step === 1 ? 'bg-white' : 'bg-white/40'}`} />
                    <span className={`w-2 h-2 rounded-full ${step === 2 ? 'bg-white' : 'bg-white/40'}`} />
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md z-20"
                >
                  <X className="w-5 h-5 text-white" />
                </button>

                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500/30 rounded-full blur-2xl" />
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6">
                <form onSubmit={handleSubmit} className="h-full flex flex-col">
                  <AnimatePresence mode="wait" custom={direction}>
                    {step === 1 ? (
                      <motion.div
                        key="step1"
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                          x: { type: "spring", stiffness: 300, damping: 30 },
                          opacity: { duration: 0.2 }
                        }}
                        className="space-y-5"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                            <label className={labelClasses}>Nom Complet</label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                onFocus={() => setFocusedField('name')}
                                onBlur={() => setFocusedField(null)}
                                required
                                className={inputClasses('name')}
                                placeholder="Jean Dupont"
                              />
                            </div>
                          </div>
                          <div>
                            <label className={labelClasses}>Email</label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                onFocus={() => setFocusedField('email')}
                                onBlur={() => setFocusedField(null)}
                                required
                                className={inputClasses('email')}
                                placeholder="jean@example.com"
                              />
                            </div>
                          </div>
                          <div>
                            <label className={labelClasses}>Téléphone</label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                onFocus={() => setFocusedField('phone')}
                                onBlur={() => setFocusedField(null)}
                                required
                                className={inputClasses('phone')}
                                placeholder="06 12 34 56 78"
                              />
                            </div>
                          </div>
                          <div>
                            <label className={labelClasses}>Date de Naissance</label>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                type="date"
                                name="date_of_birth"
                                value={formData.date_of_birth}
                                onChange={handleChange}
                                onFocus={() => setFocusedField('date_of_birth')}
                                onBlur={() => setFocusedField(null)}
                                className={inputClasses('date_of_birth')}
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="step2"
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                          x: { type: "spring", stiffness: 300, damping: 30 },
                          opacity: { duration: 0.2 }
                        }}
                        className="space-y-5"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                            <label className={labelClasses}>Marque</label>
                            <div className="relative">
                              <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <select
                                name="marque"
                                value={formData.marque}
                                onChange={handleChange}
                                onFocus={() => setFocusedField('marque')}
                                onBlur={() => setFocusedField(null)}
                                className={`${inputClasses('marque')} appearance-none`}
                              >
                                <option value="">Sélectionner une marque</option>
                                {vehicleData.map((v, index) => (
                                  <option key={index} value={v.brand}>{v.brand}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className={labelClasses}>Modèle</label>
                            <div className="relative">
                              <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <select
                                name="modele"
                                value={formData.modele}
                                onChange={handleChange}
                                onFocus={() => setFocusedField('modele')}
                                onBlur={() => setFocusedField(null)}
                                disabled={!formData.marque}
                                className={`${inputClasses('modele')} appearance-none disabled:opacity-50 disabled:cursor-not-allowed`}
                              >
                                <option value="">Sélectionner un modèle</option>
                                {availableModels.map((model, index) => (
                                  <option key={index} value={model}>{model}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className={labelClasses}>Budget (€)</label>
                            <div className="relative">
                              <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                type="number"
                                name="budget"
                                value={formData.budget}
                                onChange={handleChange}
                                onFocus={() => setFocusedField('budget')}
                                onBlur={() => setFocusedField(null)}
                                className={inputClasses('budget')}
                                placeholder="30000"
                              />
                            </div>
                          </div>
                          <div>
                            <label className={labelClasses}>Kilométrage Max</label>
                            <div className="relative">
                              <Gauge className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                type="number"
                                name="max_km"
                                value={formData.max_km}
                                onChange={handleChange}
                                onFocus={() => setFocusedField('max_km')}
                                onBlur={() => setFocusedField(null)}
                                className={inputClasses('max_km')}
                                placeholder="100000"
                              />
                            </div>
                          </div>
                          <div>
                            <label className={labelClasses}>Année (1ère Immat)</label>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                type="number"
                                name="first_registration"
                                value={formData.first_registration}
                                onChange={handleChange}
                                onFocus={() => setFocusedField('first_registration')}
                                onBlur={() => setFocusedField(null)}
                                className={inputClasses('first_registration')}
                                placeholder="2018"
                              />
                            </div>
                          </div>
                          <div>
                            <label className={labelClasses}>Carburant</label>
                            <div className="relative">
                              <Fuel className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <select
                                name="carburant"
                                value={formData.carburant}
                                onChange={handleChange}
                                onFocus={() => setFocusedField('carburant')}
                                onBlur={() => setFocusedField(null)}
                                className={`${inputClasses('carburant')} appearance-none`}
                              >
                                <option value="">Peu importe</option>
                                <option value="Diesel">Diesel</option>
                                <option value="Essence">Essence</option>
                                <option value="Hybride">Hybride</option>
                                <option value="Electrique">Electrique</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className={labelClasses}>Boîte de vitesse</label>
                            <div className="relative">
                              <Settings className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <select
                                name="boite"
                                value={formData.boite}
                                onChange={handleChange}
                                onFocus={() => setFocusedField('boite')}
                                onBlur={() => setFocusedField(null)}
                                className={`${inputClasses('boite')} appearance-none`}
                              >
                                <option value="">Peu importe</option>
                                <option value="Automatique">Automatique</option>
                                <option value="Manuelle">Manuelle</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className={labelClasses}>Couleur</label>
                            <div className="relative">
                              <Palette className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                type="text"
                                name="vehicle_color"
                                value={formData.vehicle_color}
                                onChange={handleChange}
                                onFocus={() => setFocusedField('vehicle_color')}
                                onBlur={() => setFocusedField(null)}
                                className={inputClasses('vehicle_color')}
                                placeholder="Noir, Gris..."
                              />
                            </div>
                          </div>
                          <div>
                            <label className={labelClasses}>Puissance Min (ch)</label>
                            <div className="relative">
                              <Gauge className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                type="number"
                                name="puissance_min"
                                value={formData.puissance_min}
                                onChange={handleChange}
                                onFocus={() => setFocusedField('puissance_min')}
                                onBlur={() => setFocusedField(null)}
                                className={inputClasses('puissance_min')}
                                placeholder="150"
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className={labelClasses}>Description / Options</label>
                          <div className="relative">
                            <FileText className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                            <textarea
                              name="description"
                              value={formData.description}
                              onChange={handleChange}
                              onFocus={() => setFocusedField('description')}
                              onBlur={() => setFocusedField(null)}
                              rows={3}
                              className={`${inputClasses('description')} resize-none`}
                              placeholder="Toit ouvrant, Pack M, Sièges chauffants..."
                            ></textarea>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-100 dark:border-gray-700 shrink-0 flex justify-between items-center">
                {step === 1 ? (
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                  >
                    Annuler
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Retour
                  </button>
                )}

                {step === 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all flex items-center gap-2"
                  >
                    Suivant
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Créer le client
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NewClientModal;