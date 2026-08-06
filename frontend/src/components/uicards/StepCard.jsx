export default function StepCard({ step, title, desc }) {

  return (
    <div
      className="
      group rounded-2xl border border-slate-200
      bg-white p-7 shadow-sm
      transition-all duration-300
      hover:-translate-y-2
      hover:border-emerald-300
      hover:shadow-xl
      "
    >

      <div
        className="
        flex h-12 w-12 items-center justify-center
        rounded-full bg-emerald-600
        text-sm font-bold text-white
        transition
        group-hover:scale-110
        "
      >
        {step}
      </div>


      <h3
        className="
        mt-6 text-xl font-bold
        group-hover:text-emerald-700
        "
      >
        {title}
      </h3>


      <p className="mt-3 text-sm text-slate-600">
        {desc}
      </p>

    </div>
  );
}