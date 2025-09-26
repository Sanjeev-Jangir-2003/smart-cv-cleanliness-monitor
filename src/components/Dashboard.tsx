import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { ToiletCard } from './ToiletCard';
import { DetailModal } from './DetailModal';
import { AlertPanel } from './AlertPanel';
import { AnalyticsChart } from './AnalyticsChart';
import { UploadSection } from './UploadSection';
import { ResultsDisplay } from './ResultsDisplay';
import { generateMockToilets, generateMockAlerts } from '../data/mockData';
import { ToiletZone, Alert, ProcessingResult, UploadedFile } from '../types';

export const Dashboard: React.FC = () => {
  const [toilets, setToilets] = useState<ToiletZone[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedToilet, setSelectedToilet] = useState<ToiletZone | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [processingResult, setProcessingResult] = useState<ProcessingResult | null>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);

  useEffect(() => {
    // Initialize data
    setToilets(generateMockToilets());
    setAlerts(generateMockAlerts());

    // Simulate real-time updates
    const interval = setInterval(() => {
      setToilets(prev => prev.map(toilet => ({
        ...toilet,
        cleanlinessScore: Math.max(0, Math.min(100, 
          toilet.cleanlinessScore + (Math.random() - 0.5) * 10
        )),
        lastUpdated: new Date(),
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleProcessingComplete = (result: ProcessingResult, file: UploadedFile) => {
    setProcessingResult(result);
    setUploadedFile(file);
    
    // Add new alert if threshold exceeded
    if (result.alertTriggered) {
      const newAlert: Alert = {
        id: `alert-upload-${Date.now()}`,
        toiletId: 'uploaded-analysis',
        message: `Uploaded file analysis: Critical cleanliness level detected (${result.cleanlinessScore}%)`,
        severity: 'high',
        timestamp: new Date(),
        resolved: false,
      };
      setAlerts(prev => [newAlert, ...prev]);
    }
  };

  const closeResults = () => {
    setProcessingResult(null);
    setUploadedFile(null);
  };

  const avgScore = Math.floor(
    toilets.reduce((sum, toilet) => sum + toilet.cleanlinessScore, 0) / toilets.length || 0
  );
  
  const activeAlerts = alerts.filter(alert => !alert.resolved).length;

  const sortedToilets = [...toilets].sort((a, b) => a.cleanlinessScore - b.cleanlinessScore);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        totalToilets={toilets.length}
        activeAlerts={activeAlerts}
        avgScore={avgScore}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UploadSection onProcessingComplete={(result) => {
          // We need to find the uploaded file - in a real app this would be passed differently
          // For now, we'll create a mock file reference
          const mockFile: UploadedFile = {
            id: result.fileId,
            name: 'uploaded-file',
            type: 'image',
            url: 'https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg',
            size: 1024000,
            uploadedAt: new Date(),
          };
          handleProcessingComplete(result, mockFile);
        }} />
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Monitoring Stations</h2>
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
          </button>
        </div>

        {showAnalytics && <AnalyticsChart toilets={toilets} />}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedToilets.map((toilet) => (
                <ToiletCard
                  key={toilet.id}
                  toilet={toilet}
                  onSelect={setSelectedToilet}
                />
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <AlertPanel alerts={alerts} />
          </div>
        </div>
      </main>

      {selectedToilet && (
        <DetailModal
          toilet={selectedToilet}
          onClose={() => setSelectedToilet(null)}
        />
      )}

      {processingResult && uploadedFile && (
        <ResultsDisplay
          result={processingResult}
          file={uploadedFile}
          onClose={closeResults}
        />
      )}
    </div>
  );
};