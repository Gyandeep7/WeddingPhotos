import { useState, useEffect } from 'react';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    const storedFavorites = localStorage.getItem('wedding-gallery-favorites');
    if (storedFavorites) {
      setFavorites(new Set(JSON.parse(storedFavorites)));
    }
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      localStorage.setItem('wedding-gallery-favorites', JSON.stringify(Array.from(newFavorites)));
      return newFavorites;
    });
  };

  const isFavorite = (id: string) => favorites.has(id);

  return { favorites, toggleFavorite, isFavorite };
};