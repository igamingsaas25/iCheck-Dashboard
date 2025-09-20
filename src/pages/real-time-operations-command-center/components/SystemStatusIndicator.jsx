import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const SystemStatusIndicator = ({ className = '' }) => {
  const [systemStatus, setSystemStatus] = useState({});
  const [connectionStatus, setConnectionStatus] = useState('connected');

  // Mock system status data
  const mockSystemStatus = {
    webSocket: { status: 'connected', latency: 45 },
    database: { status: 'healthy', responseTime: 120 },
    paymentGateway: { status: 'healthy', uptime: 99.9 },
    gameEngine: { status: 'warning', load: 85 },
    cdn: { status: 'healthy', hitRate: 94.2 },
    monitoring: { status: 'connected', lastUpdate: new Date() }
  };

  useEffect(() => {
    setSystemStatus(mockSystemStatus);
    
    // Simulate connection status changes
    const interval = setInterval(() => {
      const statuses = ['connected', 'reconnecting', 'disconnected'];
      const randomStatus = statuses?.[Math.floor(Math.random() * statuses?.length)];
      
      // Mostly stay connected, occasionally show other states
      if (Math.random() > 0.9) {
        setConnectionStatus(randomStatus);
        setTimeout(() => setConnectionStatus('connected'), 3000);
      }
      
      // Update system metrics
      setSystemStatus(prev => ({
        ...prev,
        webSocket: {
          ...prev?.webSocket,
          latency: 30 + Math.floor(Math.random() * 50)
        },
        database: {
          ...prev?.database,
          responseTime: 80 + Math.floor(Math.random() * 100)
        },
        gameEngine: {
          ...prev?.gameEngine,
          load: 70 + Math.floor(Math.random() * 30)
        },
        monitoring: {
          ...prev?.monitoring,
          lastUpdate: new Date()
        }
      }));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': case'healthy':
        return 'text-success';
      case 'warning': case'reconnecting':
        return 'text-warning';
      case 'disconnected': case'error':
        return 'text-critical';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': case'healthy':
        return 'CheckCircle';
      case 'warning': case'reconnecting':
        return 'AlertCircle';
      case 'disconnected': case'error':
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
              connectionStatus === 'connected' ? 'bg-success animate-pulse' :
              connectionStatus === 'reconnecting'? 'bg-warning animate-pulse' : 'bg-critical'
            }`} />
            <span className="text-sm font-medium text-foreground">
              {connectionStatus === 'connected' ? 'Live Data Stream' :
               connectionStatus === 'reconnecting'? 'Reconnecting...' : 'Connection Lost'}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {formatLastUpdate(systemStatus?.monitoring?.lastUpdate || new Date())}
          </span>
        </div>
        
        {/* System Components */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon 
                name={getStatusIcon(systemStatus?.webSocket?.status)} 
                size={12} 
                className={getStatusColor(systemStatus?.webSocket?.status)}
              />
              <span className="text-xs text-muted-foreground">WebSocket</span>
            </div>
            <span className="text-xs text-foreground">
              {systemStatus?.webSocket?.latency}ms
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon 
                name={getStatusIcon(systemStatus?.database?.status)} 
                size={12} 
                className={getStatusColor(systemStatus?.database?.status)}
              />
              <span className="text-xs text-muted-foreground">Database</span>
            </div>
            <span className="text-xs text-foreground">
              {systemStatus?.database?.responseTime}ms
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon 
                name={getStatusIcon(systemStatus?.paymentGateway?.status)} 
                size={12} 
                className={getStatusColor(systemStatus?.paymentGateway?.status)}
              />
              <span className="text-xs text-muted-foreground">Payment</span>
            </div>
            <span className="text-xs text-foreground">
              {systemStatus?.paymentGateway?.uptime}%
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon 
                name={getStatusIcon(systemStatus?.gameEngine?.status)} 
                size={12} 
                className={getStatusColor(systemStatus?.gameEngine?.status)}
              />
              <span className="text-xs text-muted-foreground">Game Engine</span>
            </div>
            <span className="text-xs text-foreground">
              {systemStatus?.gameEngine?.load}% load
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