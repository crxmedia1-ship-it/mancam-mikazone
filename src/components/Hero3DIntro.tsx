"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PackShot } from "@/components/PackShot";
import { SACK_IMAGE_SRC, SACK_LINEUP, SACK_REST_ROTATE } from "@/data/sacks";

const INTRO_MS = 4600;
const STAMP_MS = 1480;
const SETTLE_MS = 2700;
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
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      />

      <motion.div
        className="pointer-events-none absolute inset-x-0 top-[8%] z-10 flex flex-col items-center px-4 text-center sm:top-[7%]"
        initial={{ opacity: 0, y: 12, scale: 0.9 }}
        animate={
          stamped
            ? {
                opacity: settling ? 0 : 1,
                y: settling ? -16 : 0,
                scale: settling ? 0.92 : [0.9, 1.04, 1],
              }
            : { opacity: 0, y: 12, scale: 0.9 }
        }
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
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
          transition={
            settling
              ? { type: "spring", stiffness: 120, damping: 18, mass: 1.15 }
              : { duration: 0 }
          }
        >
          <motion.div
            className="pointer-events-none absolute inset-x-[6%] bottom-[2%] h-10 rounded-[100%] bg-slate-900/25 blur-2xl"
            initial={{ opacity: 0, scaleX: 0.45 }}
            animate={
              ready
                ? {
                    opacity: settling ? 0 : [0, 0.55, 0.28],
                    scaleX: settling ? 0.8 : [0.45, 1.12, 1],
                  }
                : { opacity: 0, scaleX: 0.45 }
            }
            transition={{ duration: 0.7, delay: settling ? 0 : 0.55, ease: [0.16, 1, 0.3, 1] }}
            aria-hidden="true"
          />

          <div
            className={`relative grid grid-cols-3 items-end ${
              settling ? "gap-1 sm:gap-3" : "gap-2 sm:gap-6"
            }`}
          >
            {SACK_LINEUP.map((sack, index) => (
              <motion.div
                key={sack.productId}
                className="origin-bottom"
                initial={{ y: "-78vh", opacity: 0 }}
                animate={ready ? { y: 0, opacity: 1 } : { y: "-78vh", opacity: 0 }}
                transition={{
                  y: {
                    delay: 0.08 + index * 0.12,
                    type: "spring",
                    stiffness: 210,
                    damping: 20,
                    mass: 1.7,
                  },
                  opacity: { duration: 0.18, delay: 0.08 + index * 0.12 },
                }}
              >
                <motion.div
                  className="origin-bottom"
                  initial={{ scaleY: 1.06 }}
                  animate={
                    ready
                      ? {
                          scaleY: [1.08, 0.86, 1.05, 0.98, 1],
                          rotate: SACK_REST_ROTATE[index],
                        }
                      : { scaleY: 1.06, rotate: 0 }
                  }
                  transition={{
                    delay: 0.62 + index * 0.12,
                    duration: 0.48,
                    ease: "easeOut",
                  }}
                >
                  <PackShot
                    sack={sack}
                    restRotate={0}
                    interactive={false}
                    alive={false}
                    size={settling ? "hero" : "intro"}
                    index={index}
                  />
                </motion.div>
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
