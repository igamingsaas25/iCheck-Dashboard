import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const FinancialFlowDiagram = ({ flowData, currency = 'USD' }) => {
  const [selectedFlow, setSelectedFlow] = useState(null);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: 'compact'
    })?.format(value);
  };

  const getFlowColor = (type, hasAnomaly) => {
    if (hasAnomaly) return 'border-error bg-error/10';
    switch (type) {
      case 'deposit':
        return 'border-success bg-success/10';
      case 'withdrawal':
        return 'border-warning bg-warning/10';
      case 'bonus':
        return 'border-secondary bg-secondary/10';
      default:
        return 'border-border bg-muted/10';
    }
  };

  const getFlowIcon = (type) => {
    switch (type) {
      case 'deposit':
        return 'ArrowDownCircle';
      case 'withdrawal':
        return 'ArrowUpCircle';
      case 'bonus':
        return 'Gift';
      default:
        return 'DollarSign';
    }
  };

  return (
    <div className="data-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Financial Flow Analysis</h3>
          <p className="text-sm text-muted-foreground">Deposit/withdrawal patterns with anomaly detection</p>
        </div>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full" />
            <span className="text-muted-foreground">Deposits</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning rounded-full" />
            <span className="text-muted-foreground">Withdrawals</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-error rounded-full" />
            <span className="text-muted-foreground">Anomalies</span>
          </div>
        </div>
      </div>
      {/* Flow Diagram */}
      <div className="relative">
        {/* Central Hub */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-24 h-24 bg-primary/10 border-2 border-primary rounded-full flex items-center justify-center">
            <div className="text-center">
              <Icon name="Building" size={24} className="text-primary mx-auto mb-1" />
              <span className="text-xs font-medium text-primary">Platform</span>
            </div>
          </div>
        </div>

        {/* Flow Connections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {flowData?.map((flow, index) => (
            <div
              key={flow?.id}
              className={`
                relative p-4 rounded-lg border-2 transition-smooth cursor-pointer
                ${getFlowColor(flow?.type, flow?.hasAnomaly)}
                ${selectedFlow === flow?.id ? 'ring-2 ring-primary' : ''}
                hover:shadow-sm
              `}
              onClick={() => setSelectedFlow(selectedFlow === flow?.id ? null : flow?.id)}
            >
              {/* Anomaly Indicator */}
              {flow?.hasAnomaly && (
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-error rounded-full flex items-center justify-center animate-pulse-critical">
                  <Icon name="AlertTriangle" size={10} className="text-white" />
                </div>
              )}

              <div className="flex items-center space-x-3 mb-3">
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center
                  ${flow?.type === 'deposit' ? 'bg-success/20' : 
                    flow?.type === 'withdrawal' ? 'bg-warning/20' : 'bg-secondary/20'}
                `}>
                  <Icon 
                    name={getFlowIcon(flow?.type)} 
                    size={20} 
                    className={
                      flow?.type === 'deposit' ? 'text-success' : 
                      flow?.type === 'withdrawal' ? 'text-warning' : 'text-secondary'
                    }
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground capitalize">{flow?.type}s</h4>
                  <p className="text-xs text-muted-foreground">{flow?.method}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Volume</span>
                  <span className="text-sm font-bold text-foreground font-data">
                    {formatCurrency(flow?.volume)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Transactions</span>
                  <span className="text-sm font-medium text-foreground">
                    {flow?.count?.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Avg Amount</span>
                  <span className="text-sm font-medium text-foreground">
                    {formatCurrency(flow?.avgAmount)}
                  </span>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedFlow === flow?.id && (
                <div className="mt-4 pt-4 border-t border-border animate-slide-in">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Success Rate</span>
                      <span className="text-sm font-medium text-success">
                        {flow?.successRate}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Processing Time</span>
                      <span className="text-sm font-medium text-foreground">
                        {flow?.avgProcessingTime}
                      </span>
                    </div>
                    {flow?.hasAnomaly && (
                      <div className="mt-3 p-2 bg-error/10 border border-error/20 rounded">
                        <div className="flex items-center space-x-2">
                          <Icon name="AlertTriangle" size={14} className="text-error" />
                          <span className="text-xs font-medium text-error">Anomaly Detected</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {flow?.anomalyDescription}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-success font-data">
              {formatCurrency(flowData?.filter(f => f?.type === 'deposit')?.reduce((sum, f) => sum + f?.volume, 0))}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Total Deposits</div>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-warning font-data">
              {formatCurrency(flowData?.filter(f => f?.type === 'withdrawal')?.reduce((sum, f) => sum + f?.volume, 0))}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Total Withdrawals</div>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-foreground font-data">
              {flowData?.reduce((sum, f) => sum + f?.count, 0)?.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Total Transactions</div>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-error font-data">
              {flowData?.filter(f => f?.hasAnomaly)?.length}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Active Anomalies</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialFlowDiagram;