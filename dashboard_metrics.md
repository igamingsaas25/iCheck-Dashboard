# Comprehensive Metrics for iGaming Operator Dashboard

This document outlines the key metrics required for the iGaming operator dashboard. For each metric, it provides a description, the calculation logic, and specifies the source tables and columns from the `table_schemas.sql` file.

---

## 1. Live Operations Feed

These metrics provide a near-real-time snapshot of platform activity, designed to be updated every 5 minutes.

| Metric | Description | Source Table & Calculation |
|---|---|---|
| **Active Players (5 min)** | The number of unique players who have placed a bet in the last 5 minutes. | **Source:** `live_kpi_feed.active_players_last_5_min` <br> **Logic:** `COUNT(DISTINCT player_id) FROM game_rounds WHERE created_at >= NOW() - INTERVAL '5 minutes'` |
| **Transaction Rate (per min)** | The average number of transactions (deposits + wagers) processed per minute over the last 5-minute window. | **Source:** `live_kpi_feed.transactions_per_min` <br> **Logic:** `(COUNT(deposits) + COUNT(wagers)) / 5` |
| **Revenue Rate (per min)** | The average Gross Gaming Revenue (GGR) generated per minute over the last 5-minute window. | **Source:** `live_kpi_feed.revenue_rate_per_min` <br> **Logic:** `SUM(bet_amount - win_amount) / 5` |
| **New Registrations** | The number of new players who have registered in the last 5 minutes. | **Source:** `live_kpi_feed.new_registrations_count` <br> **Logic:** `COUNT(player_id) FROM players WHERE registration_timestamp >= NOW() - INTERVAL '5 minutes'` |
| **Deposit Status (5 min)** | A count of successful versus failed deposit attempts in the last 5 minutes. | **Source:** `live_kpi_feed.successful_deposits_count`, `live_kpi_feed.failed_deposits_count` <br> **Logic:** `COUNT(*) FROM financial_transactions WHERE action_type = 'deposit' AND created_at >= NOW() - INTERVAL '5 minutes' GROUP BY status` |

---

## 2. Executive Summary & Strategic Insights

High-level performance indicators, typically viewed on a daily, weekly, or monthly basis.

| Metric | Description | Source Table & Calculation |
|---|---|---|
| **Daily Active Players (DAP)** | The number of unique players who placed at least one bet on a given day. | **Source:** `daily_kpi_summary.daily_active_players` <br> **Logic:** `COUNT(DISTINCT player_id) FROM game_rounds WHERE created_at::date = 'YYYY-MM-DD'` |
| **New Player Registrations** | The total number of new users who registered on a given day. | **Source:** `daily_kpi_summary.newly_registered_players` <br> **Logic:** `COUNT(player_id) FROM players WHERE registration_timestamp::date = 'YYYY-MM-DD'` |
| **Gross Gaming Revenue (GGR)** | The total amount wagered minus the total amount won. This is the core measure of gaming profitability. | **Source:** `daily_kpi_summary.gross_gaming_revenue` <br> **Logic:** `SUM(bet_amount) - SUM(win_amount)` |
| **Total Deposits** | The total value of all successful deposits on a given day. | **Source:** `daily_kpi_summary.total_deposits` <br> **Logic:** `SUM(amount) FROM financial_transactions WHERE action_type = 'deposit' AND status = 'success'` |
| **First-Time Depositors (FTD)** | The number of players making their very first deposit on a given day. | **Source:** `financial_transactions` table. <br> **Logic:** `COUNT(DISTINCT player_id) WHERE player_id NOT IN (SELECT player_id FROM financial_transactions WHERE created_at < 'YYYY-MM-DD')` |
| **Average Revenue Per User (ARPU)** | The average GGR generated per active player over a period. | **Source:** `daily_kpi_summary` <br> **Logic:** `gross_gaming_revenue / daily_active_players` |

---

## 3. Player Analytics and Behavior

Metrics focused on understanding player engagement, loyalty, and value.

