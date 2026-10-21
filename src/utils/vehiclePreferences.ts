export interface AdditionalVehicle {
  id: number;
  marque: string;
  modele: string;
}

export function vehicleSearchLabels(client: {marque?: string | null; modele?: string | null; additional_vehicles?: AdditionalVehicle[]}) {
  return [
    [client.marque, client.modele].filter(Boolean).join(' '),
    ...(client.additional_vehicles || []).map(vehicle => [vehicle.marque, vehicle.modele].filter(Boolean).join(' ')),
  ].filter(Boolean);
}
