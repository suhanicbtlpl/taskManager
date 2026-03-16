import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Briefcase,
    CheckSquare,
    ShieldCheck,
    LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/', permission: null },
        { name: 'Staff', icon: Users, path: '/staff', permission: 'VIEW_STAFF' },
        { name: 'Projects', icon: Briefcase, path: '/projects', permission: 'VIEW_PROJECT' },
        { name: 'Tasks', icon: CheckSquare, path: '/tasks', permission: 'VIEW_TASK' },
        { name: 'Roles', icon: ShieldCheck, path: '/roles', permission: 'VIEW_ROLE' },
    ];

    const filteredItems = menuItems.filter(item =>
        !item.permission || 
        user?.role?.roleName === 'Admin' || 
        user?.role?.permissions.includes(item.permission)
    );

    return (
        <div className="w-64 h-screen bg-slate-900 text-slate-300 fixed left-0 top-0 flex flex-col">
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                    <Briefcase className="text-primary-500" />
                    ProManage
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {filteredItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-lg transition-all
              ${isActive
                                ? 'bg-primary-600 text-white'
                                : 'hover:bg-slate-800 hover:text-white'}
            `}
                    >
                        <item.icon size={20} />
                        <span className="font-medium">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center gap-3 px-4 py-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
                        {user?.name?.[0].toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.role?.roleName}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all font-medium"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
