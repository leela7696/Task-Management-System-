'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { LogOut, User, CheckCircle2, LayoutDashboard } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 bg-white border-b border-slate-100 z-40 backdrop-blur-md bg-white/80">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">TaskFlow</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
            <div className="bg-indigo-100 p-1.5 rounded-full">
              <User className="w-4 h-4 text-indigo-600" />
            </div>
            <span className="text-sm font-semibold text-slate-700">{user?.name || user?.email}</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-500 hover:text-rose-600 font-medium transition-colors p-2 rounded-lg hover:bg-rose-50"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
