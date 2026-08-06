import logo from "../assets/logoagri.jpg";

export default function AuthLayout({
  eyebrow,
  title,
  subtitle,
  children,
}) {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-6">

      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white shadow-md">

        <div className="px-6 py-7">

          {/* Logo Section */}
          <div className="mb-5 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 shadow-sm overflow-hidden">
              <img
                src={logo}
                alt="E-Krishi Logo"
                className="h-full w-full object-contain p-1"
              />
            </div>

            <h2 className="mt-3 text-xl font-bold text-slate-800">
              E-Krishi
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Crop Recommendation System
            </p>

          </div>

          <div className="mb-5 text-center">

            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-600">
              {eyebrow}
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-800">
              {title}
            </h1>

            {subtitle && (
              <p className="mt-2 text-xs leading-5 text-slate-500">
                {subtitle}
              </p>
            )}

          </div>

          {children}

        </div>

      </div>

    </div>
  );
}