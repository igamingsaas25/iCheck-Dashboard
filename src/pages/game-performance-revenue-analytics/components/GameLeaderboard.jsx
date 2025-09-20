import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GameLeaderboard = ({ games, onGameSelect, selectedGame }) => {
  const [sortBy, setSortBy] = useState('revenue');
  const [viewMode, setViewMode] = useState('revenue'); // revenue, popularity, rtp

  const sortedGames = [...games]?.sort((a, b) => {
      switch (sortBy) {
        case 'revenue':
          return b?.revenue - a?.revenue;
        case 'popularity':
          return b?.sessions - a?.sessions;
        case 'rtp':
          return b?.rtp - a?.rtp;
        default:
          return b?.revenue - a?.revenue;
      }
    })?.slice(0, 15);

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Icon name="Trophy" size={16} className="text-yellow-500" />;
      case 1:
        return <Icon name="Medal" size={16} className="text-gray-400" />;
      case 2:
        return <Icon name="Award" size={16} className="text-amber-600" />;
      default:
        return <span className="text-sm font-medium text-muted-foreground w-4 text-center">{index + 1}</span>;
    }
  };

  const getPerformanceIndicator = (game) => {
    const trend = game?.trend || 0;
    if (trend > 5) return { icon: 'TrendingUp', color: 'text-success' };
    if (trend < -5) return { icon: 'TrendingDown', color: 'text-error' };
    return { icon: 'Minus', color: 'text-muted-foreground' };
  };

  const formatValue = (value, type) => {
    switch (type) {
      case 'currency':
        return `$${(value / 1000)?.toFixed(0)}K`;
      case 'percentage':
        return `${value?.toFixed(1)}%`;
      case 'sessions':
        return `${(value / 1000)?.toFixed(1)}K`;
      default:
        return value;
    }
  };

  const getDisplayValue = (game) => {
    switch (viewMode) {
      case 'revenue':
        return formatValue(game?.revenue, 'currency');
      case 'popularity':
        return formatValue(game?.sessions, 'sessions');
      case 'rtp':
        return formatValue(game?.rtp, 'percentage');
      default:
        return formatValue(game?.revenue, 'currency');
    }
  };

  const viewModeOptions = [
    { key: 'revenue', label: 'Revenue', icon: 'DollarSign' },
    { key: 'popularity', label: 'Popularity', icon: 'Users' },
    { key: 'rtp', label: 'RTP', icon: 'Percent' }
  ];

  return (
    <div className="bg-card rounded-lg border h-fit">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">Game Leaderboard</h3>
            <p className="text-sm text-muted-foreground">Top performing games</p>
          </div>
          <Icon name="Trophy" size={20} className="text-primary" />
        </div>

        {/* View Mode Selector */}
        <div className="flex space-x-1 bg-muted/30 rounded-lg p-1">
          {viewModeOptions?.map((option) => (
            <button
              key={option?.key}
              onClick={() => {
                setViewMode(option?.key);
                setSortBy(option?.key);
              }}
              className={`flex-1 flex items-center justify-center space-x-1 px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === option?.key
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-card-foreground'
              }`}
            >
              <Icon name={option?.icon} size={12} />
              <span>{option?.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="p-4">
        <div className="space-y-3">
          {sortedGames?.map((game, index) => {
            const indicator = getPerformanceIndicator(game);
            const isSelected = selectedGame?.id === game?.id;

            return (
              <div
                key={game?.id}
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-primary/10 border border-primary/20' :'hover:bg-muted/30'
                }`}
                onClick={() => onGameSelect(game)}
              >
                {/* Rank */}
                <div className="flex-shrink-0 w-6 flex justify-center">
                  {getRankIcon(index)}
                </div>
                {/* Game Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-card-foreground truncate">
                      {game?.name}
                    </h4>
                    <div className="flex items-center space-x-1">
                      <Icon name={indicator?.icon} size={12} className={indicator?.color} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">{game?.provider}</span>
                    <span className="text-sm font-medium text-card-foreground">
                      {getDisplayValue(game)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              iconName="BarChart3"
              iconPosition="left"
            >
              Compare
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
            >
              Export
            </Button>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="mt-4 p-3 bg-muted/20 rounded-lg">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Top 3 Average:</span>
            <span className="font-medium text-card-foreground">
              {viewMode === 'revenue' && formatValue(
                sortedGames?.slice(0, 3)?.reduce((sum, game) => sum + game?.revenue, 0) / 3,
                'currency'
              )}
              {viewMode === 'popularity' && formatValue(
                sortedGames?.slice(0, 3)?.reduce((sum, game) => sum + game?.sessions, 0) / 3,
                'sessions'
              )}
              {viewMode === 'rtp' && formatValue(
                sortedGames?.slice(0, 3)?.reduce((sum, game) => sum + game?.rtp, 0) / 3,
                'percentage'
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameLeaderboard;