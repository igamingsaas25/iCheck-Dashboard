import React from 'react';
import Icon from '../../../components/AppIcon';

const BusinessHealthIndicators = () => {
  const indicators = [
    {
      id: 1,
      title: "Total Revenue",
      value: "$47.2M",
      change: "+12.3%",
      trend: "up",
      period: "vs last quarter",
      description: "Gross gaming revenue across all platforms",
      status: "excellent"
    },
    {
      id: 2,
      title: "Player Growth Rate",
      value: "18.7%",
      change: "+3.2%",
      trend: "up",
      period: "monthly growth",
      description: "New player acquisition and retention",
      status: "good"
    },
    {
      id: 3,
      title: "Market Share",
      value: "23.4%",
      change: "+1.8%",
      trend: "up",
      period: "in target regions",
      description: "Competitive position in key markets",
      status: "good"
    },
    {
      id: 4,
      title: "Operational Efficiency",
      value: "94.2%",
      change: "-0.5%",
      trend: "down",
      period: "system uptime",
      description: "Platform availability and performance",
      status: "warning"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent':
        return 'text-success';
      case 'good':
        return 'text-primary';
      case 'warning':
        return 'text-warning';
      case 'critical':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? 'TrendingUp' : 'TrendingDown';
  };

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-success' : 'text-destructive';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {indicators?.map((indicator) => (
        <div
          key={indicator?.id}
          className="data-card p-6 hover-lift cursor-pointer group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {indicator?.title}
              </h3>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-foreground">
                  {indicator?.value}
                </span>
                <div className={`flex items-center space-x-1 ${getTrendColor(indicator?.trend)}`}>
                  <Icon 
                    name={getTrendIcon(indicator?.trend)} 
                    size={16} 
                    className={getTrendColor(indicator?.trend)}
                  />
                  <span className="text-sm font-medium">
                    {indicator?.change}
                  </span>
                </div>
              </div>
            </div>
            <div className={`w-3 h-3 rounded-full ${getStatusColor(indicator?.status)} bg-current opacity-80`}></div>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              {indicator?.period}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {indicator?.description}
            </p>
          </div>

          {/* Hover tooltip */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-popover border border-border rounded-lg shadow-modal text-xs text-popover-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
            Click for detailed breakdown
          </div>
        </div>
      ))}
    </div>
  );
};

export default BusinessHealthIndicators;