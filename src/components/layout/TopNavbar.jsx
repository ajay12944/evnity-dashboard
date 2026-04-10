import { Bell, Search, Menu, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const TopNavbar = ({ onMenuClick }) => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 flex items-center justify-between px-4 sm:px-8 z-10 sticky top-0 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
      
      {/* Mobile Menu & Search */}
      <div className="flex items-center">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 mr-3 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
        >
          <Menu size={24} />
        </button>

        <div className="relative hidden md:flex items-center group">
          <Search className="absolute left-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search anything..."
            className="pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200/80 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 w-72 transition-all font-medium text-sm text-gray-700 placeholder-gray-400"
          />
          <div className="absolute right-3 flex items-center space-x-1">
            <kbd className="hidden lg:inline-flex items-center justify-center px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded-md">⌘</kbd>
            <kbd className="hidden lg:inline-flex items-center justify-center px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded-md">K</kbd>
          </div>
        </div>
      </div>

      {/* Actions & Profile */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        <button className="relative p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>

        <div className="h-6 w-px bg-gray-200 hidden sm:block mx-2"></div>

        <div className="flex items-center space-x-3 cursor-pointer p-1.5 pr-3 hover:bg-gray-50 rounded-xl border border-transparent hover:border-gray-200 transition-all group dropdown-wrapper">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-200">
            A
          </div>
          <div className="flex-col items-start hidden sm:flex">
            <span className="text-sm font-bold text-gray-900 leading-none mb-1">Administrator</span>
            <span className="text-xs font-medium text-gray-500 leading-none">Global Access</span>
          </div>
          <ChevronDown size={16} className="text-gray-400 group-hover:text-indigo-500 transition-colors ml-1 hidden sm:block" />
          
          {/* Simple Dropdown onClick usually, but we'll use a hover dropdown for UI simplicity or just the logout button natively */}
        </div>
        
        {/* We keep the explicit logout button for direct access as well, or merge it. Let's merge it out for a cleaner look and keep the manual button for now so functionality isn't lost */}
        <button 
          onClick={handleLogout}
          className="p-2 sm:px-4 sm:py-2 text-sm font-semibold text-gray-600 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-xl transition-colors hidden sm:flex items-center"
        >
          Sign out
        </button>
      </div>
    </header>
  );
};

export default TopNavbar;
