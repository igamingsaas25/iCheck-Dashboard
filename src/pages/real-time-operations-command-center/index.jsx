import React, { useState, useEffect, useCallback } from 'react';
import Header from '../../components/ui/Header';
import GlobalFilterBar from '../../components/ui/GlobalFilterBar';
import AlertNotificationCenter from '../../components/ui/AlertNotificationCenter';
import DataExportController from '../../components/ui/DataExportController';
import KPICard from './components/KPICard';
import TransactionFlowChart from './components/TransactionFlowChart';
import AlertFeed from './components/AlertFeed';
import TopGamesGrid from './components/TopGamesGrid';
import SystemStatusIndicator from './components/SystemStatusIndicator';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Icon from '../../components/AppIcon';
import { supabase } from '../../utils/supabaseClient'; // Import the Supabase client

const RealTimeOperationsCommandCenter = () => {
  const [filters, setFilters] = useState({});
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshIntervalOptions = [
    { value: 5, label: '5 seconds' },
    { value: 10, label: '10 seconds' },
    { value: 30, label: '30 seconds' },
    { value: 60, label: '1 minute' }
  ];

  const getData = useCallback(async () => {
    setError(null);
    try {
      // Invoke the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('get-real-time-data', {
        body: { filters },
      });

      if (error) throw error;
      
      setDashboardData(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching from Supabase function:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    getData(); // Initial fetch
    if (!autoRefresh) return;
    const interval = setInterval(getData, refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, getData]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleManualRefresh = () => {
    getData();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <GlobalFilterBar onFiltersChange={handleFiltersChange} />
      <main className="content-offset">
        {/* Control Bar */}
        <div className="px-6 py-4 border-b border-border bg-card/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-foreground">Real-Time Operations Command Center</h1>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Clock" size={14} />
                <span>Last updated: {lastUpdated?.toLocaleTimeString()}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e?.target?.checked)}
                    className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-primary focus:ring-2"
                  />
                  <span className="text-sm text-foreground">Auto-refresh</span>
                </label>
                
                <Select
                  options={refreshIntervalOptions}
                  value={refreshInterval}
                  onChange={setRefreshInterval}
                  disabled={!autoRefresh}
                  className="w-32"
                />
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleManualRefresh}
                iconName="RefreshCw"
                iconPosition="left"
              >
                Refresh
              </Button>
              
              <AlertNotificationCenter />
              <DataExportController />
            </div>
          </div>
        </div>

        <div className="spacing-dashboard">
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            {Object.entries(dashboardData?.kpiData || {})?.map(([key, data]) => (
              <KPICard
                key={key}
                title={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                value={typeof data.value === 'number' ? data.value.toLocaleString() : data.value}
                unit={data.unit}
                change={data.change}
                changeType={data.changeType}
                icon={
                  key === 'activePlayers' ? 'Users' :
                  key === 'transactionsPerMinute' ? 'Activity' :
                  key === 'revenueRate' ? 'DollarSign' :
                  key === 'systemUptime' ? 'Server' :
                  key === 'alertCount' ? 'AlertTriangle' : 'Target'
                }
                sparklineData={data.sparklineData}
                threshold={data.threshold}
              />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-6">
            {/* Transaction Flow Chart - Takes 3 columns on desktop */}
            <div className="xl:col-span-3">
              <TransactionFlowChart initialData={dashboardData?.transactionFlowData} />
            </div>
            
            {/* Alert Feed - Takes 1 column on desktop */}
            <div className="xl:col-span-1">
              <AlertFeed initialAlerts={dashboardData?.alerts} />
            </div>
          </div>

          {/* Top Games Grid */}
          <TopGamesGrid initialGames={dashboardData?.topGames} />
        </div>
      </main>
      {/* System Status Indicator */}
      <SystemStatusIndicator
        systemStatus={dashboardData?.systemStatus}
        connectionStatus={dashboardData?.connectionStatus}
      />
    </div>
  );
};

export default RealTimeOperationsCommandCenter;