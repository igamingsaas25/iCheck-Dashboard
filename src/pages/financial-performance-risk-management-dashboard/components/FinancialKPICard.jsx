import React from 'react';
import Icon from '../../../components/AppIcon';

const FinancialKPICard = ({ title, value, currency, change, changeType, icon, description, trend }) => {
  const formatValue = (val, curr) => {
    if (typeof val === 'number') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: curr || 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      })?.format(val);
    }
    return val;
  };

  const getChangeColor = (type) => {
    switch (type) {
      case 'positive':
        return 'text-success';
      case 'negative':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getChangeIcon = (type) => {
    switch (type) {
      case 'positive':
        return 'TrendingUp';
      case 'negative':
        return 'TrendingDown';
      default:
        return 'Minus';
    }
  };

  return (
    <div className="data-card p-6 hover-lift">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name={icon} size={24} className="text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
        </div>
        {trend && (
          <div className="w-16 h-8 bg-muted/30 rounded flex items-center justify-center">
            <div className="w-12 h-2 bg-primary/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, trend))}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="text-3xl font-bold text-foreground font-data">
          {currency ? formatValue(value, currency) : value}
        </div>
        
        {change && (
          <div className={`flex items-center space-x-2 ${getChangeColor(changeType)}`}>
            <Icon name={getChangeIcon(changeType)} size={16} />
            <span className="text-sm font-medium">
              {typeof change === 'number' ? `${Math.abs(change)}%` : change}
            </span>
            <span className="text-xs text-muted-foreground">vs last period</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialKPICard;