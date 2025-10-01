import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, FunnelChart, Funnel, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PlayerJourneyFunnel = ({ data }) => {
  const [viewMode, setViewMode] = useState('funnel'); // 'funnel' or 'cohort'

  const funnelData = data?.funnel || [];
  const cohortData = data?.cohort || [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-modal">
          <p className="font-medium text-popover-foreground">{data?.name}</p>
          <p className="text-sm text-muted-foreground">{data?.description}</p>
          <div className="mt-2 space-y-1">
            <p className="text-sm">
              <span className="text-muted-foreground">Players: </span>
              <span className="font-medium text-popover-foreground">
                {data?.value?.toLocaleString()}
              </span>
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Conversion: </span>
              <span className="font-medium text-popover-foreground">
                {data?.percentage}%
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const CohortTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-modal">
          <p className="font-medium text-popover-foreground">{label}</p>
          <div className="mt-2 space-y-1">
            <p className="text-sm">
              <span className="text-muted-foreground">Retention: </span>
              <span className="font-medium text-popover-foreground">
                {data?.retention}%
              </span>
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Active Players: </span>
              <span className="font-medium text-popover-foreground">
                {data?.players?.toLocaleString()}
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="data-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Player Journey Analysis</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {viewMode === 'funnel' ?'Conversion funnel from registration to high-value players' :'Player retention cohort analysis over time'
            }
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'funnel' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('funnel')}
            iconName="Filter"
            iconPosition="left"
          >
            Funnel
          </Button>
          <Button
            variant={viewMode === 'cohort' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('cohort')}
            iconName="BarChart3"
            iconPosition="left"
          >
            Cohort
          </Button>
        </div>
      </div>
      {viewMode === 'funnel' ? (
        <div className="space-y-6">
          {/* Funnel Visualization */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Tooltip content={<CustomTooltip />} />
                <Funnel
                  dataKey="value"
                  data={funnelData}
                  isAnimationActive={true}
                >
                  {funnelData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.fill} />
                  ))}
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>

          {/* Funnel Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {funnelData?.map((stage, index) => (
              <div key={stage?.name} className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ backgroundColor: stage?.fill }}></div>
                <h4 className="text-sm font-medium text-foreground">{stage?.name}</h4>
                <p className="text-lg font-semibold text-foreground mt-1">
                  {stage?.value?.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">{stage?.percentage}%</p>
                {index > 0 && funnelData[index - 1] && (
                  <div className="mt-2 flex items-center justify-center space-x-1">
                    <Icon name="ArrowDown" size={12} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {((stage.value / funnelData[index - 1].value) * 100).toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Cohort Chart */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cohortData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="week" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip content={<CohortTooltip />} />
                <Bar 
                  dataKey="retention" 
                  fill="var(--color-primary)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Cohort Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="TrendingDown" size={16} className="text-warning" />
                <h4 className="text-sm font-medium text-foreground">Retention Drop</h4>
              </div>
              <p className="text-lg font-semibold text-foreground">28% at Week 2</p>
              <p className="text-xs text-muted-foreground">Largest drop-off point</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Target" size={16} className="text-success" />
                <h4 className="text-sm font-medium text-foreground">Stable Retention</h4>
              </div>
              <p className="text-lg font-semibold text-foreground">28% at Week 12</p>
              <p className="text-xs text-muted-foreground">Long-term players</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Users" size={16} className="text-primary" />
                <h4 className="text-sm font-medium text-foreground">Active Cohort</h4>
              </div>
              <p className="text-lg font-semibold text-foreground">280 players</p>
              <p className="text-xs text-muted-foreground">Still active after 12 weeks</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerJourneyFunnel;