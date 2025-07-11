import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { testPCloudConnection } from '../utils/pcloudTest';

interface ConnectionStatusProps {
  pcloudUrl: string;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ pcloudUrl }) => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'unknown'>('loading');
  const [message, setMessage] = useState('');
  const [imagesFound, setImagesFound] = useState<number>(0);
  const [sampleUrls, setSampleUrls] = useState<string[]>([]);

  useEffect(() => {
    const testConnection = async () => {
      try {
        setStatus('loading');
        const result = await testPCloudConnection(pcloudUrl);
        
        if (result.success) {
          setStatus('success');
          setMessage(result.message);
          setImagesFound(result.imagesFound || 0);
          setSampleUrls(result.sampleUrls || []);
        } else {
          setStatus('error');
          setMessage(result.message);
        }
      } catch (error) {
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Unknown error');
      }
    };

    testConnection();
  }, [pcloudUrl]);

  if (!import.meta.env.DEV) {
    return null; // Only show in development
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <WifiOff className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'loading':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 p-4 border rounded-lg shadow-lg max-w-sm ${getStatusColor()} z-50`}>
      <div className="flex items-center gap-2 mb-2">
        {getStatusIcon()}
        <span className="font-medium text-sm">
          pCloud Connection Status
        </span>
      </div>
      
      <p className="text-sm text-gray-700 mb-2">{message}</p>
      
      {status === 'success' && imagesFound > 0 && (
        <div className="text-xs text-gray-600">
          <p>Images found: {imagesFound}</p>
          {sampleUrls.length > 0 && (
            <div className="mt-1">
              <p className="font-medium">Sample URLs:</p>
              <ul className="list-disc list-inside">
                {sampleUrls.map((url, index) => (
                  <li key={index} className="truncate">
                    {url.substring(0, 50)}...
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      {status === 'error' && (
        <div className="text-xs text-red-600">
          <p>Check browser console for detailed error information.</p>
        </div>
      )}
    </div>
  );
}; 