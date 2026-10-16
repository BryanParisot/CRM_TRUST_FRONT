import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ArrowUpRight, Car, GripVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { Client } from './KanbanBoard';
function Content({client,handle}:{client:Client;handle:ReactNode}){
  const words=client.name.trim().split(/\s+/);
  const initials=[words[0]?.[0],words.length>1?words[words.length-1]?.[0]:''].join('').toUpperCase();
  const budget=Number(client.budget);
  return <>
    <div className="flex items-start gap-2.5"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xs font-semibold text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">{initials}</span><Link to={`/client/${client.id}`} className="group min-w-0 flex-1 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"><h3 className="truncate text-sm font-semibold text-gray-900 group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-300">{client.name}</h3><p className="mt-1 flex items-center gap-1 text-[10px] text-gray-400">Dossier #{client.id}<ArrowUpRight size={11}/></p></Link>{handle}</div>
    <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400"><Car size={15} className="shrink-0 text-gray-400"/><span className="truncate">{[client.marque,client.modele].filter(Boolean).join(' ')||'Véhicule à définir'}</span></div>
    <div className="mt-4 flex items-center justify-between gap-2 border-t border-gray-100 pt-3 dark:border-gray-700"><span className="text-[10px] font-medium uppercase tracking-wide text-gray-400">Budget client</span><span className="text-xs font-semibold tabular-nums text-gray-700 dark:text-gray-200">{Number.isFinite(budget)&&budget>0?budget.toLocaleString('fr-FR',{style:'currency',currency:'EUR',maximumFractionDigits:0}):'À définir'}</span></div>
  </>;
}
export default function KanbanCard({client,disabled=false}:{client:Client;disabled?:boolean}){
  const {attributes,listeners,setNodeRef,transform,transition,isDragging}=useSortable({id:client.id,disabled});
  return <article ref={setNodeRef} style={{transform:CSS.Transform.toString(transform),transition}} data-client-id={client.id} className={`rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:border-blue-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-800 ${isDragging?'opacity-30':''}`}><Content client={client} handle={<button type="button" {...attributes} {...listeners} disabled={disabled} aria-label={`Déplacer le dossier ${client.name}`} title="Déplacer le dossier" style={{touchAction:'none'}} className="-mr-1 rounded-lg p-1 text-gray-300 hover:bg-gray-100 hover:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 disabled:cursor-wait dark:text-gray-500 dark:hover:bg-gray-700"><GripVertical size={16}/></button>}/></article>;
}
export function KanbanCardPreview({client}:{client:Client}){
  return <div className="pointer-events-none w-[238px] rotate-2 rounded-xl border border-blue-300 bg-white p-4 shadow-xl dark:border-blue-600 dark:bg-gray-800"><Content client={client} handle={<GripVertical size={16} className="text-blue-400"/>}/></div>;
}
