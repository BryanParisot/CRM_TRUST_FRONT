import { useState, useEffect } from 'react';
import { DndContext, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { GripVertical, Plus, RefreshCw, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';
import KanbanColumn from './KanbanColumn';
import KanbanCard, {KanbanCardPreview} from './KanbanCard';
import NewClientModal, {type ClientSubmissionData} from './NewClientModal';
import {PIPELINE_STAGES as columns} from '../utils/pipeline';
export interface Client {
  id:number;name:string;marque?:string;modele?:string;vehicle?:string;step:number;progress:number;
  hasNotification:boolean;mileage?:number;year?:number;premiere_immat?:string;price?:string;selectedVehicles?:string[];budget?:number|string;
}
export default function KanbanBoard(){
  const [clients,setClients]=useState<Client[]>([]);
  const [activeClient,setActiveClient]=useState<Client|null>(null);
  const [isModalOpen,setIsModalOpen]=useState(false);
  const [loading,setLoading]=useState(true);
  const [moving,setMoving]=useState(false);
  const [query,setQuery]=useState('');
  const headers={Authorization:`Bearer ${localStorage.getItem('token')}`};
  const sensors=useSensors(useSensor(PointerSensor,{activationConstraint:{distance:8}}),useSensor(KeyboardSensor,{coordinateGetter:sortableKeyboardCoordinates}));
  const fetchClients=async()=>{
    setLoading(true);
    try{
      const res=await fetch('http://localhost:3000/api/clients',{headers});
      if(!res.ok)throw new Error('Impossible de charger les dossiers.');
      setClients(await res.json());
    }catch(error){toast.error((error as Error).message);}finally{setLoading(false);}
  };
  useEffect(()=>{fetchClients();},[]);
  const handleDragStart=({active}:DragStartEvent)=>setActiveClient(clients.find(c=>c.id===active.id)||null);
  const handleDragEnd=async({active,over}:DragEndEvent)=>{
    setActiveClient(null);
    if(!over)return;
    const client=clients.find(c=>c.id===Number(active.id));
    const target=columns.find(c=>c.id===over.id)?.step||clients.find(c=>c.id===Number(over.id))?.step;
    if(!client||!target||target===client.step)return;
    if(Math.abs(target-client.step)>1){toast.error('Déplacez le dossier vers l’étape précédente ou suivante.');return;}
    setMoving(true);setClients(prev=>prev.map(c=>c.id===client.id?{...c,step:target}:c));
    try{
      const res=await fetch(`http://localhost:3000/api/clients/${client.id}/steps`,{method:'POST',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify({to_step:target,changed_by:'admin'})});
      const data=await res.json();if(!res.ok)throw new Error(data.message||'Impossible de déplacer le dossier.');
      if(data.signature_error)toast.error(`Étape enregistrée. ${data.signature_error}`);else toast.success('Dossier déplacé.');
    }catch(error){setClients(prev=>prev.map(c=>c.id===client.id?{...c,step:client.step}:c));toast.error((error as Error).message);}finally{setMoving(false);}
  };
  const addClient=async(body:ClientSubmissionData)=>{
    try{
      const res=await fetch('http://localhost:3000/api/clients',{method:'POST',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify(body)});
      const data=await res.json();if(!res.ok)throw new Error(data.message||'Impossible de créer le dossier.');
      setClients(prev=>[...prev,data]);setIsModalOpen(false);setQuery('');toast.success('Client ajouté.');
    }catch(error){toast.error((error as Error).message);}
  };
  const normalized=query.trim().toLocaleLowerCase('fr');
  const visible=clients.filter(c=>`${c.name} ${c.marque||''} ${c.modele||''}`.toLocaleLowerCase('fr').includes(normalized));
  return <section className="flex h-full min-h-0 min-w-0 flex-col gap-5">
    <header className="flex flex-wrap items-center justify-between gap-4"><div><div className="flex items-center gap-3"><h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">Pipeline clients</h1><span className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-medium tabular-nums text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">{clients.length} dossier{clients.length>1?'s':''}</span></div><p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">Du premier échange à la remise des clés.</p></div><button onClick={()=>setIsModalOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"><Plus size={17}/>Nouveau client</button></header>
    <div className="flex flex-wrap items-center justify-between gap-3"><div className="relative min-w-0 flex-1 sm:w-80 sm:flex-none"><Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input type="search" aria-label="Rechercher un dossier" placeholder="Rechercher un client ou un véhicule…" value={query} onChange={e=>setQuery(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-8 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:ring-blue-900/20"/>{query&&<button aria-label="Effacer la recherche" onClick={()=>setQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:text-gray-700"><X size={14}/></button>}</div><div className="flex shrink-0 items-center gap-4"><p className="hidden items-center gap-1.5 text-xs text-gray-400 xl:flex"><GripVertical size={14}/>Glissez un dossier pour changer d’étape</p><button aria-label="Actualiser le pipeline" title="Actualiser le pipeline" disabled={loading||moving} onClick={fetchClients} className="rounded-lg border border-gray-200 bg-white p-2.5 text-gray-500 transition hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"><RefreshCw size={16} className={loading?'animate-spin':''}/></button></div></div>
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={()=>setActiveClient(null)}>
      <div role="region" aria-label="Pipeline des clients par étape" tabIndex={0} className="min-h-[23rem] min-w-0 flex-1 overflow-x-auto pb-3 outline-none focus-visible:ring-2 focus-visible:ring-blue-300" aria-busy={loading}>
        <div className="grid h-full grid-cols-[repeat(6,minmax(232px,1fr))] gap-3">{columns.map(column=>{const entries=visible.filter(c=>c.step===column.step);return <SortableContext key={column.id} items={entries.map(c=>c.id)} strategy={verticalListSortingStrategy}><KanbanColumn {...column} count={entries.length} searching={Boolean(normalized)}>{entries.map(client=><KanbanCard key={client.id} client={client} disabled={moving||loading}/>)}{column.step===1&&!normalized&&<button onClick={()=>setIsModalOpen(true)} className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 px-3 py-3 text-xs font-medium text-gray-500 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-blue-900/20"><Plus size={14}/>Ajouter un client</button>}</KanbanColumn></SortableContext>;})}</div>
      </div>
      <DragOverlay>{activeClient?<KanbanCardPreview client={activeClient}/>:null}</DragOverlay>
    </DndContext>
    <NewClientModal isOpen={isModalOpen} onClose={()=>setIsModalOpen(false)} onSubmit={addClient}/>
  </section>;
}
