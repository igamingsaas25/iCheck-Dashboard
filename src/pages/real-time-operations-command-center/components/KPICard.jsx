import React from 'react';
import Icon from '../../../components/AppIcon';

const KPICard = ({ title, value, unit, change, changeType, icon, sparklineData, threshold, className = '' }) => {
  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-success';
    if (changeType === 'negative') return 'text-error';
    return 'text-muted-foreground';
  };

  const getThresholdColor = () => {
    if (threshold === 'critical') return 'border-l-critical';
    if (threshold === 'warning') return 'border-l-warning';
    if (threshold === 'good') return 'border-l-success';
    return 'border-l-primary';
  };

  const renderSparkline = () => {
    if (!sparklineData || sparklineData?.length === 0) return null;
    
    const max = Math.max(...sparklineData);
    const min = Math.min(...sparklineData);
    const range = max - min || 1;
    
    const points = sparklineData?.map((value, index) => {
      const x = (index / (sparklineData?.length - 1)) * 60;
      const y = 20 - ((value - min) / range) * 15;
      return `${x},${y}`;
    })?.join(' ');

    return (
      <svg width="60" height="20" className="opacity-60">
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div className={`data-card hover-lift border-l-4 ${getThresholdColor()} ${className}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Icon name={icon} size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">{title}</span>
          </div>
          {renderSparkline()}
        </div>
        
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold text-foreground">{value}</span>
              {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
            </div>
            {change && (
              <div className={`flex items-center space-x-1 mt-1 ${getChangeColor()}`}>
                <Icon 
                  name={changeType === 'positive' ? 'TrendingUp' : changeType === 'negative' ? 'TrendingDown' : 'Minus'} 
                  size={12} 
                />
                <span className="text-xs font-medium">{change}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPICard;