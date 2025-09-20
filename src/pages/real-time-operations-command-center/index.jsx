import React, { useState, useEffect } from 'react';
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

const RealTimeOperationsCommandCenter = () => {
  const [filters, setFilters] = useState({});
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Mock KPI data with real-time updates
  const [kpiData, setKpiData] = useState({
    activePlayers: {
      value: '12,847',
      change: '+8.2%',
      changeType: 'positive',
      sparklineData: [12200, 12350, 12500, 12680, 12847],
      threshold: 'good'
    },
    transactionsPerMinute: {
      value: '1,234',
      unit: '/min',
      change: '+12.5%',
      changeType: 'positive',
      sparklineData: [1100, 1150, 1200, 1220, 1234],
      threshold: 'good'
    },
    revenueRate: {
      value: '$45.2K',
      unit: '/hr',
      change: '+5.7%',
      changeType: 'positive',
      sparklineData: [42000, 43000, 44000, 44500, 45200],
      threshold: 'good'
    },
    systemUptime: {
      value: '99.97%',
      change: '+0.02%',
      changeType: 'positive',
      sparklineData: [99.95, 99.96, 99.97, 99.97, 99.97],
      threshold: 'good'
    },
    alertCount: {
      value: '7',
      change: '+2',
      changeType: 'negative',
      sparklineData: [5, 6, 7, 8, 7],
      threshold: 'warning'
    },
    conversionRate: {
      value: '3.42%',
      change: '-0.15%',
      changeType: 'negative',
      sparklineData: [3.60, 3.55, 3.50, 3.45, 3.42],
      threshold: 'warning'
    }
  });

  const refreshIntervalOptions = [
    { value: 5, label: '5 seconds' },
    { value: 10, label: '10 seconds' },
    { value: 30, label: '30 seconds' },
    { value: 60, label: '1 minute' }
  ];

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // Simulate real-time KPI updates
      setKpiData(prev => ({
        activePlayers: {
          ...prev?.activePlayers,
          value: (12847 + Math.floor(Math.random() * 200 - 100))?.toLocaleString(),
          sparklineData: [...prev?.activePlayers?.sparklineData?.slice(1), 12847 + Math.floor(Math.random() * 200 - 100)]
        },
        transactionsPerMinute: {
          ...prev?.transactionsPerMinute,
          value: (1234 + Math.floor(Math.random() * 100 - 50))?.toLocaleString(),
          sparklineData: [...prev?.transactionsPerMinute?.sparklineData?.slice(1), 1234 + Math.floor(Math.random() * 100 - 50)]
        },
        revenueRate: {
          ...prev?.revenueRate,
          value: `$${(45.2 + Math.random() * 2 - 1)?.toFixed(1)}K`,
          sparklineData: [...prev?.revenueRate?.sparklineData?.slice(1), 45200 + Math.floor(Math.random() * 2000 - 1000)]
        },
        systemUptime: {
          ...prev?.systemUptime,
          value: `${(99.97 + Math.random() * 0.02 - 0.01)?.toFixed(2)}%`,
          sparklineData: [...prev?.systemUptime?.sparklineData?.slice(1), 99.97 + Math.random() * 0.02 - 0.01]
        },
        alertCount: {
          ...prev?.alertCount,
          value: Math.max(0, 7 + Math.floor(Math.random() * 3 - 1))?.toString(),
          sparklineData: [...prev?.alertCount?.sparklineData?.slice(1), Math.max(0, 7 + Math.floor(Math.random() * 3 - 1))]
        },
        conversionRate: {
          ...prev?.conversionRate,
          value: `${(3.42 + Math.random() * 0.2 - 0.1)?.toFixed(2)}%`,
          sparklineData: [...prev?.conversionRate?.sparklineData?.slice(1), 3.42 + Math.random() * 0.2 - 0.1]
        }
      }));
      
      setLastUpdated(new Date());
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleManualRefresh = () => {
    setLastUpdated(new Date());
    // Trigger manual data refresh
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
            <KPICard
              title="Active Players"
              value={kpiData?.activePlayers?.value}
              change={kpiData?.activePlayers?.change}
              changeType={kpiData?.activePlayers?.changeType}
              icon="Users"
              sparklineData={kpiData?.activePlayers?.sparklineData}
              threshold={kpiData?.activePlayers?.threshold}
              unit=""
            />
            <KPICard
              title="Transactions/Min"
              value={kpiData?.transactionsPerMinute?.value}
              unit={kpiData?.transactionsPerMinute?.unit}
              change={kpiData?.transactionsPerMinute?.change}
              changeType={kpiData?.transactionsPerMinute?.changeType}
              icon="Activity"
              sparklineData={kpiData?.transactionsPerMinute?.sparklineData}
              threshold={kpiData?.transactionsPerMinute?.threshold}
            />
            <KPICard
              title="Revenue Rate"
              value={kpiData?.revenueRate?.value}
              unit={kpiData?.revenueRate?.unit}
              change={kpiData?.revenueRate?.change}
              changeType={kpiData?.revenueRate?.changeType}
              icon="DollarSign"
              sparklineData={kpiData?.revenueRate?.sparklineData}
              threshold={kpiData?.revenueRate?.threshold}
            />
            <KPICard
              title="System Uptime"
              value={kpiData?.systemUptime?.value}
              change={kpiData?.systemUptime?.change}
              changeType={kpiData?.systemUptime?.changeType}
              icon="Server"
              sparklineData={kpiData?.systemUptime?.sparklineData}
              threshold={kpiData?.systemUptime?.threshold}
              unit=""
            />
            <KPICard
              title="Active Alerts"
              value={kpiData?.alertCount?.value}
              change={kpiData?.alertCount?.change}
              changeType={kpiData?.alertCount?.changeType}
              icon="AlertTriangle"
              sparklineData={kpiData?.alertCount?.sparklineData}
              threshold={kpiData?.alertCount?.threshold}
              unit=""
            />
            <KPICard
              title="Conversion Rate"
              value={kpiData?.conversionRate?.value}
              change={kpiData?.conversionRate?.change}
              changeType={kpiData?.conversionRate?.changeType}
              icon="Target"
              sparklineData={kpiData?.conversionRate?.sparklineData}
              threshold={kpiData?.conversionRate?.threshold}
              unit=""
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-6">
            {/* Transaction Flow Chart - Takes 3 columns on desktop */}
            <div className="xl:col-span-3">
              <TransactionFlowChart />
            </div>
            
            {/* Alert Feed - Takes 1 column on desktop */}
            <div className="xl:col-span-1">
              <AlertFeed />
            </div>
          </div>

          {/* Top Games Grid */}
          <TopGamesGrid />
        </div>
      </main>
      {/* System Status Indicator */}
      <SystemStatusIndicator />
    </div>
  );
};

export default RealTimeOperationsCommandCenter;