import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TransactionFlowChart = ({ className = '' }) => {
  const [timeRange, setTimeRange] = useState('15m');
  const [chartType, setChartType] = useState('combined');
  const [isLive, setIsLive] = useState(true);

  // Mock real-time transaction data
  const [transactionData, setTransactionData] = useState([]);

  const generateMockData = () => {
    const now = new Date();
    const data = [];
    const intervals = timeRange === '15m' ? 15 : timeRange === '1h' ? 60 : 240;
    
    for (let i = intervals; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60000);
      const baseWagers = 1200 + Math.random() * 800;
      const basePayouts = baseWagers * (0.85 + Math.random() * 0.1);
      
      data?.push({
        time: timestamp?.toLocaleTimeString('en-US', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        timestamp: timestamp?.getTime(),
        wagers: Math.round(baseWagers),
        payouts: Math.round(basePayouts),
        netRevenue: Math.round(baseWagers - basePayouts),
        transactions: Math.round(150 + Math.random() * 100)
      });
    }
    return data;
  };

  useEffect(() => {
    setTransactionData(generateMockData());
    
    if (isLive) {
      const interval = setInterval(() => {
        setTransactionData(prev => {
          const newData = [...prev?.slice(1)];
          const lastPoint = prev?.[prev?.length - 1];
          const now = new Date();
          const baseWagers = 1200 + Math.random() * 800;
          const basePayouts = baseWagers * (0.85 + Math.random() * 0.1);
          
          newData?.push({
            time: now?.toLocaleTimeString('en-US', { 
              hour12: false, 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            timestamp: now?.getTime(),
            wagers: Math.round(baseWagers),
            payouts: Math.round(basePayouts),
            netRevenue: Math.round(baseWagers - basePayouts),
            transactions: Math.round(150 + Math.random() * 100)
          });
          
          return newData;
        });
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [timeRange, isLive]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-modal">
          <p className="text-sm font-medium text-popover-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry?.color }}
                />
                <span className="text-sm text-muted-foreground capitalize">{entry?.dataKey}</span>
              </div>
              <span className="text-sm font-medium text-popover-foreground">
                ${entry?.value?.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    if (chartType === 'area') {
      return (
        <AreaChart data={transactionData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis 
            dataKey="time" 
            stroke="var(--color-muted-foreground)"
            fontSize={12}
          />
          <YAxis 
            stroke="var(--color-muted-foreground)"
            fontSize={12}
            tickFormatter={(value) => `$${(value / 1000)?.toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="wagers"
            stackId="1"
            stroke="var(--color-primary)"
            fill="var(--color-primary)"
            fillOpacity={0.3}
          />
          <Area
            type="monotone"
            dataKey="payouts"
            stackId="1"
            stroke="var(--color-secondary)"
            fill="var(--color-secondary)"
            fillOpacity={0.3}
          />
        </AreaChart>
      );
    }

    return (
      <LineChart data={transactionData}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis 
          dataKey="time" 
          stroke="var(--color-muted-foreground)"
          fontSize={12}
        />
        <YAxis 
          stroke="var(--color-muted-foreground)"
          fontSize={12}
          tickFormatter={(value) => `$${(value / 1000)?.toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="wagers"
          stroke="var(--color-primary)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: "var(--color-primary)" }}
        />
        <Line
          type="monotone"
          dataKey="payouts"
          stroke="var(--color-secondary)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: "var(--color-secondary)" }}
        />
        {chartType === 'combined' && (
          <Line
            type="monotone"
            dataKey="netRevenue"
            stroke="var(--color-accent)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "var(--color-accent)" }}
          />
        )}
      </LineChart>
    );
  };

  return (
    <div className={`data-card ${className}`}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-foreground">Real-Time Transaction Flow</h3>
            <div className={`flex items-center space-x-1 ${isLive ? 'text-success' : 'text-muted-foreground'}`}>
              <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-success animate-pulse' : 'bg-muted-foreground'}`} />
              <span className="text-xs font-medium">{isLive ? 'LIVE' : 'PAUSED'}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-muted/30 rounded-lg p-1">
              {['15m', '1h', '4h']?.map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 text-xs font-medium rounded transition-smooth ${
                    timeRange === range
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            
            <div className="flex items-center space-x-1 bg-muted/30 rounded-lg p-1">
              {[
                { key: 'combined', icon: 'TrendingUp' },
                { key: 'area', icon: 'AreaChart' }
              ]?.map((type) => (
                <button
                  key={type?.key}
                  onClick={() => setChartType(type?.key)}
                  className={`p-1 rounded transition-smooth ${
                    chartType === type?.key
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon name={type?.icon} size={14} />
                </button>
              ))}
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsLive(!isLive)}
              iconName={isLive ? 'Pause' : 'Play'}
              iconSize={16}
            />
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
        
        <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">Wagers</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-secondary" />
            <span className="text-sm text-muted-foreground">Payouts</span>
          </div>
          {chartType === 'combined' && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-accent" />
              <span className="text-sm text-muted-foreground">Net Revenue</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionFlowChart;