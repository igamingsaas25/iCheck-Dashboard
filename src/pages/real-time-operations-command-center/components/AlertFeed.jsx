import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertFeed = ({ className = '' }) => {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('all');

  // Mock real-time alerts
  const mockAlerts = [
    {
      id: 1,
      type: 'critical',
      title: 'High Server Load',
      message: 'Server CPU usage exceeded 90% threshold',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      source: 'System Monitor',
      acknowledged: false,
      actions: ['Scale Up', 'Investigate']
    },
    {
      id: 2,
      type: 'warning',
      title: 'Payment Gateway Latency',
      message: 'Average response time increased to 3.2s',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      source: 'Payment System',
      acknowledged: false,
      actions: ['Check Status', 'Switch Provider']
    },
    {
      id: 3,
      type: 'info',
      title: 'Peak Traffic Period',
      message: 'Concurrent users reached 15,000 (80% capacity)',
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      source: 'Traffic Monitor',
      acknowledged: true,
      actions: ['Monitor', 'Prepare Scale']
    },
    {
      id: 4,
      type: 'critical',
      title: 'Fraud Detection Alert',
      message: 'Suspicious betting pattern detected - Account #78432',
      timestamp: new Date(Date.now() - 12 * 60 * 1000),
      source: 'Risk Management',
      acknowledged: false,
      actions: ['Block Account', 'Review Activity']
    },
    {
      id: 5,
      type: 'warning',
      title: 'Game Server Restart',
      message: 'Poker Server #3 automatically restarted due to memory leak',
      timestamp: new Date(Date.now() - 18 * 60 * 1000),
      source: 'Game Engine',
      acknowledged: true,
      actions: ['Check Logs', 'Monitor Performance']
    }
  ];

  useEffect(() => {
    setAlerts(mockAlerts);
    
    // Simulate new alerts
    const interval = setInterval(() => {
      const alertTypes = ['critical', 'warning', 'info'];
      const sources = ['System Monitor', 'Payment System', 'Game Engine', 'Risk Management'];
      const messages = [
        'Database connection timeout detected',
        'Unusual player activity pattern observed',
        'Memory usage approaching threshold',
        'Network latency spike detected',
        'Cache hit ratio below optimal level'
      ];
      
      const newAlert = {
        id: Date.now(),
        type: alertTypes?.[Math.floor(Math.random() * alertTypes?.length)],
        title: 'System Alert',
        message: messages?.[Math.floor(Math.random() * messages?.length)],
        timestamp: new Date(),
        source: sources?.[Math.floor(Math.random() * sources?.length)],
        acknowledged: false,
        actions: ['Investigate', 'Acknowledge']
      };
      
      setAlerts(prev => [newAlert, ...prev?.slice(0, 19)]); // Keep last 20 alerts
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical':
        return 'AlertTriangle';
      case 'warning':
        return 'AlertCircle';
      case 'info':
        return 'Info';
      default:
        return 'Bell';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'critical':
        return 'text-critical border-l-critical bg-critical/5';
      case 'warning':
        return 'text-warning border-l-warning bg-warning/5';
      case 'info':
        return 'text-primary border-l-primary bg-primary/5';
      default:
        return 'text-muted-foreground border-l-muted bg-muted/5';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return timestamp?.toLocaleDateString();
  };

  const acknowledgeAlert = (alertId) => {
    setAlerts(prev => prev?.map(alert => 
      alert?.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const filteredAlerts = alerts?.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'unacknowledged') return !alert?.acknowledged;
    return alert?.type === filter;
  });

  const unacknowledgedCount = alerts?.filter(alert => !alert?.acknowledged)?.length;

  return (
    <div className={`data-card ${className}`}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-foreground">Live Alerts</h3>
            {unacknowledgedCount > 0 && (
              <span className="px-2 py-1 bg-critical/10 text-critical text-xs font-medium rounded-full">
                {unacknowledgedCount} new
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            iconName="Settings"
            iconSize={16}
          />
        </div>
        
        <div className="flex space-x-1 bg-muted/30 rounded-lg p-1">
          {[
            { key: 'all', label: 'All' },
            { key: 'unacknowledged', label: 'New' },
            { key: 'critical', label: 'Critical' },
            { key: 'warning', label: 'Warning' }
          ]?.map((filterOption) => (
            <button
              key={filterOption?.key}
              onClick={() => setFilter(filterOption?.key)}
              className={`px-3 py-1 text-xs font-medium rounded transition-smooth ${
                filter === filterOption?.key
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {filterOption?.label}
            </button>
          ))}
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {filteredAlerts?.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="CheckCircle" size={32} className="text-success mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No alerts matching filter</p>
          </div>
        ) : (
          <div className="p-2">
            {filteredAlerts?.map((alert) => (
              <div
                key={alert?.id}
                className={`
                  p-3 rounded-lg mb-2 border-l-4 transition-smooth
                  ${getAlertColor(alert?.type)}
                  ${alert?.acknowledged ? 'opacity-60' : ''}
                `}
              >
                <div className="flex items-start space-x-3">
                  <Icon 
                    name={getAlertIcon(alert?.type)} 
                    size={16} 
                    className={`mt-0.5 flex-shrink-0 ${
                      alert?.type === 'critical' ? 'text-critical' :
                      alert?.type === 'warning'? 'text-warning' : 'text-primary'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className={`text-sm font-medium ${alert?.acknowledged ? 'text-muted-foreground' : 'text-foreground'}`}>
                          {alert?.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {alert?.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            {alert?.source} • {formatTimestamp(alert?.timestamp)}
                          </span>
                          {alert?.acknowledged && (
                            <div className="flex items-center space-x-1 text-success">
                              <Icon name="Check" size={12} />
                              <span className="text-xs">Acknowledged</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {!alert?.acknowledged && alert?.actions && (
                      <div className="flex space-x-2 mt-3">
                        {alert?.actions?.map((action, index) => (
                          <Button
                            key={index}
                            variant={index === 0 ? "default" : "outline"}
                            size="xs"
                            onClick={() => {
                              if (action === 'Acknowledge') {
                                acknowledgeAlert(alert?.id);
                              }
                            }}
                          >
                            {action}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertFeed;