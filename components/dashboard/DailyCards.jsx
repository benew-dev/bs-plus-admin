// components/dashboard/DailyCards.jsx

export default function DailyCards({ data }) {
  const cards = [
    {
      title: "Commandes",
      value: data.today.orders,
      change: data.today.comparison.ordersChange,
      changePercent: data.today.comparison.ordersChangePercent,
      icon: "🛍️",
      color: "blue",
    },
    {
      title: "Revenus",
      value: `${data.today.revenue.toLocaleString()} FDj`,
      change: data.today.comparison.revenueChange,
      changePercent: data.today.comparison.revenueChangePercent,
      icon: "💰",
      color: "green",
    },
    {
      title: "En attente",
      value: data.alerts.unpaidOrders,
      icon: "⏳",
      color: "orange",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`bg-${card.color}-50 border-2 border-${card.color}-200 rounded-xl p-6`}
        >
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-semibold text-gray-700">{card.title}</p>
            <span className="text-2xl">{card.icon}</span>
          </div>

          <p className="text-3xl font-bold text-gray-900 mb-2">{card.value}</p>

          {card.change !== undefined && (
            <div
              className={`flex items-center text-sm ${
                card.change >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              <span className="mr-1">{card.change >= 0 ? "↗️" : "↘️"}</span>
              <span className="font-semibold">{card.changePercent}%</span>
              <span className="ml-1 text-gray-500">
                vs hier ({card.change >= 0 ? "+" : ""}
                {card.change})
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
