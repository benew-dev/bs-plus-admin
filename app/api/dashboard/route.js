// app/api/dashboard/route.js - NOUVEAU

import {
  getDailySummary,
  getWeeklySummary,
} from "@/backend/pipelines/dailyPipelines";
import { getDailyAlerts } from "@/backend/utils/alerts";

export async function GET(req) {
  const [summary, weekly, alerts] = await Promise.all([
    getDailySummary(),
    getWeeklySummary(),
    getDailyAlerts(),
  ]);

  return NextResponse.json({
    summary,
    weekly,
    alerts,
    timestamp: new Date(),
  });
}
