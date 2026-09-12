"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PackShot } from "@/components/PackShot";
import { SACK_IMAGE_SRC, SACK_LINEUP, SACK_REST_ROTATE } from "@/data/sacks";

const INTRO_MS = 4800;
const POUR_MS = 1080;
const BRAND_MS = 1480;
const FADE_MS = 3800;
const LOGO_SRC =
  "https://res.cloudinary.com/dgphys1xd/image/upload/v1788992084/Photoroom_20260909_181404_r3umw2.png";

const POWDER = [
  { left: "18%", color: "#4DB8C9", dx: "12vw", dy: "-42vh", delay: "0ms", size: 7 },
  { left: "18%", color: "#7DD3E0", dx: "-6vw", dy: "-36vh", delay: "40ms", size: 5 },
  { left: "20%", color: "#4DB8C9", dx: "4vw", dy: "-48vh", delay: "80ms", size: 8 },
  { left: "22%", color: "#A7E8F0", dx: "18vw", dy: "-32vh", delay: "120ms", size: 4 },
  { left: "50%", color: "#E07A45", dx: "0vw", dy: "-46vh", delay: "30ms", size: 8 },
  { left: "50%", color: "#F0A070", dx: "-10vw", dy: "-38vh", delay: "70ms", size: 5 },
  { left: "48%", color: "#E07A45", dx: "8vw", dy: "-50vh", delay: "110ms", size: 6 },
  { left: "52%", color: "#FFD0B0", dx: "14vw", dy: "-34vh", delay: "150ms", size: 4 },
  { left: "82%", color: "#2BA090", dx: "-12vw", dy: "-44vh", delay: "20ms", size: 7 },
  { left: "80%", color: "#5DC8B8", dx: "6vw", dy: "-36vh", delay: "60ms", size: 5 },
  { left: "78%", color: "#2BA090", dx: "-4vw", dy: "-50vh", delay: "100ms", size: 8 },
  { left: "84%", color: "#A8E8DC", dx: "-18vw", dy: "-30vh", delay: "140ms", size: 4 },
  { left: "50%", color: "#10B981", dx: "2vw", dy: "-52vh", delay: "90ms", size: 6 },
  { left: "35%", color: "#4DB8C9", dx: "8vw", dy: "-40vh", delay: "160ms", size: 5 },
  { left: "65%", color: "#2BA090", dx: "-8vw", dy: "-40vh", delay: "180ms", size: 5 },
] as const;

export function Hero3DIntro({ onComplete }: { onComplete: () => void }) {
  const completedRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [showBrand, setShowBrand] = useState(false);
  const [pouring, setPouring] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [fading, setFading] = useState(false);
  const [impacted, setImpacted] = useState(false);

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
    }, 250);

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

    const impactTimer = window.setTimeout(() => {
      setImpacted(true);
      setShaking(true);
      window.setTimeout(() => setShaking(false), 240);
    }, POUR_MS);
    const pourTimer = window.setTimeout(() => setPouring(true), POUR_MS + 80);
    const brandTimer = window.setTimeout(() => setShowBrand(true), BRAND_MS);
    const fadeTimer = window.setTimeout(() => setFading(true), FADE_MS);
    const doneTimer = window.setTimeout(finish, INTRO_MS);

    return () => {
      window.clearTimeout(impactTimer);
      window.clearTimeout(pourTimer);
      window.clearTimeout(brandTimer);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(doneTimer);
      document.body.style.overflow = previousOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-white"
      initial={{ opacity: 1, x: 0, y: 0 }}
      animate={
        fading
          ? { opacity: 0, x: 0, y: 0 }
          : shaking
            ? { opacity: 1, x: [0, -4, 3, -2, 0], y: [0, 2, -1, 0] }
            : { opacity: 1, x: 0, y: 0 }
      }
      exit={{ opacity: 0 }}
      transition={
        fading
          ? { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
          : shaking
            ? { duration: 0.24, ease: "easeOut" }
            : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
      }
      role="dialog"
      aria-label="MikaZone introduction"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 38%, rgba(16,185,129,0.12), transparent 52%)",
        }}
      />

      <div className="relative z-20 flex min-h-0 flex-1 flex-col items-center justify-center px-6">
        <motion.div
          className="flex flex-col items-center text-center"
          initial={{ opacity: 0.4, scale: 0.86, filter: "blur(8px)" }}
          animate={{
            opacity: fading ? 0 : 1,
            scale: showBrand ? 1 : 0.9,
            filter: showBrand ? "blur(0px)" : "blur(5px)",
          }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            style={{
              filter: showBrand
                ? "drop-shadow(0 0 32px rgba(16,185,129,0.55)) drop-shadow(0 0 80px rgba(16,185,129,0.28))"
                : "drop-shadow(0 0 12px rgba(16,185,129,0.2))",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LOGO_SRC}
              alt="MikaZone"
              className="h-28 w-auto max-w-[min(88vw,460px)] object-contain sm:h-36"
            />
          </div>
          <p
            className={`mt-4 max-w-sm text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 transition-opacity duration-500 sm:mt-5 sm:text-xs ${
              showBrand ? "opacity-100" : "opacity-0"
            }`}
          >
            Official USA partner · BuildExpo 2026
          </p>
        </motion.div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-lg px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:max-w-2xl sm:pb-10">
        <div
          className="pointer-events-none absolute inset-x-8 bottom-6 h-16 rounded-[100%] bg-slate-900/12 blur-3xl"
          aria-hidden="true"
        />
        <div
          className={`grid grid-cols-3 items-end gap-2 transition-opacity duration-700 sm:gap-6 ${
            showBrand ? "opacity-55" : "opacity-100"
          }`}
        >
          {SACK_LINEUP.map((sack, index) => (
            <motion.div
              key={sack.productId}
              className="origin-bottom"
              initial={{ y: "-70vh", opacity: 0 }}
              animate={
                ready
                  ? {
                      y: 0,
                      opacity: fading ? 0 : 1,
                      scaleY: impacted ? [0.92, 1.04, 1] : 1,
                    }
                  : { y: "-70vh", opacity: 0 }
              }
              transition={{
                y: {
                  type: "spring",
                  stiffness: 180,
                  damping: 17,
                  mass: 1.2,
                  delay: ready ? 0.06 + index * 0.12 : 0,
                },
                opacity: { duration: 0.3, delay: ready ? 0.06 + index * 0.12 : 0 },
                scaleY: { duration: 0.32, ease: "easeOut" },
              }}
            >
              <PackShot
                sack={sack}
                restRotate={SACK_REST_ROTATE[index]}
                interactive={false}
                alive={false}
                size="intro"
                index={index}
              />
            </motion.div>
          ))}
        </div>

        {pouring
          ? POWDER.map((speck, i) => (
              <span
                key={i}
                className="intro-powder pointer-events-none absolute bottom-[28%] rounded-full"
                style={{
                  left: speck.left,
                  width: speck.size,
                  height: speck.size,
                  background: speck.color,
                  ["--dx" as string]: speck.dx,
                  ["--dy" as string]: speck.dy,
                  animationDelay: speck.delay,
                }}
              />
            ))
          : null}
      </div>

      <button
        type="button"
        onClick={finish}
        className="absolute right-4 top-4 z-50 min-h-11 rounded-full border border-slate-300 bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-500 backdrop-blur-md hover:text-slate-800"
      >
        Skip ✕
      </button>
    </motion.div>
  );
}
