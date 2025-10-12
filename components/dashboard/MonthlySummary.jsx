"use client";

import { useState, useEffect } from "react";
import SimpleLineChart from "../charts/SimpleLineChart";

export default function MonthlySummary() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/monthly-stats")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading monthly stats:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">📊 Résumé du Mois</h2>
        <span className="text-sm text-gray-500">
          {new Date().toLocaleDateString("fr-FR", {
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Commandes</p>
          <p className="text-3xl font-bold text-blue-600">
            {data.thisMonth.totalOrders}
          </p>
          <p
            className={`text-xs mt-1 font-semibold ${data.comparison.ordersGrowth >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {data.comparison.ordersGrowth >= 0 ? "↗" : "↘"}{" "}
            {Math.abs(data.comparison.ordersGrowth)}% vs mois dernier
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Revenus</p>
          <p className="text-3xl font-bold text-green-600">
            {Math.round(data.thisMonth.totalRevenue / 1000)}k
          </p>
          <p
            className={`text-xs mt-1 font-semibold ${data.comparison.revenueGrowth >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {data.comparison.revenueGrowth >= 0 ? "↗" : "↘"}{" "}
            {Math.abs(data.comparison.revenueGrowth)}% vs mois dernier
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Panier moyen</p>
          <p className="text-3xl font-bold text-purple-600">
            {Math.round(data.thisMonth.avgOrderValue)} FDj
          </p>
          <p
            className={`text-xs mt-1 font-semibold ${data.comparison.avgOrderGrowth >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {data.comparison.avgOrderGrowth >= 0 ? "↗" : "↘"}{" "}
            {Math.abs(data.comparison.avgOrderGrowth)}%
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Conversion</p>
          <p className="text-3xl font-bold text-orange-600">
            {data.comparison.conversionRate}%
          </p>
          <p className="text-xs mt-1 text-gray-600">
            {data.thisMonth.paidOrders}/{data.thisMonth.totalOrders}
          </p>
        </div>
      </div>

      {/* Prévisions */}
      {data.forecast && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
          <div className="flex items-start">
            <span className="text-2xl mr-3">🔮</span>
            <div className="flex-1">
              <p className="font-bold text-blue-800">
                Prévisions de fin de mois
              </p>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-sm text-blue-700">
                    Commandes projetées:{" "}
                    <span className="font-bold">
                      {data.forecast.forecastOrders}
                    </span>
                  </p>
                  <p className="text-xs text-blue-600">
                    Actuellement: {data.forecast.currentOrders} (
                    {data.forecast.daysRemaining} jours restants)
                  </p>
                </div>
                <div>
                  <p className="text-sm text-blue-700">
                    Revenus projetés:{" "}
                    <span className="font-bold">
                      {data.forecast.forecastRevenue.toLocaleString()} FDj
                    </span>
                  </p>
                  <p className="text-xs text-blue-600">
                    Actuellement:{" "}
                    {data.forecast.currentRevenue.toLocaleString()} FDj
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Graphique tendance quotidienne */}
      {data.dailyTrend && data.dailyTrend.length > 0 && (
        <div className="mb-6">
          <SimpleLineChart
            title="Revenus quotidiens ce mois"
            data={data.dailyTrend.map((d) => d.revenue)}
            labels={data.dailyTrend.map((d) => `${d._id}`)}
            color="#10B981"
          />
        </div>
      )}

      {/* Meilleur jour */}
      {data.bestDay && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 rounded-r-lg">
          <div className="flex items-center">
            <span className="text-2xl mr-3">⭐</span>
            <div>
              <p className="font-bold text-yellow-800">Meilleur jour du mois</p>
              <p className="text-sm text-yellow-700">
                Le {data.bestDay._id} avec {data.bestDay.orders} commandes et{" "}
                {Math.round(data.bestDay.revenue)} FDj
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Top produits */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          🏆 Top 10 Produits du Mois
        </h3>
        <div className="space-y-2">
          {data.topProducts.slice(0, 10).map((product, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center flex-1">
                <span
                  className={`font-bold mr-3 ${index < 3 ? "text-yellow-600" : "text-gray-500"}`}
                >
                  #{index + 1}
                </span>
                <span className="text-sm text-gray-800 truncate">
                  {product.name}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-600">
                  {product.quantity} ventes
                </span>
                <span className="text-sm font-bold text-green-600">
                  {product.revenue.toLocaleString()} FDj
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Répartition par catégorie */}
      {data.categoryBreakdown && data.categoryBreakdown.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            📂 Performance par Catégorie
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.categoryBreakdown.map((cat, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm font-semibold text-gray-800">
                  {cat._id || "Non catégorisé"}
                </p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-600">
                    {cat.quantity} ventes
                  </span>
                  <span className="text-sm font-bold text-green-600">
                    {cat.revenue.toLocaleString()} FDj
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
