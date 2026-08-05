import PublicNavbar from '../components/PublicNavbar';

export default function Landing() {
  return (
    <main className="bg-slate-50">
      <PublicNavbar />

      <section className="mx-auto grid max-w-[1120px] items-center gap-8 px-6 py-16 md:grid-cols-[1.2fr_0.8fr] md:px-12 md:py-20 lg:px-12">
        <div>
          <p className="mb-4 font-mono text-[0.75rem] uppercase tracking-[0.06em] text-emerald-600">Smart crop planning</p>
          <h1 className="mb-5 max-w-[680px] font-display text-[2.75rem] leading-[1.12] tracking-[-0.03em] text-slate-900 md:text-[2.1rem]">
            E-Krishi crop recommendation
          </h1>
          <p className="max-w-[520px] text-[1.05rem] text-slate-600">
            Turn soil nutrients, pH, rainfall, humidity, and temperature into a
            practical crop suggestion for your field.
          </p>
        </div>

        <div className="hidden h-[320px] overflow-hidden rounded-[18px] border border-slate-200 bg-white md:block" aria-hidden="true">
          <div className="flex h-full w-full overflow-hidden rounded-none">
            <span className="flex-1 bg-[#5B8AA6]" />
            <span className="flex-1 bg-[#7BA888]" />
            <span className="flex-1 bg-[#D4915C]" />
            <span className="flex-1 bg-[#9B7BA8]" />
            <span className="flex-1 bg-[#C7A35A]" />
          </div>
        </div>
      </section>

      <section id="preview" className="mx-auto max-w-[1100px] px-6 pb-20 pt-10 md:px-12 md:pb-[90px] md:pt-10">
        <div className="mb-8">
          <p className="mb-2.5 font-mono text-[0.72rem] uppercase tracking-[0.06em] text-emerald-600">Recommendation preview</p>
          <h2 className="mb-3 font-display text-[1.9rem] text-slate-900">Know what to plant next</h2>
          <p className="max-w-[520px] text-[0.95rem] text-slate-600">
            Submit field readings in the dashboard and keep a history of your
            predictions for future planning.
          </p>
        </div>

        <div className="grid overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_rgba(15,23,42,0.06)] md:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-[14px_18px] border-slate-200 p-8 md:border-r md:grid-cols-2" aria-label="Sample soil readings">
            <div className="flex flex-col rounded-[10px] border border-slate-200 bg-white px-3 py-2.5">
              <span className="mb-0.5 text-[0.74rem] text-slate-600">Nitrogen</span>
              <strong className="font-mono text-[0.98rem] text-slate-900">72</strong>
            </div>
            <div className="flex flex-col rounded-[10px] border border-slate-200 bg-white px-3 py-2.5">
              <span className="mb-0.5 text-[0.74rem] text-slate-600">Phosphorus</span>
              <strong className="font-mono text-[0.98rem] text-slate-900">38</strong>
            </div>
            <div className="flex flex-col rounded-[10px] border border-slate-200 bg-white px-3 py-2.5">
              <span className="mb-0.5 text-[0.74rem] text-slate-600">Potassium</span>
              <strong className="font-mono text-[0.98rem] text-slate-900">41</strong>
            </div>
            <div className="flex flex-col rounded-[10px] border border-slate-200 bg-white px-3 py-2.5">
              <span className="mb-0.5 text-[0.74rem] text-slate-600">pH</span>
              <strong className="font-mono text-[0.98rem] text-slate-900">6.7</strong>
            </div>
            <div className="flex flex-col rounded-[10px] border border-slate-200 bg-white px-3 py-2.5">
              <span className="mb-0.5 text-[0.74rem] text-slate-600">Humidity</span>
              <strong className="font-mono text-[0.98rem] text-slate-900">64%</strong>
            </div>
            <div className="flex flex-col rounded-[10px] border border-slate-200 bg-white px-3 py-2.5">
              <span className="mb-0.5 text-[0.74rem] text-slate-600">Rainfall</span>
              <strong className="font-mono text-[0.98rem] text-slate-900">120 mm</strong>
            </div>
          </div>

          <div className="flex items-center justify-center p-8">
            <div className="w-full">
              <p className="mb-2.5 font-mono text-[0.72rem] uppercase tracking-[0.06em] text-emerald-600">Suggested crop</p>
              <h3 className="mb-3.5 font-display text-[1.7rem] text-slate-900">Rice</h3>
              <p className="text-center text-[0.9rem] text-slate-600">
                Create an account to run recommendations with your own data.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-[1100px] px-6 pb-20 md:px-12 md:pb-[90px]">
        <p className="mb-2.5 font-mono text-[0.72rem] uppercase tracking-[0.06em] text-emerald-600">Features</p>
        <h2 className="mb-3 font-display text-[1.9rem] text-slate-900">Built for quick farm decisions</h2>
        <div className="mt-9 grid gap-5 md:grid-cols-3">
          <article className="rounded-[18px] border border-slate-200 bg-gradient-to-b from-[#fbfaf5] to-[#f6f0dd] p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_rgba(15,23,42,0.06)]">
            <span className="mb-4 inline-block h-[6px] w-8 rounded-[4px] bg-[#C7A35A]" />
            <h3 className="mb-2 font-display text-[1.1rem] text-slate-900">Soil inputs</h3>
            <p className="text-[0.88rem] leading-[1.55] text-slate-600">
              Capture NPK, pH, rainfall, temperature, and humidity in one flow.
            </p>
          </article>
          <article className="rounded-[18px] border border-slate-200 bg-gradient-to-b from-[#fbfaf5] to-[#f6f0dd] p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_rgba(15,23,42,0.06)]">
            <span className="mb-4 inline-block h-[6px] w-8 rounded-[4px] bg-[#7BA888]" />
            <h3 className="mb-2 font-display text-[1.1rem] text-slate-900">Weather context</h3>
            <p className="text-[0.88rem] leading-[1.55] text-slate-600">
              Use current weather values to speed up recommendations.
            </p>
          </article>
          <article className="rounded-[18px] border border-slate-200 bg-gradient-to-b from-[#fbfaf5] to-[#f6f0dd] p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_rgba(15,23,42,0.06)]">
            <span className="mb-4 inline-block h-[6px] w-8 rounded-[4px] bg-[#5B8AA6]" />
            <h3 className="mb-2 font-display text-[1.1rem] text-slate-900">Saved history</h3>
            <p className="text-[0.88rem] leading-[1.55] text-slate-600">
              Review past predictions and compare crop suggestions over time.
            </p>
          </article>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-[1100px] px-6 pb-20 md:px-12 md:pb-[90px]">
        <p className="mb-2.5 font-mono text-[0.72rem] uppercase tracking-[0.06em] text-emerald-600">How it works</p>
        <h2 className="mb-3 font-display text-[1.9rem] text-slate-900">Simple steps to get started</h2>
        <div className="mt-9 grid gap-4 md:grid-cols-5">
          <div className="rounded-[18px] border border-slate-200 bg-white p-6 text-center shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_rgba(15,23,42,0.06)]">
            <div className="mx-auto mb-3.5 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-[1.1rem] font-bold text-white">1</div>
            <h3 className="mb-2 font-display text-[1rem] text-slate-900">Create Account</h3>
            <p className="text-[0.85rem] leading-[1.55] text-slate-600">Sign up with your email to start managing your crop recommendations.</p>
          </div>
          <div className="rounded-[18px] border border-slate-200 bg-white p-6 text-center shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_rgba(15,23,42,0.06)]">
            <div className="mx-auto mb-3.5 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-[1.1rem] font-bold text-white">2</div>
            <h3 className="mb-2 font-display text-[1rem] text-slate-900">Enter Soil Data</h3>
            <p className="text-[0.85rem] leading-[1.55] text-slate-600">Input your soil's Nitrogen, Phosphorus, Potassium levels and pH value.</p>
          </div>
          <div className="rounded-[18px] border border-slate-200 bg-white p-6 text-center shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_rgba(15,23,42,0.06)]">
            <div className="mx-auto mb-3.5 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-[1.1rem] font-bold text-white">3</div>
            <h3 className="mb-2 font-display text-[1rem] text-slate-900">Add Weather Info</h3>
            <p className="text-[0.85rem] leading-[1.55] text-slate-600">Provide temperature, humidity, and rainfall data for accuracy.</p>
          </div>
          <div className="rounded-[18px] border border-slate-200 bg-white p-6 text-center shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_rgba(15,23,42,0.06)]">
            <div className="mx-auto mb-3.5 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-[1.1rem] font-bold text-white">4</div>
            <h3 className="mb-2 font-display text-[1rem] text-slate-900">Get Recommendation</h3>
            <p className="text-[0.85rem] leading-[1.55] text-slate-600">Receive an AI-powered crop suggestion with confidence score.</p>
          </div>
          <div className="rounded-[18px] border border-slate-200 bg-white p-6 text-center shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_rgba(15,23,42,0.06)]">
            <div className="mx-auto mb-3.5 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-[1.1rem] font-bold text-white">5</div>
            <h3 className="mb-2 font-display text-[1rem] text-slate-900">Track History</h3>
            <p className="text-[0.85rem] leading-[1.55] text-slate-600">Keep a history of all your predictions for future reference.</p>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 px-6 py-10 text-center text-slate-50">
        <p className="mb-1.5 font-display text-[1.1rem] font-semibold">E-Krishi</p>
        <p className="text-[0.85rem] text-amber-100">Sign up, enter soil readings, and get a crop recommendation.</p>
      </footer>
    </main>
  );
}