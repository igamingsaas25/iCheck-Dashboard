import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const GamePerformanceMatrix = ({ games, onGameSelect, selectedGame }) => {
  const [sortBy, setSortBy] = useState('revenue');
  const [sortOrder, setSortOrder] = useState('desc');

  const sortedGames = [...games]?.sort((a, b) => {
    const aValue = a?.[sortBy];
    const bValue = b?.[sortBy];
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const formatValue = (value, type) => {
    switch (type) {
      case 'currency':
        return `$${value?.toLocaleString()}`;
      case 'percentage':
        return `${value?.toFixed(1)}%`;
      case 'time':
        return `${Math.floor(value / 60)}:${(value % 60)?.toString()?.padStart(2, '0')}`;
      case 'number':
        return value?.toLocaleString();
      default:
        return value;
    }
  };

  const getPerformanceColor = (value, metric) => {
    switch (metric) {
      case 'rtp':
        if (value >= 96) return 'text-success';
        if (value >= 94) return 'text-warning';
        return 'text-error';
      case 'retention':
        if (value >= 70) return 'text-success';
        if (value >= 50) return 'text-warning';
        return 'text-error';
      case 'revenue':
        if (value >= 50000) return 'text-success';
        if (value >= 25000) return 'text-warning';
        return 'text-error';
      default:
        return 'text-foreground';
    }
  };

  const columns = [
    { key: 'name', label: 'Game Title', type: 'text', width: 'w-48' },
    { key: 'provider', label: 'Provider', type: 'text', width: 'w-32' },
    { key: 'revenue', label: 'Revenue', type: 'currency', width: 'w-28' },
    { key: 'rtp', label: 'RTP', type: 'percentage', width: 'w-20' },
    { key: 'sessions', label: 'Sessions', type: 'number', width: 'w-24' },
    { key: 'avgSession', label: 'Avg Session', type: 'time', width: 'w-28' },
    { key: 'betFreq', label: 'Bet Freq/Min', type: 'number', width: 'w-28' },
    { key: 'bonusRate', label: 'Bonus Rate', type: 'percentage', width: 'w-28' },
    { key: 'retention', label: 'Retention', type: 'percentage', width: 'w-24' }
  ];

  return (
    <div className="bg-card rounded-lg border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">Game Performance Matrix</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Comprehensive performance metrics for all active games
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {sortedGames?.length} games
            </span>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              {columns?.map((column) => (
                <th
                  key={column?.key}
                  className={`${column?.width} px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors`}
                  onClick={() => handleSort(column?.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column?.label}</span>
                    {sortBy === column?.key && (
                      <Icon
                        name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'}
                        size={14}
                        className="text-primary"
                      />
                    )}
                  </div>
                </th>
              ))}
              <th className="w-20 px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedGames?.map((game, index) => (
              <tr
                key={game?.id}
                className={`hover:bg-muted/30 transition-colors cursor-pointer ${
                  selectedGame?.id === game?.id ? 'bg-primary/10 border-l-4 border-l-primary' : ''
                }`}
                onClick={() => onGameSelect(game)}
              >
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${getPerformanceColor(game?.revenue, 'revenue')}`}></div>
                    <div>
                      <div className="text-sm font-medium text-card-foreground">{game?.name}</div>
                      <div className="text-xs text-muted-foreground">{game?.category}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-card-foreground">{game?.provider}</span>
                </td>
                <td className="px-4 py-4">
                  <span className={`text-sm font-medium ${getPerformanceColor(game?.revenue, 'revenue')}`}>
                    {formatValue(game?.revenue, 'currency')}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={`text-sm ${getPerformanceColor(game?.rtp, 'rtp')}`}>
                    {formatValue(game?.rtp, 'percentage')}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-card-foreground">
                    {formatValue(game?.sessions, 'number')}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-card-foreground">
                    {formatValue(game?.avgSession, 'time')}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-card-foreground">
                    {formatValue(game?.betFreq, 'number')}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-card-foreground">
                    {formatValue(game?.bonusRate, 'percentage')}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={`text-sm ${getPerformanceColor(game?.retention, 'retention')}`}>
                    {formatValue(game?.retention, 'percentage')}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-1">
                    <button
                      className="p-1 text-muted-foreground hover:text-primary transition-colors"
                      title="View Details"
                    >
                      <Icon name="Eye" size={14} />
                    </button>
                    <button
                      className="p-1 text-muted-foreground hover:text-primary transition-colors"
                      title="Compare"
                    >
                      <Icon name="BarChart3" size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sortedGames?.length === 0 && (
        <div className="p-12 text-center">
          <Icon name="Gamepad2" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-card-foreground mb-2">No Games Found</h3>
          <p className="text-muted-foreground">
            No games match the current filter criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default GamePerformanceMatrix;