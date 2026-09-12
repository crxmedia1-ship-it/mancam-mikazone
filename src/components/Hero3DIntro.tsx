"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PackShot } from "@/components/PackShot";
import { SACK_IMAGE_SRC, SACK_LINEUP, SACK_REST_ROTATE } from "@/data/sacks";

const INTRO_MS = 9200;
const OPEN_MS = 1100;
const POUR_MS = 1450;
const BRAND_MS = 3200;
const SETTLE_MS = 6200;
const FADE_MS = 8000;
const LOGO_SRC =
  "https://res.cloudinary.com/dgphys1xd/image/upload/v1788992084/Photoroom_20260909_181404_r3umw2.png";

const MOUTHS = [
  { left: 17, hex: "#2E9BB0", cloud: "rgba(46,155,176,0.82)" },
  { left: 50, hex: "#D45A20", cloud: "rgba(212,90,32,0.8)" },
  { left: 83, hex: "#178A78", cloud: "rgba(23,138,120,0.82)" },
] as const;

function buildPowder() {
  return MOUTHS.flatMap((mouth, bag) =>
    Array.from({ length: 14 }, (_, i) => ({
      left: `${mouth.left + ((i % 3) - 1) * 2.2}%`,
      color: mouth.hex,
      dx: `${((i % 7) - 3) * 4.2}vw`,
      dy: `${22 + (i % 6) * 7}vh`,
      delay: `${bag * 60 + i * 80}ms`,
      size: 22 + (i % 5) * 8,
      soft: i % 2 === 0,
    })),
  );
}

const PLUMES = [
  { left: "17%", color: "linear-gradient(180deg, #2E9BB0 0%, rgba(46,155,176,0) 100%)", delay: "0ms" },
  { left: "50%", color: "linear-gradient(180deg, #D45A20 0%, rgba(212,90,32,0) 100%)", delay: "60ms" },
  { left: "83%", color: "linear-gradient(180deg, #178A78 0%, rgba(23,138,120,0) 100%)", delay: "30ms" },
] as const;

const CLOUDS = [
  { left: "17%", color: "rgba(46,155,176,0.88)", delay: "0ms", size: 280 },
  { left: "32%", color: "rgba(46,155,176,0.5)", delay: "140ms", size: 210 },
  { left: "50%", color: "rgba(212,90,32,0.88)", delay: "50ms", size: 300 },
  { left: "64%", color: "rgba(212,90,32,0.48)", delay: "180ms", size: 220 },
  { left: "83%", color: "rgba(23,138,120,0.88)", delay: "90ms", size: 280 },
  { left: "70%", color: "rgba(23,138,120,0.48)", delay: "220ms", size: 210 },
] as const;

export function Hero3DIntro({ onComplete }: { onComplete: () => void }) {
  const completedRef = useRef(false);
  const powder = useMemo(buildPowder, []);
  const [ready, setReady] = useState(false);
  const [opened, setOpened] = useState(false);
  const [pouring, setPouring] = useState(false);
  const [showBrand, setShowBrand] = useState(false);
  const [settled, setSettled] = useState(false);
  const [fading, setFading] = useState(false);

  function finish() {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete();
  }

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      finish();
      return;
    }

    let cancelled = false;
    const images = [...SACK_IMAGE_SRC, LOGO_SRC];
    Promise.all(
      images.map(
        (src) =>
          new Promise<void>((resolve) => {
            const img = new window.Image();
            img.onload = () => resolve();
            img.onerror = () => resolve();
            img.src = src;
          }),
      ),
    ).then(() => {
      if (!cancelled) setReady(true);
    });

    const fallback = window.setTimeout(() => {
      if (!cancelled) setReady(true);
    }, 280);

    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const openTimer = window.setTimeout(() => setOpened(true), OPEN_MS);
    const pourTimer = window.setTimeout(() => setPouring(true), POUR_MS);
    const brandTimer = window.setTimeout(() => setShowBrand(true), BRAND_MS);
    const settleTimer = window.setTimeout(() => setSettled(true), SETTLE_MS);
    const fadeTimer = window.setTimeout(() => setFading(true), FADE_MS);
    const doneTimer = window.setTimeout(finish, INTRO_MS);

    return () => {
      window.clearTimeout(openTimer);
      window.clearTimeout(pourTimer);
      window.clearTimeout(brandTimer);
      window.clearTimeout(settleTimer);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(doneTimer);
      document.body.style.overflow = previousOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-hidden bg-white"
      initial={{ opacity: 1 }}
      animate={{ opacity: fading ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      role="dialog"
      aria-label="MikaZone introduction"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 48%, rgba(16,185,129,0.14), transparent 58%)",
        }}
      />

      <motion.div
        className="absolute inset-x-0 top-[5%] z-20 px-3 sm:px-8"
        initial={{ y: 28, opacity: 0 }}
        animate={
          ready
            ? {
                y: settled ? "52dvh" : 0,
                scale: settled ? 1.16 : 1,
                opacity: 1,
              }
            : { y: 28, opacity: 0 }
        }
        transition={
          settled
            ? { type: "spring", stiffness: 108, damping: 16, mass: 1.3 }
            : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
        }
      >
        <div className="relative mx-auto grid max-w-lg grid-cols-3 items-end gap-2 sm:max-w-2xl sm:gap-6">
          {SACK_LINEUP.map((sack, index) => (
            <motion.div
              key={sack.productId}
              className="origin-bottom"
              animate={
                settled
                  ? { scaleY: [0.92, 1.05, 1], rotate: SACK_REST_ROTATE[index] }
                  : opened
                    ? { scaleY: [1, 1.04, 0.98, 1], rotate: 0 }
                    : { rotate: 0, scaleY: 1 }
              }
              transition={{ duration: settled ? 0.5 : 0.45, ease: "easeOut" }}
            >
              <PackShot
                sack={sack}
                restRotate={0}
                interactive={false}
                alive={false}
                opened={opened && !settled}
                size="intro"
                index={index}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="pointer-events-none absolute inset-0 z-30">
        {pouring
          ? PLUMES.map((plume, i) => (
              <span
                key={`plume-${i}`}
                className="intro-plume absolute top-[26%] w-16 rounded-full sm:w-20"
                style={{
                  left: plume.left,
                  height: "34vh",
                  background: plume.color,
                  filter: "blur(10px)",
                  animationDelay: plume.delay,
                }}
              />
            ))
          : null}

        {pouring
          ? powder.map((speck, i) => (
              <span
                key={i}
                className={`intro-powder-fall absolute top-[27%] rounded-full ${
                  speck.soft ? "is-soft" : ""
                }`}
                style={{
                  left: speck.left,
                  width: speck.size,
                  height: speck.size * 0.86,
                  background: speck.color,
                  boxShadow: `0 0 22px ${speck.color}`,
                  ["--dx" as string]: speck.dx,
                  ["--dy" as string]: speck.dy,
                  animationDelay: speck.delay,
                }}
              />
            ))
          : null}

        {pouring
          ? CLOUDS.map((cloud, i) => (
              <span
                key={`cloud-${i}`}
                className="intro-cloud absolute top-[29%] rounded-full blur-xl"
                style={{
                  left: cloud.left,
                  width: cloud.size,
                  height: cloud.size * 0.82,
                  background: cloud.color,
                  animationDelay: cloud.delay,
                }}
              />
            ))
          : null}

        <motion.div
          className="absolute inset-x-0 top-[40%] z-20 flex flex-col items-center px-6 text-center sm:top-[42%]"
          initial={{ opacity: 0, scale: 0.46, y: 40, filter: "blur(18px)" }}
          animate={{
            opacity: showBrand ? (settled || fading ? 0 : 1) : 0,
            scale: showBrand ? (settled ? 0.78 : 1) : 0.46,
            y: showBrand ? (settled ? -24 : 0) : 40,
            filter: showBrand ? "blur(0px)" : "blur(18px)",
          }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            style={{
              filter:
                "drop-shadow(0 0 28px rgba(16,185,129,0.55)) drop-shadow(0 0 70px rgba(16,185,129,0.25))",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LOGO_SRC}
              alt="MikaZone"
              className="h-[4.75rem] w-auto max-w-[min(78vw,380px)] object-contain sm:h-32"
            />
          </div>
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 sm:mt-3 sm:text-xs">
            Official USA partner · BuildExpo 2026
          </p>
        </motion.div>
      </div>

      <button
        type="button"
        onClick={finish}
        className="absolute right-3 top-[max(0.6rem,env(safe-area-inset-top))] z-50 min-h-11 rounded-full border border-slate-300 bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-500 backdrop-blur-md sm:right-4"
      >
        Skip ✕
      </button>
    </motion.div>
  );
}
