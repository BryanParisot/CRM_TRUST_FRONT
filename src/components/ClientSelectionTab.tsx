import React, { useEffect, useState } from "react";
import {
  EuroIcon,
  GaugeIcon,
  FuelIcon,
  CogIcon,
  ZapIcon,
  ExternalLink,
} from "lucide-react";

interface Vehicle {
  id: string;
  client_id?: number;
  title: string;
  price: string;
  mileage: number | string;
  year: number | string;
  image: string;
  link: string;
  fuel?: string;
  gearbox?: string;
  power?: string;
  isClientSelected?: boolean;
  selected_by?: string;
}

interface ClientSelectionAdminTabProps {
  vehicleOptions: Vehicle[];
  formatMileage: (mileage: number | string) => string;
}

const ClientSelectionAdminTab: React.FC<ClientSelectionAdminTabProps> = ({
  vehicleOptions,
}) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(vehicleOptions);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setVehicles(vehicleOptions);
  }, [vehicleOptions]);

  // 🔹 Récupère le client_id depuis le premier véhicule
  const clientId = vehicles[0]?.client_id;

  useEffect(() => {
    console.log("🧩 Client ID détecté :", clientId);
  }, [clientId]);

  // 🟢 Met à jour la sélection client côté admin
  const handleToggleSelection = async (vehicleId: string, checked: boolean) => {
    if (!clientId) {
      setMessage("⚠️ Aucun client ID trouvé.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await fetch("http://localhost:3000/api/vehicles/select", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: clientId, // ✅ pris depuis le véhicule
          vehicle_id: vehicleId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur serveur");

      // MAJ locale de l’état
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === vehicleId
            ? { ...v, isClientSelected: checked, selected_by: checked ? "client" : "admin" }
            : v
        )
      );

      setMessage(
        checked
          ? "✅ Véhicule marqué comme sélectionné par le client."
          : "❌ Véhicule retiré de la sélection."
      );
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour :", error);
      setMessage("⚠️ " + error.message);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
          Sélections du client
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Cochez / décochez les véhicules choisis par le client.
        </p>
      </div>

      {message && (
        <p className="text-center text-sm text-gray-700 dark:text-gray-300">
          {message}
        </p>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => {
          const isClientSelected =
            vehicle.isClientSelected || vehicle.selected_by === "client";

          return (
            <div
              key={vehicle.id}
              className={`group border rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300 relative ${isClientSelected ? "ring-2 ring-blue-600" : ""
                }`}
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={vehicle.image}
                  alt={vehicle.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full shadow">
                  {vehicle.year}
                </span>
              </div>

              {/* Infos */}
              <div className="p-4 space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                <div className="truncate font-semibold text-sm text-gray-900 dark:text-gray-100">
                  {vehicle.title}
                </div>
                <div className="flex items-center flex-wrap">
                  <EuroIcon className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
                  <span className="font-medium">{vehicle.price}</span>
                </div>
                <div className="flex items-center flex-wrap">
                  <GaugeIcon className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                  <span>{vehicle.mileage}</span>
                </div>
                <div className="flex items-center flex-wrap">
                  <FuelIcon className="w-4 h-4 mr-2 text-orange-500" />
                  <span>{vehicle.fuel || "N/A"}</span>
                </div>
                <div className="flex items-center flex-wrap">
                  <CogIcon className="w-4 h-4 mr-2 text-gray-500" />
                  <span>{vehicle.gearbox || "N/A"}</span>
                </div>
                <div className="flex items-center flex-wrap">
                  <ZapIcon className="w-4 h-4 mr-2 text-yellow-500" />
                  <span>{vehicle.power || "N/A"}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 flex justify-between items-center space-x-2">
                <a
                  href={vehicle.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-3 py-1.5 bg-gray-700 text-white rounded-md text-xs hover:bg-gray-800 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-1" />
                  Annonce
                </a>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isClientSelected}
                    onChange={(e) =>
                      handleToggleSelection(vehicle.id, e.target.checked)
                    }
                    disabled={loading}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-700 dark:text-gray-200">
                    {isClientSelected ? "Sélectionné" : "Non sélectionné"}
                  </span>
                </label>
              </div>
            </div>
          );
        })}
      </div>

      {loading && (
        <p className="text-xs text-center text-gray-500">Mise à jour...</p>
      )}
    </div>
  );
};

export default ClientSelectionAdminTab;
