import {
    CheckCircle2Icon,
    ShieldCheckIcon,
    ArrowRightIcon,
    XCircleIcon,
    AlertCircleIcon
} from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import ClientVehicleCard, { Vehicle } from "../components/ClientVehicleCard";
import ClientSelectionLoadingModal from "../components/ClientSelectionLoadingModal";

interface PublicChecklistItem {
    id: number;
    name: string;
    status: "validated" | "pending" | "issue" | "rejected";
}

interface PublicVehicle extends Vehicle {
    client_id: number;
    checklist: PublicChecklistItem[];
}

interface PublicClientData {
    id: number;
    name: string;
    email: string;
    phone: string;
    step: number;
}

interface PublicApiResponse {
    client: PublicClientData;
    vehicles: PublicVehicle[];
}

export default function ClientChecklistPage() {
    const { token } = useParams();
    const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
    const [confirming, setConfirming] = useState(false);
    const [showLoadingModal, setShowLoadingModal] = useState(false);

    const [clientData, setClientData] = useState<PublicClientData | null>(null);
    const [vehicles, setVehicles] = useState<PublicVehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/clients/public/${token}`);
                if (!response.ok) {
                    throw new Error("Erreur lors du chargement des données");
                }
                const data: PublicApiResponse = await response.json();
                setClientData(data.client);
                setVehicles(data.vehicles);
            } catch (err) {
                console.error(err);
                setError("Impossible de charger les véhicules. Veuillez vérifier votre lien.");
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchData();
        }
    }, [token]);

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

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'validated':
                return <CheckCircle2Icon className="w-4 h-4 text-green-600" />;
            case 'pending':
                return <AlertCircleIcon className="w-4 h-4 text-yellow-500" />;
            case 'issue':
                return <AlertCircleIcon className="w-4 h-4 text-orange-500" />;
            case 'rejected':
                return <XCircleIcon className="w-4 h-4 text-red-500" />;
            default:
                return <div className="w-4 h-4 rounded-full bg-gray-200" />;
        }
    };

    const getStatusBgColor = (status: string) => {
        switch (status) {
            case 'validated': return 'bg-green-100';
            case 'pending': return 'bg-yellow-100';
            case 'issue': return 'bg-orange-100';
            case 'rejected': return 'bg-red-100';
            default: return 'bg-gray-100';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
                    <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Une erreur est survenue</h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

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
                            Bonjour {clientData?.name.split(' ')[0]} 👋
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
                        {vehicles.map((vehicle) => {
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
                                            {vehicle.checklist && vehicle.checklist.length > 0 ? (
                                                vehicle.checklist.map((item) => (
                                                    <li key={item.id} className="flex items-start gap-2.5 text-sm text-gray-700">
                                                        <div className={`mt-0.5 w-4 h-4 rounded-full ${getStatusBgColor(item.status)} flex items-center justify-center flex-shrink-0`}>
                                                            {getStatusIcon(item.status)}
                                                        </div>
                                                        <span className="leading-tight">{item.name}</span>
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="text-sm text-gray-500 italic">Aucun point de contrôle disponible.</li>
                                            )}
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
