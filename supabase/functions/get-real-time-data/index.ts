import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";

// These credentials will be set in your Supabase project's environment variables
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

// Standard CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // --- 1. Fetch KPI data from the most recent summary ---
    const { data: kpiData, error: kpiError } = await supabase
      .from("live_minute_summary")
      .select("*")
      .order("time_bucket", { ascending: false })
      .limit(1)
      .single();
    if (kpiError) throw kpiError;

    // --- 2. Fetch data for the Transaction Flow Chart (last 15 minutes) ---
    const { data: transactionFlowData, error: flowError } = await supabase
      .from("live_minute_summary")
      .select("time_bucket, total_wagers, total_payouts, net_revenue, transaction_count")
      .order("time_bucket", { ascending: false })
      .limit(15);
    if (flowError) throw flowError;

    // --- 3. Fetch Top Performing Games (from daily summary, ranked by revenue) ---
    const { data: topGames, error: gamesError } = await supabase
      .from("daily_game_summary")
      .select("game_id, name:games(name), category:games(category), provider:games(provider), gross_gaming_revenue, unique_players_count, total_sessions")
      .eq("summary_date", new Date().toISOString().slice(0, 10)) // Assuming summary for today exists
      .order("gross_gaming_revenue", { ascending: false })
      .limit(6);
    if (gamesError) throw gamesError;

    // --- 4. Fetch recent, unacknowledged critical/high alerts ---
    const { data: alerts, error: alertsError } = await supabase
      .from("system_alerts")
      .select("alert_id, severity, title, description, source, created_at")
      .in("severity", ["critical", "high"])
      .eq("is_acknowledged", false)
      .order("created_at", { ascending: false })
      .limit(5);
    if (alertsError) throw alertsError;

    // --- 5. Get System Status (Simulated) ---
    const systemStatus = {
        webSocket: { status: 'connected', latency: 45 + Math.floor(Math.random() * 20) },
        database: { status: 'healthy', responseTime: 120 + Math.floor(Math.random() * 50) },
        paymentGateway: { status: 'healthy', uptime: 99.9 },
        gameEngine: { status: 'warning', load: 85 + Math.floor(Math.random() * 10) },
        monitoring: { lastUpdate: new Date().toISOString() }
    };
    const connectionStatus = 'connected';

    // --- 6. Assemble the final data payload ---
    const responsePayload = {
      kpiData: {
        activePlayers: { value: kpiData?.active_players, change: '+1.2%', changeType: 'positive' },
        transactionsPerMinute: { value: kpiData?.transaction_count, unit: '/min', change: '+3.5%', changeType: 'positive' },
        revenueRate: { value: kpiData?.net_revenue, unit: '/min', change: '+2.1%', changeType: 'positive' },
        systemUptime: { value: kpiData?.system_uptime ? `${kpiData.system_uptime}%` : 'N/A', change: '+0.01%', changeType: 'positive' },
        alertCount: { value: kpiData?.active_alerts, change: '+1', changeType: 'negative' },
        conversionRate: { value: kpiData?.conversion_rate ? `${kpiData.conversion_rate}%` : 'N/A', change: '-0.05%', changeType: 'negative' }
      },
      transactionFlowData: transactionFlowData?.map(d => ({
        time: new Date(d.time_bucket).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        wagers: d.total_wagers,
        payouts: d.total_payouts,
        netRevenue: d.net_revenue,
        transactions: d.transaction_count
      })).reverse(),
      topGames: topGames?.map(g => ({
        id: g.game_id,
        name: g.name.name,
        category: g.category.category,
        activePlayers: g.unique_players_count,
        revenue: g.gross_gaming_revenue,
        sessions: g.total_sessions,
        provider: g.provider.provider,
        status: g.gross_gaming_revenue > 50000 ? 'healthy' : 'warning',
        trend: 'up'
      })),
      alerts: alerts?.map(a => ({
        id: a.alert_id,
        type: a.severity,
        title: a.title,
        message: a.description,
        timestamp: a.created_at,
        source: a.source,
        acknowledged: false,
        actions: ['Investigate', 'Acknowledge']
      })),
      systemStatus,
      connectionStatus
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