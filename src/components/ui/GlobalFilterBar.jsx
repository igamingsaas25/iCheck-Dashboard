import React, { useState, useEffect } from 'react';
import Select from './Select';
import Button from './Button';
import Icon from '../AppIcon';

const GlobalFilterBar = ({ onFiltersChange, className = '' }) => {
  const [filters, setFilters] = useState({
    timeRange: '24h',
    currency: 'USD',
    operator: 'all',
    region: 'all'
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const timeRangeOptions = [
    { value: '1h', label: 'Last Hour' },
    { value: '6h', label: 'Last 6 Hours' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const currencyOptions = [
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'JPY', label: 'JPY (¥)' },
    { value: 'CAD', label: 'CAD (C$)' }
  ];

  const operatorOptions = [
    { value: 'all', label: 'All Operators' },
    { value: 'op1', label: 'Premium Gaming Co.' },
    { value: 'op2', label: 'Elite Casino Group' },
    { value: 'op3', label: 'Global Gaming Ltd.' },
    { value: 'op4', label: 'Mega Entertainment' }
  ];

  const regionOptions = [
    { value: 'all', label: 'All Regions' },
    { value: 'na', label: 'North America' },
    { value: 'eu', label: 'Europe' },
    { value: 'asia', label: 'Asia Pacific' },
    { value: 'latam', label: 'Latin America' }
  ];

  const quickPresets = [
    { label: 'Live', filters: { timeRange: '1h', currency: 'USD', operator: 'all', region: 'all' } },
    { label: 'Today', filters: { timeRange: '24h', currency: 'USD', operator: 'all', region: 'all' } },
    { label: 'Week', filters: { timeRange: '7d', currency: 'USD', operator: 'all', region: 'all' } }
  ];

  useEffect(() => {
    onFiltersChange?.(filters);
  }, [filters, onFiltersChange]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePresetClick = (preset) => {
    setFilters(preset?.filters);
  };

  const resetFilters = () => {
    setFilters({
      timeRange: '24h',
      currency: 'USD',
      operator: 'all',
      region: 'all'
    });
  };

  const hasActiveFilters = () => {
    return filters?.operator !== 'all' || filters?.region !== 'all' || filters?.timeRange !== '24h' || filters?.currency !== 'USD';
  };

  return (
    <div className={`bg-card border-b border-border sticky top-[60px] z-90 ${className}`}>
      <div className="px-6 py-4">
        {/* Mobile: Collapsible Filter Bar */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <h3 className="text-sm font-medium text-foreground">Filters</h3>
              {hasActiveFilters() && (
                <div className="w-2 h-2 bg-primary rounded-full"></div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
              iconPosition="right"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </div>

          {/* Quick Presets - Always Visible on Mobile */}
          <div className="flex space-x-2 mb-3">
            {quickPresets?.map((preset) => (
              <Button
                key={preset?.label}
                variant={JSON.stringify(filters) === JSON.stringify(preset?.filters) ? "default" : "outline"}
                size="sm"
                onClick={() => handlePresetClick(preset)}
              >
                {preset?.label}
              </Button>
            ))}
          </div>

          {/* Expandable Filters */}
          {isExpanded && (
            <div className="space-y-3 animate-slide-in">
              <div className="grid grid-cols-1 gap-3">
                <Select
                  label="Time Range"
                  options={timeRangeOptions}
                  value={filters?.timeRange}
                  onChange={(value) => handleFilterChange('timeRange', value)}
                />
                <Select
                  label="Currency"
                  options={currencyOptions}
                  value={filters?.currency}
                  onChange={(value) => handleFilterChange('currency', value)}
                />
                <Select
                  label="Operator"
                  options={operatorOptions}
                  value={filters?.operator}
                  onChange={(value) => handleFilterChange('operator', value)}
                />
                <Select
                  label="Region"
                  options={regionOptions}
                  value={filters?.region}
                  onChange={(value) => handleFilterChange('region', value)}
                />
              </div>
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  iconName="RotateCcw"
                  iconPosition="left"
                >
                  Reset
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Desktop: Horizontal Filter Bar */}
        <div className="hidden lg:block">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* Quick Presets */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-muted-foreground">Quick:</span>
                {quickPresets?.map((preset) => (
                  <Button
                    key={preset?.label}
                    variant={JSON.stringify(filters) === JSON.stringify(preset?.filters) ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handlePresetClick(preset)}
                  >
                    {preset?.label}
                  </Button>
                ))}
              </div>

              {/* Filter Controls */}
              <div className="flex items-center space-x-4">
                <Select
                  options={timeRangeOptions}
                  value={filters?.timeRange}
                  onChange={(value) => handleFilterChange('timeRange', value)}
                  className="w-40"
                />
                <Select
                  options={currencyOptions}
                  value={filters?.currency}
                  onChange={(value) => handleFilterChange('currency', value)}
                  className="w-32"
                />
                <Select
                  options={operatorOptions}
                  value={filters?.operator}
                  onChange={(value) => handleFilterChange('operator', value)}
                  className="w-48"
                />
                <Select
                  options={regionOptions}
                  value={filters?.region}
                  onChange={(value) => handleFilterChange('region', value)}
                  className="w-40"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              {hasActiveFilters() && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  iconName="RotateCcw"
                  iconPosition="left"
                >
                  Reset
                </Button>
              )}
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Clock" size={14} />
                <span>Last updated: {new Date()?.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalFilterBar;