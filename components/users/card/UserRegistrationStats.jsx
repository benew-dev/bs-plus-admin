/* eslint-disable react/prop-types */
import React from "react";
import { arrayHasData } from "@/helpers/helpers";
import UserStatCard from "./UserStatCard";

const UserRegistrationStats = ({
  open,
  totalUsers,
  totalClientUsers,
  totalUsersRegisteredThisMonth,
  totalUsersRegisteredLastMonth,
}) => {
  const lastMonth = new Date().getMonth();
  const currentMonth = lastMonth + 1;
  const currentYear = new Date().getFullYear();

  const data = [
    {
      title: "Tous les Utilisateurs",
      content: `${totalUsers === undefined || totalUsers === null ? "0 utilisateur" : `${totalUsers} utilisateur${totalUsers > 1 ? "s" : ""}`}`,
      indication: "Admin + Clients",
      color: "blue",
      icon: "fa-users",
    },
    {
      title: "Utilisateurs Clients",
      content: `${totalClientUsers === undefined || totalClientUsers === null ? "0 utilisateur" : `${totalClientUsers} utilisateur${totalClientUsers > 1 ? "s" : ""}`}`,
      indication: "Clients uniquement",
      color: "green",
      icon: "fa-user",
    },
    {
      title: "Nouveaux Ce Mois",
      content: `${arrayHasData(totalUsersRegisteredThisMonth) ? "0 utilisateur" : `${totalUsersRegisteredThisMonth[0]?.totalUsers} utilisateur${totalUsersRegisteredThisMonth[0]?.totalUsers > 1 ? "s" : ""}`}`,
      indication: `${currentMonth}/${currentYear}`,
      color: "purple",
      icon: "fa-user-plus",
    },
    {
      title: "Nouveaux Mois Dernier",
      content: `${arrayHasData(totalUsersRegisteredLastMonth) ? "0 utilisateur" : `${totalUsersRegisteredLastMonth[0]?.totalUsers} utilisateur${totalUsersRegisteredLastMonth[0]?.totalUsers > 1 ? "s" : ""}`}`,
      indication: `${lastMonth === 0 ? "12" : lastMonth}/${currentYear}`,
      color: "orange",
      icon: "fa-user-clock",
    },
  ];

  return (
    <div
      className={`${!open && "hidden"} bg-white rounded-lg shadow-md border border-gray-200 p-6`}
    >
      {/* Header des stats */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
        <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
          <i className="fa fa-chart-bar text-teal-600"></i>
        </div>
        <div>
          <h4 className="text-lg font-bold text-gray-800">
            Statistiques d'Inscription
          </h4>
          <p className="text-sm text-gray-500">
            Vue d'ensemble des inscriptions utilisateurs
          </p>
        </div>
      </div>

      {/* Grid des cartes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data?.map((item, index) => (
          <UserStatCard
            key={index}
            title={item?.title}
            content={item?.content}
            indication={item?.indication}
            color={item?.color}
            icon={item?.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default UserRegistrationStats;
