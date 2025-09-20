import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PredictiveAnalyticsOverlay = () => {
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [forecastPeriod, setForecastPeriod] = useState('6months');

  const historicalData = [
    { period: 'Jan 2024', revenue: 42.5, players: 1.8, marketShare: 21.2 },
    { period: 'Feb 2024', revenue: 43.8, players: 1.9, marketShare: 21.8 },
    { period: 'Mar 2024', revenue: 45.2, players: 2.0, marketShare: 22.1 },
    { period: 'Apr 2024', revenue: 46.1, players: 2.0, marketShare: 22.4 },
    { period: 'May 2024', revenue: 47.2, players: 2.1, marketShare: 23.0 },
    { period: 'Jun 2024', revenue: 47.8, players: 2.1, marketShare: 23.4 }
  ];

  const forecastData6Months = [
    ...historicalData,
    { period: 'Jul 2024', revenue: 48.5, players: 2.2, marketShare: 23.8, forecast: true },
    { period: 'Aug 2024', revenue: 49.2, players: 2.2, marketShare: 24.1, forecast: true },
    { period: 'Sep 2024', revenue: 50.1, players: 2.3, marketShare: 24.5, forecast: true },
    { period: 'Oct 2024', revenue: 51.0, players: 2.4, marketShare: 24.8, forecast: true },
    { period: 'Nov 2024', revenue: 51.8, players: 2.4, marketShare: 25.2, forecast: true },
    { period: 'Dec 2024', revenue: 52.5, players: 2.5, marketShare: 25.6, forecast: true }
  ];

  const forecastData12Months = [
    ...historicalData,
    { period: 'Jul 2024', revenue: 48.5, players: 2.2, marketShare: 23.8, forecast: true },
    { period: 'Aug 2024', revenue: 49.2, players: 2.2, marketShare: 24.1, forecast: true },
    { period: 'Sep 2024', revenue: 50.1, players: 2.3, marketShare: 24.5, forecast: true },
    { period: 'Oct 2024', revenue: 51.0, players: 2.4, marketShare: 24.8, forecast: true },
    { period: 'Nov 2024', revenue: 51.8, players: 2.4, marketShare: 25.2, forecast: true },
    { period: 'Dec 2024', revenue: 52.5, players: 2.5, marketShare: 25.6, forecast: true },
    { period: 'Jan 2025', revenue: 53.2, players: 2.5, marketShare: 26.0, forecast: true },
    { period: 'Feb 2025', revenue: 54.0, players: 2.6, marketShare: 26.3, forecast: true },
    { period: 'Mar 2025', revenue: 54.8, players: 2.6, marketShare: 26.7, forecast: true },
    { period: 'Apr 2025', revenue: 55.5, players: 2.7, marketShare: 27.1, forecast: true },
    { period: 'May 2025', revenue: 56.3, players: 2.7, marketShare: 27.4, forecast: true },
    { period: 'Jun 2025', revenue: 57.1, players: 2.8, marketShare: 27.8, forecast: true }
  ];

  const currentData = forecastPeriod === '6months' ? forecastData6Months : forecastData12Months;
  const currentPeriodIndex = historicalData?.length - 1;

  const metrics = [
    { key: 'revenue', label: 'Revenue ($M)', color: 'var(--color-primary)', icon: 'DollarSign' },
    { key: 'players', label: 'Players (M)', color: 'var(--color-secondary)', icon: 'Users' },
    { key: 'marketShare', label: 'Market Share (%)', color: 'var(--color-accent)', icon: 'Target' }
  ];

  const forecastPeriods = [
    { key: '6months', label: '6 Months' },
    { key: '12months', label: '12 Months' }
  ];

  const selectedMetricData = metrics?.find(m => m?.key === selectedMetric);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      const isForecast = data?.forecast;
      
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-modal">
          <div className="flex items-center space-x-2 mb-2">
            <p className="text-sm font-medium text-popover-foreground">{label}</p>
            {isForecast && (
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                Forecast
              </span>
            )}
          </div>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-xs">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry?.color }}
              ></div>
              <span className="text-muted-foreground">{selectedMetricData?.label}:</span>
              <span className="font-medium text-popover-foreground">
                {selectedMetric === 'revenue' ? `$${entry?.value}M` : 
                 selectedMetric === 'players' ? `${entry?.value}M` : 
                 `${entry?.value}%`}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const getForecastSummary = () => {
    const lastHistorical = historicalData?.[historicalData?.length - 1];
    const lastForecast = currentData?.[currentData?.length - 1];
    
    const growthRate = ((lastForecast?.[selectedMetric] - lastHistorical?.[selectedMetric]) / lastHistorical?.[selectedMetric] * 100)?.toFixed(1);
    
    return {
      current: lastHistorical?.[selectedMetric],
      projected: lastForecast?.[selectedMetric],
      growth: growthRate,
      period: forecastPeriod === '6months' ? '6 months' : '12 months'
    };
  };

  const summary = getForecastSummary();

  return (
    <div className="data-card p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-1">
            Predictive Analytics
          </h2>
          <p className="text-sm text-muted-foreground">
            AI-powered forecasting based on current trends
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          {/* Metric Selection */}
          <div className="flex bg-muted rounded-lg p-1">
            {metrics?.map((metric) => (
              <Button
                key={metric?.key}
                variant={selectedMetric === metric?.key ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedMetric(metric?.key)}
                iconName={metric?.icon}
                iconPosition="left"
                iconSize={14}
                className="text-xs"
              >
                <span className="hidden sm:inline">{metric?.label}</span>
              </Button>
            ))}
          </div>
          
          {/* Period Selection */}
          <div className="flex bg-muted rounded-lg p-1">
            {forecastPeriods?.map((period) => (
              <Button
                key={period?.key}
                variant={forecastPeriod === period?.key ? "default" : "ghost"}
                size="sm"
                onClick={() => setForecastPeriod(period?.key)}
                className="text-xs"
              >
                {period?.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      {/* Forecast Chart */}
      <div className="w-full h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={currentData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
            <XAxis 
              dataKey="period" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Historical Data Line */}
            <Line 
              type="monotone" 
              dataKey={selectedMetric}
              stroke={selectedMetricData?.color}
              strokeWidth={3}
              dot={(props) => {
                const { cx, cy, payload } = props;
                if (payload?.forecast) return null;
                return (
                  <circle 
                    cx={cx} 
                    cy={cy} 
                    r={4} 
                    fill={selectedMetricData?.color} 
                    strokeWidth={2}
                    stroke="var(--color-background)"
                  />
                );
              }}
              connectNulls={false}
            />
            
            {/* Forecast Data Line */}
            <Line 
              type="monotone" 
              dataKey={selectedMetric}
              stroke={selectedMetricData?.color}
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={(props) => {
                const { cx, cy, payload } = props;
                if (!payload?.forecast) return null;
                return (
                  <circle 
                    cx={cx} 
                    cy={cy} 
                    r={3} 
                    fill={selectedMetricData?.color} 
                    strokeWidth={1}
                    stroke="var(--color-background)"
                    opacity={0.8}
                  />
                );
              }}
              connectNulls={false}
            />
            
            {/* Reference line to separate historical from forecast */}
            <ReferenceLine 
              x={historicalData?.[currentPeriodIndex]?.period} 
              stroke="var(--color-muted-foreground)" 
              strokeDasharray="2 2"
              opacity={0.5}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Forecast Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-muted/20 rounded-lg p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Current Value</p>
          <p className="text-lg font-bold text-foreground">
            {selectedMetric === 'revenue' ? `$${summary?.current}M` : 
             selectedMetric === 'players' ? `${summary?.current}M` : 
             `${summary?.current}%`}
          </p>
        </div>
        <div className="bg-muted/20 rounded-lg p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Projected ({summary?.period})</p>
          <p className="text-lg font-bold text-primary">
            {selectedMetric === 'revenue' ? `$${summary?.projected}M` : 
             selectedMetric === 'players' ? `${summary?.projected}M` : 
             `${summary?.projected}%`}
          </p>
        </div>
        <div className="bg-muted/20 rounded-lg p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Expected Growth</p>
          <div className="flex items-center justify-center space-x-1">
            <Icon 
              name={parseFloat(summary?.growth) >= 0 ? "TrendingUp" : "TrendingDown"} 
              size={16} 
              className={parseFloat(summary?.growth) >= 0 ? "text-success" : "text-destructive"}
            />
            <p className={`text-lg font-bold ${parseFloat(summary?.growth) >= 0 ? "text-success" : "text-destructive"}`}>
              {summary?.growth}%
            </p>
          </div>
        </div>
      </div>
      {/* AI Insights */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Brain" size={20} className="text-primary mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground mb-2">AI-Powered Insights</h3>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                • Based on current trends, {selectedMetricData?.label?.toLowerCase()} is expected to grow by {summary?.growth}% over the next {summary?.period}
              </p>
              <p className="text-xs text-muted-foreground">
                • Seasonal patterns suggest stronger performance in Q4 2024
              </p>
              <p className="text-xs text-muted-foreground">
                • Market conditions remain favorable with 85% confidence interval
              </p>
            </div>
            <div className="mt-3 flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">Confidence Level:</span>
              <div className="flex-1 bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <span className="text-xs font-medium text-foreground">85%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictiveAnalyticsOverlay;