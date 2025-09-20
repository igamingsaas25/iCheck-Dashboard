import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PlayerDistributionHeatmap = ({ filters }) => {
  const [viewMode, setViewMode] = useState('geographic'); // 'geographic' or 'timezone'

  const geographicData = [
    { region: 'North America', players: 12847, percentage: 35.2, growth: '+8.3%', color: '#3B82F6' },
    { region: 'Europe', players: 9632, percentage: 26.4, growth: '+12.1%', color: '#8B5CF6' },
    { region: 'Asia Pacific', players: 8945, percentage: 24.5, growth: '+15.7%', color: '#10B981' },
    { region: 'Latin America', players: 3421, percentage: 9.4, growth: '+6.2%', color: '#F59E0B' },
    { region: 'Middle East', players: 1689, percentage: 4.6, growth: '+18.9%', color: '#EF4444' }
  ];

  const timezoneData = [
    { timezone: 'UTC-8 (PST)', players: 8945, peak: '8:00 PM', activity: 92 },
    { timezone: 'UTC-5 (EST)', players: 7632, peak: '9:00 PM', activity: 88 },
    { timezone: 'UTC+0 (GMT)', players: 6421, peak: '10:00 PM', activity: 85 },
    { timezone: 'UTC+1 (CET)', players: 5234, peak: '9:30 PM', activity: 82 },
    { timezone: 'UTC+8 (CST)', players: 4987, peak: '8:30 PM', activity: 79 },
    { timezone: 'UTC+9 (JST)', players: 3456, peak: '9:00 PM', activity: 76 }
  ];

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
                  {geographicData?.reduce((sum, region) => sum + region?.players, 0)?.toLocaleString()}
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