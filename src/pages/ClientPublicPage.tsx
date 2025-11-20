import {
    CalendarIcon,
    CheckCircle2Icon,
    EuroIcon,
    ExternalLink,
    FuelIcon,
    GaugeIcon
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
    fuel: string;
    gearbox?: string;
    power?: string;
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
                                <div
                                    key={v.id}
                                    onClick={() => toggleSelect(v.id)}
                                    className={`
        cursor-pointer bg-white rounded-2xl overflow-hidden
        shadow-md hover:shadow-2xl transition-all duration-300
        border ${selected ? "border-blue-600 ring-2 ring-blue-400" : "border-gray-200 hover:border-blue-300"}
        group relative
    `}
                                >
                                    {/* IMAGE SECTION */}
                                    <div className="relative h-44 w-full overflow-hidden">
                                        <img
                                            src={v.image}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />

                                        {/* BADGE SELECTED */}
                                        {selected && (
                                            <div className="absolute top-3 right-3 bg-blue-600/90 backdrop-blur-md 
            text-white px-3 py-1 rounded-full text-xs flex items-center gap-1 shadow-lg">
                                                <CheckCircle2Icon className="w-4 h-4" />
                                                Sélectionné
                                            </div>
                                        )}
                                    </div>

                                    {/* CONTENT */}
                                    <div className="p-5 space-y-4">

                                        {/* TITLE */}
                                        <p className="font-semibold text-gray-900 text-base leading-tight line-clamp-2 min-h-[40px]">
                                            {v.title}
                                        </p>

                                        {/* INFO GRID */}
                                        <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">

                                            <div className="flex items-center gap-2">
                                                <EuroIcon className="w-4 h-4 text-green-600" />
                                                <span className="font-medium">{v.price}</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <GaugeIcon className="w-4 h-4 text-blue-600" />
                                                <span>{v.mileage}</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <FuelIcon className="w-4 h-4 text-orange-500" />
                                                <span>{v.fuel}</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <CalendarIcon className="w-4 h-4 text-gray-500" />
                                                <span>{v.year}</span>
                                            </div>

                                            {v.power && (
                                                <div className="flex items-center gap-2">
                                                    ⚡ <span>{v.power} ch</span>
                                                </div>
                                            )}

                                            {v.gearbox && (
                                                <div className="flex items-center gap-2">
                                                    🔧 <span>{v.gearbox}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* CTA "Voir l'annonce" */}
                                        <a
                                            href={v.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block w-full text-center mt-3 py-2 text-sm font-medium
            text-blue-700 border border-blue-200 rounded-lg 
            hover:bg-blue-50 hover:border-blue-300 transition-all"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            Voir l’annonce complète
                                            <ExternalLink className="w-4 h-4 inline-block ml-1" />
                                        </a>
                                    </div>
                                </div>
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
