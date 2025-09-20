import React, { useState, useEffect } from 'react';
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

const GamePerformanceRevenueAnalytics = () => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [globalFilters, setGlobalFilters] = useState({});
  const [gameFilters, setGameFilters] = useState({});

  // Mock data for games
  const mockGames = [
    {
      id: 1,
      name: "Starburst",
      provider: "NetEnt",
      category: "Slots",
      volatility: "Low",
      revenue: 125000,
      rtp: 96.1,
      sessions: 15420,
      avgSession: 420,
      betFreq: 45,
      bonusRate: 12.5,
      retention: 78.2,
      trend: 8.5
    },
    {
      id: 2,
      name: "Mega Moolah",
      provider: "Microgaming",
      category: "Jackpot",
      volatility: "High",
      revenue: 98000,
      rtp: 88.1,
      sessions: 8920,
      avgSession: 680,
      betFreq: 32,
      bonusRate: 8.2,
      retention: 65.4,
      trend: -3.2
    },
    {
      id: 3,
      name: "Book of Dead",
      provider: "Play\'n GO",
      category: "Slots",
      volatility: "High",
      revenue: 87500,
      rtp: 94.2,
      sessions: 12340,
      avgSession: 380,
      betFreq: 52,
      bonusRate: 15.8,
      retention: 72.1,
      trend: 12.3
    },
    {
      id: 4,
      name: "Lightning Roulette",
      provider: "Evolution Gaming",
      category: "Live Casino",
      volatility: "Medium",
      revenue: 156000,
      rtp: 97.3,
      sessions: 6780,
      avgSession: 920,
      betFreq: 28,
      bonusRate: 22.1,
      retention: 85.6,
      trend: 15.7
    },
    {
      id: 5,
      name: "Sweet Bonanza",
      provider: "Pragmatic Play",
      category: "Slots",
      volatility: "High",
      revenue: 112000,
      rtp: 96.5,
      sessions: 18650,
      avgSession: 340,
      betFreq: 58,
      bonusRate: 18.4,
      retention: 69.8,
      trend: 6.9
    },
    {
      id: 6,
      name: "Blackjack Classic",
      provider: "NetEnt",
      category: "Table Games",
      volatility: "Low",
      revenue: 78000,
      rtp: 99.4,
      sessions: 4560,
      avgSession: 1200,
      betFreq: 25,
      bonusRate: 5.2,
      retention: 88.9,
      trend: -1.8
    },
    {
      id: 7,
      name: "Gonzo\'s Quest",
      provider: "NetEnt",
      category: "Slots",
      volatility: "Medium",
      revenue: 95000,
      rtp: 95.9,
      sessions: 11200,
      avgSession: 450,
      betFreq: 42,
      bonusRate: 14.2,
      retention: 74.5,
      trend: 4.1
    },
    {
      id: 8,
      name: "Crazy Time",
      provider: "Evolution Gaming",
      category: "Live Casino",
      volatility: "High",
      revenue: 189000,
      rtp: 96.1,
      sessions: 9870,
      avgSession: 780,
      betFreq: 35,
      bonusRate: 28.6,
      retention: 82.3,
      trend: 22.4
    },
    {
      id: 9,
      name: "Reactoonz",
      provider: "Play\'n GO",
      category: "Slots",
      volatility: "High",
      revenue: 67000,
      rtp: 96.5,
      sessions: 7890,
      avgSession: 290,
      betFreq: 48,
      bonusRate: 16.7,
      retention: 63.2,
      trend: -8.5
    },
    {
      id: 10,
      name: "Baccarat Squeeze",
      provider: "Evolution Gaming",
      category: "Live Casino",
      volatility: "Low",
      revenue: 134000,
      rtp: 98.9,
      sessions: 3450,
      avgSession: 1450,
      betFreq: 22,
      bonusRate: 12.8,
      retention: 91.2,
      trend: 7.8
    },
    {
      id: 11,
      name: "Gates of Olympus",
      provider: "Pragmatic Play",
      category: "Slots",
      volatility: "High",
      revenue: 143000,
      rtp: 96.5,
      sessions: 16780,
      avgSession: 410,
      betFreq: 55,
      bonusRate: 19.3,
      retention: 71.4,
      trend: 18.9
    },
    {
      id: 12,
      name: "Jacks or Better",
      provider: "NetEnt",
      category: "Video Poker",
      volatility: "Low",
      revenue: 45000,
      rtp: 99.5,
      sessions: 2340,
      avgSession: 890,
      betFreq: 38,
      bonusRate: 8.9,
      retention: 86.7,
      trend: -2.1
    },
    {
      id: 13,
      name: "Big Bass Bonanza",
      provider: "Pragmatic Play",
      category: "Slots",
      volatility: "High",
      revenue: 98500,
      rtp: 96.7,
      sessions: 13450,
      avgSession: 360,
      betFreq: 51,
      bonusRate: 17.8,
      retention: 68.9,
      trend: 11.2
    },
    {
      id: 14,
      name: "Dream Catcher",
      provider: "Evolution Gaming",
      category: "Live Casino",
      volatility: "Medium",
      revenue: 76000,
      rtp: 96.6,
      sessions: 5670,
      avgSession: 520,
      betFreq: 30,
      bonusRate: 15.4,
      retention: 79.1,
      trend: 3.7
    },
    {
      id: 15,
      name: "Bonanza",
      provider: "Big Time Gaming",
      category: "Slots",
      volatility: "High",
      revenue: 89000,
      rtp: 96.0,
      sessions: 10230,
      avgSession: 395,
      betFreq: 47,
      bonusRate: 16.2,
      retention: 70.8,
      trend: 5.4
    }
  ];

  // Mock performance metrics
  const mockMetrics = {
    totalGames: mockGames?.length,
    totalGamesTrend: 8.2,
    avgRtp: mockGames?.reduce((sum, game) => sum + game?.rtp, 0) / mockGames?.length,
    avgRtpTrend: 2.1,
    peakPlayers: Math.max(...mockGames?.map(game => game?.sessions)),
    peakPlayersTrend: 15.3,
    revenuePerGame: mockGames?.reduce((sum, game) => sum + game?.revenue, 0) / mockGames?.length,
    revenuePerGameTrend: 12.7
  };

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
  const filteredGames = mockGames?.filter(game => {
    // Apply game-specific filters
    if (gameFilters?.category && gameFilters?.category !== 'all') {
      const categoryMap = {
        'slots': 'Slots',
        'table': 'Table Games',
        'live': 'Live Casino',
        'jackpot': 'Jackpot',
        'poker': 'Video Poker'
      };
      if (game?.category !== categoryMap?.[gameFilters?.category]) return false;
    }

    if (gameFilters?.provider && gameFilters?.provider !== 'all') {
      const providerMap = {
        'netent': 'NetEnt',
        'microgaming': 'Microgaming',
        'pragmatic': 'Pragmatic Play',
        'evolution': 'Evolution Gaming',
        'playgo': 'Play\'n GO',
        'redtiger': 'Red Tiger',
        'blueprint': 'Blueprint Gaming',
        'btg': 'Big Time Gaming'
      };
      if (game?.provider !== providerMap?.[gameFilters?.provider]) return false;
    }

    if (gameFilters?.volatility && gameFilters?.volatility !== 'all') {
      const volatilityMap = {
        'low': 'Low',
        'medium': 'Medium',
        'high': 'High'
      };
      if (game?.volatility !== volatilityMap?.[gameFilters?.volatility]) return false;
    }

    if (gameFilters?.rtp && gameFilters?.rtp !== 'all') {
      switch (gameFilters?.rtp) {
        case 'high':
          if (game?.rtp < 96) return false;
          break;
        case 'medium':
          if (game?.rtp < 94 || game?.rtp >= 96) return false;
          break;
        case 'low':
          if (game?.rtp >= 94) return false;
          break;
      }
    }

    if (gameFilters?.performance && gameFilters?.performance !== 'all') {
      switch (gameFilters?.performance) {
        case 'top':
          if (game?.revenue < 100000) return false;
          break;
        case 'rising':
          if (game?.trend <= 5) return false;
          break;
        case 'declining':
          if (game?.trend >= -5) return false;
          break;
        case 'underperforming':
          if (game?.revenue >= 50000) return false;
          break;
      }
    }

    return true;
  });

  useEffect(() => {
    // Auto-select first game if none selected
    if (filteredGames?.length > 0 && !selectedGame) {
      setSelectedGame(filteredGames?.[0]);
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
            <PerformanceMetricCards metrics={mockMetrics} />
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