import { CheckCircle2, Shield, Car, FileText, Clock, Mail } from "lucide-react";

const ClientPaymentThankYouPage: React.FC = () => {
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
                    Merci pour votre paiement ! 🎉
                </h1>

                <p className="mt-3 text-gray-600 leading-relaxed text-[15px]">
                    Votre acompte a bien été enregistré.
                    Nous passons maintenant à l'étape suivante de votre projet 🚗✨
                </p>

                {/* Bloc explication */}
                <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-5 text-left space-y-4">

                    <div className="flex items-center space-x-3">
                        <Shield className="w-6 h-6 text-blue-600" />
                        <p className="text-gray-700 text-sm">
                            Votre paiement est <strong>sécurisé et confirmé</strong>.
                        </p>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Car className="w-6 h-6 text-blue-600" />
                        <p className="text-gray-700 text-sm">
                            Nous allons vous envoyer <strong>3 véhicules sélectionnés</strong> avec des checklists détaillées.
                        </p>
                    </div>

                    <div className="flex items-center space-x-3">
                        <FileText className="w-6 h-6 text-blue-600" />
                        <p className="text-gray-700 text-sm">
                            Chaque véhicule sera accompagné d'une <strong>checklist complète de vérification</strong>.
                        </p>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Mail className="w-6 h-6 text-blue-600" />
                        <p className="text-gray-700 text-sm">
                            Notre équipe va vous <strong>contacter très rapidement</strong> pour la suite.
                        </p>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Clock className="w-6 h-6 text-blue-600" />
                        <p className="text-gray-700 text-sm">
                            Nous vous tenons <strong>informé(e) à chaque étape</strong> du processus.
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

export default ClientPaymentThankYouPage;
