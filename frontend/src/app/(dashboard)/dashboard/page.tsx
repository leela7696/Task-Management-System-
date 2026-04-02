'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useTaskStore } from '@/store/taskStore';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import TaskCard from '@/components/tasks/TaskCard';
import TaskForm from '@/components/tasks/TaskForm';
import { Search, Filter, Plus, Loader2, ClipboardList, CheckSquare, ListTodo, MoreVertical } from 'lucide-react';
import { Task } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function DashboardPage() {
  const { user, accessToken } = useAuthStore();
  const { tasks, fetchTasks, isLoading, total, search, setSearch, completed, setCompleted, page, setPage } = useTaskStore();
  const router = useRouter();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  useEffect(() => {
    if (!accessToken) {
      router.push('/login');
    } else {
      fetchTasks();
    }
  }, [accessToken, router, fetchTasks]);

  const handleEdit = (task: Task) => {
    setTaskToEdit(task);
    setIsFormOpen(true);
  };

  const openCreateForm = () => {
    setTaskToEdit(null);
    setIsFormOpen(true);
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
            <p className="text-slate-500 font-medium">Manage your daily goals and track progress</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openCreateForm}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3.5 rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span>Create Task</span>
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard 
            icon={<ClipboardList className="text-indigo-600 w-6 h-6" />}
            label="Total Tasks"
            value={total}
            color="bg-indigo-50 border-indigo-100"
          />
          <StatCard 
            icon={<CheckSquare className="text-emerald-600 w-6 h-6" />}
            label="Completed"
            value={completedCount}
            color="bg-emerald-50 border-emerald-100"
          />
          <StatCard 
            icon={<ListTodo className="text-amber-600 w-6 h-6" />}
            label="Pending"
            value={pendingCount}
            color="bg-amber-50 border-amber-100"
          />
        </div>

        {/* Filters Section */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-6">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by title..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            <FilterButton 
              active={completed === undefined} 
              onClick={() => setCompleted(undefined)}
              label="All"
            />
            <FilterButton 
              active={completed === true} 
              onClick={() => setCompleted(true)}
              label="Completed"
            />
            <FilterButton 
              active={completed === false} 
              onClick={() => setCompleted(false)}
              label="Pending"
            />
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="space-y-4 min-h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-indigo-600 w-10 h-10" />
            </div>
          ) : tasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={handleEdit} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 py-20 flex flex-col items-center justify-center text-center px-6">
              <div className="bg-slate-50 p-4 rounded-full mb-6">
                <ClipboardList className="w-12 h-12 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">No tasks found</h3>
              <p className="text-slate-500 mt-2 max-w-sm">
                {search || completed !== undefined 
                  ? "Try adjusting your filters to find what you're looking for." 
                  : "Start by creating your first task to stay organized."}
              </p>
            </div>
          )}
        </div>

        {/* Pagination Placeholder */}
        {total > tasks.length && (
          <div className="flex justify-center pt-8">
            {/* Simple pagination could go here */}
          </div>
        )}
      </main>

      <TaskForm 
        isOpen={isFormOpen} 
        onClose={() => {
          setIsFormOpen(false);
          setTaskToEdit(null);
        }}
        taskToEdit={taskToEdit}
      />
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: number, color: string }) {
  return (
    <div className={cn("p-6 rounded-3xl border transition-all hover:scale-[1.02]", color)}>
      <div className="flex items-center gap-4">
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-600">{label}</p>
          <p className="text-2xl font-black text-slate-900 mt-0.5">{value}</p>
        </div>
      </div>
    </div>
  );
}

function FilterButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-6 py-3 rounded-2xl font-bold transition-all whitespace-nowrap",
        active 
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
          : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100"
      )}
    >
      {label}
    </button>
  );
}
