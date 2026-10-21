import {AlertCircle, ArrowUpRight, Car, Edit2, Eye, LayoutDashboard, Loader2, Mail, Phone, Plus, RefreshCw, Search, Trash2, Users, X} from 'lucide-react';
import {useCallback, useEffect, useMemo, useState, type ComponentProps} from 'react';
import {Link} from 'react-router-dom';
import toast from 'react-hot-toast';
import DeleteClientModal from '../components/DeleteClientModal';
import EditClientModal from '../components/EditClientModal';
import NewClientModal, {type ClientSubmissionData} from '../components/NewClientModal';
import {PIPELINE_STAGES} from '../utils/pipeline';
import {vehicleSearchLabels, type AdditionalVehicle} from '../utils/vehiclePreferences';

interface Client {
  additional_vehicles?: AdditionalVehicle[];
  id:number;name:string;first_name?:string|null;last_name?:string|null;
  email?:string|null;phone?:string|null;step:number;
  marque?:string|null;modele?:string|null;budget?:string|number|null;
  max_km?:string|number|null;couleur?:string|null;vehicle_color?:string|null;
  carburant?:string|null;boite?:string|null;puissance_min?:number|null;
  description?:string|null;premiere_immat?:string|null;first_registration?:string|null;
}
const normalize=(value:string)=>value.normalize('NFD').replace(/\p{Diacritic}/gu,'').toLocaleLowerCase('fr').trim();
const initials=(name:string)=>{const words=name.trim().split(/\s+/).filter(Boolean);return [words[0]?.[0],words.length>1?words[words.length-1]?.[0]:''].join('').toUpperCase()||'?';};
const primary='inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:opacity-50';
const secondary='inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:border-blue-200 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300';
const iconButton='inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 dark:hover:bg-gray-700 dark:hover:text-blue-300';
const headers=()=>({Authorization:`Bearer ${localStorage.getItem('token')}`});

export default function ClientsList(){
  const [clients,setClients]=useState<Client[]>([]);
  const [loading,setLoading]=useState(true);const [error,setError]=useState('');
  const [query,setQuery]=useState('');const [stepFilter,setStepFilter]=useState('all');
  const [showNew,setShowNew]=useState(false);
  const [editing,setEditing]=useState<Client|null>(null);const [deleting,setDeleting]=useState<Client|null>(null);
  const [updating,setUpdating]=useState(false);const [removing,setRemoving]=useState(false);
  const load=useCallback(async(signal?:AbortSignal)=>{
    setLoading(true);
    try{
      const response=await fetch('http://localhost:3000/api/clients',{headers:headers(),signal,cache:'no-store'});
      const data=await response.json();if(!response.ok)throw new Error(data.message||'Impossible de charger les clients.');
      if(!signal?.aborted){setClients(data);setError('');}
    }catch(error){if(!signal?.aborted)setError((error as Error).message);}finally{if(!signal?.aborted)setLoading(false);}
  },[]);
  useEffect(()=>{const controller=new AbortController();load(controller.signal);return()=>controller.abort();},[load]);
  const filtered=useMemo(()=>{
    const search=normalize(query);
    return clients.filter(client=>{
      const text=[client.name,client.email,client.phone,client.phone?.replace(/\D/g,''),...vehicleSearchLabels(client),`#${client.id}`].filter(Boolean).join(' ');
      return (stepFilter==='all'||client.step===Number(stepFilter))&&normalize(text).includes(search);
    }).sort((a,b)=>b.id-a.id);
  },[clients,query,stepFilter]);
  const filteredView=Boolean(query.trim())||stepFilter!=='all';
  const resetFilters=()=>{setQuery('');setStepFilter('all');};
  const addClient=async(body:ClientSubmissionData)=>{
    try{
      const response=await fetch('http://localhost:3000/api/clients',{method:'POST',headers:{...headers(),'Content-Type':'application/json'},body:JSON.stringify(body)});
      const data=await response.json();if(!response.ok)throw new Error(data.message||'Impossible de créer le client.');
      setClients(previous=>[data,...previous]);setShowNew(false);resetFilters();setError('');toast.success('Client ajouté.');
    }catch(error){toast.error((error as Error).message);}
  };
  const updateClient=async(form:ComponentProps<typeof EditClientModal>['clientData'])=>{
    if(!editing||updating)return;setUpdating(true);
    try{
      const body={...form,vehicle_color:form.couleur,first_registration:form.premiere_immat,budget:form.budget===''?null:Number(form.budget),max_km:form.max_km===''?null:Number(form.max_km),puissance_min:form.puissance_min===''?null:Number(form.puissance_min)};
      const response=await fetch(`http://localhost:3000/api/clients/${editing.id}`,{method:'PATCH',headers:{...headers(),'Content-Type':'application/json'},body:JSON.stringify(body)});
      const data=await response.json();if(!response.ok)throw new Error(data.message||'Impossible de modifier le client.');
      setClients(previous=>previous.map(client=>client.id===editing.id?{...client,...form,budget:body.budget,max_km:body.max_km,puissance_min:body.puissance_min,name:`${form.first_name.trim()} ${form.last_name.trim()}`}:client));
      setEditing(null);toast.success('Client modifié.');await load();
    }catch(error){toast.error((error as Error).message);}finally{setUpdating(false);}
  };
  const deleteClient=async()=>{
    if(!deleting||removing)return;setRemoving(true);
    try{
      const response=await fetch(`http://localhost:3000/api/clients/${deleting.id}`,{method:'DELETE',headers:headers()});
      const data=await response.json();if(!response.ok)throw new Error(data.message||'Impossible de supprimer le client.');
      setClients(previous=>previous.filter(client=>client.id!==deleting.id));setDeleting(null);toast.success('Client supprimé.');
    }catch(error){toast.error((error as Error).message);}finally{setRemoving(false);}
  };

  return <section className="min-w-0 space-y-5">
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div><div className="flex flex-wrap items-center gap-3"><h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">Tous les clients</h1><span className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-medium tabular-nums text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">{clients.length} dossier{clients.length>1?'s':''}</span></div><p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">Vos contacts et leurs recherches, au même endroit.</p></div>
      <div className="flex flex-wrap gap-2"><Link to="/" className={secondary}><LayoutDashboard size={16}/>Voir le pipeline</Link><button onClick={()=>setShowNew(true)} className={primary}><Plus size={17}/>Nouveau client</button></div>
    </header>

    <div className="flex flex-wrap items-center gap-3">
      <div className="relative min-w-0 flex-1 basis-full sm:basis-64"><Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input type="search" aria-label="Rechercher un client" placeholder="Nom, coordonnées ou véhicule…" value={query} onChange={event=>setQuery(event.target.value)} className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-9 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:ring-blue-900/20"/>{query&&<button aria-label="Effacer la recherche" onClick={()=>setQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:text-gray-700"><X size={14}/></button>}</div>
      <select aria-label="Filtrer les clients par étape" value={stepFilter} onChange={event=>setStepFilter(event.target.value)} className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white p-2.5 text-sm text-gray-600 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 sm:max-w-60"><option value="all">Toutes les étapes</option>{PIPELINE_STAGES.map(stage=><option key={stage.step} value={stage.step}>{stage.title} ({clients.filter(client=>client.step===stage.step).length})</option>)}</select>
      <button aria-label="Actualiser les clients" title="Actualiser les clients" disabled={loading} onClick={()=>load()} className={`${secondary} !p-2.5 disabled:opacity-50`}><RefreshCw size={17} className={loading?'animate-spin':''}/></button>
    </div>
    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400"><p aria-live="polite">{filtered.length} dossier{filtered.length>1?'s':''} affiché{filtered.length>1?'s':''}{filteredView?` sur ${clients.length}`:''}</p>{filteredView&&<button onClick={resetFilters} className="inline-flex items-center gap-1.5 font-medium text-blue-600 hover:underline dark:text-blue-300"><X size={13}/>Réinitialiser les filtres</button>}</div>
    {error&&<div role="alert" className="flex flex-wrap items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-900/20 dark:text-red-300"><AlertCircle size={18}/><span className="min-w-0 flex-1">{error}</span><button disabled={loading} onClick={()=>load()} className="font-semibold underline disabled:opacity-50">Réessayer</button></div>}

    <div aria-label="Liste des clients" aria-busy={loading}>
      {loading&&!clients.length?<div role="status" className="flex min-h-64 items-center justify-center gap-2 text-sm text-gray-500"><Loader2 size={20} className="animate-spin"/>Chargement des clients…</div>:!filtered.length&&!error?<div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-500 dark:bg-blue-900/30 dark:text-blue-300">{filteredView?<Search size={23}/>:<Users size={23}/>}</span><h2 className="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">{filteredView?'Aucun dossier trouvé':'Votre premier client vous attend'}</h2><p className="mt-2 max-w-sm text-sm leading-6 text-gray-500 dark:text-gray-400">{filteredView?'Essayez un autre nom ou une autre étape du pipeline.':'Ajoutez un client pour renseigner sa recherche et commencer son accompagnement.'}</p><button onClick={filteredView?resetFilters:()=>setShowNew(true)} className={`mt-5 ${filteredView?secondary:primary}`}>{filteredView?'Effacer les filtres':<><Plus size={16}/>Ajouter un client</>}</button></div>:<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{filtered.map(client=>{
        const stage=PIPELINE_STAGES.find(item=>item.step===client.step);const budget=Number(client.budget);
        return <article key={client.id} data-client-card={client.id} className="flex min-w-0 flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-800">
          <div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xs font-semibold text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">{initials(client.name)}</span><Link to={`/client/${client.id}`} title={client.name} className="group min-w-0 flex-1 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"><h2 className="truncate text-sm font-semibold text-gray-900 group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-300">{client.name}</h2><p className="mt-1 flex items-center gap-1 text-[10px] text-gray-400">Dossier #{client.id}<ArrowUpRight size={11}/></p></Link></div>
          <div className="mt-4"><span className={`inline-flex max-w-full items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium ${stage?.badge||'bg-gray-100 text-gray-500'}`}><span className={`h-1.5 w-1.5 shrink-0 rounded-full ${stage?.accent||'bg-gray-400'}`}/>{stage?.title||'Étape à préciser'}</span><div className="mt-3 grid grid-cols-6 gap-1" aria-label={stage?`Étape ${client.step} sur 6`:'Étape à préciser'}>{PIPELINE_STAGES.map(item=><span key={item.step} className={`h-1 rounded-full ${stage&&item.step<=client.step?stage.accent:'bg-gray-100 dark:bg-gray-700'}`}/>)}</div></div>
          <div className="mt-4 space-y-2.5 text-xs text-gray-500 dark:text-gray-400"><div className="flex min-w-0 items-center gap-2"><Mail size={14} className="shrink-0 text-gray-400"/>{client.email?<a href={`mailto:${client.email}`} title={client.email} className="truncate hover:text-blue-600 dark:hover:text-blue-300">{client.email}</a>:<span>Email non renseigné</span>}</div><div className="flex items-center gap-2"><Phone size={14} className="shrink-0 text-gray-400"/>{client.phone?<a href={`tel:${client.phone.replace(/\s/g,'')}`} className="hover:text-blue-600 dark:hover:text-blue-300">{client.phone}</a>:<span>Téléphone non renseigné</span>}</div></div>
          <div className="mb-4 mt-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-900/50"><p className="flex min-w-0 items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-300"><Car size={15} className="shrink-0 text-gray-400"/><span className="truncate" title={vehicleSearchLabels(client).join(' / ')}>{vehicleSearchLabels(client).join(' / ')||'Véhicule à définir'}</span></p><div className="mt-3 flex items-center justify-between gap-2 border-t border-gray-200/70 pt-2.5 dark:border-gray-700"><span className="text-[10px] font-medium uppercase tracking-wide text-gray-400">Budget véhicule</span><span className="text-xs font-semibold tabular-nums text-gray-700 dark:text-gray-200">{Number.isFinite(budget)&&budget>0?budget.toLocaleString('fr-FR',{style:'currency',currency:'EUR',maximumFractionDigits:0}):'À définir'}</span></div></div>
          <footer className="mt-auto flex items-center justify-between gap-2 border-t border-gray-100 pt-3 dark:border-gray-700"><Link to={`/client/${client.id}`} className="inline-flex items-center gap-1.5 rounded-lg text-xs font-semibold text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 dark:text-blue-300">Ouvrir le dossier<ArrowUpRight size={14}/></Link><div className="flex shrink-0 items-center gap-0.5"><Link to={`/client/${client.id}/profile`} aria-label={`Voir la fiche de ${client.name}`} title="Voir la fiche client" className={iconButton}><Eye size={15}/></Link><button onClick={()=>setEditing(client)} aria-label={`Modifier ${client.name}`} title="Modifier le client" className={iconButton}><Edit2 size={15}/></button><button onClick={()=>setDeleting(client)} aria-label={`Supprimer ${client.name}`} title="Supprimer le client" className={`${iconButton} hover:!bg-red-50 hover:!text-red-600 dark:hover:!bg-red-900/20`}><Trash2 size={15}/></button></div></footer>
        </article>;
      })}</div>}
    </div>

    <NewClientModal isOpen={showNew} onClose={()=>setShowNew(false)} onSubmit={addClient}/>
    {editing&&<EditClientModal isOpen onClose={()=>{if(!updating)setEditing(null);}} onSubmit={updateClient} isUpdating={updating} clientData={{name:editing.name,first_name:editing.first_name||'',last_name:editing.last_name||'',email:editing.email||'',phone:editing.phone||'',marque:editing.marque||'',modele:editing.modele||'',budget:editing.budget===null||editing.budget===undefined?'':String(editing.budget),max_km:editing.max_km===null||editing.max_km===undefined?'':String(editing.max_km),carburant:editing.carburant||'',boite:editing.boite||'',puissance_min:editing.puissance_min===null||editing.puissance_min===undefined?'':String(editing.puissance_min),couleur:editing.couleur||editing.vehicle_color||'',description:editing.description||'',premiere_immat:editing.premiere_immat||editing.first_registration||''}}/>}
    {deleting&&<DeleteClientModal isOpen onClose={()=>{if(!removing)setDeleting(null);}} onConfirm={deleteClient} clientName={deleting.name} isDeleting={removing}/>}
  </section>;
}
