import React from "react";
import dynamic from "next/dynamic";
import Loading from "@/app/loading";
import Link from "next/link";

const HomePage = dynamic(() => import("@/components/homepage/HomePage"), {
  loading: () => <Loading />,
});

import { getHomePageData } from "@/backend/utils/server-only-methods";

export const metadata = {
  title: "Home Page - Dashboard Admin",
  description: "Gérer le contenu de la page d'accueil",
};

const HomePagePage = async () => {
  const homePageData = await getHomePageData();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Gestion de la Page d'Accueil
          </h1>
          <p className="text-slate-600 mt-1">
            Personnalisez le contenu de votre page d'accueil
          </p>
        </div>
        <Link
          href="/admin/homepage/new"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg font-semibold"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Ajouter Home Page
        </Link>
      </div>

      <HomePage data={homePageData} />
    </div>
  );
};

export default HomePagePage;
