import {
    CheckCircle2Icon,
    ShieldCheckIcon,
    AlertTriangleIcon,
    CarIcon,
    ArrowRightIcon
} from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import ClientVehicleCard, { Vehicle } from "../components/ClientVehicleCard";
import ClientSelectionLoadingModal from "../components/ClientSelectionLoadingModal";

// Mock checklist data
const MOCK_CHECKLIST = [
    { id: "check-1-1", name: "Kilométrage certifié", status: "validated" },
    { id: "check-1-2", name: "Vidange à jour", status: "validated" },
    { id: "check-1-3", name: "Distribution vérifiée", status: "validated" },
    { id: "check-1-4", name: "CarVertical ajouté", status: "validated" },
    { id: "check-1-5", name: "Contrôle technique à jour", status: "validated" },
    { id: "check-1-6", name: "Freins vérifiés", status: "validated" },
    { id: "check-1-7", name: "Pneus vérifiés", status: "validated" },
    { id: "check-1-8", name: "Climatisation fonctionnelle", status: "validated" },
    { id: "check-1-9", name: "Batterie testée", status: "validated" },
];

// Mock vehicles data
const MOCK_VEHICLES: Vehicle[] = [
    {
        id: 101,
        title: "Audi A3 Sportback S-Line",
        price: "24 900 €",
        mileage: "45 000 km",
        year: "2020",
        fuel: "Diesel",
        gearbox: "Automatique",
        power: "150",
        image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        link: "#",
    },
    {
        id: 102,
        title: "BMW Série 1 M Sport",
        price: "26 500 €",
        mileage: "38 000 km",
        year: "2021",
        fuel: "Essence",
        gearbox: "Automatique",
        power: "140",
        image: "https://images.unsplash.com/photo-1556189250-72ba954522af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        link: "#",
    },
    {
        id: 103,
        title: "Mercedes Classe A AMG Line",
        price: "28 900 €",
        mileage: "25 000 km",
        year: "2022",
        fuel: "Hybride",
        gearbox: "Automatique",
        power: "163",
        image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        link: "#",
    }
];

export default function ClientChecklistPage() {
    const { token } = useParams();
    const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
    const [confirming, setConfirming] = useState(false);
    const [showLoadingModal, setShowLoadingModal] = useState(false);

    const handleSelect = (id: number) => {
        setSelectedVehicleId(id);
    };

    const handleConfirm = async () => {
        if (!selectedVehicleId) {
            toast.error("Veuillez sélectionner un véhicule.");
            return;
        }

        setConfirming(true);
        // Simulate API call
        setTimeout(() => {
            setConfirming(false);
            setShowLoadingModal(true);
        }, 1500);
    };

    return (
        <>
            <ClientSelectionLoadingModal
                isOpen={showLoadingModal}
                onFinish={() => {
                    window.location.href = `/client-link/${token}/success`;
                }}
            />
            <div className="min-h-screen bg-gray-50 py-10 px-4 flex flex-col items-center">
                <div className="w-full max-w-6xl space-y-8">

                    {/* HEADER */}
                    <div className="text-center space-y-3">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Validation finale du véhicule 🚗
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Voici les véhicules que nous avons audités pour vous.
                            Consultez les points de contrôle validés et choisissez celui que vous souhaitez importer.
                        </p>
                    </div>

                    {/* RASSURANCE BANNER */}
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3 text-green-800 text-sm">
                        <ShieldCheckIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div>
                            <strong>Inspection complète effectuée :</strong> Tous les véhicules ci-dessous ont passé avec succès
                            notre checklist de sécurité et de qualité. Vous pouvez choisir en toute confiance.
                        </div>
                    </div>

                    {/* VEHICLES & CHECKLISTS */}
                    <div className="grid lg:grid-cols-3 gap-8">
                        {MOCK_VEHICLES.map((vehicle) => {
                            const isSelected = selectedVehicleId === vehicle.id;

                            return (
                                <div
                                    key={vehicle.id}
                                    className={`flex flex-col gap-4 transition-all duration-300 ${isSelected ? 'transform scale-[1.02]' : 'opacity-90 hover:opacity-100'}`}
                                >
                                    {/* VEHICLE CARD */}
                                    <div onClick={() => handleSelect(vehicle.id)}>
                                        <ClientVehicleCard
                                            vehicle={vehicle}
                                            isSelected={isSelected}
                                            readOnly={true} // We handle selection via wrapper click to style the whole column
                                        />
                                    </div>

                                    {/* CHECKLIST */}
                                    <div className={`bg-white rounded-xl shadow-sm border p-5 flex-1 ${isSelected ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'}`}>
                                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <CheckCircle2Icon className="w-5 h-5 text-green-600" />
                                            Points de contrôle
                                        </h3>

                                        <ul className="space-y-3">
                                            {MOCK_CHECKLIST.map((item) => (
                                                <li key={item.id} className="flex items-start gap-2.5 text-sm text-gray-700">
                                                    <div className="mt-0.5 w-4 h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                                        <CheckCircle2Icon className="w-3 h-3 text-green-600" />
                                                    </div>
                                                    <span className="leading-tight">{item.name}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <button
                                            onClick={() => handleSelect(vehicle.id)}
                                            className={`w-full mt-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-200
                                            ${isSelected
                                                    ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            {isSelected ? 'Véhicule sélectionné' : 'Choisir ce véhicule'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* CONFIRMATION ACTION */}
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg lg:static lg:bg-transparent lg:border-none lg:shadow-none lg:p-0 flex justify-center mt-12">
                        <button
                            onClick={handleConfirm}
                            disabled={!selectedVehicleId || confirming}
                            className={`
                            px-8 py-4 rounded-xl font-bold text-lg shadow-xl flex items-center gap-3 transition-all transform
                            ${selectedVehicleId
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-105 hover:shadow-2xl'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }
                        `}
                        >
                            {confirming ? 'Validation en cours...' : (
                                <>
                                    Valider mon choix final
                                    <ArrowRightIcon className="w-6 h-6" />
                                </>
                            )}
                        </button>
                    </div>

                    {/* Spacer for mobile fixed bottom bar */}
                    <div className="h-24 lg:hidden"></div>

                </div>
            </div>
        </>
    );
}
