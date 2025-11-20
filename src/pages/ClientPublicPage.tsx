import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import ClientSelectionLoadingModal from "../components/ClientSelectionLoadingModal";
import ClientVehicleCard, { Vehicle } from "../components/ClientVehicleCard";



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
    const [showLoadingModal, setShowLoadingModal] = useState(false);

    // ===============================
    // 🔵 Load public data
    // ===============================
    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/clients/public/${token}`);
                const data = await res.json();

                if (!res.ok) throw new Error(data.message || "Lien invalide");

                setClient(data.client);
                setVehicles(data.vehicles);

                const already = data.vehicles
                    .filter((v: Vehicle) => v.selected_by === "client")
                    .map((v) => v.id);

                setSelectedIds(already);
            } catch (err: any) {
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (token) loadData();
    }, [token]);

    // ===============================
    // 🔵 Toggle vehicle selection
    // ===============================
    const toggleSelect = (id: number) => {
        setSelectedIds((prev) => {
            if (prev.includes(id)) return prev.filter((v) => v !== id);
            if (prev.length >= 3) {
                toast.error("Vous pouvez sélectionner jusqu’à 3 véhicules maximum.");
                return prev;
            }
            return [...prev, id];
        });
    };

    // ===============================
    // 🔵 Save selection
    // ===============================
    const handleSave = async () => {
        if (selectedIds.length === 0) {
            toast.error("Merci de sélectionner au moins un véhicule.");
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
            if (!res.ok) throw new Error(data.message);

            // show loading animation modal
            setShowLoadingModal(true);
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center">
                Chargement...
            </div>
        );

    if (!client)
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                Lien invalide.
            </div>
        );

    // ===============================
    // 🔥 UI RENDER
    // ===============================
    return (
        <>
            {/* PREMIUM ANIMATED MODAL */}
            <ClientSelectionLoadingModal
                isOpen={showLoadingModal}
                onFinish={() => {
                    window.location.href = `/client-link/${token}/confirmation`;
                }}
            />

            <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
                <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-8">

                    {/* HEADER */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Bonjour {client.name} 👋
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">
                                Sélectionnez jusqu’à <strong>3 véhicules</strong> que vous souhaitez
                                que nous vérifions pour vous.
                            </p>
                        </div>
                    </div>

                    {/* TEXT RASSURANT */}
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-sm text-blue-900 mb-6 leading-relaxed">
                        🛡️ <strong>Notre mission :</strong> sécuriser votre achat automobile à 100%.
                        Nous analysons chaque véhicule : historique, entretien, incohérences possibles,
                        défauts, prix, négociation et viabilité de l’importation.
                        <br />
                        <strong>Votre confort & sécurité sont notre priorité.</strong>
                    </div>

                    {/* VEHICLES GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vehicles.map((v) => {
                            const selected = selectedIds.includes(v.id);

                            return (

                                <ClientVehicleCard
                                    key={v.id}
                                    vehicle={v}
                                    isSelected={selected}
                                    onToggleSelect={toggleSelect}
                                />
                            );
                        })}
                    </div>

                    {/* VALIDATE */}
                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md font-medium transition"
                        >
                            {saving ? "Enregistrement..." : "Valider ma sélection"}
                        </button>
                    </div>

                    {/* FOOTER RASSURANT */}
                    <p className="mt-6 text-center text-xs text-gray-500">
                        🔒 Toutes vos données sont sécurisées, cryptées et ne sont jamais partagées.
                    </p>
                </div>
            </div>
        </>
    );
};

export default ClientPublicPage;
