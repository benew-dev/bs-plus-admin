import React from "react";
import dynamic from "next/dynamic";
import { Suspense } from "react";
const Sidebar = dynamic(() => import("@/components/layouts/Sidebar"));

// eslint-disable-next-line react/prop-types
const AdminLayout = ({ children }) => {
  return (
    <>
      {/* Header responsive */}
      <section className="py-3 sm:py-5 md:py-7 bg-blue-100">
        <div className="container max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
            Admin Dashboard
          </h1>
        </div>
      </section>

      {/* Main content responsive */}
      <section className="py-4 sm:py-6 md:py-8 lg:py-10">
        <div className="container max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            {/* Sidebar - Hidden on mobile by default */}
            <Sidebar />

            {/* Main content area */}
            <main className="flex-1 w-full min-w-0">
              <article className="border border-gray-200 bg-white shadow-sm sm:shadow-md rounded-lg mb-5 p-3 sm:p-4 lg:p-6">
                <Suspense>{children}</Suspense>
              </article>
            </main>
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminLayout;
