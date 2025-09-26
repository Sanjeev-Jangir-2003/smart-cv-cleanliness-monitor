import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, Cell } from 'recharts';
import { ToiletZone } from '../types';
import { BarChart3, Brain, TrendingUp } from 'lucide-react';

interface AnalyticsChartProps {
  toilets: ToiletZone[];
}

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ toilets }) => {
  const chartData = toilets.map(toilet => ({
    name: toilet.name,
    score: toilet.cleanlinessScore,
    floor: toilet.zones.floor,
    seat: toilet.zones.toiletSeat,
    sink: toilet.zones.sink,
    dustbin: toilet.zones.dustbin,
  }));

  const scatterData = toilets.map(toilet => ({
    x: toilet.zones.floor,
    y: toilet.cleanlinessScore,
    name: toilet.name,
  }));

  const predictionData = toilets.map(toilet => {
    const hoursUntilDirty = Math.max(0, (toilet.predictedDirtyTime.getTime() - Date.now()) / (1000 * 60 * 60));
    return {
      name: toilet.name,
      hours: hoursUntilDirty,
      currentScore: toilet.cleanlinessScore,
    };
  });

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center space-x-2 mb-6">
        <BarChart3 className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">Analytics & Predictive Insights</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Overall Scores */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <span>Cleanliness Scores by Location</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={12} />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Score']}
                  labelFormatter={(label) => `Location: ${label}`}
                />
                <Bar dataKey="score" radius={4}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.score >= 70 ? '#10B981' : entry.score >= 40 ? '#F59E0B' : '#EF4444'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Correlation Analysis */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <span>Floor vs Overall Score Correlation</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={scatterData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" type="number" domain={[0, 100]} name="Floor Score" />
                <YAxis dataKey="y" type="number" domain={[0, 100]} name="Overall Score" />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'y' ? `${value}% Overall` : `${value}% Floor`,
                    name === 'y' ? 'Overall Score' : 'Floor Score'
                  ]}
                  labelFormatter={(_, payload) => payload?.[0]?.payload?.name}
                />
                <Scatter dataKey="y" fill="#3B82F6" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Predictive Timeline */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span>LSTM Prediction: Hours Until Cleaning Required</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={predictionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={12} />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${Number(value).toFixed(1)} hours`, 'Time Until Cleaning']}
                />
                <Bar dataKey="hours" fill="#10B981" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Statistical Summary */}
      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Statistical Analysis</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.floor(toilets.reduce((sum, t) => sum + t.cleanlinessScore, 0) / toilets.length)}%
            </div>
            <p className="text-sm text-gray-600">Mean Score</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.max(...toilets.map(t => t.cleanlinessScore))}%
            </div>
            <p className="text-sm text-gray-600">Highest Score</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {Math.min(...toilets.map(t => t.cleanlinessScore))}%
            </div>
            <p className="text-sm text-gray-600">Lowest Score</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {toilets.filter(t => t.alertsActive).length}
            </div>
            <p className="text-sm text-gray-600">Critical Zones</p>
          </div>
        </div>
      </div>
    </div>
  );
};