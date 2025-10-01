-- =================================================================================
-- Final SQL Schema for iGaming Analytics Dashboard
-- Version: 2.0
-- Description: This script defines the complete set of tables, including dimensions,
-- raw events, and aggregated summaries, to power all five iGaming dashboards.
-- =================================================================================


-- =================================================================================
-- I. DIMENSION TABLES
-- These tables store metadata and descriptive attributes for core entities.
-- =================================================================================

CREATE TABLE players (
    player_id VARCHAR(255) PRIMARY KEY,
    username VARCHAR(255) UNIQUE,
    registration_timestamp TIMESTAMPTZ NOT NULL,
    country_code CHAR(2),
    timezone VARCHAR(100),
    date_of_birth DATE,
    -- Other demographic/static info can be added here
    last_seen_timestamp TIMESTAMPTZ
);

CREATE TABLE games (
    game_id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    provider VARCHAR(255),
    category VARCHAR(100), -- e.g., 'Slots', 'Table Games', 'Live Casino'
    rtp NUMERIC(5, 2), -- Return to Player percentage
    volatility VARCHAR(50) -- e.g., 'Low', 'Medium', 'High'
);


-- =================================================================================
-- II. RAW EVENT TABLES
-- These tables ingest the raw, immutable logs from the platform.
-- =================================================================================

CREATE TABLE player_sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id VARCHAR(255) NOT NULL REFERENCES players(player_id),
    session_start_timestamp TIMESTAMPTZ NOT NULL,
    session_end_timestamp TIMESTAMPTZ,
    duration_seconds INT
);

CREATE TABLE financial_transactions (
    transaction_id VARCHAR(255) PRIMARY KEY,
    player_id VARCHAR(255) NOT NULL REFERENCES players(player_id),
    transaction_type VARCHAR(50) NOT NULL, -- 'deposit', 'withdrawal'
    amount NUMERIC(18, 4) NOT NULL,
    currency VARCHAR(10),
    payment_method VARCHAR(100),
    status VARCHAR(50), -- 'success', 'pending', 'failed'
    created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE game_rounds (
    round_id VARCHAR(255) PRIMARY KEY,
    player_id VARCHAR(255) NOT NULL REFERENCES players(player_id),
    game_id VARCHAR(255) NOT NULL REFERENCES games(game_id),
    bet_amount NUMERIC(18, 4),
    win_amount NUMERIC(18, 4),
    currency VARCHAR(10),
    round_timestamp TIMESTAMPTZ NOT NULL
);

CREATE TABLE activity_events (
    event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id VARCHAR(255) REFERENCES players(player_id),
    event_type VARCHAR(100) NOT NULL, -- e.g., 'bonus_claimed', 'responsible_gaming_limit_set'
    event_timestamp TIMESTAMPTZ NOT NULL,
    details JSONB -- Flexible column for event-specific data
);

CREATE TABLE system_alerts (
    alert_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_type VARCHAR(100) NOT NULL, -- 'fraud_detection', 'system_health', 'payment_gateway'
    severity VARCHAR(50) NOT NULL, -- 'critical', 'high', 'medium', 'low'
    title VARCHAR(255),
    description TEXT,
    source VARCHAR(100),
    metadata JSONB, -- For account_id, server_name, etc.
    is_acknowledged BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL
);


-- =================================================================================
-- III. AGGREGATED SUMMARY TABLES
-- Pre-calculated tables to ensure fast dashboard loading.
-- =================================================================================

-- For Real-Time Dashboard
CREATE TABLE live_minute_summary (
    time_bucket TIMESTAMPTZ PRIMARY KEY, -- 1-minute intervals
    total_wagers NUMERIC(18, 4),
    total_payouts NUMERIC(18, 4),
    net_revenue NUMERIC(18, 4),
    transaction_count INT,
    active_players INT,
    new_registrations INT,
    conversion_rate NUMERIC(5, 2),
    system_uptime NUMERIC(5, 2),
    active_alerts INT
);

-- For Daily Summaries
CREATE TABLE daily_kpi_summary (
    summary_date DATE PRIMARY KEY,
    total_revenue NUMERIC(18, 4),
    profit_margin NUMERIC(5, 2),
    total_deposits NUMERIC(18, 4),
    total_withdrawals NUMERIC(18, 4),
    daily_active_players INT,
    newly_registered_players INT,
    first_time_depositors INT,
    avg_session_duration_minutes NUMERIC(10, 2),
    player_retention_rate NUMERIC(5, 2),
    player_ltv NUMERIC(18, 4),
    player_acquisition_cost NUMERIC(18, 4),
    market_share NUMERIC(5, 2),
    operational_efficiency NUMERIC(5, 2)
);

CREATE TABLE daily_game_summary (
    summary_date DATE,
    game_id VARCHAR(255) REFERENCES games(game_id),
    total_bet_amount NUMERIC(18, 4),
    total_win_amount NUMERIC(18, 4),
    gross_gaming_revenue NUMERIC(18, 4),
    unique_players_count INT,
    total_sessions INT,
    avg_session_duration_minutes NUMERIC(10, 2),
    bet_frequency_per_minute NUMERIC(10, 2),
    bonus_usage_rate NUMERIC(5, 2),
    player_retention_rate NUMERIC(5, 2),
    PRIMARY KEY (summary_date, game_id)
);

CREATE TABLE daily_payment_method_summary (
    summary_date DATE,
    payment_method VARCHAR(100),
    total_volume NUMERIC(18, 4),
    transaction_count BIGINT,
    success_rate NUMERIC(5, 2),
    avg_transaction_value NUMERIC(18, 4),
    avg_processing_time_seconds INT,
    risk_level VARCHAR(50),
    PRIMARY KEY (summary_date, payment_method)
);

CREATE TABLE daily_player_demographics_summary (
    summary_date DATE,
    age_group VARCHAR(50), -- e.g., '18-25', '26-35'
    game_category VARCHAR(100),
    player_preference_percentage NUMERIC(5, 2), -- % of players in age group who played this category
    PRIMARY KEY (summary_date, age_group, game_category)
);

-- For Monthly/Quarterly Summaries
CREATE TABLE monthly_kpi_summary (
    summary_month DATE PRIMARY KEY,
    total_revenue NUMERIC(18, 4),
    player_acquisition_cost NUMERIC(18, 4),
    profit_margin NUMERIC(5, 2),
    market_share NUMERIC(5, 2)
);

-- For Predictive Analytics
CREATE TABLE monthly_forecasts (
    forecast_month DATE,
    metric_name VARCHAR(100), -- 'revenue', 'players', 'marketShare'
    forecast_value NUMERIC(18, 4),
    PRIMARY KEY (forecast_month, metric_name)
);