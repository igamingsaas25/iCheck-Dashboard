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
    const { filters } = await req.json(); // e.g., { currency: 'USD' }

    // --- 1. Fetch Financial KPIs ---
    const { data: kpiData, error: kpiError } = await supabase
      .from("daily_kpi_summary")
      .select("total_revenue, profit_margin, total_deposits, total_withdrawals, daily_active_players")
      .order("summary_date", { ascending: false })
      .limit(1)
      .single();
    if (kpiError) throw kpiError;

    // --- 2. Fetch Revenue Stream data ---
    const { data: revenueStreamData, error: streamError } = await supabase
      .from("daily_game_summary")
      .select("summary_date, category:games(category), gross_gaming_revenue")
      .limit(100); // Simplified for demonstration
    if (streamError) throw streamError;

    // --- 3. Fetch Fraud Alerts ---
    const { data: fraudAlerts, error: alertsError } = await supabase
      .from("system_alerts")
      .select("*")
      .eq("alert_type", "fraud_detection")
      .order("created_at", { ascending: false })
      .limit(10);
    if (alertsError) throw alertsError;

    // --- 4. Fetch Payment Method Analysis data ---
    const { data: paymentMethodData, error: paymentError } = await supabase
      .from("daily_payment_method_summary")
      .select("*")
      .order("summary_date", { ascending: false })
      .limit(5); // Assuming 5 main payment methods
    if (paymentError) throw paymentError;

    // --- 5. Calculate Overall Risk Score ---
    // A simple calculation for demonstration
    const highRiskAlerts = fraudAlerts.filter(a => a.severity === 'high' || a.severity === 'critical').length;
    const riskScore = Math.min(100, 20 + (highRiskAlerts * 15));

    // --- 6. Assemble the final data payload ---
    const responsePayload = {
      financialKPIs: [
        { title: "Gross Gaming Revenue", value: kpiData.total_revenue, currency: filters?.currency, change: 12.5, changeType: "positive", icon: "TrendingUp", description: "Total revenue from gaming activities" },
        { title: "Net Profit Margin", value: `${kpiData.profit_margin}%`, change: -2.1, changeType: "negative", icon: "Percent", description: "Profit after operational costs" },
        { title: "Total Deposits", value: kpiData.total_deposits, currency: filters?.currency, change: 8.7, changeType: "positive", icon: "ArrowDownCircle", description: "Total successful deposits" },
        { title: "Total Withdrawals", value: kpiData.total_withdrawals, currency: filters?.currency, change: 5.2, changeType: "positive", icon: "ArrowUpCircle", description: "Total successful withdrawals" }
      ],
      revenueStreamData: revenueStreamData.map(d => ({ period: d.summary_date, [d.category.category.toLowerCase()]: d.gross_gaming_revenue, riskScore: 30 + Math.random() * 20 })),
      fraudAlerts: fraudAlerts.map(a => ({ id: a.alert_id, severity: a.severity, title: a.title, description: a.description, accountId: a.metadata?.account_id, timestamp: a.created_at })),
      riskScore: {
        score: riskScore,
        trend: -5.3,
        factors: [
            { name: 'Transaction Velocity', weight: 25, impact: 'high', icon: 'Zap' },
            { name: 'Geographic Risk', weight: 20, impact: 'high', icon: 'MapPin' }
        ]
      },
      paymentMethodData: paymentMethodData.map(p => ({
          method: p.payment_method,
          volume: p.total_volume,
          count: p.transaction_count,
          percentage: (p.total_volume / kpiData.total_deposits) * 100,
          successRate: p.success_rate,
          avgAmount: p.avg_transaction_value,
          riskLevel: p.risk_level,
          avgProcessingTime: `${p.avg_processing_time_seconds}s`
      }))
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