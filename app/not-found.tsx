"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)] px-5 py-12">
      <div className="flex flex-col md:flex-row items-center gap-10 max-w-2xl w-full">
        {/* Illustration */}
        <div className="relative shrink-0">
          <div className="w-52 h-52 rounded-2xl bg-surface-container overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80"
              alt="Closed gate"
              className="w-full h-full object-cover opacity-80"
            />
          </div>
          <div className="absolute -bottom-3 -right-3 bg-tertiary text-on-tertiary font-headline font-extrabold text-lg px-4 py-1.5 rounded-full shadow-lg">
            404
          </div>
        </div>

        {/* Content */}
        <div className="text-center md:text-left">
          <p className="text-[10px] font-label font-bold uppercase tracking-widest text-outline mb-2">
            Lost in the Mist
          </p>
          <h1 className="font-headline font-extrabold text-4xl text-on-surface tracking-tight mb-3">
            Page Not Found
          </h1>
          <p className="text-sm font-body text-on-surface-variant leading-relaxed mb-8 max-w-sm">
            Like a traveler missing their stop in a quiet mountain village, it seems this path has led to a closed gate. The curator suggests returning to the main trail.
          </p>
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <Link
              href="/"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-body font-bold text-sm hover:bg-primary-dim transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">home</span>
              Go Back Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-container text-on-surface font-body font-medium text-sm hover:bg-surface-container-high transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Previous Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
