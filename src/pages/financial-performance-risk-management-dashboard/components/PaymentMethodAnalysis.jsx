import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PaymentMethodAnalysis = ({ data = [], currency = 'USD' }) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [viewMode, setViewMode] = useState('volume'); // 'volume' or 'count'

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: 'compact'
    })?.format(value);
  };

  const getMethodIcon = (method) => {
    switch (method?.toLowerCase()) {
      case 'credit card':
        return 'CreditCard';
      case 'bank transfer':
        return 'Building2';
      case 'e-wallet':
        return 'Wallet';
      case 'cryptocurrency':
        return 'Coins';
      case 'mobile payment':
        return 'Smartphone';
      default:
        return 'DollarSign';
    }
  };

  const getMethodColor = (index) => {
    const colors = [
      'var(--color-chart-1)',
      'var(--color-chart-2)',
      'var(--color-chart-3)',
      'var(--color-chart-4)',
      'var(--color-chart-5)'
    ];
    return colors?.[index % colors?.length];
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-modal">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name={getMethodIcon(data?.method)} size={16} className="text-primary" />
            <span className="text-sm font-medium text-popover-foreground">{data?.method}</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between space-x-4">
              <span className="text-xs text-muted-foreground">Volume:</span>
              <span className="text-xs font-medium text-popover-foreground">
                {formatCurrency(data?.volume)}
              </span>
            </div>
            <div className="flex justify-between space-x-4">
              <span className="text-xs text-muted-foreground">Transactions:</span>
              <span className="text-xs font-medium text-popover-foreground">
                {data?.count?.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between space-x-4">
              <span className="text-xs text-muted-foreground">Share:</span>
              <span className="text-xs font-medium text-popover-foreground">
                {data?.percentage}%
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const chartData = data.map((item, index) => ({
    ...item,
    value: viewMode === 'volume' ? item.volume : item.count,
    color: getMethodColor(index)
  }));

  return (
    <div className="data-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Payment Method Analysis</h3>
          <p className="text-sm text-muted-foreground">Transaction distribution by payment type</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'volume' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('volume')}
          >
            Volume
          </Button>
          <Button
            variant={viewMode === 'count' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('count')}
          >
            Count
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                onMouseEnter={(_, index) => setSelectedMethod(index)}
                onMouseLeave={() => setSelectedMethod(null)}
              >
                {chartData?.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry?.color}
                    stroke={selectedMethod === index ? 'var(--color-primary)' : 'transparent'}
                    strokeWidth={selectedMethod === index ? 2 : 0}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Method Details */}
        <div className="space-y-3">
          {data?.map((method, index) => (
            <div
              key={method?.method}
              className={`
                p-3 rounded-lg border transition-smooth cursor-pointer
                ${selectedMethod === index 
                  ? 'border-primary bg-primary/5' :'border-border hover:border-muted-foreground hover:bg-muted/30'
                }
              `}
              onMouseEnter={() => setSelectedMethod(index)}
              onMouseLeave={() => setSelectedMethod(null)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: getMethodColor(index) }}
                  />
                  <Icon name={getMethodIcon(method?.method)} size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{method?.method}</span>
                </div>
                <span className="text-xs text-muted-foreground">{method?.percentage}%</span>
              </div>
              
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">Volume</div>
                  <div className="text-sm font-medium text-foreground font-data">
                    {formatCurrency(method?.volume)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Transactions</div>
                  <div className="text-sm font-medium text-foreground">
                    {method?.count?.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">Success Rate</div>
                  <div className={`text-sm font-medium ${method?.successRate >= 95 ? 'text-success' : method?.successRate >= 90 ? 'text-warning' : 'text-error'}`}>
                    {method?.successRate}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Avg Amount</div>
                  <div className="text-sm font-medium text-foreground">
                    {formatCurrency(method?.avgAmount)}
                  </div>
                </div>
              </div>

              {/* Risk Indicator */}
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={method?.riskLevel === 'low' ? 'CheckCircle' : method?.riskLevel === 'medium' ? 'AlertCircle' : 'AlertTriangle'} 
                    size={12} 
                    className={
                      method?.riskLevel === 'low' ? 'text-success' : 
                      method?.riskLevel === 'medium' ? 'text-warning' : 'text-error'
                    }
                  />
                  <span className="text-xs text-muted-foreground capitalize">
                    {method?.riskLevel} Risk
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Avg Processing: {method?.avgProcessingTime}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-foreground font-data">
              {data?.length}
            </div>
            <div className="text-xs text-muted-foreground">Active Methods</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-success font-data">
              {data.length > 0 ? Math.round(data.reduce((sum, m) => sum + m.successRate, 0) / data.length) : 0}%
            </div>
            <div className="text-xs text-muted-foreground">Avg Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-foreground font-data">
              {formatCurrency(data.reduce((sum, m) => sum + m.volume, 0))}
            </div>
            <div className="text-xs text-muted-foreground">Total Volume</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-foreground font-data">
              {data.reduce((sum, m) => sum + m.count, 0)?.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Total Transactions</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodAnalysis;