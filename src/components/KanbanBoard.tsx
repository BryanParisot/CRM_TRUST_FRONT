import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import { PlusIcon } from 'lucide-react';
import NewClientModal from './NewClientModal';
export interface Client {
  id: string;
  name: string;
  vehicle: string;
  step: number;
  progress: number;
  hasNotification: boolean;
  mileage?: number;
  year?: number;
  selectedVehicles?: string[];
  depositPaid?: boolean;
  idCardSent?: boolean;
  checklistCompleted?: boolean;
  finalPaymentDone?: boolean;
}
export interface Column {
  id: string;
  title: string;
  step: number;
}
const initialColumns: Column[] = [{
  id: 'col-1',
  title: 'Étape 1: Infos Client & Présélection Véhicules',
  step: 1
}, {
  id: 'col-2',
  title: 'Étape 2: Sélection Client (max 3 véhicules)',
  step: 2
}, {
  id: 'col-3',
  title: "Étape 3: Acompte 30% & Pièce d'identité",
  step: 3
}, {
  id: 'col-4',
  title: 'Étape 4: Validation Checklist Garage',
  step: 4
}, {
  id: 'col-5',
  title: 'Étape 5: Documents & Paiement Final',
  step: 5
}, {
  id: 'col-6',
  title: 'Étape 6: Livraison Véhicule',
  step: 6
}];
const initialClients: Client[] = [{
  id: 'client-1',
  name: 'John Doe',
  vehicle: 'BMW X3',
  step: 1,
  progress: 75,
  hasNotification: false,
  mileage: 45000,
  year: 2020
}, {
  id: 'client-2',
  name: 'Jane Smith',
  vehicle: 'Audi Q5',
  step: 1,
  progress: 50,
  hasNotification: false,
  mileage: 32000,
  year: 2021
}, {
  id: 'client-3',
  name: 'Mike Johnson',
  vehicle: 'Mercedes GLC',
  step: 1,
  progress: 25,
  hasNotification: false,
  mileage: 28500,
  year: 2022
}, {
  id: 'client-4',
  name: 'Sarah Williams',
  vehicle: 'Volvo XC60',
  step: 2,
  progress: 60,
  hasNotification: true,
  mileage: 15000,
  year: 2022,
  selectedVehicles: ['Volvo XC60', 'Volvo XC40', 'Audi Q3']
}, {
  id: 'client-5',
  name: 'Robert Brown',
  vehicle: 'BMW X5',
  step: 2,
  progress: 40,
  hasNotification: false,
  mileage: 52000,
  year: 2019,
  selectedVehicles: ['BMW X5', 'BMW X3']
}, {
  id: 'client-6',
  name: 'Emily Davis',
  vehicle: 'Audi A6',
  step: 3,
  progress: 80,
  hasNotification: false,
  mileage: 38000,
  year: 2020,
  selectedVehicles: ['Audi A6'],
  depositPaid: true,
  idCardSent: false
}, {
  id: 'client-7',
  name: 'David Wilson',
  vehicle: 'Mercedes E-Class',
  step: 4,
  progress: 85,
  hasNotification: false,
  mileage: 25000,
  year: 2021,
  selectedVehicles: ['Mercedes E-Class'],
  depositPaid: true,
  idCardSent: true,
  checklistCompleted: false
}, {
  id: 'client-8',
  name: 'Lisa Miller',
  vehicle: 'BMW 5 Series',
  step: 5,
  progress: 95,
  hasNotification: false,
  mileage: 18000,
  year: 2022,
  selectedVehicles: ['BMW 5 Series'],
  depositPaid: true,
  idCardSent: true,
  checklistCompleted: true,
  finalPaymentDone: false
}, {
  id: 'client-9',
  name: 'Michael Taylor',
  vehicle: 'Audi A4',
  step: 6,
  progress: 100,
  hasNotification: false,
  mileage: 12000,
  year: 2022,
  selectedVehicles: ['Audi A4'],
  depositPaid: true,
  idCardSent: true,
  checklistCompleted: true,
  finalPaymentDone: true
}, {
  id: 'client-10',
  name: 'Jennifer Garcia',
  vehicle: 'Volvo S60',
  step: 6,
  progress: 100,
  hasNotification: false,
  mileage: 9500,
  year: 2023,
  selectedVehicles: ['Volvo S60'],
  depositPaid: true,
  idCardSent: true,
  checklistCompleted: true,
  finalPaymentDone: true
}, {
  id: 'client-11',
  name: 'Thomas Rodriguez',
  vehicle: 'Mercedes C-Class',
  step: 6,
  progress: 100,
  hasNotification: false,
  mileage: 22000,
  year: 2021,
  selectedVehicles: ['Mercedes C-Class'],
  depositPaid: true,
  idCardSent: true,
  checklistCompleted: true,
  finalPaymentDone: true
}];
const KanbanBoard: React.FC = () => {
  const [columns] = useState<Column[]>(initialColumns);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [activeClient, setActiveClient] = useState<Client | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8
    }
  }));
  const handleDragStart = (event: DragStartEvent) => {
    const {
      active
    } = event;
    const draggedClient = clients.find(client => client.id === active.id);
    if (draggedClient) {
      setActiveClient(draggedClient);
    }
  };
  const handleDragEnd = (event: DragEndEvent) => {
    const {
      active,
      over
    } = event;
    if (!over) {
      setActiveClient(null);
      return;
    }
    if (active.id !== over.id) {
      const activeClientId = active.id as string;
      const overColumnId = over.id as string;
      if (overColumnId.startsWith('col-')) {
        // We're dropping onto a column
        const targetColumn = columns.find(col => col.id === overColumnId);
        if (targetColumn) {
          setClients(prevClients => prevClients.map(client => client.id === activeClientId ? {
            ...client,
            step: targetColumn.step
          } : client));
        }
      } else {
        // We're reordering within a column
        const oldIndex = clients.findIndex(client => client.id === activeClientId);
        const newIndex = clients.findIndex(client => client.id === over.id);
        setClients(arrayMove(clients, oldIndex, newIndex));
      }
    }
    setActiveClient(null);
  };
  const getClientsByStep = (step: number) => {
    return clients.filter(client => client.step === step);
  };
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const addClient = (newClient: Omit<Client, 'id' | 'step' | 'progress' | 'hasNotification'>) => {
    const client: Client = {
      id: `client-${clients.length + 1}`,
      step: 1,
      progress: 0,
      hasNotification: false,
      ...newClient
    };
    setClients([...clients, client]);
    closeModal();
  };
  return <div className="h-full">
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} modifiers={[restrictToParentElement]}>
        <div className="flex overflow-x-auto pb-4 h-full">
          {columns.map(column => <SortableContext key={column.id} items={getClientsByStep(column.step).map(client => client.id)} strategy={verticalListSortingStrategy}>
              <KanbanColumn id={column.id} title={column.title} step={column.step} isArchived={column.step === 6}>
                {getClientsByStep(column.step).map(client => <KanbanCard key={client.id} client={client} />)}
                {column.step === 1 && <button onClick={openModal} className="mt-2 w-full flex items-center justify-center py-2 px-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
                    <PlusIcon className="w-4 h-4 mr-1" />
                    Ajouter Fiche
                  </button>}
              </KanbanColumn>
            </SortableContext>)}
        </div>
        <DragOverlay>
          {activeClient ? <KanbanCard client={activeClient} isDragging /> : null}
        </DragOverlay>
      </DndContext>
      <NewClientModal isOpen={isModalOpen} onClose={closeModal} onSubmit={addClient} />
    </div>;
};
export default KanbanBoard;