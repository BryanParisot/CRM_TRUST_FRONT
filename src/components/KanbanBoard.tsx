import React, { useState, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import KanbanColumn from "./KanbanColumn";
import KanbanCard from "./KanbanCard";
import { PlusIcon, RefreshCwIcon } from "lucide-react";
import NewClientModal from "./NewClientModal";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export interface Client {
  id: number;
  name: string;
  marque?: string;
  modele?: string;
  vehicle?: string;
  step: number;
  progress: number;
  hasNotification: boolean;
  mileage?: number;
  year?: number;
  premiere_immat?: string;
  price?: string;
  selectedVehicles?: string[];
  budget?: number | string;
}

export interface Column {
  id: string;
  title: string;
  step: number;
}

const initialColumns: Column[] = [
  { id: "col-1", title: "Étape 1 — Infos & Présélection", step: 1 },
  { id: "col-2", title: "Étape 2 — Sélection Client", step: 2 },
  { id: "col-3", title: "Étape 3 — Acompte & Identité", step: 3 },
  { id: "col-4", title: "Étape 4 — Checklist Garage", step: 4 },
  { id: "col-5", title: "Étape 5 — Paiement Final", step: 5 },
  { id: "col-6", title: "Étape 6 — Livraison", step: 6 },
];

const KanbanBoard: React.FC = () => {
  const [columns] = useState<Column[]>(initialColumns);
  const [clients, setClients] = useState<Client[]>([]);
  const [activeClient, setActiveClient] = useState<Client | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  // Fetch clients
  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/clients", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Erreur de chargement clients");
      const data = await res.json();
      setClients(data);
    } catch (error) {
      toast.error("❌ Erreur lors du chargement des clients");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const draggedClient = clients.find((client) => client.id === active.id);
    if (draggedClient) setActiveClient(draggedClient);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return setActiveClient(null);

    const activeClientId = Number(active.id);
    const overColumnId = over.id as string;

    if (overColumnId.startsWith("col-")) {
      const targetColumn = columns.find((col) => col.id === overColumnId);
      if (targetColumn) {
        setClients((prev) =>
          prev.map((client) =>
            client.id === activeClientId
              ? { ...client, step: targetColumn.step }
              : client
          )
        );

        try {
          const res = await fetch(
            `http://localhost:3000/api/client-steps/${activeClientId}/steps`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                to_step: targetColumn.step,
                changed_by: "admin",
              }),
            }
          );
          if (!res.ok) throw new Error("Erreur mise à jour étape");
          toast.success("✅ Étape mise à jour !");
        } catch (error) {
          toast.error("❌ Erreur côté serveur");
        }
      }
    }
    setActiveClient(null);
  };

  const getClientsByStep = (step: number) =>
    clients.filter((c) => c.step === step);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const addClient = (
    newClient: Omit<Client, "id" | "step" | "progress" | "hasNotification">
  ) => {
    const client: Client = {
      id: Date.now(),
      step: 1,
      progress: 0,
      hasNotification: false,
      ...newClient,
    };
    setClients([...clients, client]);
    closeModal();
  };

  return (
    <div className="h-full w-full flex flex-col">
      {/* Header Top */}
      <div className="flex items-center justify-between mb-6 px-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Pipeline Clients
            </span>
            🚗
          </h2>
        </div>
        <button
          onClick={fetchClients}
          className="flex items-center text-sm px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm hover:shadow-md">
          <RefreshCwIcon className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Rafraîchir
        </button>
      </div>

      {/* Board */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToParentElement]}
      >
        <motion.div
          layout
          className="flex overflow-x-auto gap-4 pb-4 h-full min-h-[calc(100vh-200px)] px-2"
        >
          {columns.map((column) => (
            <SortableContext
              key={column.id}
              items={getClientsByStep(column.step).map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <KanbanColumn
                  id={column.id}
                  title={column.title}
                  step={column.step}
                  isArchived={column.step === 6}
                >
                  {getClientsByStep(column.step).map((client) => (
                    <KanbanCard key={client.id} client={client} />
                  ))}

                  {column.step === 1 && (
                    <button
                      onClick={openModal}
                      className="mt-3 w-full flex items-center justify-center py-3 px-4 border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-xl text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200 group">
                      <PlusIcon className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                      Ajouter un client
                    </button>
                  )}
                </KanbanColumn>
              </motion.div>
            </SortableContext>
          ))}
        </motion.div>

        <DragOverlay>
          {activeClient ? <KanbanCard client={activeClient} isDragging /> : null}
        </DragOverlay>
      </DndContext>

      <NewClientModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={addClient}
      />
    </div>
  );
};

export default KanbanBoard;
