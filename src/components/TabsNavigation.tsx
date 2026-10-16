import React from 'react';
import { IdCardIcon, CarIcon, CreditCardIcon, CheckSquareIcon, FileSignatureIcon, TruckIcon } from 'lucide-react';
interface TabsNavigationProps { activeTab:number;setActiveTab:(tab:number)=>void; }
const TabsNavigation:React.FC<TabsNavigationProps>=({activeTab,setActiveTab})=>(
  <nav aria-label="Étapes du dossier client" className="grid grid-cols-3 gap-1 border-b border-gray-100 p-2 dark:border-gray-700 sm:grid-cols-6">
    {[
      {id:1,label:'Infos client',icon:IdCardIcon},
      {id:2,label:'Véhicules',icon:CarIcon},
      {id:3,label:'Signature & acompte',icon:CreditCardIcon},
      {id:4,label:'Contrôles',icon:CheckSquareIcon},
      {id:5,label:'Solde & documents',icon:FileSignatureIcon},
      {id:6,label:'Livraison',icon:TruckIcon},
    ].map(tab=><button key={tab.id} type="button" onClick={()=>setActiveTab(tab.id)} aria-current={activeTab===tab.id?'page':undefined} className={`flex min-w-0 flex-col items-center justify-start gap-1.5 rounded-xl px-1.5 py-3 text-center text-xs leading-4 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 ${activeTab===tab.id?'bg-blue-50 font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300':'font-medium text-gray-400 hover:bg-gray-50 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-200'}`}><span className="flex items-center gap-1.5"><tab.icon size={15}/><span className="text-[10px] tabular-nums">0{tab.id}</span></span><span>{tab.label}</span></button>)}
  </nav>
);
export default TabsNavigation;
