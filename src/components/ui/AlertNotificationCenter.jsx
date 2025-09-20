import React, { useState, useEffect } from 'react';
import Button from './Button';
import Icon from '../AppIcon';

const AlertNotificationCenter = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Mock alerts data - in real app, this would come from WebSocket or API
  const mockAlerts = [
    {
      id: 1,
      type: 'critical',
      title: 'System Performance Alert',
      message: 'Server response time exceeded 2s threshold',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      source: 'Live Operations'
    },
    {
      id: 2,
      type: 'high',
      title: 'Revenue Anomaly Detected',
      message: 'Unusual drop in revenue for Slot Game #247',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: false,
      source: 'Game Analytics'
    },
    {
      id: 3,
      type: 'medium',
      title: 'Player Behavior Pattern',
      message: 'Increased player churn rate in EU region',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: true,
      source: 'Player Intelligence'
    },
    {
      id: 4,
      type: 'low',
      title: 'Maintenance Scheduled',
      message: 'Database maintenance scheduled for 2:00 AM UTC',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
      source: 'System'
    },
    {
      id: 5,
      type: 'high',
      title: 'Risk Management Alert',
      message: 'Suspicious betting pattern detected - Account #78432',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      read: false,
      source: 'Financial Control'
    }
  ];

  useEffect(() => {
    setAlerts(mockAlerts);
    setUnreadCount(mockAlerts?.filter(alert => !alert?.read)?.length);
  }, []);

  const getAlertIcon = (type) => {
    switch (type) {
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

  const getAlertColor = (type) => {
    switch (type) {
      case 'critical':
        return 'text-critical';
      case 'high':
        return 'text-high';
      case 'medium':
        return 'text-medium';
      case 'low':
        return 'text-low';
      default:
        return 'text-muted-foreground';
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

  const markAsRead = (alertId) => {
    setAlerts(prev => prev?.map(alert => 
      alert?.id === alertId ? { ...alert, read: true } : alert
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev?.map(alert => ({ ...alert, read: true })));
    setUnreadCount(0);
  };

  const clearAlert = (alertId) => {
    setAlerts(prev => prev?.filter(alert => alert?.id !== alertId));
    const alert = alerts?.find(a => a?.id === alertId);
    if (alert && !alert?.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Icon name="Bell" size={18} />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-critical text-critical-foreground text-xs font-medium rounded-full flex items-center justify-center animate-pulse-critical">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
        <span className="sr-only">
          {unreadCount > 0 ? `${unreadCount} unread notifications` : 'Notifications'}
        </span>
      </Button>
      {/* Notification Panel */}
      {isOpen && (
        <>
          <div className="absolute top-full right-0 mt-2 w-96 bg-popover border border-border rounded-lg shadow-modal z-100 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-semibold text-popover-foreground">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-1">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  iconName="X"
                  iconSize={16}
                />
              </div>
            </div>

            {/* Alerts List */}
            <div className="max-h-96 overflow-y-auto">
              {alerts?.length === 0 ? (
                <div className="p-8 text-center">
                  <Icon name="Bell" size={32} className="text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No notifications</p>
                </div>
              ) : (
                <div className="p-2">
                  {alerts?.map((alert) => (
                    <div
                      key={alert?.id}
                      className={`
                        p-3 rounded-lg mb-2 transition-smooth cursor-pointer
                        ${alert?.read 
                          ? 'bg-transparent hover:bg-muted/30' :'bg-primary/5 hover:bg-primary/10 border border-primary/20'
                        }
                      `}
                      onClick={() => !alert?.read && markAsRead(alert?.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <Icon 
                          name={getAlertIcon(alert?.type)} 
                          size={16} 
                          className={`mt-0.5 flex-shrink-0 ${getAlertColor(alert?.type)}`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className={`text-sm font-medium ${alert?.read ? 'text-muted-foreground' : 'text-popover-foreground'}`}>
                                {alert?.title}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {alert?.message}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-muted-foreground">
                                  {alert?.source} • {formatTimestamp(alert?.timestamp)}
                                </span>
                                {!alert?.read && (
                                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e?.stopPropagation();
                                clearAlert(alert?.id);
                              }}
                              className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              iconName="X"
                              iconSize={12}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {alerts?.length > 0 && (
              <div className="p-3 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-center text-xs"
                  iconName="ExternalLink"
                  iconPosition="right"
                  iconSize={12}
                >
                  View all notifications
                </Button>
              </div>
            )}
          </div>

          {/* Backdrop */}
          <div
            className="fixed inset-0 z-90"
            onClick={() => setIsOpen(false)}
          />
        </>
      )}
    </div>
  );
};

export default AlertNotificationCenter;