'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useTaskStore } from '@/store/taskStore';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import TaskCard from '@/components/tasks/TaskCard';
import TaskForm from '@/components/tasks/TaskForm';
import { Search, Filter, Plus, Loader2, ClipboardList, CheckSquare, ListTodo, MoreVertical, Flag, Tag } from 'lucide-react';
import { Task, TaskStatus, Priority } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function DashboardPage() {
  const { user, accessToken } = useAuthStore();
  const { 
    tasks, 
    fetchTasks, 
    isLoading, 
    total, 
    search, 
    setSearch, 
    status, 
    setStatus, 
    priority, 
    setPriority, 
    page, 
    setPage 
  } = useTaskStore();
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

  const completedCount = tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
  const inProgressCount = tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length;
  const pendingCount = tasks.filter(t => t.status === TaskStatus.PENDING).length;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
            <p className="text-slate-500 font-medium tracking-tight">Manage your daily goals and track progress</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <StatCard 
            icon={<ClipboardList className="text-indigo-600 w-6 h-6" />}
            label="Total"
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
            icon={<Loader2 className="text-blue-600 w-6 h-6" />}
            label="In Progress"
            value={inProgressCount}
            color="bg-blue-50 border-blue-100"
          />
          <StatCard 
            icon={<ListTodo className="text-amber-600 w-6 h-6" />}
            label="Pending"
            value={pendingCount}
            color="bg-amber-50 border-amber-100"
          />
        </div>

        {/* Filters Section */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative flex-grow w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tasks..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                <Tag className="w-4 h-4 text-slate-400" />
                <select 
                  className="bg-transparent text-sm font-semibold text-slate-600 focus:outline-none"
                  value={status || ''}
                  onChange={(e) => setStatus(e.target.value as TaskStatus || undefined)}
                >
                  <option value="">All Status</option>
                  <option value={TaskStatus.PENDING}>Pending</option>
                  <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                  <option value={TaskStatus.COMPLETED}>Completed</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                <Flag className="w-4 h-4 text-slate-400" />
                <select 
                  className="bg-transparent text-sm font-semibold text-slate-600 focus:outline-none"
                  value={priority || ''}
                  onChange={(e) => setPriority(e.target.value as Priority || undefined)}
                >
                  <option value="">All Priority</option>
                  <option value={Priority.LOW}>Low</option>
                  <option value={Priority.MEDIUM}>Medium</option>
                  <option value={Priority.HIGH}>High</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
            <p className="text-slate-500 font-medium">Loading your tasks...</p>
          </div>
        ) : tasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onEdit={handleEdit} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-200 border-dashed">
            <div className="bg-slate-50 p-6 rounded-full mb-6">
              <ClipboardList className="w-12 h-12 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No tasks found</h3>
            <p className="text-slate-500 max-w-xs text-center mb-8 font-medium">
              {search || status || priority 
                ? "We couldn't find any tasks matching your current filters." 
                : "You haven't created any tasks yet. Start by creating your first goal!"}
            </p>
            {!search && !status && !priority && (
              <button
                onClick={openCreateForm}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl transition-all active:scale-95"
              >
                <Plus className="w-5 h-5" />
                <span>Create Task</span>
              </button>
            )}
          </div>
        )}

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
