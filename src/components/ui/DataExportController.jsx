import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Button from './Button';
import Select from './Select';
import Icon from '../AppIcon';

const DataExportController = ({ className = '', contextData = null }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [exportConfig, setExportConfig] = useState({
    format: 'csv',
    dateRange: 'current',
    includeCharts: false,
    includeRawData: true
  });
  const [isExporting, setIsExporting] = useState(false);

  const formatOptions = [
    { value: 'csv', label: 'CSV (.csv)', description: 'Comma-separated values' },
    { value: 'xlsx', label: 'Excel (.xlsx)', description: 'Microsoft Excel format' },
    { value: 'pdf', label: 'PDF (.pdf)', description: 'Portable document format' },
    { value: 'json', label: 'JSON (.json)', description: 'JavaScript object notation' }
  ];

  const dateRangeOptions = [
    { value: 'current', label: 'Current View', description: 'Data currently displayed' },
    { value: 'today', label: 'Today', description: 'All data from today' },
    { value: 'week', label: 'This Week', description: 'Last 7 days' },
    { value: 'month', label: 'This Month', description: 'Last 30 days' },
    { value: 'quarter', label: 'This Quarter', description: 'Last 90 days' }
  ];

  const getContextualExportOptions = () => {
    const path = location?.pathname;
    
    switch (path) {
      case '/real-time-operations-command-center':
        return {
          title: 'Export Operations Data',
          description: 'Real-time monitoring and system metrics',
          availableFormats: ['csv', 'xlsx', 'json'],
          defaultIncludes: ['System metrics', 'Alert logs', 'Performance data']
        };
      case '/player-analytics-behavior-dashboard':
        return {
          title: 'Export Player Analytics',
          description: 'Player behavior and engagement metrics',
          availableFormats: ['csv', 'xlsx', 'pdf'],
          defaultIncludes: ['Player segments', 'Behavior patterns', 'Engagement metrics']
        };
      case '/financial-performance-risk-management-dashboard':
        return {
          title: 'Export Financial Data',
          description: 'Revenue, profit, and risk management data',
          availableFormats: ['csv', 'xlsx', 'pdf'],
          defaultIncludes: ['Revenue data', 'Risk assessments', 'Financial summaries']
        };
      case '/game-performance-revenue-analytics':
        return {
          title: 'Export Game Analytics',
          description: 'Game performance and revenue metrics',
          availableFormats: ['csv', 'xlsx', 'pdf'],
          defaultIncludes: ['Game metrics', 'Revenue data', 'Performance trends']
        };
      case '/executive-summary-strategic-insights-dashboard':
        return {
          title: 'Export Strategic Insights',
          description: 'Executive summary and strategic data',
          availableFormats: ['pdf', 'xlsx', 'csv'],
          defaultIncludes: ['Executive summary', 'KPI metrics', 'Strategic insights']
        };
      default:
        return {
          title: 'Export Data',
          description: 'Export current dashboard data',
          availableFormats: ['csv', 'xlsx', 'pdf', 'json'],
          defaultIncludes: ['Dashboard data', 'Current metrics']
        };
    }
  };

  const contextOptions = getContextualExportOptions();
  const availableFormats = formatOptions?.filter(format => 
    contextOptions?.availableFormats?.includes(format?.value)
  );

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real implementation, this would call the appropriate API
      const filename = `${contextOptions?.title?.toLowerCase()?.replace(/\s+/g, '-')}-${new Date()?.toISOString()?.split('T')?.[0]}.${exportConfig?.format}`;
      
      // Mock download trigger
      console.log('Exporting:', {
        filename,
        config: exportConfig,
        context: location?.pathname,
        timestamp: new Date()?.toISOString()
      });
      
      setIsOpen(false);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const updateConfig = (key, value) => {
    setExportConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className={`relative ${className}`}>
      {/* Export Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        iconName="Download"
        iconPosition="left"
        disabled={isExporting}
      >
        Export
      </Button>
      {/* Export Panel */}
      {isOpen && (
        <>
          <div className="absolute top-full right-0 mt-2 w-80 bg-popover border border-border rounded-lg shadow-modal z-100 animate-fade-in">
            {/* Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-popover-foreground">
                    {contextOptions?.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {contextOptions?.description}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  iconName="X"
                  iconSize={16}
                />
              </div>
            </div>

            {/* Export Configuration */}
            <div className="p-4 space-y-4">
              {/* Format Selection */}
              <Select
                label="Export Format"
                description="Choose the file format for export"
                options={availableFormats}
                value={exportConfig?.format}
                onChange={(value) => updateConfig('format', value)}
              />

              {/* Date Range */}
              <Select
                label="Date Range"
                description="Select the time period to export"
                options={dateRangeOptions}
                value={exportConfig?.dateRange}
                onChange={(value) => updateConfig('dateRange', value)}
              />

              {/* Additional Options */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-popover-foreground">Include Options</h4>
                
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exportConfig?.includeRawData}
                    onChange={(e) => updateConfig('includeRawData', e?.target?.checked)}
                    className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-primary focus:ring-2"
                  />
                  <div className="flex-1">
                    <span className="text-sm text-popover-foreground">Raw Data</span>
                    <p className="text-xs text-muted-foreground">Include detailed raw data tables</p>
                  </div>
                </label>

                {(exportConfig?.format === 'pdf' || exportConfig?.format === 'xlsx') && (
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportConfig?.includeCharts}
                      onChange={(e) => updateConfig('includeCharts', e?.target?.checked)}
                      className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-primary focus:ring-2"
                    />
                    <div className="flex-1">
                      <span className="text-sm text-popover-foreground">Charts & Visualizations</span>
                      <p className="text-xs text-muted-foreground">Include charts and graphs</p>
                    </div>
                  </label>
                )}
              </div>

              {/* Data Preview */}
              <div className="bg-muted/30 rounded-lg p-3">
                <h4 className="text-sm font-medium text-popover-foreground mb-2">Export Preview</h4>
                <div className="space-y-1">
                  {contextOptions?.defaultIncludes?.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Icon name="Check" size={12} className="text-success" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Estimated file size: ~{Math.floor(Math.random() * 5) + 1}MB
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Export will be processed in background
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleExport}
                    loading={isExporting}
                    iconName="Download"
                    iconPosition="left"
                  >
                    {isExporting ? 'Exporting...' : 'Export'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Backdrop */}
          <div
            className="fixed inset-0 z-90"
            onClick={() => setIsOpen(false)}
          />
        </>
      )}
    </div>
  );
};

export default DataExportController;