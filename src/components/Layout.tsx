import {
  BarChartIcon,
  BellIcon,
  HandshakeIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MenuIcon,
  MoonIcon,
  SettingsIcon,
  SunIcon,
  UsersIcon,
  XIcon
} from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import NotificationPanel from "./NotificationPanel";

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter((n: any) => !n.is_read).length;

  // === Vérif connexion ===
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);


  const fetchNotifications = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/notifications/unread", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
      console.log("Notifications chargées", data);
    } catch (error) {
      console.log("Erreur notifications", error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000); // toutes les 10 sec

    return () => clearInterval(interval);
  }, []);


  // === Données user ===
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const initials =
    user?.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase() || "US";

  // === Actions ===
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Déconnexion réussie 👋");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Backdrop mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 w-56 transform bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b dark:border-gray-700">
          <span className="text-xl font-semibold text-blue-600 dark:text-blue-400">
            AutoImport CRM
          </span>
          <button
            className="p-1 rounded-md lg:hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={toggleSidebar}
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <nav className="px-4 py-4 text-sm">
          <ul className="space-y-1">
            <li>
              <Link
                to="/"
                className={`flex items-center px-4 py-3 rounded-md transition-colors ${isActive("/")
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                onClick={closeSidebar}
              >
                <LayoutDashboardIcon className="w-5 h-5 mr-3" />
                Tableau de bord
              </Link>
            </li>
            <li>
              <Link
                to="/clients"
                className={`flex items-center px-4 py-3 rounded-md transition-colors ${isActive("/clients")
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                onClick={closeSidebar}
              >
                <UsersIcon className="w-5 h-5 mr-3" />
                Clients
              </Link>
            </li>
            <li>
              <Link
                to="/metrics"
                className={`flex items-center px-4 py-3 rounded-md transition-colors ${isActive("/metrics")
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                onClick={closeSidebar}
              >
                <BarChartIcon className="w-5 h-5 mr-3" />
                Métriques
              </Link>
            </li>
            <li>
              <Link
                to="/partners"
                className={`flex items-center px-4 py-3 rounded-md transition-colors ${isActive("/partners")
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                onClick={closeSidebar}
              >
                <HandshakeIcon className="w-5 h-5 mr-3" />
                Partenaires
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className={`flex items-center px-4 py-3 rounded-md transition-colors ${isActive("/settings")
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                onClick={closeSidebar}
              >
                <SettingsIcon className="w-5 h-5 mr-3" />
                Paramètres
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* === MAIN === */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between h-16 px-6 bg-white dark:bg-gray-800 shadow z-10">
          <div className="flex items-center">
            <button
              className="p-1 mr-4 rounded-md lg:hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={toggleSidebar}
            >
              <MenuIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold lg:hidden">AutoImport CRM</h1>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <BellIcon className="w-6 h-6" />

              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={toggleTheme}
              aria-label="Changer de thème"
            >
              {theme === "light" ? (
                <MoonIcon className="w-5 h-5" />
              ) : (
                <SunIcon className="w-5 h-5" />
              )}
            </button>

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                {initials}
              </div>
              <button
                onClick={handleLogout}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <LogOutIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* === NOTIFICATION PANEL === */}
        {showNotifs && (
          <NotificationPanel
            notifications={notifications}
            refresh={fetchNotifications}
          />
        )}

        {/* Contenu principal */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100 dark:bg-gray-900">
          <Outlet /> {/* ✅ Affiche ici le contenu des routes enfants */}
        </main>
      </div>
    </div>
  );
};

export default Layout;
