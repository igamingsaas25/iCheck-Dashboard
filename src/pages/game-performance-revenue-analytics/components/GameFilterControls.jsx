import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const GameFilterControls = ({ onFiltersChange, totalGames }) => {
  const [filters, setFilters] = useState({
    category: 'all',
    provider: 'all',
    volatility: 'all',
    rtp: 'all',
    launchDate: 'all',
    performance: 'all'
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'slots', label: 'Slots' },
    { value: 'table', label: 'Table Games' },
    { value: 'live', label: 'Live Casino' },
    { value: 'jackpot', label: 'Jackpot Games' },
    { value: 'poker', label: 'Video Poker' }
  ];

  const providerOptions = [
    { value: 'all', label: 'All Providers' },
    { value: 'netent', label: 'NetEnt' },
    { value: 'microgaming', label: 'Microgaming' },
    { value: 'pragmatic', label: 'Pragmatic Play' },
    { value: 'evolution', label: 'Evolution Gaming' },
    { value: 'playgo', label: 'Play\'n GO' },
    { value: 'redtiger', label: 'Red Tiger' },
    { value: 'blueprint', label: 'Blueprint Gaming' },
    { value: 'btg', label: 'Big Time Gaming' }
  ];

  const volatilityOptions = [
    { value: 'all', label: 'All Volatility' },
    { value: 'low', label: 'Low Volatility' },
    { value: 'medium', label: 'Medium Volatility' },
    { value: 'high', label: 'High Volatility' }
  ];

  const rtpOptions = [
    { value: 'all', label: 'All RTP Ranges' },
    { value: 'high', label: 'High RTP (96%+)' },
    { value: 'medium', label: 'Medium RTP (94-96%)' },
    { value: 'low', label: 'Low RTP (<94%)' }
  ];

  const launchDateOptions = [
    { value: 'all', label: 'All Launch Dates' },
    { value: 'new', label: 'New Games (Last 30 days)' },
    { value: 'recent', label: 'Recent (Last 90 days)' },
    { value: 'established', label: 'Established (6+ months)' },
    { value: 'legacy', label: 'Legacy (1+ years)' }
  ];

  const performanceOptions = [
    { value: 'all', label: 'All Performance' },
    { value: 'top', label: 'Top Performers' },
    { value: 'rising', label: 'Rising Stars' },
    { value: 'declining', label: 'Declining' },
    { value: 'underperforming', label: 'Underperforming' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const resetFilters = () => {
    const resetFilters = {
      category: 'all',
      provider: 'all',
      volatility: 'all',
      rtp: 'all',
      launchDate: 'all',
      performance: 'all'
    };
    setFilters(resetFilters);
    onFiltersChange?.(resetFilters);
  };

  const hasActiveFilters = () => {
    return Object.values(filters)?.some(value => value !== 'all');
  };

  const getActiveFilterCount = () => {
    return Object.values(filters)?.filter(value => value !== 'all')?.length;
  };

  return (
    <div className="bg-card rounded-lg border">
      <div className="p-4">
        {/* Mobile: Collapsible Header */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <h3 className="text-sm font-medium text-card-foreground">Game Filters</h3>
              {hasActiveFilters() && (
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                  {getActiveFilterCount()} active
                </span>
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
        </div>

        {/* Desktop: Always Visible Header */}
        <div className="hidden lg:flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Icon name="Filter" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-card-foreground">Game Filters</h3>
            {hasActiveFilters() && (
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                {getActiveFilterCount()} active
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Gamepad2" size={16} />
            <span>{totalGames} games</span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className={`${isExpanded || 'lg:block' ? 'block' : 'hidden'} space-y-4`}>
          {/* Primary Filters - Always Visible */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Select
              label="Category"
              options={categoryOptions}
              value={filters?.category}
              onChange={(value) => handleFilterChange('category', value)}
            />
            <Select
              label="Provider"
              options={providerOptions}
              value={filters?.provider}
              onChange={(value) => handleFilterChange('provider', value)}
              searchable
            />
            <Select
              label="Performance"
              options={performanceOptions}
              value={filters?.performance}
              onChange={(value) => handleFilterChange('performance', value)}
            />
          </div>

          {/* Secondary Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Volatility"
              options={volatilityOptions}
              value={filters?.volatility}
              onChange={(value) => handleFilterChange('volatility', value)}
            />
            <Select
              label="RTP Range"
              options={rtpOptions}
              value={filters?.rtp}
              onChange={(value) => handleFilterChange('rtp', value)}
            />
            <Select
              label="Launch Date"
              options={launchDateOptions}
              value={filters?.launchDate}
              onChange={(value) => handleFilterChange('launchDate', value)}
            />
          </div>

          {/* Filter Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              {hasActiveFilters() ? `Filtering ${totalGames} games` : `Showing all ${totalGames} games`}
            </div>
            <div className="flex items-center space-x-2">
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
              <Button
                variant="outline"
                size="sm"
                iconName="Download"
                iconPosition="left"
              >
                Export Filtered
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameFilterControls;