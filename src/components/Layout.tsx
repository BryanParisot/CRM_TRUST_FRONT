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
  XIcon,
  CarFront,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import NotificationPanel from "./NotificationPanel";

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed,setCollapsed]=useState(()=>localStorage.getItem('cartrust-nav-collapsed')==='true');
  useEffect(()=>{localStorage.setItem('cartrust-nav-collapsed',String(collapsed));},[collapsed]);
  useEffect(()=>{
    const closeOnEscape=(event:KeyboardEvent)=>{if(event.key==='Escape')setSidebarOpen(false);};
    window.addEventListener('keydown',closeOnEscape);
    return()=>window.removeEventListener('keydown',closeOnEscape);
  },[]);
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

  let user: {name?:string} = {};
  try { user=JSON.parse(localStorage.getItem('user') || '{}'); } catch { /* Session sans profil local. */ }
  const initials=user?.name?.split(' ').filter(Boolean).map(n=>n[0]).slice(0,2).join('').toUpperCase() || 'US';
  const toggleSidebar=()=>setSidebarOpen(prev=>!prev);
  const closeSidebar=()=>setSidebarOpen(false);
  const isActive=(path:string)=>location.pathname===path;
  const handleLogout=()=>{
    localStorage.removeItem('token');localStorage.removeItem('user');
    toast.success('Déconnexion réussie');navigate('/login');
  };
  const navigation=[
    {path:'/',label:'Pipeline',icon:LayoutDashboardIcon},
    {path:'/clients',label:'Clients',icon:UsersIcon},
    {path:'/metrics',label:'Métriques',icon:BarChartIcon},
    {path:'/partners',label:'Partenaires',icon:HandshakeIcon},
    {path:'/settings',label:'Paramètres',icon:SettingsIcon},
  ];
  const pageTitle=location.pathname.startsWith('/client/')?'Dossier client':navigation.find(item=>item.path===location.pathname)?.label||'Cartrust';
  return <div className="flex h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
    {sidebarOpen&&<button aria-label="Fermer le menu" className="fixed inset-0 z-20 bg-gray-900/40 backdrop-blur-sm lg:hidden" onClick={closeSidebar}/>}
    <aside id="main-navigation" aria-label="Navigation principale" className={`fixed inset-y-0 left-0 z-30 flex w-60 shrink-0 flex-col border-r border-gray-200 bg-white [transition-property:width,transform] duration-200 motion-reduce:transition-none dark:border-gray-800 dark:bg-gray-900 lg:visible lg:static lg:translate-x-0 ${collapsed?'lg:w-[76px]':'lg:w-60'} ${sidebarOpen?'visible translate-x-0':'invisible -translate-x-full'}`}>
      <div className={`flex h-16 shrink-0 items-center gap-3 border-b border-gray-100 px-5 dark:border-gray-800 ${collapsed?'lg:justify-center lg:px-0':''}`}>
        <Link to="/" aria-label="Cartrust — Accueil" onClick={closeSidebar} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm"><CarFront size={21}/></Link>
        <div className={`min-w-0 ${collapsed?'lg:hidden':''}`}><p className="text-base font-semibold tracking-tight text-gray-900 dark:text-gray-100">Cartrust</p><p className="text-[10px] font-medium uppercase tracking-widest text-gray-400">Espace de gestion</p></div>
        <button aria-label="Fermer la navigation" onClick={closeSidebar} className="ml-auto rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"><XIcon size={20}/></button>
      </div>
      <nav className="flex-1 px-3 py-6"><p className={`mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400 ${collapsed?'lg:sr-only':''}`}>Espace de travail</p><ul className="space-y-1.5">{navigation.map(item=>{
        const active=isActive(item.path)||(item.path==='/clients'&&location.pathname.startsWith('/client/'));
        return <li key={item.path}><Link to={item.path} onClick={closeSidebar} aria-label={item.label} aria-current={active?'page':undefined} title={collapsed?item.label:undefined} className={`group relative flex min-h-11 items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 ${collapsed?'lg:justify-center lg:px-0':''} ${active?'bg-blue-50 font-semibold text-blue-700 dark:bg-blue-900/25 dark:text-blue-300':'font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'}`}><item.icon size={20} strokeWidth={active?2:1.7} className="shrink-0"/><span className={collapsed?'lg:sr-only':''}>{item.label}</span>{collapsed&&<span aria-hidden="true" className="pointer-events-none absolute left-full z-50 ml-4 hidden whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-xs font-medium text-white shadow-lg lg:group-hover:block lg:group-focus-visible:block dark:bg-gray-700">{item.label}</span>}</Link></li>;
      })}</ul></nav>
      <div className="m-3 border-t border-gray-100 pt-3 dark:border-gray-800"><button onClick={()=>setCollapsed(prev=>!prev)} aria-label={collapsed?'Développer la navigation':'Réduire la navigation'} aria-expanded={!collapsed} aria-controls="main-navigation" className={`hidden w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-gray-400 transition hover:bg-gray-50 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200 lg:flex ${collapsed?'justify-center':''}`} title={collapsed?'Développer la navigation':'Réduire la navigation'}>{collapsed?<PanelLeftOpen size={19}/>:<PanelLeftClose size={19}/>}<span className={collapsed?'sr-only':''}>Réduire le menu</span></button></div>
    </aside>
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
      <header className="z-10 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-900 sm:px-6">
        <div className="flex min-w-0 items-center gap-3"><button aria-label="Ouvrir la navigation" aria-expanded={sidebarOpen} aria-controls="main-navigation" onClick={toggleSidebar} className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 dark:hover:bg-gray-800 lg:hidden"><MenuIcon size={22}/></button><p className="truncate text-sm font-semibold text-gray-600 dark:text-gray-300">{pageTitle}</p></div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button aria-label="Notifications" aria-expanded={showNotifs} onClick={()=>setShowNotifs(!showNotifs)} className="relative rounded-xl p-2 text-gray-500 transition hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"><BellIcon size={20}/>{unreadCount>0&&<span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-semibold text-white">{unreadCount}</span>}</button>
          <button aria-label="Changer de thème" onClick={toggleTheme} className="rounded-xl p-2 text-gray-500 transition hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800">{theme==='light'?<MoonIcon size={19}/>:<SunIcon size={19}/>}</button>
          <span className="mx-1 h-6 w-px bg-gray-100 dark:bg-gray-800"/>
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-xs font-semibold text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">{initials}</span>
          <button aria-label="Se déconnecter" title="Se déconnecter" onClick={handleLogout} className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-50 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-white"><LogOutIcon size={18}/></button>
        </div>
      </header>
      {showNotifs&&<NotificationPanel notifications={notifications} refresh={fetchNotifications}/>}
      <main className="min-h-0 min-w-0 flex-1 overflow-auto bg-gray-50 p-4 dark:bg-gray-900 sm:p-6"><Outlet/></main>
    </div>
  </div>;
};
export default Layout;
