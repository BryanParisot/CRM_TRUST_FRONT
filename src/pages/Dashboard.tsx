import React from 'react';
import MetricCard from '../components/MetricCard';
import KanbanBoard from '../components/KanbanBoard';
import ActivityFeed from '../components/ActivityFeed';
const recentActivities = [{
  id: 'activity-1',
  message: 'Sarah Williams a sélectionné BMW X3 - Étape 2 validée',
  timestamp: 'il y a 10 minutes'
}, {
  id: 'activity-2',
  message: 'Emily Davis a téléchargé les documents de signature',
  timestamp: 'il y a 1 heure'
}, {
  id: 'activity-3',
  message: "Robert Brown est passé à l'Étape 2: Sélection de véhicule",
  timestamp: 'il y a 3 heures'
}, {
  id: 'activity-4',
  message: 'Nouveau client John Doe ajouté au système',
  timestamp: 'il y a 5 heures'
}];
const Dashboard: React.FC = () => {
  return <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tableau de bord</h1>
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="CA Mensuel" value="€150,000" type="revenue" trend="up" trendValue="12%" />
        <MetricCard title="Véhicules Vendus" value="20" type="vehicles" />
        <MetricCard title="Taux de Conversion" value="40%" type="conversion" />
        <MetricCard title="Prospects Actifs" value="15" type="leads" />
      </div>
      {/* Kanban Board */}
      <div className="h-[500px]">
        <KanbanBoard />
      </div>
      {/* Activity Feed */}
      <ActivityFeed activities={recentActivities} />
    </div>;
};
export default Dashboard;