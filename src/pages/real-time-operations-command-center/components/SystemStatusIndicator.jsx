import React from 'react';
import Icon from '../../../components/AppIcon';

const SystemStatusIndicator = ({ systemStatus, connectionStatus, className = '' }) => {
  const defaultStatus = {
    webSocket: { status: '...', latency: '...' },
    database: { status: '...', responseTime: '...' },
    paymentGateway: { status: '...', uptime: '...' },
    gameEngine: { status: '...', load: '...' },
    monitoring: { lastUpdate: new Date() }
  };

  const status = systemStatus || defaultStatus;
  const connStatus = connectionStatus || 'connecting';

  const getStatusColor = (s) => {
    switch (s) {
      case 'connected': case 'healthy':
        return 'text-success';
      case 'warning': case 'reconnecting':
        return 'text-warning';
      case 'disconnected': case 'error':
        return 'text-critical';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (s) => {
    switch (s) {
      case 'connected': case 'healthy':
        return 'CheckCircle';
      case 'warning': case 'reconnecting':
        return 'AlertCircle';
      case 'disconnected': case 'error':
        return 'XCircle';
      default:
        return 'Circle';
    }
  };

  const formatLastUpdate = (timestamp) => {
    return timestamp?.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <div className="bg-card border border-border rounded-lg shadow-elevated p-3 min-w-[280px]">
        {/* Main Connection Status */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              connStatus === 'connected' ? 'bg-success animate-pulse' :
              connStatus === 'reconnecting'? 'bg-warning animate-pulse' : 'bg-critical'
            }`} />
            <span className="text-sm font-medium text-foreground">
              {connStatus === 'connected' ? 'Live Data Stream' :
               connStatus === 'reconnecting'? 'Reconnecting...' : 'Connection Lost'}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {formatLastUpdate(status?.monitoring?.lastUpdate || new Date())}
          </span>
        </div>
        
        {/* System Components */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon 
                name={getStatusIcon(status.webSocket?.status)}
                size={12} 
                className={getStatusColor(status.webSocket?.status)}
              />
              <span className="text-xs text-muted-foreground">WebSocket</span>
            </div>
            <span className="text-xs text-foreground">
              {status.webSocket?.latency}ms
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon 
                name={getStatusIcon(status.database?.status)}
                size={12} 
                className={getStatusColor(status.database?.status)}
              />
              <span className="text-xs text-muted-foreground">Database</span>
            </div>
            <span className="text-xs text-foreground">
              {status.database?.responseTime}ms
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon 
                name={getStatusIcon(status.paymentGateway?.status)}
                size={12} 
                className={getStatusColor(status.paymentGateway?.status)}
              />
              <span className="text-xs text-muted-foreground">Payment</span>
            </div>
            <span className="text-xs text-foreground">
              {status.paymentGateway?.uptime}%
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon 
                name={getStatusIcon(status.gameEngine?.status)}
                size={12} 
                className={getStatusColor(status.gameEngine?.status)}
              />
              <span className="text-xs text-muted-foreground">Game Engine</span>
            </div>
            <span className="text-xs text-foreground">
              {status.gameEngine?.load}% load
            </span>
          </div>
        </div>
        
        {/* Auto-refresh indicator */}
        <div className="flex items-center justify-center mt-3 pt-2 border-t border-border">
          <div className="flex items-center space-x-1 text-muted-foreground">
            <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
            <span className="text-xs">Auto-refresh: 5s</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemStatusIndicator;