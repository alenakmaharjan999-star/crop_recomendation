export default function AuthLayout({ eyebrow, title, subtitle, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="grid w-full max-w-[920px] overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_rgba(15,23,42,0.06)] md:min-h-[560px] md:grid-cols-2">
        <div className="flex flex-col justify-between bg-gradient-to-b from-slate-700 to-slate-950 p-10 text-slate-50 md:p-9">
          <div>
            <span className="font-display text-[1.15rem] font-semibold tracking-[0.01em]">🌱 E-Krishi</span>
          </div>

          <div className="mt-10">
            <h2 className="mb-4 font-display text-[1.8rem] font-medium leading-tight text-slate-50 md:text-[1.52rem]">
              Read the soil.<br />Know the crop.
            </h2>
            <p className="max-w-[320px] text-[0.92rem] leading-6 text-amber-100">
              Nitrogen, phosphorus, potassium, temperature, humidity, pH and
              rainfall — seven readings in, one confident recommendation out.
            </p>

            <div className="mt-8 max-w-[320px]">
              <div className="flex h-[6px] w-full overflow-hidden rounded-[4px]">
                <span className="flex-1 bg-[#C7A35A]" />
                <span className="flex-1 bg-[#D4915C]" />
                <span className="flex-1 bg-[#7BA888]" />
                <span className="flex-1 bg-[#5B8AA6]" />
                <span className="flex-1 bg-[#9B7BA8]" />
              </div>
              <div className="mt-2 flex justify-between font-mono text-[0.62rem] tracking-[0.02em] text-amber-100/80">
                <span>N·P·K</span>
                <span>Temp</span>
                <span>Humidity</span>
                <span>Rainfall</span>
                <span>pH</span>
              </div>
            </div>
          </div>

          <p className="font-mono text-[0.7rem] tracking-[0.02em] text-emerald-300">Soil-to-decision, in seconds.</p>
        </div>

        <div className="flex items-center justify-center p-10 md:p-10">
          <div className="w-full max-w-[340px]">
            <p className="mb-2.5 font-mono text-[0.7rem] uppercase tracking-[0.08em] text-emerald-600">{eyebrow}</p>
            <h1 className="mb-1.5 font-display text-[1.6rem] text-slate-900">{title}</h1>
            {subtitle && <p className="mb-7 text-[0.9rem] text-slate-600">{subtitle}</p>}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}