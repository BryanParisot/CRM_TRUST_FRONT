// --- imports ---
import {
    CarIcon,
    CheckCircle2Icon,
    EuroIcon,
    ExternalLink,
    GaugeIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import ClientSelectionLoadingModal from "../components/ClientSelectionLoadingModal";

interface Vehicle {
    id: number;
    title: string;
    price: string;
    mileage: string;
    year: string;
    image: string;
    link: string;
    selected_by?: string;
}

interface ClientPublic {
    id: number;
    name: string;
    email: string;
    phone: string;
    step: number;
}

const ClientPublicPage: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const [client, setClient] = useState<ClientPublic | null>(null);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // 🔥 modal loading
    const [showLoadingModal, setShowLoadingModal] = useState(false);

    // Load data
    useEffect(() => {
        const fetchPublicData = async () => {
            try {
                const res = await fetch(
                    `http://localhost:3000/api/clients/public/${token}`
                );
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Lien invalide");

                setClient(data.client);
                setVehicles(data.vehicles);

                const already = data.vehicles
                    .filter((v: Vehicle) => v.selected_by === "client")
                    .map((v: Vehicle) => v.id);

                setSelectedIds(already);
            } catch (error: any) {
                toast.error(error.message || "Erreur de chargement.");
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchPublicData();
    }, [token]);

    // Toggle selection
    const toggleSelect = (id: number) => {
        setSelectedIds((prev) => {
            if (prev.includes(id)) return prev.filter((v) => v !== id);
            if (prev.length >= 3) {
                toast.error("Vous ne pouvez sélectionner que 3 véhicules maximum.");
                return prev;
            }
            return [...prev, id];
        });
    };

    // SAVE with beautiful modal
    const handleSave = async () => {
        if (selectedIds.length === 0) {
            toast.error("Sélectionnez au moins un véhicule.");
            return;
        }

        try {
            setSaving(true);
            const res = await fetch(
                `http://localhost:3000/api/clients/public/${token}/select`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ vehicle_ids: selectedIds }),
                }
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Erreur serveur");

            // 🔥 Show animated modal
            setShowLoadingModal(true);

        } catch (error: any) {
            toast.error(error.message || "Erreur lors de l’enregistrement.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;

    if (!client) return <div className="min-h-screen flex items-center justify-center text-red-500">Lien invalide.</div>;

    return (
        <>
            {/* 🔥 Modal premium */}
            <ClientSelectionLoadingModal
                isOpen={showLoadingModal}
                onFinish={() => {
                    window.location.href = `/client-link/${token}/confirmation`;
                }}
            />

            <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4">
                <div className="w-full max-w-5xl bg-white rounded-2xl shadow-md p-6">

                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900">
                                Bonjour {client.name} 👋
                            </h1>
                            <p className="text-sm text-gray-500">
                                Sélectionnez jusqu’à <strong>3 véhicules</strong>.
                            </p>
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {vehicles.map((v) => {
                            const selected = selectedIds.includes(v.id);
                            return (
                                <div
                                    key={v.id}
                                    onClick={() => toggleSelect(v.id)}
                                    className={`border rounded-xl cursor-pointer shadow-sm hover:shadow-lg transition ${selected ? "ring-2 ring-blue-500" : ""}`}
                                >
                                    <img src={v.image} className="w-full h-40 object-cover" />
                                    <div className="p-3 space-y-1 text-sm">
                                        <div className="font-semibold">{v.title}</div>
                                        <div className="flex items-center text-xs">
                                            <EuroIcon className="w-3 h-3" /> {v.price}
                                        </div>
                                        <div className="flex items-center text-xs">
                                            <GaugeIcon className="w-3 h-3" /> {v.mileage}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Validate */}
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Valider ma sélection
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ClientPublicPage;