import React from 'react';
import { AlertTriangle, CheckCircle, Clock, MapPin } from 'lucide-react';
import { Alert } from '../types';
import { clsx } from 'clsx';

interface AlertPanelProps {
  alerts: Alert[];
}

export const AlertPanel: React.FC<AlertPanelProps> = ({ alerts }) => {
  const getSeverityColor = (severity: string, resolved: boolean) => {
    if (resolved) return 'bg-gray-100 text-gray-600 border-gray-200';
    
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string, resolved: boolean) => {
    if (resolved) return <CheckCircle className="h-4 w-4" />;
    switch (severity) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'low':
        return <AlertTriangle className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const activeAlerts = alerts.filter(alert => !alert.resolved);
  const resolvedAlerts = alerts.filter(alert => alert.resolved);

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">System Alerts</h3>
        <p className="text-sm text-gray-600">{activeAlerts.length} active, {resolvedAlerts.length} resolved</p>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {activeAlerts.length === 0 && resolvedAlerts.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>No alerts at this time</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className={clsx(
                  'p-4 rounded-lg border-l-4 transition-all duration-200 hover:shadow-md',
                  getSeverityColor(alert.severity, false)
                )}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 pt-0.5">
                    {getSeverityIcon(alert.severity, false)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs opacity-75">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{alert.toiletId}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatTimeAgo(alert.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {resolvedAlerts.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                className={clsx(
                  'p-4 rounded-lg border-l-4 opacity-60',
                  getSeverityColor(alert.severity, true)
                )}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 pt-0.5">
                    {getSeverityIcon(alert.severity, true)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-through">{alert.message}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{alert.toiletId}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>Resolved {formatTimeAgo(alert.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};