// app/api/weekly-stats/route.js

import { NextResponse } from "next/server";
import connectDB from "@/backend/config/dbConnect";
import {
  getWeeklyAnalytics,
  getBestDayOfWeek,
} from "@/backend/pipelines/weeklyPipelines";

export async function GET(req) {
  try {
    await connectDB();

    const [analytics, bestDay] = await Promise.all([
      getWeeklyAnalytics(),
      getBestDayOfWeek(),
    ]);

    return NextResponse.json({
      success: true,
      ...analytics,
      bestDay,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Weekly Stats API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
