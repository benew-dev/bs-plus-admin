"use client";

export default function UnpaidIndicator({ createdAt, paymentStatus }) {
  if (paymentStatus !== "unpaid") return null;

  const orderDate = new Date(createdAt);
  const now = new Date();
  const hoursDiff = Math.floor((now - orderDate) / (1000 * 60 * 60));

  if (hoursDiff < 24) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        ⏳ {hoursDiff}h
      </span>
    );
  }

  if (hoursDiff < 48) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
        ⚠️ +24h
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 animate-pulse">
      🚨 +48h
    </span>
  );
}
