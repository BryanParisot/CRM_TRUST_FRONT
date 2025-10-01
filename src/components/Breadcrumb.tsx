import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from 'lucide-react';

interface BreadcrumbProps {
  clientId: string;
  clientName: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ clientId, clientName }) => (
  <nav className="flex" aria-label="Breadcrumb">
    <ol className="inline-flex items-center space-x-1 md:space-x-3">
      <li className="inline-flex items-center">
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500"
        >
          <HomeIcon className="w-4 h-4 mr-2" />
          Tableau de bord
        </Link>
      </li>
      <li>
        <div className="flex items-center">
          <ChevronRightIcon className="w-5 h-5 text-gray-400" />
          <Link
            to="/clients"
            className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500"
          >
            Clients
          </Link>
        </div>
      </li>
      <li aria-current="page">
        <div className="flex items-center">
          <ChevronRightIcon className="w-5 h-5 text-gray-400" />
          <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">
            {clientName} (ID:{clientId})
          </span>
        </div>
      </li>
    </ol>
  </nav>
);

export default Breadcrumb;