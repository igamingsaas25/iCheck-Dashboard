import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import FinancialPerformanceRiskManagementDashboard from './pages/financial-performance-risk-management-dashboard';
import GamePerformanceRevenueAnalytics from './pages/game-performance-revenue-analytics';
import PlayerAnalyticsBehaviorDashboard from './pages/player-analytics-behavior-dashboard';
import ExecutiveSummaryStrategicInsightsDashboard from './pages/executive-summary-strategic-insights-dashboard';
import RealTimeOperationsCommandCenter from './pages/real-time-operations-command-center';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<ExecutiveSummaryStrategicInsightsDashboard />} />
        <Route path="/financial-performance-risk-management-dashboard" element={<FinancialPerformanceRiskManagementDashboard />} />
        <Route path="/game-performance-revenue-analytics" element={<GamePerformanceRevenueAnalytics />} />
        <Route path="/player-analytics-behavior-dashboard" element={<PlayerAnalyticsBehaviorDashboard />} />
        <Route path="/executive-summary-strategic-insights-dashboard" element={<ExecutiveSummaryStrategicInsightsDashboard />} />
        <Route path="/real-time-operations-command-center" element={<RealTimeOperationsCommandCenter />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
