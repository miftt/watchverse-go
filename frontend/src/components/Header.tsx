import React from 'react';
import { Search, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, onSearchChange, onSearchSubmit }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-[#141414] py-4 px-6 fixed w-full top-0 z-50">
      <nav className="flex items-center justify-between max-w-7xl mx-auto">
        <h1 
          onClick={() => navigate('/')} 
          className="text-2xl font-bold text-blue-500 cursor-pointer"
        >
          WatchVerse
        </h1>
        
        <div className="flex items-center space-x-6">
          <form onSubmit={onSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search movies..."
              className="bg-[#1a1a1a] text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </form>
          
          <button 
            onClick={() => navigate('/')} 
            className="hover:text-blue-500 transition-colors"
          >
            Home
          </button>
          
          <button 
            onClick={handleLogout} 
            className="flex cursor-pointer items-center space-x-2 text-red-500 hover:text-red-600 transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header; 