import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { filters } = await req.json(); // e.g., { category: 'Slots' }

    // --- 1. Fetch all game performance data from the daily summary ---
    // In a real application, you'd apply the filters from the request here.
    const { data: gamesData, error: gamesError } = await supabase
      .from("daily_game_summary")
      .select(`
        *,
        game:games (
          name,
          provider,
          category,
          rtp,
          volatility
        )
      `)
      .eq("summary_date", new Date().toISOString().slice(0, 10)); // Simplified to today's data
    if (gamesError) throw gamesError;

    // --- 2. Calculate the summary Performance Metrics ---
    const totalGames = gamesData.length;
    const avgRtp = gamesData.reduce((sum, game) => sum + game.game.rtp, 0) / totalGames;
    const peakPlayers = Math.max(...gamesData.map(game => game.unique_players_count));
    const totalRevenue = gamesData.reduce((sum, game) => sum + game.gross_gaming_revenue, 0);
    const revenuePerGame = totalRevenue / totalGames;

    const metrics = {
      totalGames,
      totalGamesTrend: 5.1, // Placeholder trend
      avgRtp,
      avgRtpTrend: 1.2,
      peakPlayers,
      peakPlayersTrend: 10.3,
      revenuePerGame,
      revenuePerGameTrend: 8.9
    };

    // --- 3. Format the game list for the UI components ---
    const games = gamesData.map(game => ({
      id: game.game_id,
      name: game.game.name,
      provider: game.game.provider,
      category: game.game.category,
      volatility: game.game.volatility,
      revenue: game.gross_gaming_revenue,
      rtp: game.game.rtp,
      sessions: game.total_sessions,
      avgSession: game.avg_session_duration_minutes,
      betFreq: game.bet_frequency_per_minute,
      bonusRate: game.bonus_usage_rate,
      retention: game.player_retention_rate,
      trend: (Math.random() - 0.5) * 20 // Placeholder trend
    }));

    // --- 4. Assemble the final data payload ---
    const responsePayload = {
      games,
      metrics,
    };

    return new Response(JSON.stringify(responsePayload), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});