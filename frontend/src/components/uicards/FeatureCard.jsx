export default function FeatureCard({ title, desc }) {
  return (
    <div
      className="
      group rounded-2xl border border-slate-200
      bg-white p-6 shadow-sm
      transition-all duration-300
      hover:-translate-y-2
      hover:border-emerald-300
      hover:shadow-xl
      "
    >

      <div
        className="
        mb-5 h-1 w-10 rounded-full bg-emerald-600
        transition-all duration-300
        group-hover:w-20
        "
      />

      <h3
        className="
        text-lg font-bold
        transition
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