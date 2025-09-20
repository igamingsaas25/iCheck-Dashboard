import React from 'react';
import Icon from '../../../components/AppIcon';

const PerformanceMetricCards = ({ metrics }) => {
  const metricCards = [
    {
      id: 'totalGames',
      title: 'Total Games Active',
      value: metrics?.totalGames,
      format: 'number',
      icon: 'Gamepad2',
      trend: metrics?.totalGamesTrend,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      id: 'avgRtp',
      title: 'Average RTP',
      value: metrics?.avgRtp,
      format: 'percentage',
      icon: 'Percent',
      trend: metrics?.avgRtpTrend,
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      id: 'peakPlayers',
      title: 'Peak Concurrent Players',
      value: metrics?.peakPlayers,
      format: 'number',
      icon: 'Users',
      trend: metrics?.peakPlayersTrend,
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      id: 'revenuePerGame',
      title: 'Revenue per Game',
      value: metrics?.revenuePerGame,
      format: 'currency',
      icon: 'DollarSign',
      trend: metrics?.revenuePerGameTrend,
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    }
  ];

  const formatValue = (value, format) => {
    switch (format) {
      case 'currency':
        return `$${(value / 1000)?.toFixed(1)}K`;
      case 'percentage':
        return `${value?.toFixed(1)}%`;
      case 'number':
        return value?.toLocaleString();
      default:
        return value;
    }
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return 'TrendingUp';
    if (trend < 0) return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return 'text-success';
    if (trend < 0) return 'text-error';
    return 'text-muted-foreground';
  };

  const generateSparklineData = (trend) => {
    const baseValue = 50;
    const variation = trend * 2;
    return Array.from({ length: 12 }, (_, i) => {
      const noise = (Math.random() - 0.5) * 10;
      return Math.max(0, baseValue + (variation * i / 11) + noise);
    });
  };

  const SparklineChart = ({ data, color }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data?.map((value, index) => {
      const x = (index / (data?.length - 1)) * 60;
      const y = 20 - ((value - min) / range) * 20;
      return `${x},${y}`;
    })?.join(' ');

    return (
      <svg width="60" height="20" className="opacity-60">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricCards?.map((card) => {
        const sparklineData = generateSparklineData(card?.trend);
        
        return (
          <div key={card?.id} className="bg-card rounded-lg border p-6 hover-lift">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${card?.bgColor}`}>
                <Icon name={card?.icon} size={20} className={card?.color} />
              </div>
              <div className="flex items-center space-x-2">
                <Icon
                  name={getTrendIcon(card?.trend)}
                  size={16}
                  className={getTrendColor(card?.trend)}
                />
                <span className={`text-sm font-medium ${getTrendColor(card?.trend)}`}>
                  {Math.abs(card?.trend)?.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                {card?.title}
              </h3>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-card-foreground">
                  {formatValue(card?.value, card?.format)}
                </span>
                <SparklineChart data={sparklineData} color={card?.color?.replace('text-', '')} />
              </div>
            </div>
            {/* Additional Context */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>vs last period</span>
                <span className={getTrendColor(card?.trend)}>
                  {card?.trend > 0 ? '+' : ''}{card?.trend?.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PerformanceMetricCards;