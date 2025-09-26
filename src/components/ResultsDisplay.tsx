import React, { useState, useEffect } from 'react';
import { Brain, Target, AlertTriangle, CheckCircle, X, Mail, Phone } from 'lucide-react';
import { ProcessingResult, UploadedFile } from '../types';
import { clsx } from 'clsx';

interface ResultsDisplayProps {
  result: ProcessingResult;
  file: UploadedFile;
  onClose: () => void;
  onSendAlert?: (alertData: any) => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  result, 
  file, 
  onClose, 
  onSendAlert 
}) => {
  const [alertSent, setAlertSent] = useState(false);

  // ✅ Auto-adjust if no detections → Clean = 100%
  const adjustedCleanliness = (result?.zones && Object.values(result.zones).every((z: any) => z.detections?.length === 0))
    ? 100 
    : result.cleanlinessScore;

  const adjustedDirtiness = 100 - adjustedCleanliness;

  const adjustedStatus = adjustedCleanliness === 100 ? "Clean" : result.status;

  const isDirty = adjustedStatus === "Dirty" || adjustedCleanliness < 40;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Clean': return 'bg-green-100 text-green-800 border-green-200';
      case 'Moderately Dirty': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Dirty': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Function to handle sending alerts
  const handleSendAlert = () => {
    if (onSendAlert) {
      const alertData = {
        message: `Toilet cleanliness alert: ${adjustedStatus} (Score: ${adjustedCleanliness}%)`,
        severity: adjustedStatus,
        score: adjustedCleanliness,
        timestamp: new Date().toISOString(),
        imageUrl: file.url
      };
      
      onSendAlert(alertData);
    }
    setAlertSent(true);
    
    console.log('Sending alert for dirty toilet condition:', {
      score: adjustedCleanliness,
      status: adjustedStatus,
      image: file.url
    });
  };

  // Auto-send alert if dirty
  useEffect(() => {
    if ((adjustedStatus === 'Dirty' || adjustedCleanliness < 40) && !alertSent) {
      handleSendAlert();
    }
  }, [adjustedStatus, adjustedCleanliness, alertSent]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Analysis Complete</h2>
                <p className="text-gray-600">AI-powered cleanliness detection results</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Overall Results */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className={clsx('text-4xl font-bold mb-2', getScoreColor(adjustedCleanliness))}>
                  {adjustedCleanliness}%
                </div>
                <p className="text-sm text-gray-600">Cleanliness Score</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-red-600 mb-2">
                  {adjustedDirtiness}%
                </div>
                <p className="text-sm text-gray-600">Dirtiness Score</p>
              </div>
              
              <div className="text-center">
                <div className={clsx(
                  'inline-block px-4 py-2 rounded-full text-lg font-semibold border',
                  getStatusColor(adjustedStatus)
                )}>
                  {adjustedStatus}
                </div>
                <p className="text-sm text-gray-600 mt-2">Classification</p>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">
                  {Math.floor(result.modelConfidence * 100)}%
                </div>
                <p className="text-sm text-gray-600">Model Confidence</p>
              </div>
            </div>

            {(isDirty || result.alertTriggered) && (
              <div className="mt-4 bg-red-100 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-800">Critical Alert Triggered</span>
                </div>
                <p className="text-sm text-red-700 mt-1">
                  {alertSent 
                    ? "Alert notifications sent to cleaning staff via SMS/Email/Telegram"
                    : "Preparing to send alert notifications..."
                  }
                </p>
                
                {!alertSent && (
                  <button
                    onClick={handleSendAlert}
                    className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center space-x-2"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Send Alert Now</span>
                  </button>
                )}
                
                {alertSent && (
                  <div className="mt-3 flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1 text-green-600">
                      <Mail className="h-4 w-4" />
                      <span>Email sent</span>
                    </div>
                    <div className="flex items-center space-x-1 text-green-600">
                      <Phone className="h-4 w-4" />
                      <span>SMS sent</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Zone-Wise Breakdown */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Target className="h-5 w-5 text-purple-600" />
              <span>Zone-Wise Breakdown</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(result.zones).map(([zoneName, zoneData]: [string, any]) => (
                <div key={zoneName} className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-gray-700 capitalize">
                      {zoneName.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <div className="flex flex-col items-end">
                      <span className={clsx('text-lg font-bold', getScoreColor(zoneData.score))}>
                        {zoneData.detections?.length === 0 ? "100% Clean" : `${zoneData.score}% Clean`}
                      </span>
                      <span className="text-red-600 font-bold">
                        {zoneData.detections?.length === 0 ? "0% Dirty" : `${100 - zoneData.score}% Dirty`}
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div 
                      className={clsx(
                        'h-3 rounded-full transition-all duration-500',
                        zoneData.score >= 70 ? 'bg-green-500' : 
                        zoneData.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                      )}
                      style={{ width: `${zoneData.detections?.length === 0 ? 100 : zoneData.score}%` }}
                    />
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    {zoneData.detections?.length || 0} detection{zoneData.detections?.length !== 1 ? 's' : ''} found
                    {zoneData.detections?.length > 0 && (
                      <span className="ml-2">
                        (avg confidence: {Math.floor(zoneData.detections.reduce((sum: number, d: any) => sum + d.confidence, 0) / zoneData.detections.length * 100)}%)
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                console.log('Saving results to cloud database...');
                onClose();
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Save to Database</span>
            </button>
            
            {isDirty && !alertSent && (
              <button
                onClick={handleSendAlert}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <Phone className="h-4 w-4" />
                <span>Send Alert</span>
              </button>
            )}
            
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              Close Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
