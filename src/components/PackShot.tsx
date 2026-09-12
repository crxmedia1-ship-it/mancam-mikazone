"use client";

import type { SackShowcase } from "@/data/sacks";

type PackShotProps = {
  sack: SackShowcase;
  dimmed?: boolean;
  alive?: boolean;
  lite?: boolean;
  showCaption?: boolean;
  revealCaption?: boolean;
  index?: number;
  onSelect?: () => void;
};

export function PackShot({
  sack,
  dimmed = false,
  alive = false,
  lite = false,
  showCaption = false,
  revealCaption = false,
  index = 0,
  onSelect,
}: PackShotProps) {
  const imgMax =
    "max-h-[min(48vw,30vh)] sm:max-h-[320px] lg:max-h-[380px] xl:max-h-[min(52vh,540px)] 2xl:max-h-[min(58vh,640px)]";

  const caption =
    onSelect || showCaption ? (
      <span
        className={`relative z-10 mt-2 flex flex-col items-center ${
          revealCaption ? "sack-caption-in" : showCaption && !onSelect ? "opacity-0" : ""
        }`}
        style={
          revealCaption ? { animationDelay: `${0.08 + index * 0.16}s` } : undefined
        }
      >
        <span className="text-[11px] font-bold tracking-wide text-slate-800 sm:text-xs">
          {sack.shortName}
        </span>
        <span className="mt-0.5 hidden max-w-[11rem] text-center text-[10px] leading-tight text-slate-400 sm:block">
          {sack.chemical}
        </span>
      </span>
    ) : null;

  const body = (
    <>
      {lite ? null : (
        <span
          className="sack-aura pointer-events-none absolute bottom-[4%] left-1/2 hidden h-10 w-[88%] rounded-[100%] blur-2xl sm:block"
          style={{
            background: sack.accent,
            animationDelay: `${index * 0.45}s`,
            animationPlayState: dimmed ? "paused" : "running",
          }}
          aria-hidden="true"
        />
      )}
      <span
        className={`relative mx-auto block w-fit ${alive && !dimmed && !lite ? "sack-idle" : ""}`}
        style={{ animationDelay: `${index * 0.45}s` }}
      >
        {lite ? null : (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden scale-[1.035] blur-[4px] sm:block"
            style={{
              WebkitMaskImage: `url(${sack.front})`,
              WebkitMaskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskImage: `url(${sack.front})`,
              maskSize: "contain",
              maskRepeat: "no-repeat",
              maskPosition: "center",
              backgroundColor: sack.accent,
              opacity: 0.55,
            }}
          />
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={sack.front}
          alt=""
          draggable={false}
          className={`relative mx-auto h-auto w-full select-none object-contain ${imgMax}`}
          style={
            lite
              ? undefined
              : { filter: "drop-shadow(0 12px 14px rgba(15,23,42,0.12))" }
          }
        />
      </span>
    </>
  );

  const shell = `relative flex w-full flex-col items-center transition-opacity duration-300 ${
    dimmed ? "opacity-45" : "opacity-100"
  }`;

  if (!onSelect) {
    return (
      <div className={shell}>
        {body}
        {caption}
      </div>
    );
  }

  return (
    <button
      type="button"
      className={`${shell} cursor-pointer touch-manipulation`}
      aria-label={`View specs for ${sack.shortName}`}
      onClick={onSelect}
    >
      {body}
      {caption}
    </button>
  );
}
