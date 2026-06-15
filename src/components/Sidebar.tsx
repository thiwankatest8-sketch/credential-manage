import { Shield, LayoutDashboard, LogOut, X, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const initials = user
    ? `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase()
    : 'U';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose?.();
  };

  const menuItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Security',
      path: '/security',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Logo area */}
      <div
        className="p-6 relative"
        style={{
          background:
            'radial-gradient(ellipse 120% 80% at 0% 0%, rgba(124,58,237,0.2) 0%, transparent 60%)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-600/30 border border-violet-500/40 flex items-center justify-center flex-shrink-0">
            <Shield size={18} className="text-violet-400" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">VaultNest</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors md:hidden"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <div className="px-3">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-r-lg border-l-2 transition-all duration-200 ${
                  isActive
                    ? 'text-violet-400 bg-violet-600/20 border-violet-500'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/80 border-transparent'
                }`}
                onClick={() => handleNavigate(item.path)}
              >
                <Icon size={18} />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* User area */}
      <div className="border-t border-gray-800 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-semibold text-sm">{initials}</span>
          </div>
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-gray-400 text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors text-sm w-full px-2 py-1.5 rounded-lg hover:bg-red-500/10 min-h-[40px]"
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-gray-900 border-r border-gray-800 fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <aside className="relative z-10 w-64 bg-gray-900 border-r border-gray-800 h-full flex flex-col">
            <SidebarContent onClose={onClose} />
          </aside>
        </div>
      )}
    </>
  );
}
