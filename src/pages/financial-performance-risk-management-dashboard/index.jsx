import React, { useState, useEffect, useCallback } from 'react';
import Header from '../../components/ui/Header';
import GlobalFilterBar from '../../components/ui/GlobalFilterBar';
import AlertNotificationCenter from '../../components/ui/AlertNotificationCenter';
import DataExportController from '../../components/ui/DataExportController';
import FinancialKPICard from './components/FinancialKPICard';
import RevenueStreamChart from './components/RevenueStreamChart';
import FraudAlertFeed from './components/FraudAlertFeed';
import FinancialFlowDiagram from './components/FinancialFlowDiagram';
import RiskScoreIndicator from './components/RiskScoreIndicator';
import PaymentMethodAnalysis from './components/PaymentMethodAnalysis';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Icon from '../../components/AppIcon';
import { supabase } from '../../utils/supabaseClient';

const FinancialPerformanceRiskManagementDashboard = () => {
  const [filters, setFilters] = useState({
    timeRange: '24h',
    currency: 'USD',
    operator: 'all',
    region: 'all'
  });

  const [refreshInterval, setRefreshInterval] = useState(60);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke('get-financial-performance', {
            body: { filters },
      });
      if (error) throw error;
      setDashboardData(data);
      setLastUpdated(new Date());
    } catch (err) {
        console.error("Failed to fetch financial data:", err);
        setError("Failed to load dashboard data. Please try again.");
    } finally {
        setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    getData();
  }, [getData]);

  // Auto-refresh functionality
  useEffect(() => {
    let interval;
    if (isAutoRefresh) {
      interval = setInterval(getData, refreshInterval * 1000);
    }
    return () => clearInterval(interval);
  }, [isAutoRefresh, refreshInterval, getData]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleManualRefresh = () => {
    getData();
  };

  const refreshIntervalOptions = [
    { value: 30, label: '30 seconds' },
    { value: 60, label: '1 minute' },
    { value: 300, label: '5 minutes' },
    { value: 600, label: '10 minutes' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="content-offset">
        <GlobalFilterBar onFiltersChange={handleFiltersChange} />
        
        <main className="spacing-dashboard">
          {/* Top Control Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Financial Performance & Risk Management
              </h1>
              <p className="text-muted-foreground">
                Comprehensive revenue tracking and risk monitoring dashboard
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Refresh Controls */}
              <div className="flex items-center space-x-2">
                <Select
                  options={refreshIntervalOptions}
                  value={refreshInterval}
                  onChange={setRefreshInterval}
                  className="w-32"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                  iconName={isAutoRefresh ? "Pause" : "Play"}
                  iconPosition="left"
                >
                  {isAutoRefresh ? 'Pause' : 'Resume'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleManualRefresh}
                  iconName="RefreshCw"
                  iconPosition="left"
                >
                  Refresh
                </Button>
              </div>
              
              {/* Export and Alerts */}
              <div className="flex items-center space-x-2">
                <AlertNotificationCenter />
                <DataExportController />
              </div>
            </div>
          </div>

          {/* Financial KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {dashboardData?.financialKPIs?.map((kpi, index) => (
              <FinancialKPICard
                key={index}
                title={kpi.title}
                value={kpi.value}
                currency={kpi.currency}
                change={kpi.change}
                changeType={kpi.changeType}
                icon={kpi.icon}
                description={kpi.description}
                trend={kpi.trend}
              />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-16 gap-6 mb-8">
            {/* Revenue Stream Chart - 10 columns */}
            <div className="xl:col-span-10">
              <RevenueStreamChart 
                data={dashboardData?.revenueStreamData}
                currency={filters?.currency} 
              />
            </div>
            
            {/* Risk Score Indicator - 6 columns */}
            <div className="xl:col-span-6">
              <RiskScoreIndicator
                score={dashboardData?.riskScore?.score}
                trend={dashboardData?.riskScore?.trend}
                factors={dashboardData?.riskScore?.factors}
                lastUpdated={lastUpdated}
              />
            </div>
          </div>

          {/* Secondary Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-16 gap-6 mb-8">
            {/* Financial Flow Diagram - 10 columns */}
            <div className="xl:col-span-10">
              <FinancialFlowDiagram 
                flowData={dashboardData?.financialFlowData}
                currency={filters?.currency} 
              />
            </div>
            
            {/* Fraud Alert Feed - 6 columns */}
            <div className="xl:col-span-6">
              <FraudAlertFeed alerts={dashboardData?.fraudAlerts} />
            </div>
          </div>

          {/* Payment Method Analysis */}
          <div className="mb-8">
            <PaymentMethodAnalysis 
              data={dashboardData?.paymentMethodData}
              currency={filters?.currency} 
            />
          </div>

          {/* Status Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-border">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span>System Status: Operational</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={14} />
                <span>Last Updated: {lastUpdated?.toLocaleTimeString()}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>Data Latency: &lt; 60s</span>
              <span>•</span>
              <span>Risk Updates: 5min</span>
              <span>•</span>
              <span>© {new Date()?.getFullYear()} Gaming Analytics Hub</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FinancialPerformanceRiskManagementDashboard;