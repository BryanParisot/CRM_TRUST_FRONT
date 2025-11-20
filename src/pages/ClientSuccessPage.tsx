import { CheckCircle2, Shield, HeartHandshake, FileText, Clock, CreditCard } from "lucide-react";

const ClientSuccessPage: React.FC = () => {
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
                    Félicitations ! 🎉
                </h1>

                <p className="mt-3 text-gray-600 leading-relaxed text-[15px]">
                    Votre choix de véhicule a bien été enregistré !
                    Nous allons maintenant prendre en charge votre dossier 🚗✨
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
                        <HeartHandshake className="w-6 h-6 text-blue-600" />
                        <p className="text-gray-700 text-sm">
                            Un de nos conseillers va vous <strong>recontacter très rapidement</strong> pour valider les détails.
                        </p>
                    </div>

                    <div className="flex items-center space-x-3">
                        <CreditCard className="w-6 h-6 text-blue-600" />
                        <p className="text-gray-700 text-sm">
                            Vous recevrez un <strong>lien de paiement sécurisé</strong> pour régler l'acompte ou la prestation.
                        </p>
                    </div>

                    <div className="flex items-center space-x-3">
                        <FileText className="w-6 h-6 text-blue-600" />
                        <p className="text-gray-700 text-sm">
                            Nous vous indiquerons les <strong>documents à fournir</strong> pour entamer les démarches auprès du garage.
                        </p>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Clock className="w-6 h-6 text-blue-600" />
                        <p className="text-gray-700 text-sm">
                            Nous vous tenons <strong>informé(e) étape par étape</strong>.
                        </p>
                    </div>
                </div>

                {/* Footer note */}
                <p className="mt-6 text-xs text-gray-400">
                    Merci de votre confiance. À très bientôt !
                </p>
            </div>
        </div>
    );
};

export default ClientSuccessPage;
