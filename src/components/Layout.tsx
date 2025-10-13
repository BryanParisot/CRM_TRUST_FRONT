import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { LayoutDashboardIcon, UsersIcon, BarChartIcon, HandshakeIcon, SettingsIcon, MenuIcon, XIcon, SunIcon, MoonIcon, LogOutIcon } from 'lucide-react';
interface LayoutProps {
  children: React.ReactNode;
}
const Layout: React.FC<LayoutProps> = ({
  children
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    theme,
    toggleTheme
  } = useTheme();
  const location = useLocation();
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const closeSidebar = () => {
    setSidebarOpen(false);
  };
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  return <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && <div className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden" onClick={closeSidebar}></div>}
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-54 transform bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b dark:border-gray-700">
          <div className="flex items-center">
            <span className="text-xl font-semibold text-blue-600 dark:text-blue-400">
              AutoImport CRM
            </span>
          </div>
          <button className="p-1 rounded-md lg:hidden focus:outline-none focus:ring-2 focus:ring-blue-500" onClick={toggleSidebar}>
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <nav className="px-4 py-4 text-sm">
          <ul className="space-y-1">
            <li>
              <Link to="/" className={`flex items-center px-4 py-3 rounded-md transition-colors ${isActive('/') ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`} onClick={closeSidebar}>
                <LayoutDashboardIcon className="w-5 h-5 mr-3" />
                <span>Tableau de bord</span>
              </Link>
            </li>
            <li>
              <Link to="/clients" className={`flex items-center px-4 py-3 rounded-md transition-colors ${isActive('/clients') ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`} onClick={closeSidebar}>
                <UsersIcon className="w-5 h-5 mr-3" />
                <span>Clients</span>
              </Link>
            </li>
            <li>
              <Link to="/metrics" className={`flex items-center px-4 py-3 rounded-md transition-colors ${isActive('/metrics') ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`} onClick={closeSidebar}>
                <BarChartIcon className="w-5 h-5 mr-3" />
                <span>Métriques</span>
              </Link>
            </li>
            <li>
              <Link to="/partners" className={`flex items-center px-4 py-3 rounded-md transition-colors ${isActive('/partners') ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`} onClick={closeSidebar}>
                <HandshakeIcon className="w-5 h-5 mr-3" />
                <span>Partenaires</span>
              </Link>
            </li>
            <li>
              <Link to="/settings" className={`flex items-center px-4 py-3 rounded-md transition-colors ${isActive('/settings') ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`} onClick={closeSidebar}>
                <SettingsIcon className="w-5 h-5 mr-3" />
                <span>Paramètres</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between h-16 px-6 bg-white dark:bg-gray-800 shadow z-10">
          <div className="flex items-center">
            <button className="p-1 mr-4 rounded-md lg:hidden focus:outline-none focus:ring-2 focus:ring-blue-500" onClick={toggleSidebar}>
              <MenuIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold lg:hidden">AutoImport CRM</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" onClick={toggleTheme} aria-label="Changer de thème">
              {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
            </button>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                JD
              </div>
              <button className="ml-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <LogOutIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>;
};
export default Layout;