import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Grid, Calendar, ClipboardList, Megaphone, X, Hexagon, CalendarDays } from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Announcements', path: '/announcements', icon: <Megaphone size={20} /> },
    { name: 'Clubs', path: '/clubs', icon: <Grid size={20} /> },
    { name: 'Events', path: '/events', icon: <Calendar size={20} /> },
    { name: 'Calendar', path: '/calendar', icon: <CalendarDays size={20} /> },
    { name: 'Registrations', path: '/registrations', icon: <ClipboardList size={20} /> },
  ];

  return (
    <div className={`
      fixed inset-y-0 left-0 z-30 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)]
      lg:translate-x-0 lg:static lg:inset-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      {/* Brand Header */}
      <div className="flex items-center justify-between h-20 px-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200/50">
            <Hexagon className="text-white" size={24} fill="currentColor" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Evnity Admin
          </h1>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="lg:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 scrollbar-hide">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">Overview</div>
        
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center px-3 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm border border-indigo-100/50'
                  : 'text-gray-500 font-medium hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`mr-3 transition-colors duration-200 ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-500'}`}>
                  {item.icon}
                </div>
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center space-x-3">
           <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
             A
           </div>
           <div className="flex flex-col">
             <span className="text-sm font-bold text-gray-800">Admin User</span>
             <span className="text-xs text-gray-500 font-medium">admin@evnity.dev</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
