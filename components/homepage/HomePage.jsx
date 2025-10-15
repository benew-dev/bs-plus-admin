/* eslint-disable react/prop-types */
"use client";

import { CldImage } from "next-cloudinary";
import Link from "next/link";

export default function HomePage({ data }) {
  if (!data || !data.title) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <div className="text-center py-16">
          <svg
            className="w-24 h-24 mx-auto text-slate-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-lg font-semibold text-slate-600 mb-2">
            Aucune page d'accueil configurée
          </p>
          <p className="text-slate-500 mb-6">
            Créez votre première page d'accueil pour commencer
          </p>
          <Link
            href="/admin/homepage/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg font-semibold"
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
            Créer la page d'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Contenu Actuel</h2>
              <p className="text-white/80">Page d'accueil du site</p>
            </div>
          </div>
          <Link
            href="/admin/homepage/edit"
            className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-xl hover:bg-white/90 transition-all shadow-lg font-semibold"
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Modifier
          </Link>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Titre */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Titre
          </label>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <p className="text-lg font-bold text-slate-800">{data.title}</p>
          </div>
        </div>

        {/* Sous-titre */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Sous-titre
          </label>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <p className="text-slate-700">{data.subtitle}</p>
          </div>
        </div>

        {/* Texte */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Texte
          </label>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <p className="text-slate-700 whitespace-pre-wrap">{data.text}</p>
          </div>
        </div>

        {/* Image */}
        {data.image && data.image.public_id && (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Image
            </label>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="aspect-video rounded-lg overflow-hidden">
                <CldImage
                  src={data.image.public_id}
                  alt={data.title}
                  width={800}
                  height={450}
                  crop="fill"
                  gravity="center"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* Preview Card */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-dashed border-indigo-300">
          <p className="text-xs uppercase text-indigo-600 font-semibold mb-3">
            Aperçu
          </p>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {data.image && data.image.public_id && (
              <div className="aspect-video">
                <CldImage
                  src={data.image.public_id}
                  alt={data.title}
                  width={600}
                  height={338}
                  crop="fill"
                  gravity="center"
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <div className="p-6">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                {data.title}
              </h3>
              <p className="text-lg text-slate-600 mb-4">{data.subtitle}</p>
              <p className="text-slate-700">{data.text}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
