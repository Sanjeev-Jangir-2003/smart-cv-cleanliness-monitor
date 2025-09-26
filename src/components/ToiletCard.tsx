import React from 'react';
import { MapPin, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { ToiletZone } from '../types';
import { clsx } from 'clsx';

interface ToiletCardProps {
  toilet: ToiletZone;
  onSelect: (toilet: ToiletZone) => void;
}

export const ToiletCard: React.FC<ToiletCardProps> = ({ toilet, onSelect }) => {
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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div 
      onClick={() => onSelect(toilet)}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 hover:border-blue-300 transform hover:-translate-y-1"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{toilet.name}</h3>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {toilet.location}
            </div>
          </div>
          
          <div className={clsx(
            'px-3 py-1 rounded-full text-xs font-medium border',
            getStatusColor(toilet.status)
          )}>
            {toilet.status}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className={clsx('text-2xl font-bold', getScoreColor(toilet.cleanlinessScore))}>
              {toilet.cleanlinessScore}%
            </div>
            <p className="text-xs text-gray-600">Cleanliness Score</p>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-gray-900">
              {formatTime(toilet.predictedDirtyTime)}
            </div>
            <p className="text-xs text-gray-600">Next Cleaning Due</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Floor:</span>
            <span className={getScoreColor(toilet.zones.floor)}>{toilet.zones.floor}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Toilet Seat:</span>
            <span className={getScoreColor(toilet.zones.toiletSeat)}>{toilet.zones.toiletSeat}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Sink:</span>
            <span className={getScoreColor(toilet.zones.sink)}>{toilet.zones.sink}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Dustbin:</span>
            <span className={getScoreColor(toilet.zones.dustbin)}>{toilet.zones.dustbin}%</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            Updated {formatTime(toilet.lastUpdated)}
          </div>
          
          {toilet.alertsActive && (
            <div className="flex items-center text-xs text-red-600">
              <AlertCircle className="h-4 w-4 mr-1" />
              Alert Active
            </div>
          )}
        </div>
      </div>
    </div>
  );
};