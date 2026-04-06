'use client';

import { Task, TaskStatus, Priority } from '@/types';
import { useTaskStore } from '@/store/taskStore';
import { Trash2, CheckCircle, Circle, Edit2, Calendar, Flag, Clock } from 'lucide-react';
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
  const { updateTaskStatus, deleteTask } = useTaskStore();

  const handleStatusChange = async () => {
    let nextStatus: TaskStatus;
    if (task.status === TaskStatus.PENDING) nextStatus = TaskStatus.IN_PROGRESS;
    else if (task.status === TaskStatus.IN_PROGRESS) nextStatus = TaskStatus.COMPLETED;
    else nextStatus = TaskStatus.PENDING;

    try {
      await updateTaskStatus(task.id, nextStatus);
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

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.HIGH: return 'text-rose-600 bg-rose-50 border-rose-100';
      case Priority.MEDIUM: return 'text-amber-600 bg-amber-50 border-amber-100';
      case Priority.LOW: return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED: return <CheckCircle className="w-6 h-6 fill-emerald-50 text-emerald-500" />;
      case TaskStatus.IN_PROGRESS: return <Clock className="w-6 h-6 text-indigo-500" />;
      default: return <Circle className="w-6 h-6 text-slate-300 group-hover:text-indigo-500" />;
    }
  };

  const isCompleted = task.status === TaskStatus.COMPLETED;

  return (
    <div className={cn(
      "group bg-white p-5 rounded-2xl border transition-all duration-200 hover:shadow-md",
      isCompleted ? "border-slate-100 bg-slate-50/50" : "border-slate-200"
    )}>
      <div className="flex items-start gap-4">
        <button 
          onClick={handleStatusChange}
          className="mt-1 flex-shrink-0 transition-colors"
          title={`Status: ${task.status}`}
        >
          {getStatusIcon(task.status)}
        </button>

        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn(
              "px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border",
              getPriorityColor(task.priority)
            )}>
              {task.priority}
            </span>
            {task.dueDate && (
              <span className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                <Calendar className="w-3 h-3" />
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
          
          <h3 className={cn(
            "text-lg font-semibold truncate transition-all",
            isCompleted ? "text-slate-400 line-through" : "text-slate-800"
          )}>
            {task.title}
          </h3>
          {task.description && (
            <p className={cn(
              "text-sm mt-1 line-clamp-2",
              isCompleted ? "text-slate-400" : "text-slate-600"
            )}>
              {task.description}
            </p>
          )}
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
