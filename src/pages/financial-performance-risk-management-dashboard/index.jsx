import React, { useState, useEffect } from 'react';
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

const FinancialPerformanceRiskManagementDashboard = () => {
  const [filters, setFilters] = useState({
    timeRange: '24h',
    currency: 'USD',
    operator: 'all',
    region: 'all'
  });

  const [refreshInterval, setRefreshInterval] = useState(60);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  // Mock financial KPI data
  const financialKPIs = [
    {
      title: "Gross Gaming Revenue",
      value: 2847500,
      currency: filters?.currency,
      change: 12.5,
      changeType: "positive",
      icon: "TrendingUp",
      description: "Total revenue from gaming activities",
      trend: 78
    },
    {
      title: "Net Profit Margin",
      value: "23.4%",
      change: -2.1,
      changeType: "negative",
      icon: "Percent",
      description: "Profit after operational costs",
      trend: 65
    },
    {
      title: "Transaction Volume",
      value: 156789,
      change: 8.7,
      changeType: "positive",
      icon: "ArrowUpDown",
      description: "Total financial transactions",
      trend: 82
    },
    {
      title: "Risk Score",
      value: "42/100",
      change: -5.3,
      changeType: "positive",
      icon: "Shield",
      description: "Composite risk assessment",
      trend: 58
    }
  ];

  // Mock revenue stream data
  const revenueStreamData = [
    {
      period: "00:00",
      slots: 450000,
      tableGames: 280000,
      liveCasino: 320000,
      riskScore: 35
    },
    {
      period: "04:00",
      slots: 380000,
      tableGames: 240000,
      liveCasino: 290000,
      riskScore: 28
    },
    {
      period: "08:00",
      slots: 520000,
      tableGames: 310000,
      liveCasino: 380000,
      riskScore: 42
    },
    {
      period: "12:00",
      slots: 680000,
      tableGames: 420000,
      liveCasino: 450000,
      riskScore: 38
    },
    {
      period: "16:00",
      slots: 750000,
      tableGames: 480000,
      liveCasino: 520000,
      riskScore: 45
    },
    {
      period: "20:00",
      slots: 820000,
      tableGames: 540000,
      liveCasino: 580000,
      riskScore: 52
    }
  ];

  // Mock fraud alerts data
  const fraudAlerts = [
    {
      id: 1,
      severity: 'critical',
      title: 'Suspicious Betting Pattern',
      description: 'Account #78432 showing unusual high-value betting patterns with rapid win/loss cycles',
      accountId: '#78432',
      timestamp: new Date(Date.now() - 5 * 60 * 1000)
    },
    {
      id: 2,
      severity: 'high',
      title: 'Multiple Account Detection',
      description: 'Same device fingerprint detected across 5 different accounts with similar betting behavior',
      accountId: '#91256',
      timestamp: new Date(Date.now() - 12 * 60 * 1000)
    },
    {
      id: 3,
      severity: 'high',
      title: 'Rapid Deposit/Withdrawal',
      description: 'Account showing rapid deposit and withdrawal cycles within 30-minute windows',
      accountId: '#45789',
      timestamp: new Date(Date.now() - 18 * 60 * 1000)
    },
    {
      id: 4,
      severity: 'medium',
      title: 'Geolocation Anomaly',
      description: 'Account accessed from 3 different countries within 2 hours',
      accountId: '#23456',
      timestamp: new Date(Date.now() - 25 * 60 * 1000)
    },
    {
      id: 5,
      severity: 'medium',
      title: 'Bonus Abuse Pattern',
      description: 'Systematic bonus claiming pattern detected across multiple promotional offers',
      accountId: '#67890',
      timestamp: new Date(Date.now() - 35 * 60 * 1000)
    },
    {
      id: 6,
      severity: 'low',
      title: 'Payment Method Switch',
      description: 'Account switched payment methods 4 times in the last 24 hours',
      accountId: '#34567',
      timestamp: new Date(Date.now() - 45 * 60 * 1000)
    }
  ];

  // Mock financial flow data
  const financialFlowData = [
    {
      id: 1,
      type: 'deposit',
      method: 'Credit Card',
      volume: 1250000,
      count: 3456,
      avgAmount: 361,
      successRate: 97.8,
      avgProcessingTime: '2.3s',
      hasAnomaly: false,
      anomalyDescription: null
    },
    {
      id: 2,
      type: 'withdrawal',
      method: 'Bank Transfer',
      volume: 890000,
      count: 1234,
      avgAmount: 721,
      successRate: 94.2,
      avgProcessingTime: '4.7m',
      hasAnomaly: true,
      anomalyDescription: 'Processing time 40% higher than normal'
    },
    {
      id: 3,
      type: 'deposit',
      method: 'E-Wallet',
      volume: 680000,
      count: 2345,
      avgAmount: 290,
      successRate: 99.1,
      avgProcessingTime: '1.8s',
      hasAnomaly: false,
      anomalyDescription: null
    },
    {
      id: 4,
      type: 'withdrawal',
      method: 'Cryptocurrency',
      volume: 420000,
      count: 567,
      avgAmount: 741,
      successRate: 96.5,
      avgProcessingTime: '12.4m',
      hasAnomaly: true,
      anomalyDescription: 'Unusual concentration of large withdrawals'
    },
    {
      id: 5,
      type: 'bonus',
      method: 'Promotional Credit',
      volume: 180000,
      count: 890,
      avgAmount: 202,
      successRate: 100,
      avgProcessingTime: 'Instant',
      hasAnomaly: false,
      anomalyDescription: null
    }
  ];

  // Mock risk factors
  const riskFactors = [
    {
      name: 'Transaction Velocity',
      weight: 25,
      impact: 'high',
      icon: 'Zap'
    },
    {
      name: 'Account Age',
      weight: 15,
      impact: 'medium',
      icon: 'Calendar'
    },
    {
      name: 'Geographic Risk',
      weight: 20,
      impact: 'high',
      icon: 'MapPin'
    },
    {
      name: 'Payment Method Risk',
      weight: 18,
      impact: 'medium',
      icon: 'CreditCard'
    },
    {
      name: 'Behavioral Patterns',
      weight: 22,
      impact: 'high',
      icon: 'Activity'
    }
  ];

  // Mock payment method data
  const paymentMethodData = [
    {
      method: 'Credit Card',
      volume: 1250000,
      count: 3456,
      percentage: 42.5,
      successRate: 97.8,
      avgAmount: 361,
      riskLevel: 'low',
      avgProcessingTime: '2.3s'
    },
    {
      method: 'Bank Transfer',
      volume: 890000,
      count: 1234,
      percentage: 30.2,
      successRate: 94.2,
      avgAmount: 721,
      riskLevel: 'medium',
      avgProcessingTime: '4.7m'
    },
    {
      method: 'E-Wallet',
      volume: 680000,
      count: 2345,
      percentage: 23.1,
      successRate: 99.1,
      avgAmount: 290,
      riskLevel: 'low',
      avgProcessingTime: '1.8s'
    },
    {
      method: 'Cryptocurrency',
      volume: 420000,
      count: 567,
      percentage: 14.3,
      successRate: 96.5,
      avgAmount: 741,
      riskLevel: 'high',
      avgProcessingTime: '12.4m'
    },
    {
      method: 'Mobile Payment',
      volume: 180000,
      count: 890,
      percentage: 6.1,
      successRate: 98.7,
      avgAmount: 202,
      riskLevel: 'low',
      avgProcessingTime: '1.2s'
    }
  ];

  // Auto-refresh functionality
  useEffect(() => {
    let interval;
    if (isAutoRefresh) {
      interval = setInterval(() => {
        setLastUpdated(new Date());
      }, refreshInterval * 1000);
    }
    return () => clearInterval(interval);
  }, [isAutoRefresh, refreshInterval]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleManualRefresh = () => {
    setLastUpdated(new Date());
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
            {financialKPIs?.map((kpi, index) => (
              <FinancialKPICard
                key={index}
                title={kpi?.title}
                value={kpi?.value}
                currency={kpi?.currency}
                change={kpi?.change}
                changeType={kpi?.changeType}
                icon={kpi?.icon}
                description={kpi?.description}
                trend={kpi?.trend}
              />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-16 gap-6 mb-8">
            {/* Revenue Stream Chart - 10 columns */}
            <div className="xl:col-span-10">
              <RevenueStreamChart 
                data={revenueStreamData} 
                currency={filters?.currency} 
              />
            </div>
            
            {/* Risk Score Indicator - 6 columns */}
            <div className="xl:col-span-6">
              <RiskScoreIndicator
                score={42}
                trend={-5.3}
                factors={riskFactors}
                lastUpdated={lastUpdated}
              />
            </div>
          </div>

          {/* Secondary Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-16 gap-6 mb-8">
            {/* Financial Flow Diagram - 10 columns */}
            <div className="xl:col-span-10">
              <FinancialFlowDiagram 
                flowData={financialFlowData} 
                currency={filters?.currency} 
              />
            </div>
            
            {/* Fraud Alert Feed - 6 columns */}
            <div className="xl:col-span-6">
              <FraudAlertFeed alerts={fraudAlerts} />
            </div>
          </div>

          {/* Payment Method Analysis */}
          <div className="mb-8">
            <PaymentMethodAnalysis 
              data={paymentMethodData} 
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