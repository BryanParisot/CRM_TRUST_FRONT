export function clientPortalPath(token: string, step: number): string {
  const base = `/client-link/${token}`;
  if (step === 3) return `${base}/payment`;
  if (step === 4) return `${base}/checklist`;
  if (step === 5) return `${base}/settlement`;
  if (step >= 6) return `${base}/delivery`;
  if (step <= 1) return `${base}/overview`;
  return `${base}/select`;
}

export const clientPortalSteps = [
  {label:'Informations client',description:'Votre conseiller recueille vos coordonnées et les critères de votre recherche.'},
  {label:'Propositions de véhicules',description:'Consultez les annonces proposées et indiquez les véhicules qui vous plaisent.'},
  {label:'Signature & acompte',description:'Signez vos CGV, déposez vos justificatifs et retrouvez les informations de votre acompte.'},
  {label:'Contrôles du véhicule',description:'Suivez les vérifications enregistrées pour les véhicules que vous avez retenus.'},
  {label:'Solde & documents',description:'Consultez le solde de la prestation, votre acompte reçu et les documents du véhicule.'},
  {label:'Livraison',description:'Retrouvez la date et l’adresse de remise du véhicule renseignées par votre conseiller.'},
];

export function currentClientStepPath(token:string,step:number):string {
  const path=clientPortalPath(token,step);
  return path.endsWith('/overview')?`${path}#progress`:path;
}
