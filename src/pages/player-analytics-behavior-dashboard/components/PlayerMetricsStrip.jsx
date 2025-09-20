import React from 'react';
import Icon from '../../../components/AppIcon';

const PlayerMetricsStrip = ({ filters }) => {
  const metrics = [
    {
      id: 'acquisition',
      title: 'Player Acquisition',
      value: '2,847',
      change: '+12.3%',
      changeType: 'positive',
      icon: 'UserPlus',
      description: 'New registrations',
      period: 'vs last period'
    },
    {
      id: 'retention',
      title: 'Retention Rate',
      value: '68.4%',
      change: '+2.1%',
      changeType: 'positive',
      icon: 'Users',
      description: '7-day retention',
      period: 'vs last period'
    },
    {
      id: 'session',
      title: 'Avg Session Duration',
      value: '24.6m',
      change: '-1.2m',
      changeType: 'negative',
      icon: 'Clock',
      description: 'Average playtime',
      period: 'vs last period'
    },
    {
      id: 'ltv',
      title: 'Customer LTV',
      value: '$487.20',
      change: '+$23.40',
      changeType: 'positive',
      icon: 'DollarSign',
      description: 'Lifetime value',
      period: 'vs last period'
    }
  ];

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
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {metrics?.map((metric) => (
        <div key={metric?.id} className="data-card hover-lift p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name={metric?.icon} size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  {metric?.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {metric?.description}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-2xl font-semibold text-foreground">
              {metric?.value}
            </div>
            <div className="flex items-center space-x-2">
              <div className={`flex items-center space-x-1 ${getChangeColor(metric?.changeType)}`}>
                <Icon name={getChangeIcon(metric?.changeType)} size={14} />
                <span className="text-sm font-medium">{metric?.change}</span>
              </div>
              <span className="text-xs text-muted-foreground">{metric?.period}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlayerMetricsStrip;