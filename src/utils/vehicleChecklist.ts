export const DEFAULT_CHECKLIST_ITEMS = [
  'Historique d’entretien',
  'Entretien à jour',
  'Contrôle technique',
  'Vérifications kilométriques',
  'Papiers du véhicule',
  'État des consommables',
  'Rapport CEBIA',
];

export const CHECKLIST_STATUS_LABELS = {
  validated:'Validé',
  pending:'En attente',
  issue:'À corriger',
  rejected:'Non validé',
  not_applicable:'Non applicable',
};

export function matchesChecklistTemplate(items: { name: string }[]): boolean {
  return items.length === DEFAULT_CHECKLIST_ITEMS.length
    && items.every((item, index) => item.name === DEFAULT_CHECKLIST_ITEMS[index]);
}
