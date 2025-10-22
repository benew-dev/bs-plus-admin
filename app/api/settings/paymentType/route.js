import dbConnect from "@/backend/config/dbConnect";
import {
  authorizeRoles,
  isAuthenticatedUser,
} from "@/backend/middlewares/auth";
import PaymentType from "@/backend/models/paymentType";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // Vérifier l'authentification
    await isAuthenticatedUser(req, NextResponse);

    // Vérifier le role
    authorizeRoles(NextResponse, "admin");

    // Connexion DB
    await dbConnect();

    const paymentTypes = await PaymentType.find();

    return NextResponse.json(
      {
        success: true,
        paymentTypes,
        count: paymentTypes.length,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching payment types:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch payment types",
      },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    // Vérifier l'authentification
    await isAuthenticatedUser(req, NextResponse);

    // Vérifier le role
    authorizeRoles(NextResponse, "admin");

    // Connexion DB
    await dbConnect();

    const body = await req.json();

    // Validation des données
    if (!body.platform) {
      return NextResponse.json(
        {
          success: false,
          error: "La plateforme de paiement est requise",
        },
        { status: 400 },
      );
    }

    // Vérifier si la plateforme existe déjà
    const existingPlatform = await PaymentType.findOne({
      platform: body.platform,
    });

    if (existingPlatform) {
      return NextResponse.json(
        {
          success: false,
          error: `La plateforme ${body.platform} existe déjà`,
        },
        { status: 409 },
      );
    }

    // Compter les types de paiement existants
    const totalPaymentType = await PaymentType.countDocuments();

    // Limite augmentée à 5 pour inclure CASH + 4 plateformes électroniques
    if (totalPaymentType >= 5) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Vous avez atteint la limite maximale de 5 moyens de paiement. Pour ajouter une nouvelle plateforme, supprimez-en une.",
        },
        { status: 400 },
      );
    }

    // Validation conditionnelle pour CASH
    if (body.platform === "CASH") {
      // Pour CASH, on n'exige pas paymentName et paymentNumber
      body.paymentName = body.paymentName || "Paiement en espèces";
      body.paymentNumber = body.paymentNumber || "N/A";
      body.isCashPayment = true;
      body.description = "Paiement en espèces lors de la récupération";
    } else {
      // Pour les autres plateformes, validation stricte
      if (!body.paymentName || !body.paymentNumber) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Le nom du titulaire et le numéro de compte sont requis pour les paiements électroniques",
          },
          { status: 400 },
        );
      }
    }

    // Créer le type de paiement
    const paymentType = await PaymentType.create(body);

    return NextResponse.json(
      {
        success: true,
        paymentType,
        message: "Moyen de paiement ajouté avec succès",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating payment type:", error);

    // Gestion des erreurs de validation Mongoose
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        {
          success: false,
          error: messages.join(", "),
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Échec de l'ajout du moyen de paiement",
      },
      { status: 500 },
    );
  }
}
