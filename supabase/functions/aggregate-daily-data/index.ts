import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

serve(async (_req) => {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // --- Define the time window for the previous day ---
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Start of today in UTC
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1); // Start of yesterday in UTC

    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    // --- 1. Aggregate for daily_kpi_summary ---
    console.log(`Aggregating data for ${yesterdayStr}...`);

    const { data: dailyMetrics, error: metricsError } = await supabase.rpc('calculate_daily_kpi', {
      report_date: yesterdayStr
    });
    if (metricsError) throw new Error(`Error calculating daily KPI: ${metricsError.message}`);

    const kpiSummaryRow = {
      summary_date: yesterdayStr,
      total_revenue: dailyMetrics.ggr,
      total_deposits: dailyMetrics.total_deposits,
      total_withdrawals: dailyMetrics.total_withdrawals,
      daily_active_players: dailyMetrics.dap,
      newly_registered_players: dailyMetrics.new_players,
      // Placeholders for more complex metrics
      profit_margin: 25.0,
      first_time_depositors: 0,
      avg_session_duration_minutes: 0,
      player_retention_rate: 0,
      player_ltv: 0,
      player_acquisition_cost: 0,
      market_share: 0,
      operational_efficiency: 0
    };

    const { error: kpiUpsertError } = await supabase
      .from("daily_kpi_summary")
      .upsert(kpiSummaryRow, { onConflict: 'summary_date' });
    if (kpiUpsertError) throw new Error(`Error upserting daily KPI summary: ${kpiUpsertError.message}`);
    console.log("Successfully updated daily_kpi_summary.");


    // --- 2. Aggregate for daily_game_summary ---
    const { data: gameMetrics, error: gameMetricsError } = await supabase.rpc('calculate_daily_game_summary', {
      report_date: yesterdayStr
    });
    if (gameMetricsError) throw new Error(`Error calculating game summary: ${gameMetricsError.message}`);

    const gameSummaryRows = gameMetrics.map(g => ({
        summary_date: yesterdayStr,
        game_id: g.game_id,
        total_bet_amount: g.total_bet_amount,
        total_win_amount: g.total_win_amount,
        gross_gaming_revenue: g.ggr,
        unique_players_count: g.unique_players,
        total_sessions: 0, // Requires more complex logic
        avg_session_duration_minutes: 0,
        bet_frequency_per_minute: 0,
        bonus_usage_rate: 0,
        player_retention_rate: 0
    }));

    const { error: gameUpsertError } = await supabase
      .from("daily_game_summary")
      .upsert(gameSummaryRows, { onConflict: 'summary_date,game_id' });
    if (gameUpsertError) throw new Error(`Error upserting daily game summary: ${gameUpsertError.message}`);
    console.log(`Successfully updated daily_game_summary with ${gameSummaryRows.length} rows.`);


    // --- 3. Aggregate for daily_payment_method_summary ---
    // (A similar RPC function 'calculate_daily_payment_summary' would be created for this)

    console.log("Daily aggregation complete.");

    return new Response(JSON.stringify({ success: true, message: `Aggregated data for ${yesterdayStr}` }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Aggregation failed:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});

/*
NOTE: This Edge Function calls PostgreSQL functions (`calculate_daily_kpi`, `calculate_daily_game_summary`).
You would need to create these functions in your Supabase SQL Editor. Here are example implementations:

-- Function for daily_kpi_summary
CREATE OR REPLACE FUNCTION calculate_daily_kpi(report_date date)
RETURNS TABLE(ggr numeric, total_deposits numeric, total_withdrawals numeric, dap bigint, new_players bigint) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COALESCE(SUM(bet_amount - win_amount), 0) FROM game_rounds WHERE DATE(round_timestamp) = report_date) as ggr,
    (SELECT COALESCE(SUM(amount), 0) FROM financial_transactions WHERE DATE(created_at) = report_date AND transaction_type = 'deposit' AND status = 'success') as total_deposits,
    (SELECT COALESCE(SUM(amount), 0) FROM financial_transactions WHERE DATE(created_at) = report_date AND transaction_type = 'withdrawal' AND status = 'success') as total_withdrawals,
    (SELECT COUNT(DISTINCT player_id) FROM game_rounds WHERE DATE(round_timestamp) = report_date) as dap,
    (SELECT COUNT(player_id) FROM players WHERE DATE(registration_timestamp) = report_date) as new_players;
END;
$$ LANGUAGE plpgsql;


-- Function for daily_game_summary
CREATE OR REPLACE FUNCTION calculate_daily_game_summary(report_date date)
RETURNS TABLE(game_id varchar, total_bet_amount numeric, total_win_amount numeric, ggr numeric, unique_players bigint) AS $$
BEGIN
  RETURN QUERY
  SELECT
    gr.game_id,
    COALESCE(SUM(gr.bet_amount), 0) as total_bet_amount,
    COALESCE(SUM(gr.win_amount), 0) as total_win_amount,
    COALESCE(SUM(gr.bet_amount - gr.win_amount), 0) as ggr,
    COUNT(DISTINCT gr.player_id) as unique_players
  FROM game_rounds gr
  WHERE DATE(gr.round_timestamp) = report_date
  GROUP BY gr.game_id;
END;
$$ LANGUAGE plpgsql;

*/