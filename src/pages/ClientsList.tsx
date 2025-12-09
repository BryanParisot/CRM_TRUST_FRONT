import {
    Edit2,
    Eye,
    Mail,
    Phone,
    Plus,
    Search,
    Trash2,
    User,
    Wallet,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import DeleteClientModal from "../components/DeleteClientModal";
import EditClientModal from "../components/EditClientModal";
import NewClientModal from "../components/NewClientModal";

interface Client {
    id: number;
    name: string;
    email: string;
    phone: string;
    marque?: string;
    modele?: string;
    max_km?: string;
    couleur?: string;
    carburant?: string;
    boite?: string;
    puissance_min?: number;
    step: number;
    budget?: string;
    description?: string;
}

const ClientsList: React.FC = () => {
    const navigate = useNavigate();
    const [clients, setClients] = useState<Client[]>([]);
    const [filteredClients, setFilteredClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [showNewClientModal, setShowNewClientModal] = useState<boolean>(false);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    // Fetch clients
    useEffect(() => {
        const fetchClients = async () => {
            try {
                setLoading(true);
                const res = await fetch("http://localhost:3000/api/clients", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (!res.ok) throw new Error("Erreur lors du chargement des clients");

                const data = await res.json();
                setClients(data);
                setFilteredClients(data);
            } catch (error: any) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, []);

    // Search filter
    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredClients(clients);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = clients.filter(
                (client) =>
                    client.name.toLowerCase().includes(query) ||
                    client.email.toLowerCase().includes(query) ||
                    client.phone.toLowerCase().includes(query)
            );
            setFilteredClients(filtered);
        }
    }, [searchQuery, clients]);

    // Get initials
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    // Get step badge color
    const getStepBadge = (step: number) => {
        const badges: { [key: number]: { label: string; color: string } } = {
            1: { label: "Étape 1", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
            2: { label: "Étape 2", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400" },
            3: { label: "Étape 3", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
            4: { label: "Étape 4", color: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400" },
            5: { label: "Étape 5", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
            6: { label: "Étape 6", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
        };
        return badges[step] || badges[1];
    };

    // Handle update client
    const handleUpdateClient = async (formData: any) => {
        if (!selectedClient) return;

        try {
            setIsUpdating(true);

            const res = await fetch(`http://localhost:3000/api/clients/${selectedClient.id}`, {
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

    // Handle delete client
    const handleDeleteClient = async () => {
        if (!selectedClient) return;

        try {
            setIsDeleting(true);

            const res = await fetch(`http://localhost:3000/api/clients/${selectedClient.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!res.ok) throw new Error("Erreur lors de la suppression");

            toast.success("Client supprimé avec succès ✅");
            setShowDeleteModal(false);
            window.location.reload();
        } catch (error: any) {
            toast.error(error.message || "Erreur lors de la suppression ❌");
        } finally {
            setIsDeleting(false);
        }
    };

    // Handle add new client
    const handleAddClient = async (formData: any) => {
        try {
            const res = await fetch("http://localhost:3000/api/clients", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Erreur lors de la création");

            toast.success("Client créé avec succès ✅");
            setShowNewClientModal(false);
            window.location.reload();
        } catch (error: any) {
            toast.error(error.message || "Erreur lors de la création ❌");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Tous les clients
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                {filteredClients.length} client{filteredClients.length > 1 ? "s" : ""} au total
                            </p>
                        </div>
                        <button
                            onClick={() => setShowNewClientModal(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg"
                        >
                            <Plus className="w-5 h-5" />
                            Nouveau client
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="mt-6 relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher par nom, email ou téléphone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <ClipLoader size={50} color="#2563EB" />
                            <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement des clients...</p>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredClients.length === 0 && (
                    <div className="text-center py-20">
                        <User className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            {searchQuery ? "Aucun client trouvé" : "Aucun client"}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {searchQuery
                                ? "Essayez une autre recherche"
                                : "Commencez par ajouter votre premier client"}
                        </p>
                        {!searchQuery && (
                            <button
                                onClick={() => setShowNewClientModal(true)}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                <Plus className="w-5 h-5" />
                                Ajouter un client
                            </button>
                        )}
                    </div>
                )}

                {/* Clients Grid */}
                {!loading && filteredClients.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredClients.map((client) => {
                            const stepBadge = getStepBadge(client.step);
                            return (
                                <div
                                    key={client.id}
                                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 overflow-hidden group"
                                >
                                    {/* Card Header */}
                                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-xl font-bold border-2 border-white/30">
                                                {getInitials(client.name)}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-white mb-1">{client.name}</h3>
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${stepBadge.color}`}>
                                                    {stepBadge.label}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-6 space-y-3">
                                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                            <Mail className="w-4 h-4 text-blue-600" />
                                            <span className="truncate">{client.email}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                            <Phone className="w-4 h-4 text-green-600" />
                                            <span>{client.phone}</span>
                                        </div>
                                        {client.budget && (
                                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                                <Wallet className="w-4 h-4 text-purple-600" />
                                                <span>{client.budget} €</span>
                                            </div>
                                        )}
                                        {(client.marque || client.modele) && (
                                            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {client.marque} {client.modele}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Card Actions */}
                                    <div className="px-6 pb-6 flex gap-2">
                                        <button
                                            onClick={() => navigate(`/client/${client.id}/profile`)}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                                        >
                                            <Eye className="w-4 h-4" />
                                            Voir
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedClient(client);
                                                setShowEditModal(true);
                                            }}
                                            className="flex items-center justify-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedClient(client);
                                                setShowDeleteModal(true);
                                            }}
                                            className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modals */}
            <NewClientModal
                isOpen={showNewClientModal}
                onClose={() => setShowNewClientModal(false)}
                onSubmit={handleAddClient}
            />

            {selectedClient && (
                <>
                    <EditClientModal
                        isOpen={showEditModal}
                        onClose={() => {
                            setShowEditModal(false);
                            setSelectedClient(null);
                        }}
                        onSubmit={handleUpdateClient}
                        clientData={{
                            name: selectedClient.name,
                            email: selectedClient.email,
                            phone: selectedClient.phone,
                            marque: selectedClient.marque || "",
                            modele: selectedClient.modele || "",
                            budget: selectedClient.budget || "",
                            max_km: selectedClient.max_km || "",
                            carburant: selectedClient.carburant || "",
                            boite: selectedClient.boite || "",
                            puissance_min: String(selectedClient.puissance_min || ""),
                            couleur: selectedClient.couleur || "",
                            description: selectedClient.description || "",
                        }}
                        isUpdating={isUpdating}
                    />

                    <DeleteClientModal
                        isOpen={showDeleteModal}
                        onClose={() => {
                            setShowDeleteModal(false);
                            setSelectedClient(null);
                        }}
                        onConfirm={handleDeleteClient}
                        clientName={selectedClient.name}
                        isDeleting={isDeleting}
                    />
                </>
            )}
        </div>
    );
};

export default ClientsList;
