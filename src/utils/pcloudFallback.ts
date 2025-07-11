export interface FallbackImage {
  id: string;
  url: string;
  title: string;
}

// Fallback method 1: Try using a public CORS proxy
export const fetchWithCorsProxy = async (pcloudUrl: string): Promise<FallbackImage[]> => {
  const corsProxies = [
    'https://cors-anywhere.herokuapp.com/',
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
  ];

  for (const proxy of corsProxies) {
    try {
      console.log(`Trying CORS proxy: ${proxy}`);
      const response = await fetch(proxy + encodeURIComponent(pcloudUrl));
      
      if (response.ok) {
        const htmlContent = await response.text();
        const images = extractImagesFromHtml(htmlContent);
        
        if (images.length > 0) {
          console.log(`Success with proxy ${proxy}: ${images.length} images found`);
          return images;
        }
      }
    } catch (error) {
      console.warn(`Proxy ${proxy} failed:`, error);
      continue;
    }
  }
  
  throw new Error('All CORS proxies failed');
};

// Fallback method 2: Use a different approach with fetch options
export const fetchWithCustomHeaders = async (pcloudUrl: string): Promise<FallbackImage[]> => {
  try {
    const response = await fetch(pcloudUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      mode: 'cors',
    });

    if (response.ok) {
      const htmlContent = await response.text();
      return extractImagesFromHtml(htmlContent);
    }
    
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  } catch (error) {
    console.error('Custom headers fetch failed:', error);
    throw error;
  }
};

// Fallback method 3: Return sample data for testing
export const getSampleImages = (): FallbackImage[] => {
  return [
    {
      id: 'sample-1',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
      title: 'Wedding Ceremony',
    },
    {
      id: 'sample-2',
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=600&fit=crop',
      title: 'First Dance',
    },
    {
      id: 'sample-3',
      url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop',
      title: 'Wedding Rings',
    },
    {
      id: 'sample-4',
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=600&fit=crop',
      title: 'Reception',
    },
  ];
};

const extractImagesFromHtml = (htmlContent: string): FallbackImage[] => {
  const images: FallbackImage[] = [];
  
  // Look for image URLs in the HTML
  const imagePatterns = [
    /https:\/\/[^"]*\.pcloud\.com[^"]*\.(jpg|jpeg|png|gif|webp)/gi,
    /https:\/\/[^"]*\.my\.pcloud\.com[^"]*\.(jpg|jpeg|png|gif|webp)/gi,
    /https:\/\/[^"]*\.pcloud\.com\/download[^"]*/gi,
    /https:\/\/[^"]*\.my\.pcloud\.com\/download[^"]*/gi,
  ];
  
  imagePatterns.forEach(pattern => {
    const matches = htmlContent.match(pattern);
    if (matches) {
      matches.forEach((url, index) => {
        images.push({
          id: `fallback-${images.length}`,
          url: url,
          title: `Wedding Photo ${images.length + 1}`,
        });
      });
    }
  });
  
  // Remove duplicates
  return images.filter((image, index, self) => 
    index === self.findIndex(img => img.url === image.url)
  );
}; 