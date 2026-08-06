export default function SectionTitle({ eyebrow, title, description }) {

  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-3xl font-bold">
        {title}
      </h2>


      {description && (
        <p className="mt-3 max-w-xl text-slate-600">
          {description}
        </p>
      )}

    </>
  );
}