"use client";

import { useState } from "react";
import type { SackShowcase } from "@/data/sacks";

type PackShotProps = {
  sack: SackShowcase;
  restRotate?: number;
  interactive?: boolean;
  alive?: boolean;
  dimmed?: boolean;
  coach?: boolean;
  size?: "hero" | "intro";
  index?: number;
  onSelect?: () => void;
  onActiveChange?: (active: boolean) => void;
};

export function PackShot({
  sack,
  restRotate = 0,
  interactive = true,
  alive = true,
  dimmed = false,
  coach = false,
  size = "hero",
  index = 0,
  onSelect,
  onActiveChange,
}: PackShotProps) {
  const [hover, setHover] = useState(false);
  const intro = size === "intro";
  const showSide = Boolean(interactive && hover && sack.side);
  const imgMax = intro
    ? "max-h-[22vh] sm:max-h-[26vh]"
    : "max-h-[min(52vw,36vh)] sm:max-h-[320px] lg:max-h-[380px]";

  const body = (
    <>
      <span
        className="pointer-events-none absolute bottom-[6%] left-1/2 h-5 w-[68%] -translate-x-1/2 rounded-[100%] bg-slate-900/20 blur-xl transition-opacity duration-300"
        style={{ opacity: dimmed ? 0.12 : hover ? 0.42 : 0.28 }}
        aria-hidden="true"
      />
      <span
        className="relative mx-auto block w-full"
        style={{ transform: `rotate(${restRotate}deg)` }}
      >
        <span
          className={`relative mx-auto block w-fit ${alive && !hover ? "sack-idle" : ""}`}
          style={{ animationDelay: `${index * 0.45}s` }}
        >
          <span
            className={`relative mx-auto block w-fit ${hover ? "pack-sheen" : ""} ${
              coach && !hover ? "coach-pulse" : ""
            }`}
          >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={sack.front}
            alt=""
            draggable={false}
            className={`relative mx-auto h-auto w-full select-none object-contain drop-shadow-[0_24px_28px_rgba(15,23,42,0.18)] transition-all duration-300 ${imgMax} ${
              showSide ? "opacity-0" : "opacity-100"
            } ${hover && interactive ? "-translate-y-2" : ""}`}
          />
          {sack.side ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={sack.side}
              alt=""
              draggable={false}
              className={`pointer-events-none absolute inset-0 m-auto h-auto w-auto select-none object-contain drop-shadow-[0_24px_28px_rgba(15,23,42,0.18)] transition-opacity duration-300 ${imgMax} ${
                showSide ? "opacity-100" : "opacity-0"
              }`}
            />
          ) : null}
          </span>
        </span>
      </span>
    </>
  );

  const shell = `relative flex w-full flex-col items-center transition-all duration-500 ${
    dimmed ? "scale-[0.96] opacity-45" : "scale-100 opacity-100"
  }`;

  if (!interactive) {
    return <div className={shell}>{body}</div>;
  }

  return (
    <button
      type="button"
      className={`${shell} cursor-pointer touch-manipulation`}
      aria-label={`View specs for ${sack.shortName}`}
      onClick={onSelect}
      onPointerEnter={() => {
        setHover(true);
        onActiveChange?.(true);
      }}
      onPointerLeave={() => {
        setHover(false);
        onActiveChange?.(false);
      }}
    >
      {body}
      <span className="relative z-10 mt-2 flex flex-col items-center">
        {sack.featured ? (
          <span className="mb-1 rounded-sm bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-800">
            Star
          </span>
        ) : (
          <span className="mb-1 h-[18px]" />
        )}
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
