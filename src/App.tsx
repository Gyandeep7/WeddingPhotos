import React, { useState, useMemo } from 'react';
import { Camera, Sparkles, Heart, Star } from 'lucide-react';
import { useMediaData } from './hooks/useMediaData';
import { useFavorites } from './hooks/useFavorites';
import SearchBar from './components/SearchBar';
import FilterTabs, { FilterType } from './components/FilterTabs';
import MediaCard from './components/MediaCard';
import { ConnectionStatus } from './components/ConnectionStatus';

function App() {
  const { mediaData, loading, error } = useMediaData();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredMedia = useMemo(() => {
    let filtered = mediaData.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (activeFilter) {
      case 'photos':
        filtered = filtered.filter(item => item.type === 'photo');
        break;
      case 'videos':
        filtered = filtered.filter(item => item.type === 'video');
        break;
      case 'favorites':
        filtered = filtered.filter(item => isFavorite(item.id));
        break;
      default:
        break;
    }

    return filtered;
  }, [mediaData, searchTerm, activeFilter, favorites]);

  const counts = useMemo(() => {
    const searchFiltered = mediaData.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return {
      all: searchFiltered.length,
      photos: searchFiltered.filter(item => item.type === 'photo').length,
      videos: searchFiltered.filter(item => item.type === 'video').length,
      favorites: searchFiltered.filter(item => isFavorite(item.id)).length,
    };
  }, [mediaData, searchTerm, favorites]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 flex items-center justify-center relative overflow-hidden">
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/30 rounded-full animate-float"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-red-200/30 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-32 left-1/3 w-20 h-20 bg-purple-200/30 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-500 mx-auto shadow-3d"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-blue-300 mx-auto"></div>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-3d">
            <h2 className="text-2xl font-script text-blue-600 mb-2">Loading</h2>
            <p className="text-blue-500 font-medium">Preparing your precious memories...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center bg-white/90 backdrop-blur-md rounded-3xl p-12 shadow-3d max-w-md">
          <div className="text-blue-400 mb-6">
            <Camera className="h-16 w-16 mx-auto animate-bounce-slow" />
          </div>
          <h2 className="text-xl font-script text-blue-600 mb-4">Oops!</h2>
          <p className="text-blue-600 font-medium mb-2">Failed to load media gallery</p>
          <p className="text-blue-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-br from-blue-200/20 to-red-200/20 rounded-full animate-float blur-xl"></div>
        <div className="absolute top-1/3 right-20 w-32 h-32 bg-gradient-to-br from-purple-200/20 to-blue-200/20 rounded-full animate-float blur-xl" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-28 h-28 bg-gradient-to-br from-red-200/20 to-purple-200/20 rounded-full animate-float blur-xl" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-1/3 right-1/3 w-36 h-36 bg-gradient-to-br from-blue-200/15 to-red-200/15 rounded-full animate-float blur-xl" style={{ animationDelay: '6s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/70 backdrop-blur-xl border-b border-blue-200/50 sticky top-0 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            {/* Couple Names */}
            <div className="mb-6">
              <h1 className="text-5xl md:text-6xl font-script bg-gradient-to-r from-blue-500 via-red-500 to-blue-600 bg-clip-text text-transparent animate-fade-in">
                Gyandeep & Shirissha
              </h1>
              <div className="flex items-center justify-center gap-4 mt-4">
                <div className="h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent flex-1 max-w-32"></div>
                <Heart className="h-6 w-6 text-red-400 animate-pulse-slow" />
                <div className="h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent flex-1 max-w-32"></div>
              </div>
            </div>

            {/* Gallery Title */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="h-8 w-8 text-red-500 animate-bounce-slow" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-red-600 bg-clip-text text-transparent">
                Wedding Gallery
              </h2>
              <Sparkles className="h-8 w-8 text-red-500 animate-bounce-slow" style={{ animationDelay: '1s' }} />
            </div>
            
            <p className="text-blue-600 font-medium text-lg">
              Cherishing every precious moment of our special day
            </p>

            {/* Decorative Stars */}
            <div className="flex justify-center gap-2 mt-4">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className="h-4 w-4 text-red-400 animate-pulse-slow" 
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        
        <FilterTabs
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          counts={counts}
        />

        {filteredMedia.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-12 shadow-3d max-w-md mx-auto">
              <Camera className="h-20 w-20 text-blue-300 mx-auto mb-6 animate-bounce-slow" />
              <h3 className="text-2xl font-script text-gray-600 mb-4">
                No memories found
              </h3>
              <p className="text-gray-500">
                {searchTerm ? 'Try adjusting your search term' : 'No media matches your current filter'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredMedia.map((item, index) => (
              <div
                key={item.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <MediaCard
                  title={item.title}
                  url={item.url}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-white/70 backdrop-blur-xl border-t border-blue-200/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="mb-6">
              <h3 className="text-2xl font-script bg-gradient-to-r from-blue-500 to-red-600 bg-clip-text text-transparent mb-2">
                Made with Love
              </h3>
              <p className="text-blue-600 font-medium">
                For Gyandeep & Shirissha's Special Day
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-6 text-sm text-blue-400">
              <div className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                <span>{mediaData.length} precious memories</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span>{favorites.size} favorites</span>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="flex justify-center gap-4 mt-6">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse-slow"></div>
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse-slow" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Connection Status (Development Only) */}
      <ConnectionStatus pcloudUrl="https://u.pcloud.link/publink/show?code=kZVq7B5ZvW8P3j3wghLzuQsTX9vpP5qBuSb7" />
    </div>
  );
}

export default App;