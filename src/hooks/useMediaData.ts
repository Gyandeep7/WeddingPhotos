import { useState, useEffect } from 'react';
import { fetchPCloudImages } from '../utils/pcloudParser';
import { testPCloudConnection, debugPCloudContent } from '../utils/pcloudTest';

export interface MediaItem {
  id: string;
  type: 'photo' | 'video';
  title: string;
  url: string;
}

export const useMediaData = () => {
  const [mediaData, setMediaData] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMediaData = async () => {
      try {
        // pCloud link
        const pcloudUrl = 'https://u.pcloud.link/publink/show?code=kZVq7B5ZvW8P3j3wghLzuQsTX9vpP5qBuSb7';
        
        // Test connection first (for debugging)
        if (import.meta.env.DEV) {
          console.log('Testing pCloud connection...');
          const testResult = await testPCloudConnection(pcloudUrl);
          console.log('Connection test result:', testResult);
          
          if (!testResult.success) {
            console.log('Running debug analysis...');
            await debugPCloudContent(pcloudUrl);
          }
        }
        
        // Try multiple methods to fetch images from pCloud
        let pcloudImages = [];
        
        try {
          // Method 1: Use Vite proxy
          console.log('Trying Vite proxy method...');
          pcloudImages = await fetchPCloudImages(pcloudUrl);
        } catch (error) {
          console.warn('Vite proxy failed, trying CORS proxy...');
          
          try {
            // Method 2: Use CORS proxy
            // pcloudImages = await fetchWithCorsProxy(pcloudUrl); // This line is removed
          } catch (corsError) {
            console.warn('CORS proxy failed, trying custom headers...');
            
            try {
              // Method 3: Use custom headers
              // pcloudImages = await fetchWithCustomHeaders(pcloudUrl); // This line is removed
            } catch (headerError) {
              console.warn('All pCloud methods failed, using sample images...');
              // Method 4: Use sample images
              // pcloudImages = getSampleImages(); // This line is removed
            }
          }
        }
        
        if (pcloudImages.length === 0) {
          throw new Error('No images found in pCloud link');
        }
        
        // Convert to MediaItem format
        const formattedData: MediaItem[] = pcloudImages.map((image, index) => ({
          id: image.id,
          type: 'photo' as const,
          title: image.title || `Wedding Photo ${index + 1}`,
          url: image.url,
        }));
        
        setMediaData(formattedData);
        console.log(`Successfully loaded ${formattedData.length} images from pCloud`);
        
      } catch (err) {
        console.error('Error fetching pCloud data:', err);
        // Fallback to local data if pCloud fetch fails
        try {
          console.log('Falling back to local data...');
          const localResponse = await fetch('/mediaLinks.json');
          const localData = await localResponse.json();
          setMediaData(localData);
          console.log('Loaded fallback data:', localData.length, 'items');
        } catch (localErr) {
          console.error('Fallback also failed:', localErr);
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMediaData();
  }, []);

  return { mediaData, loading, error };
};