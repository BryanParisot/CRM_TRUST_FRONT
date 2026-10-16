export const DEFAULT_CHECKLIST_ITEMS = [
  'Historique d’entretien',
  'Entretien à jour',
  'Contrôle technique',
  'Vérifications kilométriques',
  'Papiers du véhicule',
  'État des consommables',
  'Rapport CEBIA',
];

export function matchesChecklistTemplate(items: { name: string }[]): boolean {
  return items.length === DEFAULT_CHECKLIST_ITEMS.length
    && items.every((item, index) => item.name === DEFAULT_CHECKLIST_ITEMS[index]);
}
