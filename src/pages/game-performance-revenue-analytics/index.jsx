import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import GlobalFilterBar from '../../components/ui/GlobalFilterBar';
import AlertNotificationCenter from '../../components/ui/AlertNotificationCenter';
import DataExportController from '../../components/ui/DataExportController';
import PerformanceMetricCards from './components/PerformanceMetricCards';
import GameScatterPlot from './components/GameScatterPlot';
import GameLeaderboard from './components/GameLeaderboard';
import GamePerformanceMatrix from './components/GamePerformanceMatrix';
import GameFilterControls from './components/GameFilterControls';
import { supabase } from '../../utils/supabaseClient';

const GamePerformanceRevenueAnalytics = () => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [globalFilters, setGlobalFilters] = useState({});
  const [gameFilters, setGameFilters] = useState({});
  const [dashboardData, setDashboardData] = useState({ games: [], metrics: {} });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
        const { data, error } = await supabase.functions.invoke('get-game-performance', {
            body: { filters: { ...globalFilters, ...gameFilters } },
        });
        if (error) throw error;
        setDashboardData(data);
    } catch (err) {
        console.error("Failed to fetch game performance data:", err);
        setError("Failed to load game performance data. Please try again.");
    } finally {
        setIsLoading(false);
    }
  }, [globalFilters, gameFilters]);

  useEffect(() => {
    getData();
  }, [getData]);

  const handleGameSelect = (game) => {
    setSelectedGame(game);
  };

  const handleGlobalFiltersChange = (filters) => {
    setGlobalFilters(filters);
  };

  const handleGameFiltersChange = (filters) => {
    setGameFilters(filters);
  };

  // Filter games based on active filters
  const filteredGames = useMemo(() => dashboardData.games.filter(game => {
    if (gameFilters.category && gameFilters.category !== 'all') {
    if (gameFilters.category && gameFilters.category !== 'all') {
      const categoryMap = {
        'slots': 'Slots',
        'table': 'Table Games',
        'live': 'Live Casino',
        'jackpot': 'Jackpot',
        'poker': 'Video Poker'
      };
      if (game.category !== categoryMap[gameFilters.category]) return false;
    }

    if (gameFilters.provider && gameFilters.provider !== 'all') {
      const providerMap = {
        'netent': 'NetEnt',
        'microgaming': 'Microgaming',
        'pragmatic': 'Pragmatic Play',
        'evolution': 'Evolution Gaming',
        'playgo': "Play'n GO",
        'redtiger': 'Red Tiger',
        'blueprint': 'Blueprint Gaming',
        'btg': 'Big Time Gaming'
      };
      if (game.provider !== providerMap[gameFilters.provider]) return false;
    }

    if (gameFilters.volatility && gameFilters.volatility !== 'all') {
    if (gameFilters.volatility && gameFilters.volatility !== 'all') {
      const volatilityMap = {
        'low': 'Low',
        'medium': 'Medium',
        'high': 'High'
      };
      if (game.volatility !== volatilityMap[gameFilters.volatility]) return false;
    }

    if (gameFilters.rtp && gameFilters.rtp !== 'all') {
      switch (gameFilters.rtp) {
        case 'high':
          if (game.rtp < 96) return false;
          break;
        case 'medium':
          if (game.rtp < 94 || game.rtp >= 96) return false;
          break;
        case 'low':
          if (game.rtp >= 94) return false;
          break;
      }
    }

    if (gameFilters.performance && gameFilters.performance !== 'all') {
      switch (gameFilters.performance) {
        case 'top':
          if (game.revenue < 100000) return false;
          break;
        case 'rising':
          if (game.trend <= 5) return false;
          break;
        case 'declining':
          if (game.trend >= -5) return false;
          break;
        case 'underperforming':
          if (game.revenue >= 50000) return false;
          break;
      }
    }

    return true;
  }), [dashboardData.games, gameFilters]);

  useEffect(() => {
    // Auto-select first game if none selected or if selected game is filtered out
    if (filteredGames.length > 0 && (!selectedGame || !filteredGames.find(g => g.id === selectedGame.id))) {
      setSelectedGame(filteredGames[0]);
    } else if (filteredGames.length === 0) {
      setSelectedGame(null);
    }
  }, [filteredGames, selectedGame]);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Game Performance & Revenue Analytics - Gaming Analytics Hub</title>
        <meta name="description" content="Comprehensive game performance analytics with revenue optimization insights and comparative analysis tools." />
      </Helmet>
      <Header />
      <GlobalFilterBar onFiltersChange={handleGlobalFiltersChange} />
      <main className="content-offset">
        <div className="container mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Game Performance & Revenue Analytics
              </h1>
              <p className="text-muted-foreground">
                Analyze individual game metrics, popularity trends, and revenue optimization opportunities
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <AlertNotificationCenter />
              <DataExportController />
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="mb-8">
            <PerformanceMetricCards metrics={dashboardData.metrics} />
          </div>

          {/* Game Filters */}
          <div className="mb-8">
            <GameFilterControls 
              onFiltersChange={handleGameFiltersChange}
              totalGames={filteredGames?.length}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
            {/* Main Chart Area */}
            <div className="lg:col-span-9">
              <GameScatterPlot
                games={filteredGames}
                onGameSelect={handleGameSelect}
                selectedGame={selectedGame}
              />
            </div>

            {/* Sidebar - Game Leaderboard */}
            <div className="lg:col-span-3">
              <GameLeaderboard
                games={filteredGames}
                onGameSelect={handleGameSelect}
                selectedGame={selectedGame}
              />
            </div>
          </div>

          {/* Game Performance Matrix */}
          <div className="mb-8">
            <GamePerformanceMatrix
              games={filteredGames}
              onGameSelect={handleGameSelect}
              selectedGame={selectedGame}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default GamePerformanceRevenueAnalytics;