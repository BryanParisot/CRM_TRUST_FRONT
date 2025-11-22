import { AlertTriangle, X } from "lucide-react";
import React from "react";

interface DeleteClientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    clientName: string;
    isDeleting?: boolean;
}

const DeleteClientModal: React.FC<DeleteClientModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    clientName,
    isDeleting = false,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                    disabled={isDeleting}
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Icon */}
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full">
                    <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-2">
                    Supprimer le client
                </h3>

                {/* Message */}
                <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                    Êtes-vous sûr de vouloir supprimer le client{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">
                        {clientName}
                    </span>{" "}
                    ? Cette action est irréversible.
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isDeleting ? "Suppression..." : "Supprimer"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteClientModal;
