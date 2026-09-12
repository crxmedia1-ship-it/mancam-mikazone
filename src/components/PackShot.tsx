"use client";

import type { SackShowcase } from "@/data/sacks";

type PackShotProps = {
  sack: SackShowcase;
  dimmed?: boolean;
  onSelect?: () => void;
};

export function PackShot({
  sack,
  dimmed = false,
  onSelect,
}: PackShotProps) {
  const imgMax = "max-h-[min(48vw,30vh)] sm:max-h-[320px] lg:max-h-[380px]";

  const body = (
    <>
      <span
        className="pointer-events-none absolute bottom-[8%] left-1/2 h-6 w-[70%] -translate-x-1/2 rounded-[100%] bg-slate-900/20 blur-2xl"
        style={{ opacity: dimmed ? 0.08 : 0.22 }}
        aria-hidden="true"
      />
      <span className="relative mx-auto block w-fit">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={sack.front}
          alt=""
          draggable={false}
          className={`relative mx-auto h-auto w-full select-none object-contain drop-shadow-[0_18px_24px_rgba(15,23,42,0.16)] ${imgMax}`}
        />
      </span>
    </>
  );

  const shell = `relative flex w-full flex-col items-center transition-opacity duration-300 ${
    dimmed ? "opacity-45" : "opacity-100"
  }`;

  if (!onSelect) {
    return <div className={shell}>{body}</div>;
  }

  return (
    <button
      type="button"
      className={`${shell} cursor-pointer touch-manipulation`}
      aria-label={`View specs for ${sack.shortName}`}
      onClick={onSelect}
    >
      {body}
      <span className="relative z-10 mt-2 flex flex-col items-center">
        <span className="text-[11px] font-bold tracking-wide text-slate-800 sm:text-xs">
          {sack.shortName}
        </span>
        <span className="mt-0.5 hidden max-w-[11rem] text-center text-[10px] leading-tight text-slate-400 sm:block">
          {sack.chemical}
        </span>
      </span>
    </button>
  );
}
