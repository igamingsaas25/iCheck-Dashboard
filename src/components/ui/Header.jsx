import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const primaryNavItems = [
    {
      label: 'Live Operations',
      path: '/real-time-operations-command-center',
      icon: 'Activity',
      description: 'Real-time monitoring hub'
    },
    {
      label: 'Strategic Insights',
      path: '/executive-summary-strategic-insights-dashboard',
      icon: 'TrendingUp',
      description: 'Executive performance analysis'
    },
    {
      label: 'Player Intelligence',
      path: '/player-analytics-behavior-dashboard',
      icon: 'Users',
      description: 'Player behavior analytics'
    },
    {
      label: 'Game Analytics',
      path: '/game-performance-revenue-analytics',
      icon: 'Gamepad2',
      description: 'Game performance metrics'
    }
  ];

  const secondaryNavItems = [
    {
      label: 'Financial Control',
      path: '/financial-performance-risk-management-dashboard',
      icon: 'DollarSign',
      description: 'Revenue and risk management'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMoreMenuOpen(false);
  };

  const isActiveTab = (path) => {
    return location?.pathname === path;
  };

  const Logo = () => (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
          <Icon name="BarChart3" size={20} color="white" />
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse"></div>
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-semibold text-foreground tracking-tight">
          Gaming Analytics
        </span>
        <span className="text-xs text-muted-foreground font-medium">
          Hub
        </span>
      </div>
    </div>
  );

  return (
    <header className="nav-fixed nav-height bg-background/95 backdrop-blur-sm border-b border-border z-100">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {primaryNavItems?.map((item) => (
            <button
              key={item?.path}
              onClick={() => handleNavigation(item?.path)}
              className={`
                relative px-4 py-2 rounded-lg text-sm font-medium transition-smooth
                flex items-center space-x-2 group
                ${isActiveTab(item?.path)
                  ? 'bg-primary/10 text-primary border border-primary/20' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }
              `}
              title={item?.description}
            >
              <Icon 
                name={item?.icon} 
                size={16} 
                className={isActiveTab(item?.path) ? 'text-primary' : 'text-current'} 
              />
              <span>{item?.label}</span>
              {isActiveTab(item?.path) && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
              )}
            </button>
          ))}

          {/* More Menu */}
          <div className="relative">
            <button
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-smooth
                flex items-center space-x-2
                ${isMoreMenuOpen || secondaryNavItems?.some(item => isActiveTab(item?.path))
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }
              `}
            >
              <Icon name="MoreHorizontal" size={16} />
              <span>More</span>
              <Icon 
                name="ChevronDown" 
                size={14} 
                className={`transition-transform ${isMoreMenuOpen ? 'rotate-180' : ''}`} 
              />
            </button>

            {isMoreMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-popover border border-border rounded-lg shadow-modal z-50 animate-fade-in">
                <div className="p-2">
                  {secondaryNavItems?.map((item) => (
                    <button
                      key={item?.path}
                      onClick={() => handleNavigation(item?.path)}
                      className={`
                        w-full px-3 py-2 rounded-md text-sm transition-smooth
                        flex items-center space-x-3 text-left
                        ${isActiveTab(item?.path)
                          ? 'bg-primary/10 text-primary' :'text-popover-foreground hover:bg-muted/50'
                        }
                      `}
                    >
                      <Icon 
                        name={item?.icon} 
                        size={16} 
                        className={isActiveTab(item?.path) ? 'text-primary' : 'text-muted-foreground'} 
                      />
                      <div className="flex-1">
                        <div className="font-medium">{item?.label}</div>
                        <div className="text-xs text-muted-foreground">{item?.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
            iconName="Menu"
            iconSize={20}
          >
            <span className="sr-only">Open navigation menu</span>
          </Button>

          {isMoreMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-background border-b border-border shadow-modal z-50 animate-slide-in">
              <div className="p-4 space-y-2">
                {[...primaryNavItems, ...secondaryNavItems]?.map((item) => (
                  <button
                    key={item?.path}
                    onClick={() => handleNavigation(item?.path)}
                    className={`
                      w-full px-4 py-3 rounded-lg text-sm font-medium transition-smooth
                      flex items-center space-x-3 text-left
                      ${isActiveTab(item?.path)
                        ? 'bg-primary/10 text-primary border border-primary/20' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }
                    `}
                  >
                    <Icon 
                      name={item?.icon} 
                      size={18} 
                      className={isActiveTab(item?.path) ? 'text-primary' : 'text-current'} 
                    />
                    <div className="flex-1">
                      <div className="font-medium">{item?.label}</div>
                      <div className="text-xs text-muted-foreground">{item?.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side Actions */}
        <div className="hidden lg:flex items-center space-x-3">
          {/* Alert Notification Center */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              iconName="Bell"
              iconSize={18}
              className="relative"
            >
              <span className="sr-only">Notifications</span>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full animate-pulse-critical"></div>
            </Button>
          </div>

          {/* User Menu */}
          <Button
            variant="ghost"
            size="icon"
            iconName="User"
            iconSize={18}
          >
            <span className="sr-only">User menu</span>
          </Button>
        </div>
      </div>
      {/* Click outside to close menu */}
      {isMoreMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsMoreMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;