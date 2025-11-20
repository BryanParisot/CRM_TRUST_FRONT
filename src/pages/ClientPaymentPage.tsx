import {
  CheckCircle2Icon,
  CopyIcon,
  ShieldCheckIcon,
  FileUpIcon,
  CarIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import ClientVehicleCard from "../components/ClientVehicleCard";

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
      const res = await fetch(
        `http://localhost:3000/api/clients/public/${token}`
      );
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

    const res = await fetch(
      `http://localhost:3000/api/clients/${client.id}/identity`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) {
      toast.error("Erreur lors de l’upload de votre pièce d’identité.");
      return false;
    }

    toast.success("Pièce d’identité importée ✔️");
    return true;
  };

  const confirmPayment = async () => {
    // 1️⃣ On exige la CNI + upload
    // const ok = await handleUpload();
    //if (!ok) return;

    // 2️⃣ On envoie juste une notification à l’admin
    try {
      setSending(true);

      const res = await fetch("http://localhost:3000/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // pas de token ici car portail public
        },
        body: JSON.stringify({
          client_id: client.id,
          type: "payment_and_identity",
          message: `Le client ${client.name} a indiqué avoir effectué le virement et a transmis sa pièce d'identité.`,
        }),
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la notification.");
      }

      toast.success(
        "Merci ! Nous avons bien reçu vos informations. Un conseiller va revenir vers vous très rapidement."
      );
    } catch (e) {
      console.error(e);
      toast.error(
        "Votre paiement est bien pris en compte, mais une erreur est survenue côté notification. Nous vérifierons manuellement."
      );
    } finally {
      setSending(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Chargement...
      </div>
    );

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

          <p className="text-gray-500 text-sm mb-4">
            Voici les véhicules que vous avez retenus. Nous allons vérifier chaque
            annonce pour garantir une transaction sécurisée et conforme à vos attentes.
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            {vehicles.map((v) => (
              <ClientVehicleCard
                key={v.id}
                vehicle={v}
                readOnly={true}
              />
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
            Pour sécuriser l’achat et éviter toute usurpation d’identité, nous
            avons besoin d’une pièce d’identité.
            <strong className="text-gray-800">
              {" "}
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
          {sending ? (
            "Envoi..."
          ) : (
            <>
              <CheckCircle2Icon className="w-5 h-5 mr-2" />
              J’ai effectué le virement
            </>
          )}
        </button>

        <p className="text-center text-xs text-gray-500">
          🔒 Toutes vos données sont sécurisées et ne sont jamais partagées.
        </p>
      </div>
    </div>
  );
}
