import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FraudAlertFeed = ({ alerts }) => {
  const [filter, setFilter] = useState('all');

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'text-critical bg-critical/10 border-critical/20';
      case 'high':
        return 'text-high bg-high/10 border-high/20';
      case 'medium':
        return 'text-medium bg-medium/10 border-medium/20';
      case 'low':
        return 'text-low bg-low/10 border-low/20';
      default:
        return 'text-muted-foreground bg-muted/10 border-border';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return 'AlertTriangle';
      case 'high':
        return 'AlertCircle';
      case 'medium':
        return 'Info';
      case 'low':
        return 'CheckCircle';
      default:
        return 'Bell';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diff = now - alertTime;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return alertTime?.toLocaleDateString();
  };

  const filteredAlerts = filter === 'all' 
    ? alerts 
    : alerts?.filter(alert => alert?.severity === filter);

  const severityCounts = alerts?.reduce((acc, alert) => {
    acc[alert.severity] = (acc?.[alert?.severity] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="data-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Fraud Alert Feed</h3>
          <p className="text-sm text-muted-foreground">Real-time risk monitoring</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>
      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-4 bg-muted/30 rounded-lg p-1">
        {['all', 'critical', 'high', 'medium', 'low']?.map((severity) => (
          <button
            key={severity}
            onClick={() => setFilter(severity)}
            className={`
              flex-1 px-3 py-2 text-xs font-medium rounded-md transition-smooth capitalize
              ${filter === severity 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
              }
            `}
          >
            {severity}
            {severity !== 'all' && severityCounts?.[severity] && (
              <span className="ml-1 px-1.5 py-0.5 bg-primary/20 text-primary rounded-full text-xs">
                {severityCounts?.[severity]}
              </span>
            )}
          </button>
        ))}
      </div>
      {/* Alerts List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredAlerts?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Shield" size={32} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No alerts for selected filter</p>
          </div>
        ) : (
          filteredAlerts?.map((alert) => (
            <div
              key={alert?.id}
              className={`
                p-4 rounded-lg border transition-smooth hover:shadow-sm
                ${getSeverityColor(alert?.severity)}
              `}
            >
              <div className="flex items-start space-x-3">
                <Icon 
                  name={getSeverityIcon(alert?.severity)} 
                  size={16} 
                  className={`mt-0.5 flex-shrink-0 ${alert?.severity === 'critical' ? 'animate-pulse' : ''}`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-foreground mb-1">
                        {alert?.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {alert?.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                          <span>Account: {alert?.accountId}</span>
                          <span>•</span>
                          <span>{formatTimestamp(alert?.timestamp)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="xs"
                            iconName="Eye"
                            iconPosition="left"
                          >
                            Investigate
                          </Button>
                          <Button
                            variant="ghost"
                            size="xs"
                            iconName="X"
                            iconSize={12}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Footer Actions */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {filteredAlerts?.length} of {alerts?.length} alerts
          </span>
          <Button
            variant="ghost"
            size="sm"
            iconName="ExternalLink"
            iconPosition="right"
            iconSize={12}
          >
            View All Alerts
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FraudAlertFeed;