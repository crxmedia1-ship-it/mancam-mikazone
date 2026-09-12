"use client";

import type { SackShowcase } from "@/data/sacks";

type PackShotProps = {
  sack: SackShowcase;
  dimmed?: boolean;
  alive?: boolean;
  index?: number;
  onSelect?: () => void;
};

export function PackShot({
  sack,
  dimmed = false,
  alive = false,
  index = 0,
  onSelect,
}: PackShotProps) {
  const imgMax =
    "max-h-[min(48vw,30vh)] sm:max-h-[320px] lg:max-h-[380px] xl:max-h-[min(52vh,540px)] 2xl:max-h-[min(58vh,640px)]";
  const mask = {
    WebkitMaskImage: `url(${sack.front})`,
    WebkitMaskSize: "contain",
    WebkitMaskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskImage: `url(${sack.front})`,
    maskSize: "contain",
    maskRepeat: "no-repeat",
    maskPosition: "center",
  } as const;

  const body = (
    <>
      <span
        className="sack-aura pointer-events-none absolute bottom-[4%] left-1/2 h-10 w-[88%] rounded-[100%] blur-2xl"
        style={{
          background: sack.accent,
          animationDelay: `${index * 0.45}s`,
          animationPlayState: dimmed ? "paused" : "running",
        }}
        aria-hidden="true"
      />
      <span
        className={`relative mx-auto block w-fit ${alive && !dimmed ? "sack-idle" : ""}`}
        style={{ animationDelay: `${index * 0.45}s` }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 scale-[1.035] blur-[4px]"
          style={{ ...mask, backgroundColor: sack.accent, opacity: 0.55 }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={sack.front}
          alt=""
          draggable={false}
          className={`relative mx-auto h-auto w-full select-none object-contain ${imgMax}`}
          style={{
            filter: `drop-shadow(0 16px 18px rgba(15,23,42,0.14))`,
          }}
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
