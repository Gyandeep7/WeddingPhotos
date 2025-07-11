import React from 'react';
import { Search, Sparkles } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="relative max-w-lg mx-auto mb-12">
      <div className="relative group">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-red-400 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
        
        {/* Search Input Container */}
        <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-3d border border-blue-200/50 overflow-hidden">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-blue-400 group-hover:text-blue-500 transition-colors duration-300" />
          </div>
          
          <input
            type="text"
            placeholder="Search your precious memories..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-16 pr-16 py-5 bg-transparent text-gray-700 placeholder-blue-300 text-lg font-medium focus:outline-none focus:ring-0 transition-all duration-300"
          />
          
          {/* Decorative Sparkles */}
          <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none">
            <div className="flex gap-1">
              <Sparkles className="h-4 w-4 text-red-400 animate-pulse-slow" />
              <Sparkles className="h-3 w-3 text-blue-400 animate-pulse-slow" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>
        </div>

        {/* Shimmer Effect */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-shimmer rounded-3xl"></div>
      </div>
    </div>
  );
};

export default SearchBar;