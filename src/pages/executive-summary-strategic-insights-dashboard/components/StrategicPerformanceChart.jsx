import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StrategicPerformanceChart = () => {
  const [activeView, setActiveView] = useState('revenue');
  const [timePeriod, setTimePeriod] = useState('quarterly');

  const quarterlyData = [
    {
      period: 'Q1 2024',
      revenue: 42.5,
      playerAcquisitionCost: 28.3,
      profitMargin: 24.2,
      marketShare: 21.8
    },
    {
      period: 'Q2 2024',
      revenue: 45.8,
      playerAcquisitionCost: 26.7,
      profitMargin: 26.1,
      marketShare: 22.4
    },
    {
      period: 'Q3 2024',
      revenue: 47.2,
      playerAcquisitionCost: 25.1,
      profitMargin: 28.3,
      marketShare: 23.4
    },
    {
      period: 'Q4 2024',
      revenue: 49.8,
      playerAcquisitionCost: 24.2,
      profitMargin: 29.7,
      marketShare: 24.1
    }
  ];

  const annualData = [
    {
      period: '2021',
      revenue: 156.2,
      playerAcquisitionCost: 32.1,
      profitMargin: 18.5,
      marketShare: 18.2
    },
    {
      period: '2022',
      revenue: 168.7,
      playerAcquisitionCost: 30.8,
      profitMargin: 21.3,
      marketShare: 19.8
    },
    {
      period: '2023',
      revenue: 181.3,
      playerAcquisitionCost: 28.9,
      profitMargin: 23.7,
      marketShare: 21.5
    },
    {
      period: '2024',
      revenue: 190.1,
      playerAcquisitionCost: 26.1,
      profitMargin: 27.1,
      marketShare: 22.9
    }
  ];

  const currentData = timePeriod === 'quarterly' ? quarterlyData : annualData;

  const viewOptions = [
    { key: 'revenue', label: 'Revenue Trends', icon: 'DollarSign' },
    { key: 'efficiency', label: 'Cost Efficiency', icon: 'Target' },
    { key: 'growth', label: 'Market Growth', icon: 'TrendingUp' }
  ];

  const periodOptions = [
    { key: 'quarterly', label: 'Quarterly' },
    { key: 'annual', label: 'Annual' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-modal">
          <p className="text-sm font-medium text-popover-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-xs">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry?.color }}
              ></div>
              <span className="text-muted-foreground">{entry?.name}:</span>
              <span className="font-medium text-popover-foreground">
                {entry?.name?.includes('Cost') || entry?.name?.includes('Revenue') 
                  ? `$${entry?.value}M` 
                  : `${entry?.value}%`
                }
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (activeView) {
      case 'revenue':
        return (
          <ResponsiveContainer width="100%" height={350}>
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
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="var(--color-primary)" 
                strokeWidth={3}
                name="Revenue ($M)"
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="profitMargin" 
                stroke="var(--color-success)" 
                strokeWidth={2}
                name="Profit Margin (%)"
                dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'efficiency':
        return (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={currentData}>
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
              <Legend />
              <Bar 
                dataKey="playerAcquisitionCost" 
                fill="var(--color-warning)" 
                name="Player Acquisition Cost ($M)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'growth':
        return (
          <ResponsiveContainer width="100%" height={350}>
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
              <Legend />
              <Line 
                type="monotone" 
                dataKey="marketShare" 
                stroke="var(--color-secondary)" 
                strokeWidth={3}
                name="Market Share (%)"
                dot={{ fill: 'var(--color-secondary)', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="data-card p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-1">
            Strategic Performance Analysis
          </h2>
          <p className="text-sm text-muted-foreground">
            Key business metrics and trend analysis
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          {/* Period Selection */}
          <div className="flex bg-muted rounded-lg p-1">
            {periodOptions?.map((option) => (
              <Button
                key={option?.key}
                variant={timePeriod === option?.key ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimePeriod(option?.key)}
                className="text-xs"
              >
                {option?.label}
              </Button>
            ))}
          </div>
          
          {/* View Selection */}
          <div className="flex bg-muted rounded-lg p-1">
            {viewOptions?.map((option) => (
              <Button
                key={option?.key}
                variant={activeView === option?.key ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveView(option?.key)}
                iconName={option?.icon}
                iconPosition="left"
                iconSize={14}
                className="text-xs"
              >
                <span className="hidden sm:inline">{option?.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
      {/* Chart */}
      <div className="w-full">
        {renderChart()}
      </div>
      {/* Key Insights */}
      <div className="mt-6 pt-6 border-t border-border">
        <h3 className="text-sm font-medium text-foreground mb-3">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <Icon name="TrendingUp" size={16} className="text-success mt-0.5" />
            <div>
              <p className="text-sm text-foreground font-medium">Revenue Growth</p>
              <p className="text-xs text-muted-foreground">
                Consistent upward trend with 12.3% quarterly increase
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Icon name="Target" size={16} className="text-primary mt-0.5" />
            <div>
              <p className="text-sm text-foreground font-medium">Cost Optimization</p>
              <p className="text-xs text-muted-foreground">
                Player acquisition costs reduced by 14.5% year-over-year
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategicPerformanceChart;