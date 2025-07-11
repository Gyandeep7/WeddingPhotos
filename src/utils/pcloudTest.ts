export const testPCloudConnection = async (pcloudUrl: string): Promise<{
  success: boolean;
  message: string;
  imagesFound?: number;
  sampleUrls?: string[];
}> => {
  try {
    console.log('Testing pCloud connection...');
    
    // Test direct fetch first
    const directResponse = await fetch(pcloudUrl);
    console.log('Direct fetch status:', directResponse.status);
    
    if (directResponse.ok) {
      const htmlContent = await directResponse.text();
      console.log('HTML content length:', htmlContent.length);
      
      // Look for any image-related content
      const imagePatterns = [
        /https:\/\/[^"]*\.pcloud\.com[^"]*\.(jpg|jpeg|png|gif|webp)/gi,
        /https:\/\/[^"]*\.my\.pcloud\.com[^"]*\.(jpg|jpeg|png|gif|webp)/gi,
        /https:\/\/[^"]*\.pcloud\.com\/download[^"]*/gi,
        /https:\/\/[^"]*\.my\.pcloud\.com\/download[^"]*/gi,
      ];
      
      const foundUrls: string[] = [];
      imagePatterns.forEach(pattern => {
        const matches = htmlContent.match(pattern);
        if (matches) {
          foundUrls.push(...matches);
        }
      });
      
      return {
        success: true,
        message: `Successfully connected to pCloud. Found ${foundUrls.length} potential image URLs.`,
        imagesFound: foundUrls.length,
        sampleUrls: foundUrls.slice(0, 3), // Show first 3 URLs
      };
    } else {
      return {
        success: false,
        message: `Failed to connect to pCloud. Status: ${directResponse.status}`,
      };
    }
  } catch (error) {
    console.error('pCloud connection test failed:', error);
    return {
      success: false,
      message: `Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};

export const debugPCloudContent = async (pcloudUrl: string): Promise<void> => {
  try {
    const response = await fetch(pcloudUrl);
    const htmlContent = await response.text();
    
    console.log('=== pCloud Content Debug ===');
    console.log('Response status:', response.status);
    console.log('Content length:', htmlContent.length);
    console.log('Content preview (first 1000 chars):', htmlContent.substring(0, 1000));
    
    // Look for common patterns
    const patterns = [
      { name: 'Image URLs', pattern: /https:\/\/[^"]*\.(jpg|jpeg|png|gif|webp)/gi },
      { name: 'pCloud URLs', pattern: /https:\/\/[^"]*\.pcloud\.com[^"]*/gi },
      { name: 'Download URLs', pattern: /download[^"]*/gi },
      { name: 'JSON data', pattern: /window\.__INITIAL_STATE__/gi },
      { name: 'Image tags', pattern: /<img[^>]*>/gi },
    ];
    
    patterns.forEach(({ name, pattern }) => {
      const matches = htmlContent.match(pattern);
      console.log(`${name} found:`, matches ? matches.length : 0);
      if (matches && matches.length > 0) {
        console.log(`${name} samples:`, matches.slice(0, 3));
      }
    });
    
  } catch (error) {
    console.error('Debug failed:', error);
  }
}; 