import {
    ArrowLeft,
    BadgeCheck,
    Car,
    Cog,
    Edit2,
    Fuel,
    Gauge,
    Mail,
    Palette,
    Phone,
    Trash2,
    User,
    Wallet,
    Zap,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import DeleteClientModal from "../components/DeleteClientModal";
import EditClientModal from "../components/EditClientModal";

interface ClientData {
    id: string;
    name: string;
    email: string;
    phone: string;
    marque: string;
    modele: string;
    max_km: string;
    couleur: string;
    carburant: string;
    boite: string;
    puissance_min: number;
    budget: string;
    description: string;
    premiere_immat?: string;
}

const ClientProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [clientData, setClientData] = useState<ClientData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    // Fetch client data
    useEffect(() => {
        const fetchClient = async () => {
            try {
                setLoading(true);
                const res = await fetch(`http://localhost:3000/api/clients/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (!res.ok) throw new Error("Erreur lors du chargement du client");

                const data = await res.json();
                setClientData(data);
            } catch (err: any) {
                setError(err.message);
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchClient();
    }, [id]);

    // Update client
    const handleUpdateClient = async (formData: any) => {
        try {
            setIsUpdating(true);

            const res = await fetch(`http://localhost:3000/api/clients/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Erreur lors de la mise à jour");

            toast.success("Client modifié avec succès ✅");
            setShowEditModal(false);
            window.location.reload();
        } catch (error: any) {
            toast.error(error.message || "Erreur lors de la mise à jour ❌");
        } finally {
            setIsUpdating(false);
        }
    };

    // Delete client
    const handleDeleteClient = async () => {
        try {
            setIsDeleting(true);

            const res = await fetch(`http://localhost:3000/api/clients/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!res.ok) throw new Error("Erreur lors de la suppression");

            toast.success("Client supprimé avec succès ✅");
            setShowDeleteModal(false);
            navigate("/");
        } catch (error: any) {
            toast.error(error.message || "Erreur lors de la suppression ❌");
        } finally {
            setIsDeleting(false);
        }
    };

    // Get initials from name
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    // Get badge color based on fuel type
    const getFuelBadgeColor = (fuel: string) => {
        const colors: { [key: string]: string } = {
            Essence: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
            Diesel: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
            Hybride: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
            Électrique: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
        };
        return colors[fuel] || "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <ClipLoader size={50} color="#2563EB" />
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement du profil...</p>
                </div>
            </div>
        );
    }

    if (error || !clientData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-500 text-lg">{error || "Client non trouvé"}</p>
                    <button
                        onClick={() => navigate("/")}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Retour au tableau de bord
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate("/")}
                    className="mb-6 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Retour au tableau de bord
                </button>

                {/* Header Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                                {getInitials(clientData.name)}
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 shadow-lg">
                                <BadgeCheck className="w-5 h-5 text-white" />
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                {clientData.name}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center md:justify-start gap-2">
                                <Mail className="w-4 h-4" />
                                {clientData.email}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowEditModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg"
                            >
                                <Edit2 className="w-4 h-4" />
                                Modifier
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-md hover:shadow-lg"
                            >
                                <Trash2 className="w-4 h-4" />
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Contact Information */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-600" />
                            Informations de contact
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <Mail className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{clientData.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <Phone className="w-5 h-5 text-green-600" />
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Téléphone</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{clientData.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <Wallet className="w-5 h-5 text-purple-600" />
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Budget</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{clientData.budget} €</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Preferences */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Car className="w-5 h-5 text-blue-600" />
                            Préférences véhicule
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <Car className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Marque & Modèle</p>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {clientData.marque} {clientData.modele}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <Gauge className="w-5 h-5 text-orange-600" />
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Kilométrage Max</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{clientData.max_km} km</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <Palette className="w-5 h-5 text-pink-600" />
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Couleur</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{clientData.couleur}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Technical Specifications */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Cog className="w-5 h-5 text-blue-600" />
                            Caractéristiques techniques
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Fuel className="w-5 h-5 text-orange-600" />
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Carburant</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{clientData.carburant}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getFuelBadgeColor(clientData.carburant)}`}>
                                    {clientData.carburant}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Cog className="w-5 h-5 text-blue-600" />
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Boîte de vitesse</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{clientData.boite}</p>
                                    </div>
                                </div>
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                    {clientData.boite}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <Zap className="w-5 h-5 text-yellow-600" />
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Puissance minimale</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{clientData.puissance_min} CV</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Notes & Détails
                        </h2>
                        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border-l-4 border-blue-600">
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                {clientData.description || "Aucune description disponible."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <EditClientModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                onSubmit={handleUpdateClient}
                clientData={{
                    name: clientData.name,
                    email: clientData.email,
                    phone: clientData.phone,
                    marque: clientData.marque,
                    modele: clientData.modele,
                    budget: clientData.budget,
                    max_km: clientData.max_km,
                    carburant: clientData.carburant,
                    boite: clientData.boite,
                    puissance_min: String(clientData.puissance_min),
                    couleur: clientData.couleur,
                    description: clientData.description,
                    premiere_immat: clientData.premiere_immat || "",
                }}
                isUpdating={isUpdating}
            />

            <DeleteClientModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteClient}
                clientName={clientData.name}
                isDeleting={isDeleting}
            />
        </div>
    );
};

export default ClientProfile;