| Metric | Description | Source Table & Calculation |
|---|---|---|
| **Player Lifetime Value (LTV)** | The total GGR a player has generated since they registered. | **Source:** `daily_player_summary` (aggregated over time) <br> **Logic:** `SUM(total_bet_amount - total_win_amount) GROUP BY player_id` |
| **Average Session Duration** | The average length of a player's session. | **Source:** `daily_player_summary.total_session_duration_seconds`, `daily_player_summary.session_count` <br> **Logic:** `AVG(session_duration_seconds) FROM player_sessions` |
| **Average Bet Size** | The average value of a single wager for a player. | **Source:** `daily_player_summary` <br> **Logic:** `AVG(bet_amount) FROM game_rounds` |
| **Player Retention Rate** | The percentage of players who were active in a previous period and are still active in the current period. | **Source:** `daily_player_summary` <br> **Logic:** `(COUNT(Active This Month) / COUNT(Active Last Month)) * 100` |

---

## 4. Game Performance

Metrics to evaluate the popularity and profitability of games and providers.

| Metric | Description | Source Table & Calculation |
|---|---|---|
| **Game Popularity** | A ranking of games by the number of unique players or total rounds played. | **Source:** `daily_game_summary.unique_players_count` <br> **Logic:** `COUNT(DISTINCT player_id) FROM game_rounds GROUP BY game_id` |
| **Top Grossing Games** | A ranking of games by the total GGR they generate. | **Source:** `daily_game_summary.gross_gaming_revenue` <br> **Logic:** `SUM(bet_amount - win_amount) GROUP BY game_id` |
| **Hold Percentage (per Game)** | The percentage of total wagers that the house keeps as GGR for a specific game. | **Source:** `daily_game_summary` <br> **Logic:** `(gross_gaming_revenue / total_bet_amount) * 100` |
| **Provider Performance** | An aggregation of GGR, bets, and active players grouped by game provider. | **Source:** `daily_game_summary` <br> **Logic:** `GROUP BY provider` on key metrics. |

---

## 5. Revenue Analytics and Financial Performance

Detailed metrics on the flow of money into and out of the platform.

| Metric | Description | Source Table & Calculation |
|---|---|---|
| **Deposit to Withdrawal Ratio** | The ratio of total deposit value to total withdrawal value over a period. | **Source:** `daily_kpi_summary.total_deposits`, `daily_kpi_summary.total_withdrawals` <br> **Logic:** `SUM(deposits) / SUM(withdrawals)` |
| **Average Deposit Value** | The average value of a single successful deposit transaction. | **Source:** `financial_transactions` <br> **Logic:** `AVG(amount) WHERE action_type = 'deposit' AND status = 'success'` |
| **Transactions by Payment Method** | A breakdown of transaction volume and value by payment method (e.g., GCash, Bank Transfer). | **Source:** `financial_transactions` <br> **Logic:** `COUNT(*), SUM(amount) GROUP BY payment_method` |

---

## 6. Risk Management

Metrics and alerts to identify potentially fraudulent or problematic behavior. These often require more complex, pattern-based queries on raw data.

| Metric / Alert | Description | Source Table & Calculation |
|---|---|---|
| **Multi-Account by IP/Device** | Flags players creating multiple accounts from the same IP address or device ID to abuse bonuses. | **Source:** `players` <br> **Logic:** `COUNT(player_id) > 1 GROUP BY ip_address` or `GROUP BY device_id` |
| **High-Frequency Deposits** | Alerts when a player makes numerous small deposit attempts in a short time, potentially testing stolen cards. | **Source:** `financial_transactions` <br> **Logic:** `COUNT(transaction_id) WHERE action_type='deposit' AND created_at > NOW() - INTERVAL '1 hour' GROUP BY player_id` |
| **Excessive Session Time** | Alerts when a player's single session duration exceeds a responsible gaming threshold (e.g., 6 hours). | **Source:** `player_sessions` <br> **Logic:** `WHERE session_duration_seconds > 21600` |
| **Deposit Limit Breach** | Alerts when a player's total deposits in a 24-hour period exceed their self-imposed limit or a platform-wide threshold. | **Source:** `daily_player_summary`, `activity_events` (for limit settings) <br> **Logic:** Compare `daily_player_summary.total_deposit_amount` with the limit stored in `activity_events.details`. |
| **Bonus Abuse Pattern** | Identifies players who primarily play with bonus funds and withdraw immediately after meeting wagering requirements. | **Source:** `activity_events`, `game_rounds`, `financial_transactions` <br> **Logic:** A complex query correlating `bonus_claimed` events with gameplay and subsequent `withdrawal` requests. |