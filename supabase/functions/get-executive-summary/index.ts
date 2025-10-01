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
    const { date_range } = await req.json(); // e.g., 'last_30_days'

    // --- 1. Fetch Business Health Indicators (from daily summary) ---
    // This is a simplified example. A real implementation would compare
    // the selected date range with the previous one.
    const { data: healthData, error: healthError } = await supabase
      .from("daily_kpi_summary")
      .select("total_revenue, newly_registered_players, market_share, operational_efficiency")
      .order("summary_date", { ascending: false })
      .limit(1)
      .single();
    if (healthError) throw healthError;

    // --- 2. Fetch Strategic Performance Chart data ---
    const { data: quarterlyData, error: quarterlyError } = await supabase
      .from("monthly_kpi_summary") // Assuming monthly can be aggregated to quarterly
      .select("summary_month, total_revenue, player_acquisition_cost, profit_margin, market_share")
      .order("summary_month", { ascending: true });
    if (quarterlyError) throw quarterlyError;

    // --- 3. Fetch Business Scorecard data ---
    // This is highly specific and would likely come from multiple tables or even external sources.
    // We'll return a static example for now.
    const scorecardData = [
      { id: 'finance', name: 'Finance', icon: 'DollarSign', kpis: [{ name: 'Revenue Growth', value: `${healthData.total_revenue > 45000000 ? '12.3%' : '9.5%'}`, target: '10%', status: 'green', trend: 'improving' }] },
      { id: 'marketing', name: 'Marketing', icon: 'Target', kpis: [{ name: 'Player Acquisition', value: `${healthData.newly_registered_players > 10000 ? '18.7%' : '14.2%'}`, target: '15%', status: 'green', trend: 'improving' }] }
    ];

    // --- 4. Fetch Predictive Analytics data ---
    const { data: historicalData, error: historicalError } = await supabase
      .from("monthly_kpi_summary")
      .select("summary_month, total_revenue, market_share")
      .order("summary_month", { ascending: false })
      .limit(6);
    if (historicalError) throw historicalError;

    const { data: forecastData, error: forecastError } = await supabase
        .from("monthly_forecasts")
        .select("forecast_month, metric_name, forecast_value")
        .order("forecast_month", { ascending: true })
        .limit(12);
    if (forecastError) throw forecastError;


    // --- 5. Assemble the final data payload ---
    const responsePayload = {
      businessHealth: {
        totalRevenue: { value: healthData.total_revenue, change: 12.3 },
        playerGrowthRate: { value: 0.187, change: 3.2 }, // Placeholder
        marketShare: { value: healthData.market_share, change: 1.8 },
        operationalEfficiency: { value: healthData.operational_efficiency, change: -0.5 }
      },
      strategicPerformance: {
        quarterly: quarterlyData.map(d => ({ period: d.summary_month, revenue: d.total_revenue, playerAcquisitionCost: d.player_acquisition_cost, profitMargin: d.profit_margin, marketShare: d.market_share })),
        annual: [] // Annual data would require a separate aggregation
      },
      businessScorecard: scorecardData,
      predictiveAnalytics: {
          historical: historicalData.reverse().map(d => ({ period: d.summary_month, revenue: d.total_revenue, marketShare: d.market_share })),
          forecast: forecastData.map(d => ({ period: d.forecast_month, [d.metric_name]: d.forecast_value, forecast: true }))
      }
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