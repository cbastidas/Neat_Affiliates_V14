// HomeHero.tsx
// A simple top-of-page hero section (no navbar link). All UI text is in English for consistency.
// Comments are in English.

//import React from "react";

type Props = {
  onLogin?: () => void;
  onSignup?: () => void;
  onScrollNext?: () => void; // scroll to the next section (e.g., WhyJoin)
};

export default function HomeHero({ onSignup, onScrollNext }: Props) {
  return (
    <section
      id="HomeHero"
      className="relative isolate overflow-hidden bg-transparent-to-b from-white to-gray-50
                hover:border-purple-300
                hover:rounded-2xl
                 hover:font-bold
                 hover:shadow-[0_0_12px_rgba(109,0,220,0.35)]
                 transition-all 
                 duration-300"
      style={{ paddingTop: "5rem" }} // offset for fixed navbar
    >
      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12 text-center">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900">
          Grow your affiliate revenue with <br></br>Neat Affiliates
        </h1>

        <p className="mt-4 text-lg text-gray-600">
          Tools, reporting and flexible deals to help you scale—fast.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={onSignup}
            className="font-bold sm:text-base lg:text-lg rounded-xl bg-green-600 px-5 py-2 sm:px-7 sm:py-3 text-white hover:bg-green-800 hover:font-bold transition"
          >
            Register Now and Start Earning
          </button>
        </div>
      <div className="mt-8 flex items-center justify-center gap-3">
        <button
            onClick={onScrollNext}
            className="font-bold text-sm sm:text-base lg:text-lg rounded-xl border px-4 py-2 sm:px-6 sm:py-3 text-gray-700
                 hover:border-purple-300
                 hover:font-bold
                 hover:text-purple-700
                 hover:shadow-[0_0_12px_rgba(109,0,220,0.35)]
                 transition-all 
                 duration-300"
            aria-label="Scroll to next section"
          >
            Learn more
          </button>
        </div>
        
        {/* 
        <div className="mt-12">
          <button
            onClick={onScrollNext}
            className="animate-bounce text-gray-500 hover:text-gray-700"
            aria-label="Scroll to next section"
          >
            ↓
          </button>
        </div>
          */}

        {/* Decorative area – keep it subtle */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -z-10 top-0 h-[320px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-100 via-transparent to-transparent"
        />
      </div>
    </section>
  );
}
