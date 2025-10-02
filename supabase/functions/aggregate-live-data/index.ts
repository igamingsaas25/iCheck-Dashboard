import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!; // Use the service role key for admin-level access

serve(async (_req) => {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Define the time window for the last minute
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);

    // --- Calculate all metrics for the last minute ---

    // 1. Get total wagers, payouts, and transaction count from game_rounds
    const { data: gameData, error: gameError } = await supabase
      .from("game_rounds")
      .select("bet_amount, win_amount")
      .gte("round_timestamp", oneMinuteAgo.toISOString())
      .lt("round_timestamp", now.toISOString());
    if (gameError) throw gameError;

    const totalWagers = gameData.reduce((sum, r) => sum + (r.bet_amount || 0), 0);
    const totalPayouts = gameData.reduce((sum, r) => sum + (r.win_amount || 0), 0);
    const netRevenue = totalWagers - totalPayouts;
    const wagerCount = gameData.length;

    // 2. Get active players
    const { count: activePlayers, error: playersError } = await supabase
      .from("game_rounds")
      .select("player_id", { count: "exact", head: true })
      .gte("round_timestamp", oneMinuteAgo.toISOString())
      .lt("round_timestamp", now.toISOString());
    if (playersError) throw playersError;

    // 3. Get new registrations
    const { count: newRegistrations, error: regError } = await supabase
        .from("players")
        .select("*", { count: "exact", head: true })
        .gte("registration_timestamp", oneMinuteAgo.toISOString())
        .lt("registration_timestamp", now.toISOString());
    if (regError) throw regError;

    // 4. Get deposit count
    const { count: depositCount, error: depositError } = await supabase
        .from("financial_transactions")
        .select("*", { count: "exact", head: true })
        .eq("transaction_type", "deposit")
        .eq("status", "success")
        .gte("created_at", oneMinuteAgo.toISOString())
        .lt("created_at", now.toISOString());
    if(depositError) throw depositError;

    const transactionCount = wagerCount + depositCount;

    // --- Assemble the summary row ---
    const summaryRow = {
      time_bucket: now.toISOString(),
      total_wagers: totalWagers,
      total_payouts: totalPayouts,
      net_revenue: netRevenue,
      transaction_count: transactionCount,
      active_players: activePlayers,
      new_registrations: newRegistrations,
      // Placeholders for other metrics that might need more complex calculation
      conversion_rate: newRegistrations > 0 ? (depositCount / newRegistrations * 100) : 0,
      system_uptime: 99.9, // This would typically come from an external monitoring service
      active_alerts: 0, // This would be calculated from the system_alerts table
    };

    // --- Insert the new summary row into the database ---
    const { error: upsertError } = await supabase
      .from("live_minute_summary")
      .upsert(summaryRow);

    if (upsertError) throw upsertError;

    return new Response(JSON.stringify({ success: true, inserted: summaryRow }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});