import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SLIDES = [
  {
    title: "Report infrastructure problems before they grow",
    subtitle:
      "Citizens document potholes, broken lights, and sanitation hazards with photos and precise locations.",
    cta: "Report an issue",
    href: "/register",
    accent: "from-emerald-600 via-emerald-700 to-teal-800",
  },
  {
    title: "Staff teams track assignments in one place",
    subtitle:
      "Municipal workers receive prioritized tasks, update status, and close the loop with residents.",
    cta: "Browse resolved work",
    href: "/all-issues",
    accent: "from-teal-700 via-cyan-800 to-slate-900",
  },
  {
    title: "Transparent progress for every neighborhood",
    subtitle:
      "Resolved issues stay visible so communities can see real maintenance outcomes across the city.",
    cta: "See latest fixes",
    href: "#resolved-issues",
    accent: "from-slate-800 via-emerald-800 to-emerald-900",
  },
];

export function HeroBanner() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[active];

  return (
    <section className="relative overflow-hidden" aria-label="Hero banner">
      <div
        className={`bg-gradient-to-br ${slide.accent} transition-all duration-700`}
      >
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24 lg:px-8">
          <div className="text-white">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-100">
              City Guardian Platform
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              {slide.title}
            </h1>
            <p className="mt-4 max-w-xl text-base text-emerald-50 sm:text-lg">
              {slide.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={slide.href}
                className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-emerald-900 hover:bg-emerald-50"
              >
                {slide.cta}
              </Link>
              <Link
                to="/all-issues"
                className="rounded-lg border border-white/50 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
              >
                View all issues
              </Link>
            </div>
          </div>

          <div className="hidden rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur lg:block">
            <ul className="space-y-4 text-sm text-emerald-50">
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                  1
                </span>
                Snap a photo and pin the exact location on the map.
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                  2
                </span>
                Staff review, assign, and move each report through clear statuses.
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                  3
                </span>
                Residents follow resolution progress until the issue is closed.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => setActive(index)}
            className={`h-2.5 rounded-full transition-all ${
              index === active ? "w-8 bg-white" : "w-2.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
