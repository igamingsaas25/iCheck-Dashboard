import React, { useState, useEffect, useCallback } from 'react';
import Header from '../../components/ui/Header';
import GlobalFilterBar from '../../components/ui/GlobalFilterBar';
import AlertNotificationCenter from '../../components/ui/AlertNotificationCenter';
import DataExportController from '../../components/ui/DataExportController';
import BusinessHealthIndicators from './components/BusinessHealthIndicators';
import StrategicPerformanceChart from './components/StrategicPerformanceChart';
import MarketPositioningMetrics from './components/MarketPositioningMetrics';
import BusinessScorecard from './components/BusinessScorecard';
import PredictiveAnalyticsOverlay from './components/PredictiveAnalyticsOverlay';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

// This function simulates a real API call to fetch all data for this dashboard
const fetchExecutiveData = async (filters) => {
    // In a real application, this would be an actual fetch call:
    // const response = await fetch(`/api/executive-summary?filters=${JSON.stringify(filters)}`);
    // const data = await response.json();
    // return data;

    // For demonstration, we simulate the API response with mock data.
    return {
        businessHealth: {
            totalRevenue: { value: 47200000, change: 12.3 },
            playerGrowthRate: { value: 0.187, change: 3.2 },
            marketShare: { value: 0.234, change: 1.8 },
            operationalEfficiency: { value: 0.942, change: -0.5 }
        },
        strategicPerformance: {
            quarterly: [
                { period: 'Q1 2024', revenue: 42.5, playerAcquisitionCost: 28.3, profitMargin: 24.2, marketShare: 21.8 },
                { period: 'Q2 2024', revenue: 45.8, playerAcquisitionCost: 26.7, profitMargin: 26.1, marketShare: 22.4 },
                { period: 'Q3 2024', revenue: 47.2, playerAcquisitionCost: 25.1, profitMargin: 28.3, marketShare: 23.4 },
                { period: 'Q4 2024', revenue: 49.8, playerAcquisitionCost: 24.2, profitMargin: 29.7, marketShare: 24.1 }
            ],
            annual: [
                { period: '2021', revenue: 156.2, playerAcquisitionCost: 32.1, profitMargin: 18.5, marketShare: 18.2 },
                { period: '2022', revenue: 168.7, playerAcquisitionCost: 30.8, profitMargin: 21.3, marketShare: 19.8 },
                { period: '2023', revenue: 181.3, playerAcquisitionCost: 28.9, profitMargin: 23.7, marketShare: 21.5 },
                { period: '2024', revenue: 190.1, playerAcquisitionCost: 26.1, profitMargin: 27.1, marketShare: 22.9 }
            ]
        },
        businessScorecard: [
            { id: 'operations', name: 'Operations', icon: 'Settings', kpis: [{ name: 'System Uptime', value: '99.7%', target: '99.5%', status: 'green', trend: 'stable' }, { name: 'Response Time', value: '1.2s', target: '<2s', status: 'green', trend: 'improving' }] },
            { id: 'finance', name: 'Finance', icon: 'DollarSign', kpis: [{ name: 'Revenue Growth', value: '12.3%', target: '10%', status: 'green', trend: 'improving' }, { name: 'Profit Margin', value: '28.3%', target: '25%', status: 'green', trend: 'improving' }] }
        ],
        predictiveAnalytics: {
            historical: [
                { period: 'Jan 2024', revenue: 42.5, players: 1.8, marketShare: 21.2 },
                { period: 'Mar 2024', revenue: 45.2, players: 2.0, marketShare: 22.1 },
                { period: 'Jun 2024', revenue: 47.8, players: 2.1, marketShare: 23.4 }
            ],
            forecast: [
                { period: 'Sep 2024', revenue: 50.1, players: 2.3, marketShare: 24.5, forecast: true },
                { period: 'Dec 2024', revenue: 52.5, players: 2.5, marketShare: 25.6, forecast: true }
            ]
        }
    };
};

const ExecutiveSummaryStrategicInsightsDashboard = () => {
  const [filters, setFilters] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  const getData = useCallback(async () => {
    setIsLoading(true);
    try {
        const data = await fetchExecutiveData(filters);
        setDashboardData(data);
        setLastUpdated(new Date());
    } catch (error) {
        console.error("Failed to fetch executive summary data:", error);
    } finally {
        setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    getData();
  }, [getData]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleRefresh = () => {
    getData();
  };

  const handlePrintView = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="content-offset">
          <GlobalFilterBar onFiltersChange={handleFiltersChange} />
          
          {/* Loading State */}
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Loading Executive Dashboard</h3>
                <p className="text-sm text-muted-foreground">
                  Prioritizing critical KPIs for immediate executive value...
                </p>
              </div>
              <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                <Icon name="Shield" size={14} className="text-success" />
                <span>Secure data processing in progress</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="content-offset">
        <GlobalFilterBar onFiltersChange={handleFiltersChange} />
        
        {/* Page Header */}
        <div className="px-6 py-6 border-b border-border bg-card/50">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Icon name="BarChart3" size={20} color="white" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">
                  Executive Summary & Strategic Insights
                </h1>
              </div>
              <p className="text-muted-foreground">
                High-level strategic insights and key performance indicators for leadership teams
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Last Updated */}
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Clock" size={14} />
                <span>Updated: {lastUpdated?.toLocaleTimeString()}</span>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  iconName="RefreshCw"
                  iconPosition="left"
                  iconSize={14}
                >
                  Refresh
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrintView}
                  iconName="Printer"
                  iconPosition="left"
                  iconSize={14}
                >
                  Print
                </Button>
                
                <DataExportController />
                <AlertNotificationCenter />
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="spacing-dashboard">
          {/* Business Health Indicators - Top Priority */}
          <section className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Icon name="Activity" size={20} className="text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Business Health Overview</h2>
            </div>
            <BusinessHealthIndicators data={dashboardData?.businessHealth} />
          </section>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-8">
            {/* Strategic Performance Chart - 8 columns */}
            <div className="xl:col-span-8">
              <StrategicPerformanceChart data={dashboardData?.strategicPerformance} />
            </div>
            
            {/* Market Positioning Metrics - 4 columns */}
            <div className="xl:col-span-4">
              <MarketPositioningMetrics />
            </div>
          </div>

          {/* Business Scorecard - Full Width */}
          <section className="mb-8">
            <BusinessScorecard data={dashboardData?.businessScorecard} />
          </section>

          {/* Predictive Analytics Overlay */}
          <section className="mb-8">
            <PredictiveAnalyticsOverlay data={dashboardData?.predictiveAnalytics} />
          </section>

          {/* Executive Summary Footer */}
          <div className="bg-card border border-border rounded-lg p-6 print:break-inside-avoid">
            <div className="flex items-start space-x-4">
              <Icon name="FileText" size={24} className="text-primary mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Executive Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Key Achievements</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Revenue growth of 12.3% exceeding quarterly targets</li>
                      <li>• Market share expansion to 23.4% in target regions</li>
                      <li>• Operational efficiency maintained at 94.2%</li>
                      <li>• Player acquisition costs reduced by 14.5%</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Strategic Priorities</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Continue market share expansion initiatives</li>
                      <li>• Optimize player acquisition cost efficiency</li>
                      <li>• Monitor risk exposure levels closely</li>
                      <li>• Prepare for Q4 seasonal performance surge</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      Report generated on {new Date()?.toLocaleDateString()} at {new Date()?.toLocaleTimeString()}
                    </span>
                    <span>
                      Gaming Analytics Hub - Executive Dashboard v2.1
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveSummaryStrategicInsightsDashboard;