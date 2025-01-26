import React from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  Calendar,
  Users,
  Settings,
  LogOut,
  PlusCircle,
  LayoutDashboard,
  ListPlus,
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, children, isActive }) => (
  <Link
    to={to}
    className={`flex items-center space-x-3 px-4 py-2 rounded-md transition-colors ${isActive
        ? 'bg-indigo-100 text-indigo-700'
        : 'text-gray-700 hover:bg-gray-100'
      }`}
  >
    {icon}
    <span>{children}</span>
  </Link>
);

export const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  const isAdmin = user?.roles.includes('ROLE_ADMIN');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md min-h-screen p-4">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-indigo-600">Event Manager</h1>
          </div>
          <nav className="space-y-2">
            <NavItem
              to="/dashboard"
              icon={<LayoutDashboard className="h-5 w-5" />}
              isActive={location.pathname === '/dashboard'}
            >
              Dashboard
            </NavItem>
            <NavItem
              to="/events"
              icon={<Calendar className="h-5 w-5" />}
              isActive={location.pathname === '/events'}
            >
              Events
            </NavItem>
            {isAdmin && (
              <>
                <NavItem
                  to="/events/new"
                  icon={<PlusCircle className="h-5 w-5" />}
                  isActive={location.pathname === '/events/new'}
                >
                  Create Event
                </NavItem>
                <NavItem
                  to="/categories"
                  icon={<ListPlus className="h-5 w-5" />}
                  isActive={location.pathname === '/categories'}
                >
                  Categories
                </NavItem>
              </>
            )}
            <NavItem
              to="/profile"
              icon={<Users className="h-5 w-5" />}
              isActive={location.pathname === '/profile'}
            >
              Profile
            </NavItem>
            <NavItem
              to="/settings"
              icon={<Settings className="h-5 w-5" />}
              isActive={location.pathname === '/settings'}
            >
              Settings
            </NavItem>
          </nav>
          <div className="absolute bottom-4 w-52">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-2 w-full text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};