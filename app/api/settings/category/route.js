import dbConnect from "@/backend/config/dbConnect";
import {
  authorizeRoles,
  isAuthenticatedUser,
} from "@/backend/middlewares/auth";
import Category from "@/backend/models/category";
import { NextResponse } from "next/server";

export async function POST(req) {
  // Vérifier l'authentification
  await isAuthenticatedUser(req, NextResponse);

  // Vérifier le role
  authorizeRoles(NextResponse, "admin");

  // Connexion DB
  await dbConnect();

  const totalCategory = await Category.countDocuments();

  const body = await req.json();

  if (totalCategory < 6) {
    // Créer la catégorie avec les données envoyées (incluant isActive)
    const categoryData = {
      categoryName: body.categoryName,
      isActive: body.isActive || false, // Par défaut false si non spécifié
    };

    const categoryAdded = await Category.create(categoryData);

    return NextResponse.json(
      {
        success: true,
        categoryAdded,
      },
      { status: 201 },
    );
  } else {
    const error =
      "You have reached the maximum limit, 6, of category. To add another category, delete one.";

    return NextResponse.json(
      {
        success: false,
        error,
      },
      { status: 401 },
    );
  }
}

export async function GET(req) {
  // Vérifier l'authentification
  await isAuthenticatedUser(req, NextResponse);

  // Vérifier le role
  authorizeRoles(NextResponse, "admin");

  // Connexion DB
  await dbConnect();

  // Récupérer toutes les catégories triées par statut (actives d'abord)
  const categories = await Category.find().sort({
    isActive: -1,
    categoryName: 1,
  });

  return NextResponse.json(
    {
      categories,
    },
    { status: 200 },
  );
}
