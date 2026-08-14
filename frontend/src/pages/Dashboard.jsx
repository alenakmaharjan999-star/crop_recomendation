import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CloudSun,
  FlaskConical,
  Leaf,
  Sprout,
  ThermometerSun,
  ArrowRight,
} from 'lucide-react';
import AppLayout from '../components/AppLayout';
import { getStoredLatestRecommendation } from '../api/apiClient';

const SYSTEM_CARDS = [
  {
    label: 'Supported crops',
    value: '22',
    detail: 'Crop classes in the trained dataset',
    icon: Sprout,
    tone: 'bg-emerald-100 text-emerald-700',
  },
  {
    label: 'Soil parameters',
    value: '4',
    detail: 'N, P, K, and soil pH',
    icon: FlaskConical,
    tone: 'bg-amber-100 text-amber-700',
  },
  {
    label: 'Fertilizer advice',
    value: 'NPK',
    detail: 'Deficit-based recommendation',
    icon: Leaf,
    tone: 'bg-lime-100 text-lime-700',
  },
  {
    label: 'Weather parameters',
    value: '3',
    detail: 'Temperature, humidity, rainfall',
    icon: CloudSun,
    tone: 'bg-sky-100 text-sky-700',
  },
];

const STEPS = [
  {
    number: '01',
    title: 'Enter soil & weather data',
    detail:
      'Provide soil nutrients, pH, and a location for environmental conditions.',
    icon: FlaskConical,
  },
  {
    number: '02',
    title: 'Get crop prediction',
    detail:
      'The trained model evaluates the supplied agricultural parameters.',
    icon: Sprout,
  },
  {
    number: '03',
    title: 'Get fertilizer recommendation',
    detail:
      'NPK nutrient deficits are matched to an appropriate fertilizer.',
    icon: Leaf,
  },
];

const PARAMETERS = [
  {
    label: 'Nitrogen',
    icon: FlaskConical,
  },
  {
    label: 'Phosphorus',
    icon: FlaskConical,
  },
  {
    label: 'Potassium',
    icon: FlaskConical,
  },
  {
    label: 'Soil pH',
    icon: FlaskConical,
  },
  {
    label: 'Temperature',
    icon: ThermometerSun,
  },
  {
    label: 'Humidity',
    icon: CloudSun,
  },
  {
    label: 'Rainfall',
    icon: CloudSun,
  },
];

export default function Dashboard() {
  const [latestRecommendation, setLatestRecommendation] = useState(null);

  useEffect(() => {
    setLatestRecommendation(getStoredLatestRecommendation());
  }, []);

  const fertilizer =
    latestRecommendation?.fertilizerRecommendation?.recommendation;

  return (
    <AppLayout>
      {/* Header */}
      <header className="mb-8 max-w-3xl">
       

        <h1 className="font-display text-2xl text-slate-900 md:text-[1.8rem]">
          Crop Recommendation System
        </h1>

        <p className="mt-3 text-[0.94rem] leading-6 text-slate-600">
          Use soil nutrient and environmental parameters to receive
          evidence-based crop predictions and NPK fertilizer guidance.
        </p>
      </header>

      {/* System Overview */}
      <section
        aria-label="System overview"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {SYSTEM_CARDS.map(
          ({ label, value, detail, icon: Icon, tone }) => (
            <article
              key={label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_rgba(15,23,42,0.06)]"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}
              >
                <Icon size={20} aria-hidden="true" />
              </div>

              <p className="mt-4 text-sm text-slate-600">{label}</p>

              <p className="mt-1 font-display text-2xl font-semibold text-slate-900">
                {value}
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                {detail}
              </p>
            </article>
          )
        )}
      </section>

      {/* How the System Works */}
      <section className="mt-8 rounded-[18px] border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_rgba(15,23,42,0.06)] sm:p-6">
        <h2 className="font-display text-[1.2rem] text-slate-900">
          How the system works
        </h2>

        <p className="mt-1 text-sm text-slate-600">
          A simple path from field measurements to practical guidance.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {STEPS.map(
            ({ number, title, detail, icon: Icon }) => (
              <article
                key={number}
                className="relative rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-700">
                    {number}
                  </span>

                  <Icon
                    size={19}
                    className="text-emerald-700"
                    aria-hidden="true"
                  />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-slate-900">
                  {title}
                </h3>

                <p className="mt-1 text-sm leading-5 text-slate-600">
                  {detail}
                </p>
              </article>
            )
          )}
        </div>
      </section>

      {/* Parameters + Latest Recommendation */}
      <section className="mt-8 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        {/* Supported Parameters */}
        <div className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_rgba(15,23,42,0.06)] sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
              <ThermometerSun size={20} aria-hidden="true" />
            </div>

            <div>
              <h2 className="font-display text-[1.2rem] text-slate-900">
                Supported parameters
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                The seven features currently used by the crop recommendation
                model.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2">
            {PARAMETERS.map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5"
              >
                <Icon
                  size={17}
                  className="shrink-0 text-emerald-700"
                  aria-hidden="true"
                />

                <span className="text-sm font-medium text-slate-700">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Recommendation */}
        <section className="rounded-[18px] border border-emerald-200 bg-emerald-50/50 p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_rgba(15,23,42,0.06)] sm:p-6">
          <h2 className="font-display text-[1.2rem] text-slate-900">
            Latest recommendation
          </h2>

          {latestRecommendation?.crop ? (
            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-emerald-100 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  Crop
                </p>

                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {latestRecommendation.crop}
                </p>
              </div>

              <div className="rounded-xl border border-emerald-100 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  Fertilizer
                </p>

                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {fertilizer?.name ||
                    'Not returned for this recommendation'}
                </p>
              </div>

              <Link
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                to="/recommend"
              >
                Make another recommendation
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-dashed border-emerald-200 bg-white/80 p-4">
              <p className="font-semibold text-slate-900">
                No recommendation available yet
              </p>

              <p className="mt-1 text-sm leading-5 text-slate-600">
                Start with your soil readings to get a crop prediction and
                fertilizer guidance.
              </p>

              <Link
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                to="/recommend"
              >
                Go to Recommend
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          )}
        </section>
      </section>
    </AppLayout>
  );
}