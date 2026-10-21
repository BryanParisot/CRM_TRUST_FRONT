import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ArrowUpRight, Car, Flag, GripVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { Client } from './KanbanBoard';
import {vehicleSearchLabels} from '../utils/vehiclePreferences';
import ClientPriorityButton from './ClientPriorityButton';
function Content({client,handle,priorityControl}:{client:Client;handle:ReactNode;priorityControl:ReactNode}){
  const words=client.name.trim().split(/\s+/);
  const initials=[words[0]?.[0],words.length>1?words[words.length-1]?.[0]:''].join('').toUpperCase();
  const budget=Number(client.budget);
  return <>
    <div className="flex items-start gap-2.5"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xs font-semibold text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">{initials}</span><Link to={`/client/${client.id}`} title={client.name} className="group min-w-0 flex-1 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"><h3 className="truncate text-sm font-semibold text-gray-900 group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-300">{client.name}</h3><p className="mt-1 flex items-center gap-1 whitespace-nowrap text-[10px] text-gray-400">Dossier #{client.id}<ArrowUpRight size={11}/></p></Link><div className="-mr-1 flex shrink-0 items-center gap-0.5">{handle}</div></div>
    <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400"><Car size={15} className="shrink-0 text-gray-400"/><span className="min-w-0 flex-1 truncate" title={vehicleSearchLabels(client).join(' / ')}>{vehicleSearchLabels(client).join(' / ')||'Véhicule à définir'}</span>{priorityControl}</div>
    <div className="mt-4 flex items-center justify-between gap-2 border-t border-gray-100 pt-3 dark:border-gray-700"><span className="text-[10px] font-medium uppercase tracking-wide text-gray-400">Budget client</span><span className="text-xs font-semibold tabular-nums text-gray-700 dark:text-gray-200">{Number.isFinite(budget)&&budget>0?budget.toLocaleString('fr-FR',{style:'currency',currency:'EUR',maximumFractionDigits:0}):'À définir'}</span></div>
  </>;
}
export default function KanbanCard({client,disabled=false,onPriorityChanged}:{client:Client;disabled?:boolean;onPriorityChanged:(priority:boolean)=>void}){
  const {attributes,listeners,setNodeRef,transform,transition,isDragging}=useSortable({id:client.id,disabled});
  return <article ref={setNodeRef} style={{transform:CSS.Transform.toString(transform),transition}} data-client-id={client.id} className={`rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:border-blue-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-800 ${isDragging?'opacity-30':''}`}><Content client={client} priorityControl={<ClientPriorityButton clientId={client.id} clientName={client.name} priority={Boolean(client.is_priority)} disabled={disabled||isDragging} onChanged={onPriorityChanged}/>} handle={<button type="button" {...attributes} {...listeners} disabled={disabled} aria-label={`Déplacer le dossier ${client.name}`} title="Déplacer le dossier" style={{touchAction:'none'}} className="rounded-lg p-1 text-gray-300 hover:bg-gray-100 hover:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 disabled:cursor-wait dark:text-gray-500 dark:hover:bg-gray-700"><GripVertical size={16}/></button>}/></article>;
}
export function KanbanCardPreview({client}:{client:Client}){
  return <div className="pointer-events-none w-[238px] rotate-2 rounded-xl border border-blue-300 bg-white p-4 shadow-xl dark:border-blue-600 dark:bg-gray-800"><Content client={client} priorityControl={<span className={`inline-flex h-7 w-7 items-center justify-center rounded-lg ${client.is_priority?'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400':'text-gray-300 dark:text-gray-500'}`}><Flag size={14} strokeWidth={1.7}/></span>} handle={<GripVertical size={16} className="text-blue-400"/>}/></div>;
}
