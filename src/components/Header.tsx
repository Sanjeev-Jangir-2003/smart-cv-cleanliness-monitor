import React from 'react';
import { Monitor, Activity, AlertTriangle } from 'lucide-react';

interface HeaderProps {
  totalToilets: number;
  activeAlerts: number;
  avgScore: number;
}

export const Header: React.FC<HeaderProps> = ({ totalToilets, activeAlerts, avgScore }) => {
  return (
    <header className="bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 p-3 rounded-lg">
              <Monitor className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Urban Cleanliness Monitor</h1>
              <p className="text-slate-300">AI-Powered Zone-Wise Detection System</p>
            </div>
          </div>
          
          <div className="flex space-x-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2">
                <Monitor className="h-5 w-5 text-blue-400" />
                <span className="text-2xl font-bold">{totalToilets}</span>
              </div>
              <p className="text-sm text-slate-300">Active Stations</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                <span className="text-2xl font-bold">{activeAlerts}</span>
              </div>
              <p className="text-sm text-slate-300">Active Alerts</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2">
                <Activity className="h-5 w-5 text-green-400" />
                <span className="text-2xl font-bold">{avgScore}%</span>
              </div>
              <p className="text-sm text-slate-300">Avg Cleanliness</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};