import React from 'react';
import { ClockIcon } from 'lucide-react';
interface Activity {
  id: string;
  message: string;
  timestamp: string;
}
interface ActivityFeedProps {
  activities: Activity[];
}
const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities
}) => {
  return <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Activité Récente</h2>
      <div className="space-y-3">
        {activities.map(activity => <div key={activity.id} className="flex items-start">
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 mr-3">
              <ClockIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm">{activity.message}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {activity.timestamp}
              </p>
            </div>
          </div>)}
      </div>
    </div>;
};
export default ActivityFeed;