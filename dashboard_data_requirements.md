# Data Requirements for iGaming Dashboard UI

This document outlines the complete list of data points required to populate the existing user interface for the iGaming dashboards. The requirements are broken down by dashboard page and the specific component that uses the data.

---

## 1. Real-Time Operations Command Center

This dashboard requires a constant stream of data, updated every few seconds or minutes.

### 1.1. KPI Cards (`KPICard.jsx`)
For the main KPI cards at the top, we need the following data points, including their current value, a percentage change from a previous period, and a recent history for the sparkline charts.

-   **Active Players**:
    -   `current_value` (e.g., 12,847)
    -   `change_percentage` (e.g., "+8.2%")
    -   `sparkline_data` (array of recent values, e.g., `[12200, 12350, 12500, 12680, 12847]`)
-   **Transactions per Minute**:
    -   `current_value` (e.g., 1,234)
    -   `change_percentage` (e.g., "+12.5%")
    -   `sparkline_data` (array of recent values)
-   **Revenue Rate**:
    -   `current_value` (e.g., 45200, formatted as "$45.2K")
    -   `change_percentage` (e.g., "+5.7%")
    -   `sparkline_data` (array of recent values)
-   **System Uptime**:
    -   `current_value` (e.g., "99.97%")
    -   `change_percentage` (e.g., "+0.02%")
    -   `sparkline_data` (array of recent values)
-   **Active Alerts**:
    -   `current_value` (e.g., 7)
    -   `change_value` (e.g., "+2")
    -   `sparkline_data` (array of recent values)
-   **Conversion Rate**:
    -   `current_value` (e.g., "3.42%")
    -   `change_percentage` (e.g., "-0.15%")
    -   `sparkline_data` (array of recent values)

### 1.2. Transaction Flow Chart (`TransactionFlowChart.jsx`)
This component requires a time-series dataset, with data points for each minute over a selectable range (15m, 1h, 4h).
-   **Data Structure**: An array of objects.
-   **Each Object Needs**:
    -   `timestamp` (e.g., "14:35")
    -   `wagers` (total bet amount in that minute)
    -   `payouts` (total win amount in that minute)
    -   `netRevenue` (wagers - payouts)
    -   `transactions` (count of transactions in that minute)

### 1.3. Top Performing Games (`TopGamesGrid.jsx`)
This component requires a list of the top games, updated in near real-time.
-   **Data Structure**: An array of game objects.
-   **Each Game Object Needs**:
    -   `id` (unique game identifier)
    -   `name` (e.g., "Mega Fortune Slots")
    -   `category` (e.g., "Slots")
    -   `activePlayers` (current number of players in the game)
    -   `revenue` (GGR for a recent period)
    -   `rtp` (Return to Player percentage)
    -   `sessions` (count of active game sessions)
    -   `avgBet` (average bet amount)
    -   `status` (e.g., "healthy", "warning", "critical")
    -   `trend` (e.g., "up", "down", "stable")
    -   `change` (percentage change for revenue, e.g., "+12.5%")

### 1.4. Live Alerts (`AlertFeed.jsx`)
This component requires a stream of alert events.
-   **Data Structure**: An array of alert objects.
-   **Each Alert Object Needs**:
    -   `id` (unique alert identifier)
    -   `type` (e.g., "critical", "warning", "info")
    -   `title` (e.g., "High Server Load")
    -   `message` (detailed description)
    -   `timestamp`
    -   `source` (e.g., "System Monitor", "Risk Management")
    -   `acknowledged` (boolean)
    -   `actions` (array of strings for buttons, e.g., ["Investigate", "Acknowledge"])

---

## 2. Executive Summary & Strategic Insights

This dashboard requires data aggregated over longer periods (daily, weekly, quarterly, annually).

### 2.1. Business Health Indicators (`BusinessHealthIndicators.jsx`)
This component requires four key metrics, each with a value and a percentage change from a previous period.
-   `totalRevenue` (e.g., "$47.2M", "+12.3%")
-   `playerGrowthRate` (e.g., "18.7%", "+3.2%")
-   `marketShare` (e.g., "23.4%", "+1.8%")
-   `operationalEfficiency` (e.g., "94.2%", "-0.5%")

### 2.2. Strategic Performance Chart (`StrategicPerformanceChart.jsx`)
This component needs time-series data aggregated by quarter and by year.
-   **Data Structure**: An array of objects for each time period (quarterly, annual).
-   **Each Object Needs**:
    -   `period` (e.g., "Q1 2024" or "2023")
    -   `revenue`
    -   `playerAcquisitionCost`
    -   `profitMargin`
    -   `marketShare`

### 2.3. Market Positioning Metrics (`MarketPositioningMetrics.jsx`)
**Note:** I was unable to read this file due to a persistent tool error. Based on the component's name and its location on the page, it likely requires data comparing your performance against key competitors or across different market regions. A potential data structure would be a list of competitors, each with metrics for market share, growth, and player sentiment.

### 2.4. Business Scorecard (`BusinessScorecard.jsx`)
This component requires a hierarchical data structure organized by department.
-   **Data Structure**: A list of department objects.
-   **Each Department Object Needs**:
    -   `id` (e.g., "finance")
    -   `name` (e.g., "Finance")
    -   `kpis`: An array of KPI objects.
-   **Each KPI Object Needs**:
    -   `name` (e.g., "Revenue Growth")
    -   `value` (e.g., "12.3%")
    -   `target` (e.g., "10%")
    -   `status` (e.g., "green", "amber", "red")
    -   `trend` (e.g., "improving", "stable", "declining")

### 2.5. Predictive Analytics (`PredictiveAnalyticsOverlay.jsx`)
This component requires both historical and forecasted data.
-   **Data Structure**: An array of time-series data points.
-   **Each Data Point Needs**:
    -   `period` (e.g., "Jan 2024")
    -   `revenue`
    -   `players`
    -   `marketShare`
    -   `forecast` (a boolean flag: `false` for historical, `true` for predicted values)