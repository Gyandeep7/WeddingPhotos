import React from 'react';
import { Image, Video, Heart, Grid3X3, Sparkles } from 'lucide-react';

export type FilterType = 'all' | 'photos' | 'videos' | 'favorites';

interface FilterTabsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts: {
    all: number;
    photos: number;
    videos: number;
    favorites: number;
  };
}

const FilterTabs: React.FC<FilterTabsProps> = ({ activeFilter, onFilterChange, counts }) => {
  const tabs = [
    { id: 'all' as FilterType, label: 'All Memories', icon: Grid3X3, count: counts.all, color: 'blue' },
    { id: 'photos' as FilterType, label: 'Photos', icon: Image, count: counts.photos, color: 'red' },
    { id: 'videos' as FilterType, label: 'Videos', icon: Video, count: counts.videos, color: 'purple' },
    { id: 'favorites' as FilterType, label: 'Favorites', icon: Heart, count: counts.favorites, color: 'red' },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-12">
      {tabs.map(({ id, label, icon: Icon, count, color }) => (
        <button
          key={id}
          onClick={() => onFilterChange(id)}
          className={`group relative flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 ${
            activeFilter === id
              ? `bg-gradient-to-r ${
                  color === 'blue' ? 'from-blue-500 to-blue-600' :
                  color === 'red' ? 'from-red-500 to-red-600' :
                  color === 'purple' ? 'from-purple-500 to-purple-600' :
                  'from-red-500 to-red-600'
                } text-white shadow-3d-hover`
              : 'bg-white/90 backdrop-blur-md text-gray-600 hover:text-blue-600 border border-blue-200/50 shadow-3d hover:shadow-3d-hover'
          }`}
        >
          {/* Glow Effect for Active Tab */}
          {activeFilter === id && (
            <div className={`absolute inset-0 rounded-2xl blur-lg opacity-30 ${
              color === 'blue' ? 'bg-blue-400' :
              color === 'red' ? 'bg-red-400' :
              color === 'purple' ? 'bg-purple-400' :
              'bg-red-400'
            }`}></div>
          )}
          
          {/* Content */}
          <div className="relative flex items-center gap-3">
            <Icon className={`h-5 w-5 transition-all duration-300 ${
              activeFilter === id ? 'animate-pulse-slow' : 'group-hover:scale-110'
            }`} />
            <span className="font-semibold text-lg">{label}</span>
            
            {/* Count Badge */}
            <span className={`px-3 py-1 rounded-full text-sm font-bold transition-all duration-300 ${
              activeFilter === id
                ? 'bg-white/20 text-white'
                : `${
                    color === 'rose' ? 'bg-rose-100 text-rose-600' :
                    color === 'blue' ? 'bg-blue-100 text-blue-600' :
                    color === 'red' ? 'bg-red-100 text-red-600' :
                    color === 'purple' ? 'bg-purple-100 text-purple-600' :
                    'bg-red-100 text-red-600'
                  }`
            }`}>
              {count}
            </span>

            {/* Sparkle for Active Tab */}
            {activeFilter === id && (
              <Sparkles className="h-4 w-4 animate-pulse-slow" />
            )}
          </div>

          {/* Shimmer Effect */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer rounded-2xl"></div>
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;