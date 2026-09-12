const STEPS = [
  { id: 1, label: "Tap a bag" },
  { id: 2, label: "Register" },
  { id: 3, label: "Get PDF" },
] as const;

export function StandGuide({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 px-2.5 py-2 sm:px-4 sm:py-3">
      <p className="hidden text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-800 sm:block">
        You&apos;re at the MikaZone stand
      </p>
      <ol className="flex items-center justify-between gap-1 sm:mt-2.5">
        {STEPS.map((item, index) => {
          const active = step === item.id;
          const done = step > item.id;
          return (
            <li key={item.id} className="flex min-w-0 flex-1 items-center gap-1">
              {index > 0 ? (
                <span
                  className={`h-px flex-1 ${done || active ? "bg-emerald-400" : "bg-emerald-200"}`}
                  aria-hidden="true"
                />
              ) : null}
              <span
                className={`flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                  active
                    ? "bg-emerald-600 text-white"
                    : done
                      ? "bg-emerald-500 text-white"
                      : "bg-white text-emerald-700 ring-1 ring-emerald-200"
                }`}
              >
                {item.id}
              </span>
              <span
                className={`truncate text-[11px] font-semibold sm:text-xs ${
                  active ? "text-emerald-950" : "text-emerald-700/80"
                }`}
              >
                {item.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
