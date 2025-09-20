import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import GlobalFilterBar from '../../components/ui/GlobalFilterBar';
import AlertNotificationCenter from '../../components/ui/AlertNotificationCenter';
import DataExportController from '../../components/ui/DataExportController';
import PlayerMetricsStrip from './components/PlayerMetricsStrip';
import PlayerJourneyFunnel from './components/PlayerJourneyFunnel';
import PlayerDistributionHeatmap from './components/PlayerDistributionHeatmap';
import EngagementMatrix from './components/EngagementMatrix';
import AdvancedFilterPanel from './components/AdvancedFilterPanel';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const PlayerAnalyticsBehaviorDashboard = () => {
  const [globalFilters, setGlobalFilters] = useState({});
  const [advancedFilters, setAdvancedFilters] = useState({});
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  // Auto-refresh data every 30 minutes
  useEffect(() => {
    if (isAutoRefresh) {
      const interval = setInterval(() => {
        setLastUpdated(new Date());
      }, 30 * 60 * 1000); // 30 minutes

      return () => clearInterval(interval);
    }
  }, [isAutoRefresh]);

  const handleGlobalFiltersChange = (filters) => {
    setGlobalFilters(filters);
  };

  const handleAdvancedFiltersChange = (filters) => {
    setAdvancedFilters(filters);
  };

  const refreshData = () => {
    setLastUpdated(new Date());
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />
      {/* Global Filter Bar */}
      <GlobalFilterBar 
        onFiltersChange={handleGlobalFiltersChange}
        className="content-offset"
      />
      {/* Advanced Filter Panel */}
      <AdvancedFilterPanel 
        onFiltersChange={handleAdvancedFiltersChange}
      />
      {/* Main Content */}
      <main className="spacing-dashboard">
        {/* Dashboard Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Player Analytics & Behavior Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive player behavior analysis and engagement insights
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Auto Refresh Toggle */}
            <div className="flex items-center space-x-2">
              <Button
                variant={isAutoRefresh ? "default" : "outline"}
                size="sm"
                onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                iconName={isAutoRefresh ? "Pause" : "Play"}
                iconPosition="left"
              >
                Auto Refresh
              </Button>
            </div>

            {/* Manual Refresh */}
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              iconName="RefreshCw"
              iconPosition="left"
            >
              Refresh
            </Button>

            {/* Notifications */}
            <AlertNotificationCenter />

            {/* Export */}
            <DataExportController />
          </div>
        </div>

        {/* Last Updated Info */}
        <div className="flex items-center justify-between mb-6 p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Clock" size={14} />
            <span>Last updated: {lastUpdated?.toLocaleTimeString()}</span>
            {isAutoRefresh && (
              <>
                <span>•</span>
                <span>Auto-refresh: Every 30 minutes</span>
              </>
            )}
          </div>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span>Live Data</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Database" size={14} />
              <span>36.5M records processed</span>
            </div>
          </div>
        </div>

        {/* Primary Metrics Strip */}
        <PlayerMetricsStrip filters={{ ...globalFilters, ...advancedFilters }} />

        {/* Main Analytics Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6">
          {/* Player Journey Funnel - Main Content (8 cols) */}
          <div className="xl:col-span-8">
            <PlayerJourneyFunnel filters={{ ...globalFilters, ...advancedFilters }} />
          </div>

          {/* Player Distribution Heatmap - Right Panel (4 cols) */}
          <div className="xl:col-span-4">
            <PlayerDistributionHeatmap filters={{ ...globalFilters, ...advancedFilters }} />
          </div>
        </div>

        {/* Full-Width Engagement Matrix */}
        <div className="mb-6">
          <EngagementMatrix filters={{ ...globalFilters, ...advancedFilters }} />
        </div>

        {/* Additional Insights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Player Lifecycle Insights */}
          <div className="data-card p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="Users" size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Player Lifecycle</h3>
                <p className="text-sm text-muted-foreground">Journey stage analysis</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">New Players</p>
                  <p className="text-xs text-muted-foreground">0-7 days</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-foreground">2,847</p>
                  <p className="text-xs text-success">+12.3%</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">Active Players</p>
                  <p className="text-xs text-muted-foreground">7-30 days</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-foreground">8,945</p>
                  <p className="text-xs text-success">+5.7%</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">Loyal Players</p>
                  <p className="text-xs text-muted-foreground">30+ days</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-foreground">15,632</p>
                  <p className="text-xs text-success">+8.1%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Behavioral Patterns */}
          <div className="data-card p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Icon name="Activity" size={20} className="text-secondary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Behavioral Patterns</h3>
                <p className="text-sm text-muted-foreground">Activity insights</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-foreground">Peak Activity</span>
                  <span className="text-sm font-medium text-foreground">8:00 PM - 11:00 PM</span>
                </div>
                <div className="w-full bg-muted/30 rounded-full h-2">
                  <div className="bg-secondary h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-foreground">Weekend Activity</span>
                  <span className="text-sm font-medium text-foreground">+23% vs Weekdays</span>
                </div>
                <div className="w-full bg-muted/30 rounded-full h-2">
                  <div className="bg-accent h-2 rounded-full" style={{ width: '68%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-foreground">Mobile Usage</span>
                  <span className="text-sm font-medium text-foreground">72% of Sessions</span>
                </div>
                <div className="w-full bg-muted/30 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '72%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Risk & Compliance */}
          <div className="data-card p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                <Icon name="Shield" size={20} className="text-warning" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Risk & Compliance</h3>
                <p className="text-sm text-muted-foreground">Player safety metrics</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon name="CheckCircle" size={16} className="text-success" />
                  <span className="text-sm font-medium text-foreground">Responsible Gaming</span>
                </div>
                <span className="text-sm font-semibold text-success">98.7%</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon name="AlertTriangle" size={16} className="text-warning" />
                  <span className="text-sm font-medium text-foreground">At-Risk Players</span>
                </div>
                <span className="text-sm font-semibold text-warning">47</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-error/10 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon name="XCircle" size={16} className="text-error" />
                  <span className="text-sm font-medium text-foreground">Flagged Accounts</span>
                </div>
                <span className="text-sm font-semibold text-error">12</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
            <div className="text-sm text-muted-foreground">
              <p>Player Analytics Dashboard • Gaming Analytics Hub</p>
              <p>Data refreshed every 30 minutes • Historical trends available for 2+ years</p>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Icon name="Users" size={14} />
                <span>27,424 Active Players</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="TrendingUp" size={14} />
                <span>+8.3% Growth</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={14} />
                <span>24.6m Avg Session</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlayerAnalyticsBehaviorDashboard;