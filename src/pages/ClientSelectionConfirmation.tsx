import { CheckCircle2, Shield, HeartHandshake, Car, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const ClientSelectionConfirmation: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
            <div className="bg-white shadow-2xl rounded-2xl max-w-xl w-full p-10 text-center border border-blue-100">

                {/* Icone */}
                <div className="flex justify-center mb-4">
                    <div className="bg-blue-600 text-white p-4 rounded-full shadow-lg">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    Sélection enregistrée 🎉
                </h1>

                <p className="mt-3 text-gray-600 leading-relaxed text-[15px]">
                    Merci d’avoir fait votre sélection !
                    Vous êtes maintenant à un pas de sécuriser votre futur véhicule 🚗✨
                </p>

                {/* Bloc explication */}
                <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-5 text-left space-y-4">

                    <div className="flex items-center space-x-3">
                        <Shield className="w-6 h-6 text-blue-600" />
                        <p className="text-gray-700 text-sm">
                            Notre priorité est que <strong>chaque achat se passe en sérénité</strong>.
                        </p>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Car className="w-6 h-6 text-blue-600" />
                        <p className="text-gray-700 text-sm">
                            Dès réception de votre acompte, nous lançons la
                            <strong> vérification technique complète (40+ points)</strong>.
                        </p>
                    </div>

                    <div className="flex items-center space-x-3">
                        <HeartHandshake className="w-6 h-6 text-blue-600" />
                        <p className="text-gray-700 text-sm">
                            Nous échangeons directement avec nos garages partenaires pour
                            <strong>sécuriser le véhicule</strong> choisi.
                        </p>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Clock className="w-6 h-6 text-blue-600" />
                        <p className="text-gray-700 text-sm">
                            Vous recevrez un <strong>lien de paiement sécurisé</strong> très bientôt.
                        </p>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-10">
                    <Link
                        to="/"
                        className="inline-flex px-8 py-3 bg-blue-600 text-white rounded-xl font-medium shadow-lg hover:bg-blue-700 transition-all"
                    >
                        Revenir à l’accueil
                    </Link>
                </div>

                {/* Footer note */}
                <p className="mt-6 text-xs text-gray-400">
                    Nous vous tenons informé(e) étape par étape.
                </p>
            </div>
        </div>
    );
};

export default ClientSelectionConfirmation;
