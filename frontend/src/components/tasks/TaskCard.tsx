'use client';

import { Task } from '@/types';
import { useTaskStore } from '@/store/taskStore';
import { Trash2, CheckCircle, Circle, Edit2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import toast from 'react-hot-toast';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export default function TaskCard({ task, onEdit }: TaskCardProps) {
  const { toggleTask, deleteTask } = useTaskStore();

  const handleToggle = async () => {
    try {
      await toggleTask(task.id);
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(task.id);
        toast.success('Task deleted');
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  return (
    <div className={cn(
      "group bg-white p-5 rounded-2xl border transition-all duration-200 hover:shadow-md",
      task.completed ? "border-slate-100 bg-slate-50/50" : "border-slate-200"
    )}>
      <div className="flex items-start gap-4">
        <button 
          onClick={handleToggle}
          className={cn(
            "mt-1 flex-shrink-0 transition-colors",
            task.completed ? "text-emerald-500" : "text-slate-300 hover:text-indigo-500"
          )}
        >
          {task.completed ? (
            <CheckCircle className="w-6 h-6 fill-emerald-50" />
          ) : (
            <Circle className="w-6 h-6" />
          )}
        </button>

        <div className="flex-grow min-w-0">
          <h3 className={cn(
            "text-lg font-semibold truncate transition-all",
            task.completed ? "text-slate-400 line-through" : "text-slate-800"
          )}>
            {task.title}
          </h3>
          {task.description && (
            <p className={cn(
              "text-sm mt-1 line-clamp-2",
              task.completed ? "text-slate-400" : "text-slate-600"
            )}>
              {task.description}
            </p>
          )}
          <div className="mt-3 flex items-center text-xs text-slate-400 font-medium">
            <span>{new Date(task.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onEdit(task)}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={handleDelete}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
