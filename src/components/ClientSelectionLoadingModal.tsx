import { motion } from "framer-motion";
import { Car } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
    isOpen: boolean;
    onFinish: () => void;
}

const messages = [
    "On prépare votre sélection personnalisée… 🚗✨",
    "Nos garages partenaires vérifient les disponibilités… 🔧",
    "On analyse les véhicules retenus… 👀",
    "Encore un instant, on sécurise tout pour vous… 🔒",
];

export default function ClientSelectionLoadingModal({ isOpen, onFinish }: Props) {
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState(messages[0]);

    useEffect(() => {
        if (!isOpen) return;

        const interval = setInterval(() => {
            setProgress((p) => Math.min(p + Math.random() * 15, 100));
        }, 400);

        let i = 0;
        const msgInterval = setInterval(() => {
            i = (i + 1) % messages.length;
            setMessage(messages[i]);
        }, 1400);

        return () => {
            clearInterval(interval);
            clearInterval(msgInterval);
        };
    }, [isOpen]);

    // Redirection lorsque terminé
    useEffect(() => {
        if (progress >= 100) {
            setTimeout(() => {
                onFinish();
            }, 600);
        }
    }, [progress]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
                className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl w-[90%] max-w-md text-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
            >
                {/* Icon */}
                <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    className="mx-auto bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-md"
                >
                    <Car className="w-8 h-8" />
                </motion.div>

                {/* Message */}
                <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium text-sm">
                    {message}
                </p>

                {/* Progress Bar */}
                <div className="w-full mt-6 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <motion.div
                        className="h-2 bg-blue-600 rounded-full"
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: "easeOut" }}
                    />
                </div>

                <p className="text-xs text-gray-400 mt-2">{Math.floor(progress)}%</p>
            </motion.div>
        </div>
    );
}
