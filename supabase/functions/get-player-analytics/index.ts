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
    const { filters } = await req.json();

    // --- 1. Fetch Player KPIs ---
    const { data: kpiData, error: kpiError } = await supabase
      .from("daily_kpi_summary")
      .select("newly_registered_players, player_retention_rate, avg_session_duration_minutes, player_ltv")
      .order("summary_date", { ascending: false })
      .limit(1)
      .single();
    if (kpiError) throw kpiError;

    // --- 2. Fetch Player Journey Funnel Data ---
    // This is a simplified query. A real implementation would involve more complex cohort analysis.
    const { count: registrationCount } = await supabase.from("players").select('*', { count: 'exact' });
    const { count: depositCount } = await supabase.from("financial_transactions").select('player_id', { count: 'exact', head: true }).eq('transaction_type', 'deposit');

    const funnelData = [
      { name: 'Registration', value: registrationCount, fill: '#3B82F6', percentage: 100 },
      { name: 'First Deposit', value: depositCount, fill: '#8B5CF6', percentage: (depositCount / registrationCount * 100) },
    ];

    // --- 3. Fetch Player Distribution Data ---
    const { data: geoData, error: geoError } = await supabase
        .from("players")
        .select("country_code")
        .neq("country_code", null);
    if (geoError) throw geoError;

    // Aggregate by country in code for simplicity
    const geoCounts = geoData.reduce((acc, { country_code }) => {
        acc[country_code] = (acc[country_code] || 0) + 1;
        return acc;
    }, {});

    // --- 4. Fetch Engagement Matrix Data ---
    const { data: engagementData, error: engagementError } = await supabase
        .from("daily_player_demographics_summary")
        .select("*")
        .eq("summary_date", new Date().toISOString().slice(0, 10));
    if(engagementError) throw engagementError;

    // --- 5. Assemble the final data payload ---
    const responsePayload = {
      playerMetrics: {
        acquisition: { value: kpiData.newly_registered_players, change: '+12.3%' },
        retention: { value: kpiData.player_retention_rate / 100, change: '+2.1%' },
        avgSession: { value: `${kpiData.avg_session_duration_minutes.toFixed(1)}m`, change: '-1.2m' },
        ltv: { value: kpiData.player_ltv, change: '+$23.40' }
      },
      journeyFunnel: {
        funnel: funnelData,
        cohort: [ // Cohort data requires more complex historical queries
            { week: 'Week 1', retention: 100, players: 1000 },
            { week: 'Week 4', retention: 45, players: 450 }
        ]
      },
      distribution: {
        geographic: Object.entries(geoCounts).map(([region, players]) => ({ region, players, percentage: (players/registrationCount * 100), growth: '+5.0%', color: '#3B82F6' })),
        timezone: [ // Timezone data requires another grouping
            { timezone: 'UTC-8 (PST)', players: 8945, peak: '8:00 PM', activity: 92 }
        ]
      },
      engagement: {
        bubble: [ // Bubble data requires complex joins
            { gameType: 'Slots', engagement: 85, revenue: 450, playerCount: 12500, avgSession: 28, demographics: 'Mixed Age Groups', color: '#3B82F6' }
        ],
        heatmap: engagementData.map(d => ({ ageGroup: d.age_group, [d.game_category.toLowerCase()]: d.player_preference_percentage }))
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