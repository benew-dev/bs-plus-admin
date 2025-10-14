import { NextResponse } from "next/server";
import connectDB from "@/backend/config/dbConnect";
import HomePage from "@/backend/models/homepage";

// GET - Récupérer la page d'accueil
export async function GET(req) {
  try {
    await connectDB();

    const homePage = await HomePage.findOne().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: homePage,
    });
  } catch (error) {
    console.error("HomePage GET Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}

// POST - Créer ou mettre à jour la page d'accueil
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { title, subtitle, text, image } = body;

    // Validation
    if (!title || !subtitle || !text || !image) {
      return NextResponse.json(
        {
          success: false,
          message: "Tous les champs sont requis",
        },
        { status: 400 },
      );
    }

    // Créer ou mettre à jour (on garde une seule page d'accueil)
    const homePage = await HomePage.findOneAndUpdate(
      {},
      {
        title,
        subtitle,
        text,
        image,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );

    return NextResponse.json({
      success: true,
      message: "Page d'accueil créée avec succès",
      data: homePage,
    });
  } catch (error) {
    console.error("HomePage POST Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}

// PUT - Mettre à jour la page d'accueil
export async function PUT(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { title, subtitle, text, image } = body;

    const homePage = await HomePage.findOneAndUpdate(
      {},
      {
        title,
        subtitle,
        text,
        image,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!homePage) {
      return NextResponse.json(
        {
          success: false,
          message: "Page d'accueil non trouvée",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Page d'accueil mise à jour avec succès",
      data: homePage,
    });
  } catch (error) {
    console.error("HomePage PUT Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
