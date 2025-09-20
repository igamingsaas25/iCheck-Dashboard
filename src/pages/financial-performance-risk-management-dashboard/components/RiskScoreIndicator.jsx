import React from 'react';
import Icon from '../../../components/AppIcon';

const RiskScoreIndicator = ({ score, trend, factors, lastUpdated }) => {
  const getRiskLevel = (score) => {
    if (score >= 80) return { level: 'Critical', color: 'text-critical', bgColor: 'bg-critical/10', borderColor: 'border-critical' };
    if (score >= 60) return { level: 'High', color: 'text-high', bgColor: 'bg-high/10', borderColor: 'border-high' };
    if (score >= 40) return { level: 'Medium', color: 'text-medium', bgColor: 'bg-medium/10', borderColor: 'border-medium' };
    return { level: 'Low', color: 'text-low', bgColor: 'bg-low/10', borderColor: 'border-low' };
  };

  const risk = getRiskLevel(score);

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp)?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className={`data-card p-6 border-2 ${risk?.borderColor} ${risk?.bgColor}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Overall Risk Score</h3>
          <p className="text-sm text-muted-foreground">Composite risk assessment</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span className="text-xs text-muted-foreground">
            Updated: {formatTimestamp(lastUpdated)}
          </span>
        </div>
      </div>
      {/* Risk Score Display */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-32 h-32">
          {/* Circular Progress */}
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="var(--color-muted)"
              strokeWidth="8"
              fill="transparent"
              className="opacity-20"
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke={`var(--color-${risk?.level?.toLowerCase()})`}
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 50}`}
              strokeDashoffset={`${2 * Math.PI * 50 * (1 - score / 100)}`}
              className="transition-all duration-1000 ease-out"
              strokeLinecap="round"
            />
          </svg>
          
          {/* Score Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={`text-3xl font-bold ${risk?.color} font-data`}>
                {score}
              </div>
              <div className="text-xs text-muted-foreground">/ 100</div>
            </div>
          </div>
        </div>
      </div>
      {/* Risk Level Badge */}
      <div className="flex items-center justify-center mb-6">
        <div className={`px-4 py-2 rounded-full border ${risk?.borderColor} ${risk?.bgColor}`}>
          <div className="flex items-center space-x-2">
            <Icon 
              name={score >= 80 ? "AlertTriangle" : score >= 60 ? "AlertCircle" : score >= 40 ? "Info" : "CheckCircle"} 
              size={16} 
              className={risk?.color}
            />
            <span className={`text-sm font-medium ${risk?.color}`}>
              {risk?.level} Risk
            </span>
          </div>
        </div>
      </div>
      {/* Trend Indicator */}
      {trend && (
        <div className="flex items-center justify-center mb-6">
          <div className={`flex items-center space-x-2 ${trend > 0 ? 'text-error' : trend < 0 ? 'text-success' : 'text-muted-foreground'}`}>
            <Icon 
              name={trend > 0 ? "TrendingUp" : trend < 0 ? "TrendingDown" : "Minus"} 
              size={16} 
            />
            <span className="text-sm font-medium">
              {trend > 0 ? '+' : ''}{trend}% from last hour
            </span>
          </div>
        </div>
      )}
      {/* Risk Factors */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">Contributing Factors</h4>
        {factors?.map((factor, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon 
                name={factor?.icon} 
                size={16} 
                className={factor?.impact === 'high' ? 'text-error' : factor?.impact === 'medium' ? 'text-warning' : 'text-muted-foreground'}
              />
              <span className="text-sm text-foreground">{factor?.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-16 h-2 bg-muted/30 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    factor?.impact === 'high' ? 'bg-error' : 
                    factor?.impact === 'medium' ? 'bg-warning' : 'bg-success'
                  }`}
                  style={{ width: `${factor?.weight}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-8 text-right">
                {factor?.weight}%
              </span>
            </div>
          </div>
        ))}
      </div>
      {/* Action Recommendations */}
      <div className="mt-6 pt-4 border-t border-border">
        <h4 className="text-sm font-medium text-foreground mb-2">Recommended Actions</h4>
        <div className="space-y-2">
          {score >= 80 && (
            <div className="flex items-center space-x-2 text-xs text-critical">
              <Icon name="AlertTriangle" size={12} />
              <span>Immediate review required - Suspend high-risk accounts</span>
            </div>
          )}
          {score >= 60 && (
            <div className="flex items-center space-x-2 text-xs text-warning">
              <Icon name="Eye" size={12} />
              <span>Enhanced monitoring - Review transaction patterns</span>
            </div>
          )}
          {score >= 40 && (
            <div className="flex items-center space-x-2 text-xs text-medium">
              <Icon name="Shield" size={12} />
              <span>Standard monitoring - Continue regular checks</span>
            </div>
          )}
          {score < 40 && (
            <div className="flex items-center space-x-2 text-xs text-success">
              <Icon name="CheckCircle" size={12} />
              <span>Low risk - Maintain current protocols</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiskScoreIndicator;