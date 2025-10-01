import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';


const TopGamesGrid = ({ initialGames, className = '' }) => {
  const [games, setGames] = useState(initialGames || []);
  const [sortBy, setSortBy] = useState('revenue');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    if (initialGames) {
      setGames(initialGames);
    }
  }, [initialGames]);

  useEffect(() => {
    // Simulate real-time updates for demonstration
    const interval = setInterval(() => {
      setGames(prev => prev.map(game => ({
        ...game,
        activePlayers: Math.max(0, game.activePlayers + Math.floor(Math.random() * 20 - 10)),
        revenue: Math.max(0, game.revenue + Math.floor(Math.random() * 1000 - 500)),
        sessions: Math.max(0, game.sessions + Math.floor(Math.random() * 10 - 5))
      })));
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const sortedGames = [...games]?.sort((a, b) => {
    switch (sortBy) {
      case 'revenue':
        return b?.revenue - a?.revenue;
      case 'players':
        return b?.activePlayers - a?.activePlayers;
      case 'rtp':
        return b?.rtp - a?.rtp;
      case 'sessions':
        return b?.sessions - a?.sessions;
      default:
        return 0;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'text-success bg-success/10 border-success/20';
      case 'warning':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'critical':
        return 'text-critical bg-critical/10 border-critical/20';
      default:
        return 'text-muted-foreground bg-muted/10 border-muted/20';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return 'TrendingUp';
      case 'down':
        return 'TrendingDown';
      case 'stable':
        return 'Minus';
      default:
        return 'Minus';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'text-success';
      case 'down':
        return 'text-error';
      case 'stable':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedGames?.map((game) => (
        <div key={game?.id} className="data-card hover-lift">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Icon name="Gamepad2" size={16} color="white" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground truncate">{game?.name}</h4>
                  <p className="text-xs text-muted-foreground">{game?.category}</p>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full border text-xs font-medium ${getStatusColor(game?.status)}`}>
                {game?.status}
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Revenue</span>
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-medium text-foreground">${game?.revenue?.toLocaleString()}</span>
                  <div className={`flex items-center space-x-1 ${getTrendColor(game?.trend)}`}>
                    <Icon name={getTrendIcon(game?.trend)} size={10} />
                    <span className="text-xs">{game?.change}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Active Players</span>
                <span className="text-sm font-medium text-foreground">{game?.activePlayers?.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">RTP</span>
                <span className="text-sm font-medium text-foreground">{game?.rtp}%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Avg Bet</span>
                <span className="text-sm font-medium text-foreground">${game?.avgBet}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Game</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Players</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Revenue</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">RTP</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Sessions</th>
            <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
          </tr>
        </thead>
        <tbody>
          {sortedGames?.map((game) => (
            <tr key={game?.id} className="border-b border-border hover:bg-muted/30 transition-smooth">
              <td className="py-3 px-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded flex items-center justify-center">
                    <Icon name="Gamepad2" size={12} color="white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{game?.name}</div>
                    <div className="text-xs text-muted-foreground">{game?.category}</div>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 text-right text-sm text-foreground">{game?.activePlayers?.toLocaleString()}</td>
              <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-end space-x-1">
                  <span className="text-sm font-medium text-foreground">${game?.revenue?.toLocaleString()}</span>
                  <div className={`flex items-center space-x-1 ${getTrendColor(game?.trend)}`}>
                    <Icon name={getTrendIcon(game?.trend)} size={10} />
                    <span className="text-xs">{game?.change}</span>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 text-right text-sm text-foreground">{game?.rtp}%</td>
              <td className="py-3 px-4 text-right text-sm text-foreground">{game?.sessions?.toLocaleString()}</td>
              <td className="py-3 px-4 text-center">
                <div className={`inline-flex px-2 py-1 rounded-full border text-xs font-medium ${getStatusColor(game?.status)}`}>
                  {game?.status}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className={`data-card ${className}`}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Top Performing Games</h3>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 bg-muted/30 rounded-lg p-1">
              {[
                { key: 'revenue', label: 'Revenue' },
                { key: 'players', label: 'Players' },
                { key: 'rtp', label: 'RTP' }
              ]?.map((sort) => (
                <button
                  key={sort?.key}
                  onClick={() => setSortBy(sort?.key)}
                  className={`px-3 py-1 text-xs font-medium rounded transition-smooth ${
                    sortBy === sort?.key
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {sort?.label}
                </button>
              ))}
            </div>
            
            <div className="flex items-center space-x-1 bg-muted/30 rounded-lg p-1">
              {[
                { key: 'grid', icon: 'Grid3X3' },
                { key: 'table', icon: 'List' }
              ]?.map((view) => (
                <button
                  key={view?.key}
                  onClick={() => setViewMode(view?.key)}
                  className={`p-1 rounded transition-smooth ${
                    viewMode === view?.key
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon name={view?.icon} size={14} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="p-4">
        {viewMode === 'grid' ? renderGridView() : renderTableView()}
      </div>
    </div>
  );
};

export default TopGamesGrid;