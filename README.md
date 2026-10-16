# Cartrust CRM — interface

Interface React, TypeScript et Vite du CRM Cartrust : pipeline administrateur et portail client accessible par lien personnalisé.

## Démarrage local

1. Préparer et démarrer MySQL puis l’API avec les instructions du [backend](https://github.com/BryanParisot/CRM_BACK_END#readme).
2. Dans ce dépôt : `npm ci`.
3. Lancer `npm run dev -- --host 127.0.0.1` et ouvrir http://localhost:5173.

L’API locale doit être accessible sur http://localhost:3000. Les identifiants administrateur sont ceux créés avec `npm run db:init` dans le backend.

## Vérification

`npm run build` produit le site dans `dist/`. Les tests du parcours client et des droits d’accès sont dans le dépôt backend.

Le parcours couvre les propositions de véhicules ajoutées manuellement, la signature des CGV, les justificatifs et l’acompte, les contrôles, le solde de la prestation et la livraison. Le client retrouve son étape actuelle et ses documents depuis la navigation de son espace.
