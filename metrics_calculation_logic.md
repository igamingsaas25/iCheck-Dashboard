# iGaming Dashboard: Metrics Calculation Logic

This document provides the technical specification for calculating every metric displayed on the iGaming dashboards. It maps the visual components of the UI to the underlying data sources defined in `table_schemas.sql` and specifies the transformation logic.

---

## 1. Real-Time Operations Command Center

**Source of Data:** The `live_minute_summary` table, which is populated every minute by a job that processes the last minute of raw event data.

| Metric | Formula / Description | SQL Logic (to populate the summary table) |
|---|---|---|
| **Active Players** | Count of unique players who placed a bet in the last minute. | `SELECT COUNT(DISTINCT player_id) FROM game_rounds WHERE round_timestamp >= NOW() - INTERVAL '1 minute'` |
| **Transactions/Min** | Count of all deposits and wagers in the last minute. | `SELECT COUNT(t1.id) + COUNT(t2.id) FROM financial_transactions t1, game_rounds t2 WHERE ...` |
| **Revenue Rate** | Gross Gaming Revenue (GGR) in the last minute. | `SELECT SUM(bet_amount - win_amount) FROM game_rounds WHERE ...` |
| **System Uptime** | Assumes an external monitoring source provides this. To be stored directly. | N/A (External Source) |
| **Active Alerts** | Count of unacknowledged critical/high severity alerts. | `SELECT COUNT(*) FROM system_alerts WHERE is_acknowledged = FALSE AND severity IN ('critical', 'high')` |
| **Conversion Rate** | (New Registrations with First Deposit / New Registrations) in the last minute. | A more complex query joining `players` and `financial_transactions`. |
| **Top Games Grid** | Ranks games by GGR over the last hour. | `SELECT game_id, SUM(bet_amount - win_amount) as ggr FROM game_rounds WHERE round_timestamp >= NOW() - INTERVAL '1 hour' GROUP BY game_id ORDER BY ggr DESC LIMIT 10` |
| **Alert Feed** | Direct query of recent alerts. | `SELECT * FROM system_alerts ORDER BY created_at DESC LIMIT 20` |

---

## 2. Executive Summary & Strategic Insights

**Source of Data:** `daily_kpi_summary`, `monthly_kpi_summary`, and other daily summary tables.

| Metric | Formula / Description | SQL Logic (to populate daily/monthly summary tables) |
|---|---|---|
| **Total Revenue** | Gross Gaming Revenue (GGR) for the period. | `SELECT SUM(bet_amount - win_amount) FROM game_rounds WHERE DATE(round_timestamp) = '{{date}}'` |
| **Player Growth Rate**| % change in New Registrations vs previous period. | `(Today's New Players / Yesterday's New Players) - 1` |
| **Market Share** | Assumes external data on total market size is available. | `(Our Revenue / Total Market Revenue) * 100` |
| **Op. Efficiency** | A composite score. Example: `(1 - (Operational Costs / Total Revenue)) * 100`. Requires cost data. | N/A (Requires external data) |
| **Player Acq. Cost** | Marketing spend / New Player Registrations. | Requires marketing cost data. |
| **Profit Margin** | (GGR - Costs) / GGR. | Requires operational and marketing cost data. |
| **Business Scorecard**| Values are derived from various sources (e.g., `daily_kpi_summary.total_revenue` for Finance KPI) or external systems (e.g., `System Uptime` from monitoring). | N/A (Composite metric) |
| **Predictive Analytics**| Based on historical data from `monthly_kpi_summary`. | `SELECT summary_month, total_revenue FROM monthly_kpi_summary` is used as input to a forecasting model. Results are stored in `monthly_forecasts`. |

---

## 3. Financial Performance & Risk Management

**Source of Data:** `daily_kpi_summary`, `daily_payment_method_summary`, `system_alerts`.

| Metric | Formula / Description | SQL Logic (to populate daily summary tables) |
|---|---|---|
| **NGR** | GGR - Bonuses - Taxes/Fees. | Requires bonus and tax data. |
| **ARPU** | Total Revenue / Daily Active Players. | `daily_kpi_summary.total_revenue / daily_kpi_summary.daily_active_players` |
| **Revenue by Stream**| GGR grouped by game category. | `SELECT g.category, SUM(gr.bet_amount - gr.win_amount) FROM game_rounds gr JOIN games g ON gr.game_id = g.game_id WHERE DATE(gr.round_timestamp) = '{{date}}' GROUP BY g.category` |
| **Payment Method Volume** | Total value of successful deposits per payment method. | `SELECT payment_method, SUM(amount) FROM financial_transactions WHERE transaction_type = 'deposit' AND status = 'success' AND DATE(created_at) = '{{date}}' GROUP BY payment_method` |
| **Overall Risk Score**| A weighted average of multiple risk factors. | Example: `(Fraud Alert Score * 0.4) + (High-Risk Payment % * 0.3) + (Unusual Betting Score * 0.3)` |

---

## 4. Game Performance & Revenue Analytics

**Source of Data:** `daily_game_summary`.

| Metric | Formula / Description | SQL Logic (to populate `daily_game_summary`) |
|---|---|---|
| **Revenue (per game)**| GGR for a specific game for the day. | `SELECT game_id, SUM(bet_amount - win_amount) FROM game_rounds WHERE DATE(round_timestamp) = '{{date}}' GROUP BY game_id` |
| **Avg Session (per game)** | Average session duration for players of a specific game. | `SELECT game_id, AVG(duration_seconds) FROM player_sessions WHERE player_id IN (SELECT DISTINCT player_id FROM game_rounds WHERE game_id = '{{game_id}}') ...` |
| **Retention (per game)**| % of players who played a game yesterday and also today. | A query comparing player lists from two consecutive days for a specific game. |
| **Volatility** | A game-specific attribute provided by the game provider. | Stored directly in the `games` dimension table. |

---

## 5. Player Analytics & Behavior

**Source of Data:** `daily_kpi_summary`, `daily_player_demographics_summary`, and direct queries on raw tables.

| Metric | Formula / Description | SQL Logic |
|---|---|---|
| **Customer LTV** | Average GGR per player over their entire lifetime. | `(SELECT SUM(bet_amount - win_amount) FROM game_rounds) / (SELECT COUNT(DISTINCT player_id) FROM players)` |
| **Funnel: Registration**| Total players registered. | `SELECT COUNT(DISTINCT player_id) FROM players` |
| **Funnel: First Deposit**| Count of players with at least one deposit. | `SELECT COUNT(DISTINCT player_id) FROM financial_transactions WHERE transaction_type = 'deposit'` |
| **Cohort Retention** | % of players from a registration week who are still active in subsequent weeks. | A window function query grouping `players` by `registration_timestamp` and joining with `player_sessions` to check for activity in later weeks. |
| **Engagement Matrix** | Player preference for game types by age group. | `SELECT p.age_group, g.category, COUNT(DISTINCT gr.player_id) FROM game_rounds gr JOIN players p ON gr.player_id = p.player_id JOIN games g ON gr.game_id = g.game_id GROUP BY p.age_group, g.category` |
| **Player Distribution**| Count of players grouped by country. | `SELECT country_code, COUNT(player_id) FROM players GROUP BY country_code` |