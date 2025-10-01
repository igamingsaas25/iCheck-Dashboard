import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BusinessScorecard = ({ data }) => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const departments = data || [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'green':
        return 'bg-success text-success-foreground';
      case 'amber':
        return 'bg-warning text-warning-foreground';
      case 'red':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'green':
        return 'CheckCircle';
      case 'amber':
        return 'AlertTriangle';
      case 'red':
        return 'XCircle';
      default:
        return 'Circle';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving':
        return 'TrendingUp';
      case 'declining':
        return 'TrendingDown';
      case 'stable':
        return 'Minus';
      case 'monitoring':
        return 'Eye';
      default:
        return 'Minus';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'improving':
        return 'text-success';
      case 'declining':
        return 'text-destructive';
      case 'stable':
        return 'text-muted-foreground';
      case 'monitoring':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  const filteredDepartments = selectedDepartment === 'all' 
    ? departments 
    : departments.filter(dept => dept.id === selectedDepartment);

  const getOverallStatus = () => {
    if (!departments || departments.length === 0) {
        return { total: 0, green: 0, amber: 0, red: 0, percentage: 0 };
    }
    const allKpis = departments.flatMap(dept => dept.kpis);
    const greenCount = allKpis.filter(kpi => kpi.status === 'green').length;
    const amberCount = allKpis.filter(kpi => kpi.status === 'amber').length;
    const redCount = allKpis.filter(kpi => kpi.status === 'red').length;
    
    return {
      total: allKpis.length,
      green: greenCount,
      amber: amberCount,
      red: redCount,
      percentage: Math.round((greenCount / allKpis.length) * 100)
    };
  };

  const overallStatus = getOverallStatus();

  return (
    <div className="data-card p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-1">
            Business Scorecard
          </h2>
          <p className="text-sm text-muted-foreground">
            Departmental KPI performance overview
          </p>
        </div>
        
        {/* Overall Status */}
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Overall Health</p>
            <p className="text-lg font-bold text-success">{overallStatus?.percentage}%</p>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-xs text-muted-foreground">{overallStatus?.green}</span>
            <div className="w-2 h-2 bg-warning rounded-full ml-2"></div>
            <span className="text-xs text-muted-foreground">{overallStatus?.amber}</span>
            <div className="w-2 h-2 bg-destructive rounded-full ml-2"></div>
            <span className="text-xs text-muted-foreground">{overallStatus?.red}</span>
          </div>
        </div>
      </div>
      {/* Department Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={selectedDepartment === 'all' ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedDepartment('all')}
        >
          All Departments
        </Button>
        {departments?.map((dept) => (
          <Button
            key={dept?.id}
            variant={selectedDepartment === dept?.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedDepartment(dept?.id)}
            iconName={dept?.icon}
            iconPosition="left"
            iconSize={14}
          >
            {dept?.name}
          </Button>
        ))}
      </div>
      {/* Scorecard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDepartments?.map((department) => (
          <div key={department?.id} className="bg-muted/20 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name={department?.icon} size={16} className="text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">
                {department?.name}
              </h3>
            </div>
            
            <div className="space-y-3">
              {department?.kpis?.map((kpi, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-card rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-foreground">
                        {kpi?.name}
                      </span>
                      <Icon 
                        name={getTrendIcon(kpi?.trend)} 
                        size={12} 
                        className={getTrendColor(kpi?.trend)}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">
                        Target: {kpi?.target}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-bold text-foreground">
                      {kpi?.value}
                    </span>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${getStatusColor(kpi?.status)}`}>
                      <Icon name={getStatusIcon(kpi?.status)} size={12} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Summary Insights */}
      <div className="mt-6 pt-6 border-t border-border">
        <h3 className="text-sm font-medium text-foreground mb-3">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-start space-x-3">
            <Icon name="CheckCircle" size={16} className="text-success mt-0.5" />
            <div>
              <p className="text-sm text-foreground font-medium">Strong Performance</p>
              <p className="text-xs text-muted-foreground">
                {overallStatus?.green} out of {overallStatus?.total} KPIs meeting targets
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Icon name="TrendingUp" size={16} className="text-primary mt-0.5" />
            <div>
              <p className="text-sm text-foreground font-medium">Improving Trends</p>
              <p className="text-xs text-muted-foreground">
                Multiple departments showing positive momentum
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Icon name="Eye" size={16} className="text-warning mt-0.5" />
            <div>
              <p className="text-sm text-foreground font-medium">Areas to Monitor</p>
              <p className="text-xs text-muted-foreground">
                Risk exposure requires continued attention
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessScorecard;