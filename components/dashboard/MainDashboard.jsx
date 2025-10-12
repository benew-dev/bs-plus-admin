"use client";

import { useState, useEffect } from "react";
import AlertsPanel from "./AlertsPanel";
import DailyCards from "./DailyCards";
import SimpleLineChart from "../charts/SimpleLineChart";
import SimpleBarChart from "../charts/SimpleBarChart";

// Composant Loading
function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Chargement du dashboard...</p>
      </div>
    </div>
  );
}

export default function MainDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement");
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-semibold">Erreur de chargement</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6 p-6">
      {/* Date + Heure */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold">Bonjour Admin 👋</h1>
        <p className="text-blue-100 mt-1">
          {new Date().toLocaleDateString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Alertes */}
      <AlertsPanel alerts={data.alerts} />

      {/* KPIs Aujourd'hui */}
      <div>
        <h2 className="text-xl font-bold mb-4">📊 Aujourd'hui vs Hier</h2>
        <DailyCards data={data.summary} />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <SimpleLineChart
            title="Commandes - 7 derniers jours"
            data={data.summary.trends.weekOrders.map((d) => d.count)}
            labels={["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]}
          />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <SimpleBarChart
            title="Top 5 Produits cette semaine"
            data={data.summary.trends.topProducts.map((p) => ({
              name: p._id.substring(0, 20),
              value: p.revenue,
            }))}
          />
        </div>
      </div>

      {/* Semaine */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">📅 Cette Semaine</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Commandes</p>
            <p className="text-3xl font-bold text-blue-600">
              {data.weekly.thisWeek.orders}
            </p>
            <p
              className={`text-sm mt-1 ${
                data.weekly.comparison.ordersGrowth >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {data.weekly.comparison.ordersGrowth >= 0 ? "↗️" : "↘️"}
              {Math.abs(data.weekly.comparison.ordersGrowth)}% vs semaine
              dernière
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Revenus</p>
            <p className="text-3xl font-bold text-green-600">
              {data.weekly.thisWeek.revenue.toLocaleString()} FDj
            </p>
            <p
              className={`text-sm mt-1 ${
                data.weekly.comparison.revenueGrowth >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {data.weekly.comparison.revenueGrowth >= 0 ? "↗️" : "↘️"}
              {Math.abs(data.weekly.comparison.revenueGrowth)}% vs semaine
              dernière
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
