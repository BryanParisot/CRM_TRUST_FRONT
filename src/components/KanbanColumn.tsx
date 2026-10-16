import type { ReactNode } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Inbox } from 'lucide-react';
interface KanbanColumnProps { id:string;title:string;step:number;description:string;count:number;searching:boolean;children:ReactNode; }
const accents=['bg-slate-400','bg-blue-500','bg-violet-500','bg-amber-500','bg-cyan-500','bg-emerald-500'];
export default function KanbanColumn({id,title,step,description,count,searching,children}:KanbanColumnProps){
  const {setNodeRef,isOver}=useDroppable({id});
  return <section ref={setNodeRef} data-column={step} aria-label={`${title}, ${count} dossier${count>1?'s':''}`} className={`flex h-full min-h-0 flex-col rounded-2xl border p-2.5 transition-colors ${isOver?'border-blue-300 bg-blue-50 dark:border-blue-600 dark:bg-blue-900/20':'border-gray-200/80 bg-gray-100/70 dark:border-gray-700 dark:bg-gray-800/40'}`}>
    <header className="px-1.5 pb-4 pt-2"><div className="flex items-center gap-2"><span className={`h-2 w-2 shrink-0 rounded-full ${accents[step-1]}`}/><h2 className="min-w-0 flex-1 text-sm font-semibold tracking-tight text-gray-700 dark:text-gray-200">{title}</h2><span className="flex h-6 min-w-6 items-center justify-center rounded-md border border-gray-200 bg-white px-1.5 text-xs font-medium tabular-nums text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">{count}</span></div><p className="mt-2 pl-4 text-[11px] text-gray-400 dark:text-gray-500">{description}</p></header>
    <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-0.5 pb-1">
      {count===0&&<div className={`flex min-h-32 flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-3 py-6 text-center ${isOver?'border-blue-300 text-blue-600':'border-gray-200 text-gray-400 dark:border-gray-700 dark:text-gray-500'}`}><Inbox size={21} strokeWidth={1.5}/><p className="text-xs">{isOver?'Déposer le dossier ici':searching?'Aucun résultat':'Aucun dossier à cette étape'}</p></div>}
      {children}
    </div>
  </section>;
}
