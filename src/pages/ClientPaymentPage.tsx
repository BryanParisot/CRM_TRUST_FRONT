import {
    CheckCircle2Icon,
    CopyIcon,
    ShieldCheckIcon,
    FileUpIcon,
    CarIcon,
    GaugeIcon,
    EuroIcon,
    FuelIcon,
    CalendarIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

export default function ClientPaymentPage() {
    const { token } = useParams();
    const [client, setClient] = useState<any>(null);
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    const [frontID, setFrontID] = useState<File | null>(null);
    const [backID, setBackID] = useState<File | null>(null);

    const rib = {
        holder: "AUTOIMPORT FRANCE",
        iban: "FR76 1027 8065 0200 0102 0410 182",
        bic: "CMCIFR2A",
    };

    useEffect(() => {
        const load = async () => {
            const res = await fetch(`http://localhost:3000/api/clients/public/${token}`);
            const data = await res.json();

            setClient(data.client);
            setVehicles(data.vehicles.filter((v: any) => v.selected_by === "client"));
            setLoading(false);
        };

        load();
    }, [token]);

    const copy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copié !");
    };

    const handleUpload = async () => {
        if (!frontID || !backID) {
            toast.error("Veuillez importer les deux faces de votre pièce d’identité.");
            return false;
        }

        const formData = new FormData();
        formData.append("front", frontID);
        formData.append("back", backID);

        const res = await fetch(`http://localhost:3000/api/clients/${client.id}/identity`, {
            method: "POST",
            body: formData,
        });

        if (!res.ok) {
            toast.error("Erreur lors de l’upload");
            return false;
        }

        toast.success("Pièce d’identité importée ✔️");
        return true;
    };

    const confirmPayment = async () => {
        if (!(await handleUpload())) return;

        setSending(true);

        const res = await fetch(
            `http://localhost:3000/api/clients/${client.id}/steps`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    to_step: 4,
                    changed_by: "client",
                }),
            }
        );

        setSending(false);

        if (!res.ok) {
            toast.error("Erreur");
            return;
        }

        toast.success("Merci ! Nous revenons vers vous très rapidement.");
        window.location.reload();
    };

    if (loading)
        return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-3xl space-y-8">

                {/* HEADER */}
                <div className="bg-blue-600 text-white p-5 rounded-xl text-center space-y-1">
                    <h1 className="text-xl font-semibold">Paiement de l’acompte</h1>
                    <p className="opacity-90 text-sm">
                        Pour finaliser votre dossier, merci de suivre les étapes ci-dessous.
                    </p>
                </div>

                {/* VEHICULES */}
                <div>
                    <h2 className="font-semibold text-lg mb-2 flex items-center gap-2">
                        <CarIcon className="w-5 h-5 text-blue-600" />
                        Vos véhicules sélectionnés
                    </h2>

                    <div className="grid sm:grid-cols-2 gap-4">
                        {vehicles.map((v) => (
                            <div key={v.id} className="border rounded-xl overflow-hidden shadow">
                                <img src={v.image} className="w-full h-32 object-cover" />
                                <div className="p-3 text-sm space-y-1">
                                    <p className="font-semibold">{v.title}</p>

                                    <div className="flex items-center text-gray-700 gap-1">
                                        <EuroIcon className="w-4 h-4 text-green-600" />
                                        {v.price}
                                    </div>

                                    <div className="flex items-center text-gray-600 gap-1">
                                        <GaugeIcon className="w-4 h-4 text-blue-600" />
                                        {v.mileage}
                                    </div>

                                    <div className="flex items-center text-gray-600 gap-1">
                                        <FuelIcon className="w-4 h-4 text-orange-600" />
                                        {v.fuel}
                                    </div>

                                    <div className="flex items-center text-gray-600 gap-1">
                                        <CalendarIcon className="w-4 h-4" />
                                        {v.year}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* IDENTITÉ */}
                <div>
                    <h2 className="font-semibold text-lg mb-2 flex items-center gap-2">
                        <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
                        Vérification d’identité
                    </h2>

                    <p className="text-gray-600 text-sm mb-3">
                        Pour sécuriser l’achat et éviter toute usurpation d’identité, nous avons
                        besoin d’une pièce d’identité.
                        <strong className="text-gray-800">
                            Vos documents sont chiffrés et totalement confidentiels.
                        </strong>
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <label className="border rounded-lg p-4 cursor-pointer text-center hover:bg-gray-50">
                            <FileUpIcon className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                            <span className="text-sm font-medium">Recto</span>
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e) => setFrontID(e.target.files?.[0] || null)}
                            />
                            {frontID && (
                                <p className="text-xs text-green-600 mt-1">Importé ✔️</p>
                            )}
                        </label>

                        <label className="border rounded-lg p-4 cursor-pointer text-center hover:bg-gray-50">
                            <FileUpIcon className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                            <span className="text-sm font-medium">Verso</span>
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e) => setBackID(e.target.files?.[0] || null)}
                            />
                            {backID && (
                                <p className="text-xs text-green-600 mt-1">Importé ✔️</p>
                            )}
                        </label>
                    </div>
                </div>

                {/* RIB */}
                <div>
                    <h2 className="font-semibold text-lg mb-2">Informations bancaires</h2>

                    <div className="bg-gray-50 border rounded-xl p-4 text-sm space-y-3">
                        <div className="flex justify-between">
                            <span>Bénéficiaire :</span>
                            <span className="font-semibold">{rib.holder}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span>IBAN :</span>
                            <span className="font-semibold">{rib.iban}</span>
                            <button onClick={() => copy(rib.iban)}>
                                <CopyIcon className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex justify-between items-center">
                            <span>BIC :</span>
                            <span className="font-semibold">{rib.bic}</span>
                            <button onClick={() => copy(rib.bic)}>
                                <CopyIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* VALIDATE */}
                <button
                    onClick={confirmPayment}
                    disabled={sending}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex justify-center font-semibold"
                >
                    {sending ? "Envoi..." : (
                        <>
                            <CheckCircle2Icon className="w-5 h-5 mr-2" />
                            J’ai effectué le virement
                        </>
                    )}
                </button>

                {/* MESSAGE RASSURANT */}
                <p className="text-center text-xs text-gray-500">
                    🔒 Toutes vos données sont sécurisées et ne sont jamais partagées.
                </p>
            </div>
        </div>
    );
}
