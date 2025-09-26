import React from 'react';
import { Dialog } from '@headlessui/react';
import { X, Camera, Brain, TrendingUp, Shield } from 'lucide-react';
import { ToiletZone } from '../types';
import { generateHistoricalData } from '../data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DetailModalProps {
  toilet: ToiletZone;
  onClose: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ toilet, onClose }) => {
  const historicalData = generateHistoricalData(toilet.id);

  const chartData = historicalData.map(item => ({
    time: item.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    score: item.score,
  }));

  const getZoneColor = (score: number) => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-4xl w-full bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div>
                <Dialog.Title className="text-2xl font-bold text-gray-900">
                  {toilet.name} - {toilet.location}
                </Dialog.Title>
                <p className="text-gray-600">Detailed Analysis & Predictions</p>
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
            {/* Current Status */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{toilet.cleanlinessScore}%</div>
                  <p className="text-sm text-gray-600">Overall Score</p>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-semibold px-3 py-1 rounded-full ${
                    toilet.status === 'Clean' ? 'bg-green-100 text-green-800' :
                    toilet.status === 'Moderately Dirty' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {toilet.status}
                  </div>
                  <p className="text-sm text-gray-600">Classification</p>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {toilet.predictedDirtyTime.toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                  <p className="text-sm text-gray-600">Next Cleaning</p>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-semibold ${toilet.alertsActive ? 'text-red-600' : 'text-green-600'}`}>
                    {toilet.alertsActive ? 'ACTIVE' : 'NONE'}
                  </div>
                  <p className="text-sm text-gray-600">Alerts</p>
                </div>
              </div>
            </div>

            {/* Zone Analysis */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Camera className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Zone-Wise Detection Results</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(toilet.zones).map(([zone, score]) => (
                  <div key={zone} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-700 capitalize">
                        {zone.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-sm font-bold">{score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getZoneColor(score)}`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ML Model Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">AI Model Performance</h3>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-xl font-bold text-purple-600">98.5%</div>
                  <p className="text-sm text-gray-600">YOLOv8 Accuracy</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-xl font-bold text-green-600">95.2%</div>
                  <p className="text-sm text-gray-600">CNN Classifier</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-xl font-bold text-blue-600">0.8ms</div>
                  <p className="text-sm text-gray-600">Processing Time</p>
                </div>
              </div>
            </div>

            {/* Trends Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">24-Hour Cleanliness Trend</h3>
              </div>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Cleanliness Score']}
                      labelFormatter={(label) => `Time: ${label}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Privacy & Security */}
            <div className="bg-green-50 rounded-xl border border-green-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Privacy & Security</h3>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Edge detection preprocessing active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>No facial data stored or transmitted</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Encrypted cloud transmission</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>GDPR compliant data handling</span>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};