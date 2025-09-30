import React from 'react';
import { TrendingUpIcon, BarChartIcon, PieChartIcon, BellIcon } from 'lucide-react';
interface MetricCardProps {
  title: string;
  value: string;
  type: 'revenue' | 'vehicles' | 'conversion' | 'leads';
  trend?: 'up' | 'down';
  trendValue?: string;
}
const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  type,
  trend,
  trendValue
}) => {
  const getIcon = () => {
    switch (type) {
      case 'revenue':
        return <TrendingUpIcon className="w-5 h-5 text-green-500" />;
      case 'vehicles':
        return <BarChartIcon className="w-5 h-5 text-blue-500" />;
      case 'conversion':
        return <PieChartIcon className="w-5 h-5 text-purple-500" />;
      case 'leads':
        return <BellIcon className="w-5 h-5 text-orange-500" />;
      default:
        return null;
    }
  };
  return <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 transition-transform hover:transform hover:scale-105">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </h3>
        <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
          {getIcon()}
        </div>
      </div>
      <div className="flex items-end">
        <p className="text-2xl font-semibold">{value}</p>
        {trend && <div className={`ml-2 text-sm flex items-center ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </div>}
      </div>
    </div>;
};
export default MetricCard;