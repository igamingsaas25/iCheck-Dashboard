import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PlayerDistributionHeatmap = ({ data }) => {
  const [viewMode, setViewMode] = useState('geographic'); // 'geographic' or 'timezone'

  const geographicData = data?.geographic || [];
  const timezoneData = data?.timezone || [];

  const getActivityLevel = (activity) => {
    if (activity >= 90) return { level: 'Very High', color: 'bg-success', textColor: 'text-success' };
    if (activity >= 80) return { level: 'High', color: 'bg-primary', textColor: 'text-primary' };
    if (activity >= 70) return { level: 'Medium', color: 'bg-warning', textColor: 'text-warning' };
    return { level: 'Low', color: 'bg-error', textColor: 'text-error' };
  };

  return (
    <div className="data-card p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Player Distribution</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {viewMode === 'geographic' ?'Geographic distribution and growth trends' :'Timezone activity patterns and peak hours'
            }
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'geographic' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('geographic')}
            iconName="Globe"
            iconPosition="left"
          >
            Geographic
          </Button>
          <Button
            variant={viewMode === 'timezone' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('timezone')}
            iconName="Clock"
            iconPosition="left"
          >
            Timezone
          </Button>
        </div>
      </div>
      {viewMode === 'geographic' ? (
        <div className="space-y-4">
          {/* Geographic Distribution */}
          {geographicData?.map((region, index) => (
            <div key={region?.region} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: region?.color }}
                  ></div>
                  <span className="text-sm font-medium text-foreground">
                    {region?.region}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-muted-foreground">
                    {region?.players?.toLocaleString()} players
                  </span>
                  <span className="text-sm font-medium text-success">
                    {region?.growth}
                  </span>
                </div>
              </div>
              <div className="relative">
                <div className="w-full bg-muted/30 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${region?.percentage}%`,
                      backgroundColor: region?.color
                    }}
                  ></div>
                </div>
                <span className="absolute right-0 -top-5 text-xs text-muted-foreground">
                  {region?.percentage}%
                </span>
              </div>
            </div>
          ))}

          {/* Geographic Summary */}
          <div className="mt-6 pt-4 border-t border-border">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-foreground">
                  {geographicData.reduce((sum, region) => sum + region.players, 0)?.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Total Players</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-success">+11.2%</p>
                <p className="text-xs text-muted-foreground">Overall Growth</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Timezone Activity */}
          {timezoneData?.map((tz, index) => {
            const activityInfo = getActivityLevel(tz?.activity);
            return (
              <div key={tz?.timezone} className="bg-muted/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">{tz?.timezone}</h4>
                    <p className="text-xs text-muted-foreground">
                      {tz?.players?.toLocaleString()} active players
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${activityInfo?.color}/20 ${activityInfo?.textColor}`}>
                    {activityInfo?.level}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon name="Clock" size={14} className="text-muted-foreground" />
                    <span className="text-sm text-foreground">Peak: {tz?.peak}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">Activity:</span>
                    <div className="w-16 bg-muted/30 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${activityInfo?.color}`}
                        style={{ width: `${tz?.activity}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-foreground">{tz?.activity}%</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Timezone Insights */}
          <div className="mt-6 pt-4 border-t border-border">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon name="TrendingUp" size={16} className="text-primary" />
                  <span className="text-sm font-medium text-foreground">Peak Activity Window</span>
                </div>
                <span className="text-sm text-primary font-medium">8:00 PM - 10:00 PM</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon name="Globe" size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Coverage</span>
                </div>
                <span className="text-sm text-foreground font-medium">24/7 Global Activity</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerDistributionHeatmap;