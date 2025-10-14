import React from "react";
import dynamic from "next/dynamic";
import Loading from "@/app/loading";

const AddHomePageDetails = dynamic(
  () => import("@/components/homepage/AddHomePageDetails"),
  {
    loading: () => <Loading />,
  },
);

export const metadata = {
  title: "Dashboard - Ajouter Home Page",
  description: "Créer ou modifier le contenu de la page d'accueil",
};

const NewHomePagePage = () => {
  return <AddHomePageDetails />;
};

export default NewHomePagePage;
