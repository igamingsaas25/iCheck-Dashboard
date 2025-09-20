import React, { useState, useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

import Button from '../../../components/ui/Button';

const GameScatterPlot = ({ games, onGameSelect, selectedGame }) => {
  const [xAxis, setXAxis] = useState('sessions');
  const [yAxis, setYAxis] = useState('revenue');
  const [colorBy, setColorBy] = useState('provider');

  const axisOptions = [
    { value: 'sessions', label: 'Sessions', format: 'number' },
    { value: 'revenue', label: 'Revenue', format: 'currency' },
    { value: 'rtp', label: 'RTP %', format: 'percentage' },
    { value: 'avgSession', label: 'Avg Session (min)', format: 'time' },
    { value: 'betFreq', label: 'Bet Frequency', format: 'number' },
    { value: 'retention', label: 'Retention %', format: 'percentage' }
  ];

  const colorOptions = [
    { value: 'provider', label: 'Provider' },
    { value: 'category', label: 'Category' },
    { value: 'volatility', label: 'Volatility' },
    { value: 'performance', label: 'Performance' }
  ];

  const providerColors = {
    'NetEnt': '#3B82F6',
    'Microgaming': '#8B5CF6',
    'Pragmatic Play': '#10B981',
    'Evolution Gaming': '#F59E0B',
    'Play\'n GO': '#EF4444',
    'Red Tiger': '#EC4899',
    'Blueprint Gaming': '#06B6D4',
    'Big Time Gaming': '#84CC16'
  };

  const categoryColors = {
    'Slots': '#3B82F6',
    'Table Games': '#8B5CF6',
    'Live Casino': '#10B981',
    'Jackpot': '#F59E0B',
    'Video Poker': '#EF4444'
  };

  const volatilityColors = {
    'Low': '#10B981',
    'Medium': '#F59E0B',
    'High': '#EF4444'
  };

  const getColorByValue = (game) => {
    switch (colorBy) {
      case 'provider':
        return providerColors?.[game?.provider] || '#94A3B8';
      case 'category':
        return categoryColors?.[game?.category] || '#94A3B8';
      case 'volatility':
        return volatilityColors?.[game?.volatility] || '#94A3B8';
      case 'performance':
        if (game?.revenue > 75000) return '#10B981';
        if (game?.revenue > 50000) return '#F59E0B';
        return '#EF4444';
      default:
        return '#3B82F6';
    }
  };

  const chartData = useMemo(() => {
    return games?.map(game => ({
      ...game,
      x: game?.[xAxis],
      y: game?.[yAxis],
      color: getColorByValue(game),
      size: Math.max(20, Math.min(100, game?.sessions / 100))
    }));
  }, [games, xAxis, yAxis, colorBy]);

  const formatAxisValue = (value, format) => {
    switch (format) {
      case 'currency':
        return `$${(value / 1000)?.toFixed(0)}K`;
      case 'percentage':
        return `${value?.toFixed(1)}%`;
      case 'time':
        return `${Math.floor(value / 60)}:${(value % 60)?.toString()?.padStart(2, '0')}`;
      case 'number':
        return value >= 1000 ? `${(value / 1000)?.toFixed(1)}K` : value?.toString();
      default:
        return value;
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-modal">
          <h4 className="font-medium text-popover-foreground mb-2">{data?.name}</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Provider:</span>
              <span className="text-popover-foreground">{data?.provider}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category:</span>
              <span className="text-popover-foreground">{data?.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{axisOptions?.find(opt => opt?.value === xAxis)?.label}:</span>
              <span className="text-popover-foreground">
                {formatAxisValue(data?.x, axisOptions?.find(opt => opt?.value === xAxis)?.format)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{axisOptions?.find(opt => opt?.value === yAxis)?.label}:</span>
              <span className="text-popover-foreground">
                {formatAxisValue(data?.y, axisOptions?.find(opt => opt?.value === yAxis)?.format)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">RTP:</span>
              <span className="text-popover-foreground">{data?.rtp?.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const handleDotClick = (data) => {
    onGameSelect(data);
  };

  const getAxisLabel = (axis) => {
    return axisOptions?.find(opt => opt?.value === axis)?.label || axis;
  };

  const getLegendItems = () => {
    switch (colorBy) {
      case 'provider':
        return Object.entries(providerColors)?.map(([key, color]) => ({ key, color, label: key }));
      case 'category':
        return Object.entries(categoryColors)?.map(([key, color]) => ({ key, color, label: key }));
      case 'volatility':
        return Object.entries(volatilityColors)?.map(([key, color]) => ({ key, color, label: key }));
      case 'performance':
        return [
          { key: 'high', color: '#10B981', label: 'High (>$75K)' },
          { key: 'medium', color: '#F59E0B', label: 'Medium ($50K-$75K)' },
          { key: 'low', color: '#EF4444', label: 'Low (<$50K)' }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="bg-card rounded-lg border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">Game Performance Correlation</h3>
            <p className="text-sm text-muted-foreground">
              Interactive scatter plot showing relationships between game metrics
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Maximize2"
              iconPosition="left"
            >
              Fullscreen
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">X-Axis</label>
            <select
              value={xAxis}
              onChange={(e) => setXAxis(e?.target?.value)}
              className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {axisOptions?.map(option => (
                <option key={option?.value} value={option?.value}>{option?.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Y-Axis</label>
            <select
              value={yAxis}
              onChange={(e) => setYAxis(e?.target?.value)}
              className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {axisOptions?.map(option => (
                <option key={option?.value} value={option?.value}>{option?.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Color By</label>
            <select
              value={colorBy}
              onChange={(e) => setColorBy(e?.target?.value)}
              className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {colorOptions?.map(option => (
                <option key={option?.value} value={option?.value}>{option?.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Chart */}
          <div className="flex-1">
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={chartData} margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name={getAxisLabel(xAxis)}
                    tickFormatter={(value) => formatAxisValue(value, axisOptions?.find(opt => opt?.value === xAxis)?.format)}
                    stroke="#94A3B8"
                    fontSize={12}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name={getAxisLabel(yAxis)}
                    tickFormatter={(value) => formatAxisValue(value, axisOptions?.find(opt => opt?.value === yAxis)?.format)}
                    stroke="#94A3B8"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Scatter
                    dataKey="y"
                    onClick={handleDotClick}
                  >
                    {chartData?.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry?.color}
                        stroke={selectedGame?.id === entry?.id ? '#3B82F6' : 'transparent'}
                        strokeWidth={selectedGame?.id === entry?.id ? 3 : 0}
                        style={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Legend */}
          <div className="w-full lg:w-48">
            <h4 className="text-sm font-medium text-card-foreground mb-3">
              {colorOptions?.find(opt => opt?.value === colorBy)?.label} Legend
            </h4>
            <div className="space-y-2">
              {getLegendItems()?.map((item) => (
                <div key={item?.key} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item?.color }}
                  ></div>
                  <span className="text-sm text-muted-foreground">{item?.label}</span>
                </div>
              ))}
            </div>

            {/* Selected Game Info */}
            {selectedGame && (
              <div className="mt-6 p-3 bg-primary/10 rounded-lg border border-primary/20">
                <h4 className="text-sm font-medium text-card-foreground mb-2">Selected Game</h4>
                <div className="space-y-1 text-xs">
                  <div className="font-medium text-primary">{selectedGame?.name}</div>
                  <div className="text-muted-foreground">{selectedGame?.provider}</div>
                  <div className="text-muted-foreground">{selectedGame?.category}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameScatterPlot;