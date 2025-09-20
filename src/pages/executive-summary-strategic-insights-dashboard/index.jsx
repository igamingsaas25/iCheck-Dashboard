import React, { useState, useEffect } from 'react';
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

const ExecutiveSummaryStrategicInsightsDashboard = () => {
  const [filters, setFilters] = useState({});
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial data loading
    const loadData = async () => {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsLoading(false);
    };

    loadData();

    // Set up hourly updates
    const updateInterval = setInterval(() => {
      setLastUpdated(new Date());
    }, 3600000); // 1 hour

    return () => clearInterval(updateInterval);
  }, []);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setLastUpdated(new Date());
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdated(new Date());
    setIsLoading(false);
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
            <BusinessHealthIndicators />
          </section>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-8">
            {/* Strategic Performance Chart - 8 columns */}
            <div className="xl:col-span-8">
              <StrategicPerformanceChart />
            </div>
            
            {/* Market Positioning Metrics - 4 columns */}
            <div className="xl:col-span-4">
              <MarketPositioningMetrics />
            </div>
          </div>

          {/* Business Scorecard - Full Width */}
          <section className="mb-8">
            <BusinessScorecard />
          </section>

          {/* Predictive Analytics Overlay */}
          <section className="mb-8">
            <PredictiveAnalyticsOverlay />
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