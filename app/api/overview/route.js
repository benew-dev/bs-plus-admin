import dbConnect from "@/backend/config/dbConnect";
import Order from "@/backend/models/order";
import { getMonthlyOrdersAnalytics } from "@/backend/pipelines/orderPipelines";
import {
  descListCategorySoldSinceBeginningPipeline,
  descListProductSoldSinceBeginningPipeline,
  descListProductSoldThisMonthPipeline,
} from "@/backend/pipelines/productPipelines";
import { userThatBoughtMostSinceBeginningPipeline } from "@/backend/pipelines/userPipelines";
import APIFilters from "@/backend/utils/APIFilters";
import { NextResponse } from "next/server";

export async function GET(req) {
  // Connexion DB
  await dbConnect();

  const resPerPage = 2;
  const ordersCount = await Order.countDocuments();

  let orders;
  let filteredOrdersCount = 0;
  let totalPages = 0;
  let result = 0;

  const searchParams = req.nextUrl.searchParams;

  if (searchParams?.get("keyword")) {
    const orderNumber = searchParams?.get("keyword");
    // ADAPTÉ AU MODÈLE ORDER : Suppression de .populate("shippingInfo user")
    orders = await Order.findOne({ orderNumber: orderNumber }).populate("user");

    if (orders) filteredOrdersCount = 1;
  } else {
    const apiFilters = new APIFilters(Order.find(), searchParams).filter();

    // ADAPTÉ AU MODÈLE ORDER : Suppression de .populate("shippingInfo")
    orders = await apiFilters.query.populate("user").sort({ createdAt: -1 });
    filteredOrdersCount = orders.length;

    apiFilters.pagination(resPerPage);
    // ADAPTÉ AU MODÈLE ORDER : Suppression de .populate("shippingInfo")
    orders = await apiFilters.query
      .clone()
      .populate("user")
      .sort({ createdAt: -1 });

    result = ordersCount / resPerPage;
    totalPages = Number.isInteger(result) ? result : Math.ceil(result);
  }

  // NOUVELLE IMPLÉMENTATION : Une seule requête pour toutes les stats
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  // Obtenir toutes les stats en une seule requête
  const monthlyStats = await getMonthlyOrdersAnalytics(
    currentMonth,
    currentYear,
  );

  // Stats supplémentaires (depuis le début, pas seulement ce mois)
  // ADAPTÉ AU MODÈLE ORDER : Comptage des commandes payées au lieu de "delivered"
  const deliveredOrdersCount = await Order.countDocuments({
    paymentStatus: "paid",
  });

  // Descendant List of Product Sold Since The Beginning
  const descListProductSoldSinceBeginning =
    await descListProductSoldSinceBeginningPipeline();

  // Descendant List of Category Sold Since The Beginning
  const descListCategorySoldSinceBeginning =
    await descListCategorySoldSinceBeginningPipeline();

  const descListProductSoldThisMonth =
    await descListProductSoldThisMonthPipeline(currentMonth, currentYear);

  const userThatBoughtMostSinceBeginning =
    await userThatBoughtMostSinceBeginningPipeline();

  const overviewPattern = /overview/;

  if (overviewPattern.test(req?.url)) {
    return NextResponse.json(
      {
        userThatBoughtMostSinceBeginning,
        descListProductSoldThisMonth,
        descListCategorySoldSinceBeginning,
        descListProductSoldSinceBeginning,
        // Utilisation des nouvelles stats basées sur paymentStatus
        totalOrdersUnpaidThisMonth: [
          { totalOrdersUnpaid: monthlyStats.totalOrdersUnpaid },
        ],
        totalOrdersPaidThisMonth: [
          { totalOrdersPaid: monthlyStats.totalOrdersPaid },
        ],
        totalOrdersThisMonth: [{ totalOrders: monthlyStats.totalOrders }],
        ordersCount,
        totalPages,
        filteredOrdersCount,
        orders,
      },
      { status: 200 },
    );
  } else {
    return NextResponse.json(
      {
        // ADAPTÉ AU MODÈLE ORDER :
        // Suppression de totalOrdersDeliveredThisMonth (n'existe plus)
        // On utilise totalOrdersPaid à la place de delivered
        deliveredOrdersCount, // Count global des commandes payées
        totalOrdersThisMonth: [{ totalOrders: monthlyStats.totalOrders }],
        totalPages,
        ordersCount,
        filteredOrdersCount,
        orders,
      },
      { status: 200 },
    );
  }
}
