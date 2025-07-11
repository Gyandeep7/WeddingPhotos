export interface PCloudImage {
  id: string;
  url: string;
  title?: string;
  thumbnail?: string;
}

export const parsePCloudContent = (htmlContent: string): PCloudImage[] => {
  const images: PCloudImage[] = [];
  
  try {
    // Method 1: Look for direct image URLs in the HTML
    const directImagePatterns = [
      /https:\/\/[^"]*\.pcloud\.com[^"]*\.(jpg|jpeg|png|gif|webp|bmp)/gi,
      /https:\/\/[^"]*\.my\.pcloud\.com[^"]*\.(jpg|jpeg|png|gif|webp|bmp)/gi,
    ];
    
    directImagePatterns.forEach(pattern => {
      const matches = htmlContent.match(pattern);
      if (matches) {
        matches.forEach((url, index) => {
          images.push({
            id: `direct-${index}`,
            url: url,
            title: `Wedding Photo ${index + 1}`,
          });
        });
      }
    });
    
    // Method 2: Look for download/getfile URLs
    const downloadPatterns = [
      /https:\/\/[^"]*\.pcloud\.com\/download[^"]*/gi,
      /https:\/\/[^"]*\.my\.pcloud\.com\/download[^"]*/gi,
      /https:\/\/[^"]*\.pcloud\.com\/getfile[^"]*/gi,
      /https:\/\/[^"]*\.my\.pcloud\.com\/getfile[^"]*/gi,
    ];
    
    downloadPatterns.forEach(pattern => {
      const matches = htmlContent.match(pattern);
      if (matches) {
        matches.forEach((url, index) => {
          images.push({
            id: `download-${index}`,
            url: url,
            title: `Wedding Photo ${index + 1}`,
          });
        });
      }
    });
    
    // Method 3: Look for JSON data embedded in the page
    const jsonPattern = /window\.__INITIAL_STATE__\s*=\s*({.*?});/s;
    const jsonMatch = htmlContent.match(jsonPattern);
    
    if (jsonMatch) {
      try {
        const jsonData = JSON.parse(jsonMatch[1]);
        // Navigate through the JSON structure to find image data
        const extractedImages = extractImagesFromJson(jsonData);
        images.push(...extractedImages);
      } catch (jsonError) {
        console.warn('Failed to parse JSON data from pCloud page:', jsonError);
      }
    }
    
    // Method 4: Look for data attributes that might contain image info
    const dataAttrPattern = /data-[^=]*="([^"]*\.(jpg|jpeg|png|gif|webp|bmp))"/gi;
    const dataMatches = htmlContent.matchAll(dataAttrPattern);
    
    for (const match of dataMatches) {
      if (match[1]) {
        images.push({
          id: `data-${images.length}`,
          url: match[1],
          title: `Wedding Photo ${images.length + 1}`,
        });
      }
    }
    
    // Remove duplicates based on URL
    const uniqueImages = images.filter((image, index, self) => 
      index === self.findIndex(img => img.url === image.url)
    );
    
    return uniqueImages;
    
  } catch (error) {
    console.error('Error parsing pCloud content:', error);
    return [];
  }
};

const extractImagesFromJson = (data: any): PCloudImage[] => {
  const images: PCloudImage[] = [];
  
  const extractFromObject = (obj: any, path: string = ''): void => {
    if (!obj || typeof obj !== 'object') return;
    
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (typeof value === 'string' && isImageUrl(value)) {
        images.push({
          id: `json-${images.length}`,
          url: value,
          title: `Wedding Photo ${images.length + 1}`,
        });
      } else if (typeof value === 'object') {
        extractFromObject(value, currentPath);
      }
    }
  };
  
  extractFromObject(data);
  return images;
};

const isImageUrl = (url: string): boolean => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
  const lowerUrl = url.toLowerCase();
  return imageExtensions.some(ext => lowerUrl.includes(ext)) || 
         lowerUrl.includes('pcloud.com') && lowerUrl.includes('download');
};

export const fetchPCloudImages = async (pcloudUrl: string): Promise<PCloudImage[]> => {
  try {
    const apiUrl = `/api/pcloud-proxy?url=${encodeURIComponent(pcloudUrl)}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch pCloud data: ${response.status}`);
    }

    const htmlContent = await response.text();
    return parsePCloudContent(htmlContent);

  } catch (error) {
    console.error('Error fetching pCloud images:', error);
    throw error;
  }
}; 