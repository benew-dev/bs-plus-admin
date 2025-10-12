// backend/utils/alerts.js - À CRÉER
import Order from "../models/order";
import Product from "../models/order";

export const getDailyAlerts = async () => {
  const alerts = [];

  // 1. COMMANDES NON PAYÉES > 24H
  const unpaidOld = await Order.countDocuments({
    paymentStatus: "unpaid",
    createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  });

  if (unpaidOld > 0) {
    alerts.push({
      type: "warning",
      priority: "high",
      title: "⚠️ Commandes en attente",
      message: `${unpaidOld} commandes non payées depuis +24h`,
      action: "/admin/orders?paymentStatus=unpaid",
      actionText: "Voir les commandes",
    });
  }

  // 2. STOCK CRITIQUE
  const lowStock = await Product.find({
    stock: { $lte: 5 },
    isActive: true,
  });

  if (lowStock.length > 0) {
    alerts.push({
      type: "warning",
      priority: "high",
      title: "📦 Stock faible",
      message: `${lowStock.length} produits en stock critique`,
      details: lowStock.map((p) => `${p.name}: ${p.stock} unités`),
      action: "/admin/products?stock=less",
      actionText: "Voir les produits",
    });
  }

  // 3. PRODUITS INACTIFS AVEC STOCK
  const inactiveWithStock = await Product.countDocuments({
    isActive: false,
    stock: { $gt: 0 },
  });

  if (inactiveWithStock > 0) {
    alerts.push({
      type: "info",
      priority: "medium",
      title: "💡 Optimisation",
      message: `${inactiveWithStock} produits inactifs avec du stock`,
      action: "/admin/products",
      actionText: "Revoir ces produits",
    });
  }

  // 4. AUCUNE COMMANDE AUJOURD'HUI (si après 12h)
  const hour = new Date().getHours();
  if (hour >= 12) {
    const today = await Order.countDocuments({
      createdAt: {
        $gte: new Date().setHours(0, 0, 0, 0),
      },
    });

    if (today === 0) {
      alerts.push({
        type: "info",
        priority: "low",
        title: "🔔 Activité",
        message: "Aucune commande reçue aujourd'hui",
        action: "/admin/products",
        actionText: "Voir les produits",
      });
    }
  }

  // 5. NOUVEAU CLIENT IMPORTANT
  const bigOrder = await Order.findOne({
    createdAt: {
      $gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    totalAmount: { $gte: 1000 }, // Ajuster selon votre contexte
  }).sort({ totalAmount: -1 });

  if (bigOrder) {
    alerts.push({
      type: "success",
      priority: "medium",
      title: "🎉 Grosse commande",
      message: `Nouvelle commande de ${bigOrder.totalAmount} FDj`,
      action: `/admin/orders/${bigOrder._id}`,
      actionText: "Voir la commande",
    });
  }

  return alerts;
};
