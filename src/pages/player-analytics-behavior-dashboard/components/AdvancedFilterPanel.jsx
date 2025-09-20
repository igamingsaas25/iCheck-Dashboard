import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const AdvancedFilterPanel = ({ onFiltersChange, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    playerSegment: 'all',
    gameCategory: 'all',
    registrationPeriod: '30d',
    activityLevel: 'all',
    spendingTier: 'all',
    deviceType: 'all',
    paymentMethod: 'all',
    riskLevel: 'all',
    customFilters: {
      minSessions: '',
      maxSessions: '',
      minSpend: '',
      maxSpend: '',
      includeInactive: false,
      includeBanned: false,
      includeVIP: true
    }
  });

  const [savedFilters, setSavedFilters] = useState([
    { id: 1, name: 'High Value Players', description: 'VIP players with $1000+ spend' },
    { id: 2, name: 'New Player Cohort', description: 'Players registered in last 7 days' },
    { id: 3, name: 'At-Risk Players', description: 'Declining activity patterns' }
  ]);

  const playerSegmentOptions = [
    { value: 'all', label: 'All Players' },
    { value: 'new', label: 'New Players (0-30 days)' },
    { value: 'regular', label: 'Regular Players (30-90 days)' },
    { value: 'veteran', label: 'Veteran Players (90+ days)' },
    { value: 'dormant', label: 'Dormant Players (30+ days inactive)' },
    { value: 'vip', label: 'VIP Players' }
  ];

  const gameCategoryOptions = [
    { value: 'all', label: 'All Games' },
    { value: 'slots', label: 'Slot Games' },
    { value: 'table', label: 'Table Games' },
    { value: 'live', label: 'Live Casino' },
    { value: 'sports', label: 'Sports Betting' },
    { value: 'poker', label: 'Poker' }
  ];

  const registrationPeriodOptions = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' },
    { value: 'all', label: 'All Time' }
  ];

  const activityLevelOptions = [
    { value: 'all', label: 'All Activity Levels' },
    { value: 'very-high', label: 'Very High (Daily)' },
    { value: 'high', label: 'High (3-6 times/week)' },
    { value: 'medium', label: 'Medium (1-2 times/week)' },
    { value: 'low', label: 'Low (Monthly)' },
    { value: 'inactive', label: 'Inactive (30+ days)' }
  ];

  const spendingTierOptions = [
    { value: 'all', label: 'All Spending Levels' },
    { value: 'whale', label: 'Whale ($10,000+)' },
    { value: 'high-roller', label: 'High Roller ($1,000-$10,000)' },
    { value: 'medium-spender', label: 'Medium Spender ($100-$1,000)' },
    { value: 'low-spender', label: 'Low Spender ($10-$100)' },
    { value: 'free-player', label: 'Free Players ($0-$10)' }
  ];

  const deviceTypeOptions = [
    { value: 'all', label: 'All Devices' },
    { value: 'desktop', label: 'Desktop' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'tablet', label: 'Tablet' }
  ];

  const paymentMethodOptions = [
    { value: 'all', label: 'All Payment Methods' },
    { value: 'credit-card', label: 'Credit Card' },
    { value: 'debit-card', label: 'Debit Card' },
    { value: 'e-wallet', label: 'E-Wallet' },
    { value: 'bank-transfer', label: 'Bank Transfer' },
    { value: 'crypto', label: 'Cryptocurrency' }
  ];

  const riskLevelOptions = [
    { value: 'all', label: 'All Risk Levels' },
    { value: 'low', label: 'Low Risk' },
    { value: 'medium', label: 'Medium Risk' },
    { value: 'high', label: 'High Risk' },
    { value: 'flagged', label: 'Flagged Accounts' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleCustomFilterChange = (key, value) => {
    const newCustomFilters = { ...filters?.customFilters, [key]: value };
    const newFilters = { ...filters, customFilters: newCustomFilters };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      playerSegment: 'all',
      gameCategory: 'all',
      registrationPeriod: '30d',
      activityLevel: 'all',
      spendingTier: 'all',
      deviceType: 'all',
      paymentMethod: 'all',
      riskLevel: 'all',
      customFilters: {
        minSessions: '',
        maxSessions: '',
        minSpend: '',
        maxSpend: '',
        includeInactive: false,
        includeBanned: false,
        includeVIP: true
      }
    };
    setFilters(defaultFilters);
    onFiltersChange?.(defaultFilters);
  };

  const saveCurrentFilters = () => {
    const filterName = prompt('Enter a name for this filter set:');
    if (filterName) {
      const newSavedFilter = {
        id: Date.now(),
        name: filterName,
        description: 'Custom filter configuration',
        filters: { ...filters }
      };
      setSavedFilters(prev => [...prev, newSavedFilter]);
    }
  };

  const loadSavedFilter = (savedFilter) => {
    if (savedFilter?.filters) {
      setFilters(savedFilter?.filters);
      onFiltersChange?.(savedFilter?.filters);
    }
  };

  const hasActiveFilters = () => {
    return Object.entries(filters)?.some(([key, value]) => {
      if (key === 'customFilters') {
        return Object.entries(value)?.some(([customKey, customValue]) => {
          if (typeof customValue === 'boolean') {
            return customKey === 'includeVIP' ? !customValue : customValue;
          }
          return customValue !== '';
        });
      }
      return value !== 'all' && value !== '30d';
    });
  };

  return (
    <div className={`bg-card border-b border-border ${className}`}>
      <div className="px-6 py-4">
        {/* Filter Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <h3 className="text-sm font-semibold text-foreground">Advanced Filters</h3>
            {hasActiveFilters() && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-xs text-primary font-medium">Active</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={saveCurrentFilters}
              iconName="Bookmark"
              iconPosition="left"
            >
              Save
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              iconName="RotateCcw"
              iconPosition="left"
            >
              Reset
            </Button>
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
        </div>

        {/* Quick Filters - Always Visible */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <Select
            label="Player Segment"
            options={playerSegmentOptions}
            value={filters?.playerSegment}
            onChange={(value) => handleFilterChange('playerSegment', value)}
          />
          <Select
            label="Game Category"
            options={gameCategoryOptions}
            value={filters?.gameCategory}
            onChange={(value) => handleFilterChange('gameCategory', value)}
          />
          <Select
            label="Registration Period"
            options={registrationPeriodOptions}
            value={filters?.registrationPeriod}
            onChange={(value) => handleFilterChange('registrationPeriod', value)}
          />
          <Select
            label="Activity Level"
            options={activityLevelOptions}
            value={filters?.activityLevel}
            onChange={(value) => handleFilterChange('activityLevel', value)}
          />
        </div>

        {/* Saved Filters */}
        {savedFilters?.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-medium text-muted-foreground mb-2">Saved Filters</h4>
            <div className="flex flex-wrap gap-2">
              {savedFilters?.map((savedFilter) => (
                <Button
                  key={savedFilter?.id}
                  variant="outline"
                  size="sm"
                  onClick={() => loadSavedFilter(savedFilter)}
                  className="text-xs"
                >
                  {savedFilter?.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="space-y-6 animate-slide-in">
            {/* Additional Filter Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select
                label="Spending Tier"
                options={spendingTierOptions}
                value={filters?.spendingTier}
                onChange={(value) => handleFilterChange('spendingTier', value)}
              />
              <Select
                label="Device Type"
                options={deviceTypeOptions}
                value={filters?.deviceType}
                onChange={(value) => handleFilterChange('deviceType', value)}
              />
              <Select
                label="Payment Method"
                options={paymentMethodOptions}
                value={filters?.paymentMethod}
                onChange={(value) => handleFilterChange('paymentMethod', value)}
              />
              <Select
                label="Risk Level"
                options={riskLevelOptions}
                value={filters?.riskLevel}
                onChange={(value) => handleFilterChange('riskLevel', value)}
              />
            </div>

            {/* Custom Range Filters */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Custom Ranges</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Input
                  label="Min Sessions"
                  type="number"
                  placeholder="0"
                  value={filters?.customFilters?.minSessions}
                  onChange={(e) => handleCustomFilterChange('minSessions', e?.target?.value)}
                />
                <Input
                  label="Max Sessions"
                  type="number"
                  placeholder="999"
                  value={filters?.customFilters?.maxSessions}
                  onChange={(e) => handleCustomFilterChange('maxSessions', e?.target?.value)}
                />
                <Input
                  label="Min Spend ($)"
                  type="number"
                  placeholder="0"
                  value={filters?.customFilters?.minSpend}
                  onChange={(e) => handleCustomFilterChange('minSpend', e?.target?.value)}
                />
                <Input
                  label="Max Spend ($)"
                  type="number"
                  placeholder="10000"
                  value={filters?.customFilters?.maxSpend}
                  onChange={(e) => handleCustomFilterChange('maxSpend', e?.target?.value)}
                />
              </div>
            </div>

            {/* Include/Exclude Options */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Include Options</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Checkbox
                  label="Include Inactive Players"
                  description="Players with no activity in 30+ days"
                  checked={filters?.customFilters?.includeInactive}
                  onChange={(e) => handleCustomFilterChange('includeInactive', e?.target?.checked)}
                />
                <Checkbox
                  label="Include Banned Players"
                  description="Players with account restrictions"
                  checked={filters?.customFilters?.includeBanned}
                  onChange={(e) => handleCustomFilterChange('includeBanned', e?.target?.checked)}
                />
                <Checkbox
                  label="Include VIP Players"
                  description="High-value and premium players"
                  checked={filters?.customFilters?.includeVIP}
                  onChange={(e) => handleCustomFilterChange('includeVIP', e?.target?.checked)}
                />
              </div>
            </div>

            {/* Filter Summary */}
            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="text-sm font-medium text-foreground mb-2">Filter Summary</h4>
              <div className="text-sm text-muted-foreground">
                <p>
                  Showing {filters?.playerSegment === 'all' ? 'all players' : playerSegmentOptions?.find(opt => opt?.value === filters?.playerSegment)?.label?.toLowerCase()} 
                  {filters?.gameCategory !== 'all' && ` playing ${gameCategoryOptions?.find(opt => opt?.value === filters?.gameCategory)?.label?.toLowerCase()}`}
                  {filters?.registrationPeriod !== 'all' && ` registered in the ${registrationPeriodOptions?.find(opt => opt?.value === filters?.registrationPeriod)?.label?.toLowerCase()}`}
                </p>
                {hasActiveFilters() && (
                  <p className="mt-1 text-primary">
                    {Object.entries(filters)?.filter(([key, value]) => {
                      if (key === 'customFilters') return false;
                      return value !== 'all' && value !== '30d';
                    })?.length} advanced filters active
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedFilterPanel;