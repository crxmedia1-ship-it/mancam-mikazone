"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PackShot } from "@/components/PackShot";
import { SACK_IMAGE_SRC, SACK_LINEUP } from "@/data/sacks";

const INTRO_MS = 4800;
const STAMP_MS = 1480;
const SETTLE_MS = 2600;
const LOGO_SRC =
  "https://res.cloudinary.com/dgphys1xd/image/upload/v1788992084/Photoroom_20260909_181404_r3umw2.png";

type Slot = { top: number; left: number; width: number };

function studioSlot(): Slot {
  const width = Math.min(window.innerWidth >= 640 ? 560 : 420, window.innerWidth - 32);
  return {
    width,
    left: (window.innerWidth - width) / 2,
    top: window.innerHeight * 0.5,
  };
}

function homeSlot(): Slot | null {
  const el = document.getElementById("stand-bags");
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  return { top: rect.top, left: rect.left, width: rect.width };
}

export function Hero3DIntro({ onComplete }: { onComplete: () => void }) {
  const completedRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [stamped, setStamped] = useState(false);
  const [settling, setSettling] = useState(false);
  const [slot, setSlot] = useState<Slot | null>(null);

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
      if (!cancelled) {
        setSlot(studioSlot());
        setReady(true);
      }
    });

    const fallback = window.setTimeout(() => {
      if (!cancelled) {
        setSlot(studioSlot());
        setReady(true);
      }
    }, 220);

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

    const stampTimer = window.setTimeout(() => setStamped(true), STAMP_MS);
    const settleTimer = window.setTimeout(() => {
      setSlot(homeSlot() ?? studioSlot());
      setSettling(true);
    }, SETTLE_MS);
    const doneTimer = window.setTimeout(finish, INTRO_MS);

    return () => {
      window.clearTimeout(stampTimer);
      window.clearTimeout(settleTimer);
      window.clearTimeout(doneTimer);
      document.body.style.overflow = previousOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-label="MikaZone introduction"
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 28%, #fff 0%, #efece6 46%, #e7e2d8 100%)",
        }}
        initial={{ opacity: 1 }}
        animate={{ opacity: settling ? 0 : 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />

      <motion.div
        className="pointer-events-none absolute inset-x-0 top-[8%] z-10 flex flex-col items-center px-4 text-center sm:top-[7%]"
        initial={{ opacity: 0, y: 12, scale: 0.94 }}
        animate={
          stamped
            ? {
                opacity: settling ? 0 : 1,
                y: settling ? -12 : 0,
                scale: settling ? 0.96 : 1,
              }
            : { opacity: 0, y: 12, scale: 0.94 }
        }
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LOGO_SRC}
          alt="MikaZone"
          className="h-28 w-auto max-w-[min(92vw,560px)] object-contain sm:h-40"
        />
        <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500 sm:mt-4 sm:text-sm">
          Official USA partner
        </p>
      </motion.div>

      {slot ? (
        <motion.div
          className="absolute z-20"
          initial={false}
          animate={{
            top: slot.top,
            left: slot.left,
            width: slot.width,
          }}
          transition={{
            type: "spring",
            stiffness: settling ? 92 : 400,
            damping: settling ? 18 : 40,
            mass: settling ? 1.15 : 1,
          }}
        >
          <div className="relative grid grid-cols-3 items-end gap-1 sm:gap-3">
            {SACK_LINEUP.map((sack, index) => (
              <motion.div
                key={sack.productId}
                className="origin-bottom"
                initial={{ y: "-70vh", opacity: 0 }}
                animate={ready ? { y: 0, opacity: 1 } : { y: "-70vh", opacity: 0 }}
                transition={{
                  y: {
                    delay: 0.08 + index * 0.11,
                    type: "spring",
                    stiffness: 180,
                    damping: 16,
                    mass: 1.45,
                  },
                  opacity: { duration: 0.2, delay: 0.08 + index * 0.11 },
                }}
              >
                <PackShot sack={sack} index={index} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : null}

      <button
        type="button"
        onClick={finish}
        className="absolute right-3 top-[max(0.6rem,env(safe-area-inset-top))] z-50 min-h-11 px-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 sm:right-5"
      >
        Skip
      </button>
    </div>
  );
}
