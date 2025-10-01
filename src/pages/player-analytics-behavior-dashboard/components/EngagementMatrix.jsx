import React, { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const EngagementMatrix = ({ data }) => {
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [viewMode, setViewMode] = useState('bubble'); // 'bubble' or 'heatmap'

  const segmentOptions = [
    { value: 'all', label: 'All Players' },
    { value: 'new', label: 'New Players (0-30 days)' },
    { value: 'regular', label: 'Regular Players (30-90 days)' },
    { value: 'veteran', label: 'Veteran Players (90+ days)' },
    { value: 'high-value', label: 'High Value Players' }
  ];

  const bubbleData = data?.bubble || [];
  const heatmapData = data?.heatmap || [];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-4 shadow-modal max-w-xs">
          <h4 className="font-semibold text-popover-foreground mb-2">{data?.gameType}</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Engagement Score:</span>
              <span className="font-medium text-popover-foreground">{data?.engagement}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg Revenue:</span>
              <span className="font-medium text-popover-foreground">${data?.revenue}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Active Players:</span>
              <span className="font-medium text-popover-foreground">{data?.playerCount?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg Session:</span>
              <span className="font-medium text-popover-foreground">{data?.avgSession}m</span>
            </div>
            <div className="pt-2 border-t border-border">
              <span className="text-muted-foreground">Demographics:</span>
              <p className="text-popover-foreground font-medium">{data?.demographics}</p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const getHeatmapColor = (value) => {
    if (value >= 80) return 'bg-success/80 text-white';
    if (value >= 60) return 'bg-primary/80 text-white';
    if (value >= 40) return 'bg-warning/80 text-white';
    return 'bg-error/80 text-white';
  };

  return (
    <div className="data-card p-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Player Engagement Matrix</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {viewMode === 'bubble' ?'Game preferences correlated with player demographics and engagement' :'Age group preferences across different game types'
            }
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Select
            options={segmentOptions}
            value={selectedSegment}
            onChange={setSelectedSegment}
            className="w-48"
          />
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'bubble' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('bubble')}
              iconName="Circle"
              iconPosition="left"
            >
              Bubble
            </Button>
            <Button
              variant={viewMode === 'heatmap' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('heatmap')}
              iconName="Grid3X3"
              iconPosition="left"
            >
              Heatmap
            </Button>
          </div>
        </div>
      </div>
      {viewMode === 'bubble' ? (
        <div className="space-y-6">
          {/* Bubble Chart */}
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  type="number" 
                  dataKey="engagement" 
                  name="Engagement Score"
                  domain={[0, 100]}
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickFormatter={(value) => `${value}%`}
                />
                <YAxis 
                  type="number" 
                  dataKey="revenue" 
                  name="Average Revenue"
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickFormatter={(value) => `$${value}`}
                />
                <ZAxis type="number" dataKey="playerCount" range={[50, 400]} />
                <Tooltip content={<CustomTooltip />} />
                <Scatter name="Games" data={bubbleData} fill="var(--color-primary)">
                  {bubbleData?.map((entry, index) => (
                    <Scatter key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Legend and Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Game Types</h4>
              <div className="grid grid-cols-2 gap-2">
                {bubbleData?.map((game) => (
                  <div key={game?.gameType} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: game?.color }}
                    ></div>
                    <span className="text-sm text-foreground">{game?.gameType}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Key Insights</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Icon name="TrendingUp" size={14} className="text-success" />
                  <span className="text-foreground">Slots show highest player volume</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Icon name="DollarSign" size={14} className="text-primary" />
                  <span className="text-foreground">Poker generates highest revenue per player</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Icon name="Clock" size={14} className="text-warning" />
                  <span className="text-foreground">Poker has longest average sessions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Heatmap */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Age Group</th>
                  <th className="text-center p-3 text-sm font-medium text-muted-foreground">Slots</th>
                  <th className="text-center p-3 text-sm font-medium text-muted-foreground">Blackjack</th>
                  <th className="text-center p-3 text-sm font-medium text-muted-foreground">Roulette</th>
                  <th className="text-center p-3 text-sm font-medium text-muted-foreground">Poker</th>
                  <th className="text-center p-3 text-sm font-medium text-muted-foreground">Baccarat</th>
                  <th className="text-center p-3 text-sm font-medium text-muted-foreground">Sports</th>
                </tr>
              </thead>
              <tbody>
                {heatmapData?.map((row) => (
                  <tr key={row?.ageGroup}>
                    <td className="p-3 text-sm font-medium text-foreground">{row?.ageGroup}</td>
                    <td className="p-2">
                      <div className={`text-center py-2 px-3 rounded text-sm font-medium ${getHeatmapColor(row?.slots)}`}>
                        {row?.slots}%
                      </div>
                    </td>
                    <td className="p-2">
                      <div className={`text-center py-2 px-3 rounded text-sm font-medium ${getHeatmapColor(row?.blackjack)}`}>
                        {row?.blackjack}%
                      </div>
                    </td>
                    <td className="p-2">
                      <div className={`text-center py-2 px-3 rounded text-sm font-medium ${getHeatmapColor(row?.roulette)}`}>
                        {row?.roulette}%
                      </div>
                    </td>
                    <td className="p-2">
                      <div className={`text-center py-2 px-3 rounded text-sm font-medium ${getHeatmapColor(row?.poker)}`}>
                        {row?.poker}%
                      </div>
                    </td>
                    <td className="p-2">
                      <div className={`text-center py-2 px-3 rounded text-sm font-medium ${getHeatmapColor(row?.baccarat)}`}>
                        {row?.baccarat}%
                      </div>
                    </td>
                    <td className="p-2">
                      <div className={`text-center py-2 px-3 rounded text-sm font-medium ${getHeatmapColor(row?.sports)}`}>
                        {row?.sports}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Heatmap Legend */}
          <div className="flex items-center justify-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Preference Level:</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-error/80 rounded"></div>
                <span className="text-sm text-foreground">Low (0-39%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-warning/80 rounded"></div>
                <span className="text-sm text-foreground">Medium (40-59%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-primary/80 rounded"></div>
                <span className="text-sm text-foreground">High (60-79%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-success/80 rounded"></div>
                <span className="text-sm text-foreground">Very High (80%+)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EngagementMatrix;