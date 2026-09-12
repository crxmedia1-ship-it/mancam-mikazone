"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PackShot } from "@/components/PackShot";
import { SACK_IMAGE_SRC, SACK_LINEUP } from "@/data/sacks";

const LOGO_SRC =
  "https://res.cloudinary.com/dgphys1xd/image/upload/v1788992084/Photoroom_20260909_181404_r3umw2.png";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_SETTLE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type Slot = { x: number; y: number; width: number };

type IntroProfile = {
  mobile: boolean;
  introMs: number;
  stampMs: number;
  settleMs: number;
  landMs: number;
};

const MOBILE_PROFILE: IntroProfile = {
  mobile: true,
  introMs: 6700,
  stampMs: 1200,
  settleMs: 3200,
  landMs: 4500,
};

const DESKTOP_PROFILE: IntroProfile = {
  mobile: false,
  introMs: 5800,
  stampMs: 1100,
  settleMs: 3000,
  landMs: 4100,
};

function studioSlot(width: number): Slot {
  return {
    width,
    x: (window.innerWidth - width) / 2,
    y: window.innerHeight * 0.5,
  };
}

function homeSlot(): Slot | null {
  const el = document.getElementById("stand-bags");
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  return { x: rect.left, y: rect.top, width: rect.width };
}

function measureSlot(preferHome: boolean): Slot {
  const home = homeSlot();
  const width = home?.width ?? Math.min(window.innerWidth >= 640 ? 560 : 420, window.innerWidth - 32);
  if (preferHome && home) return home;
  return studioSlot(width);
}

export function Hero3DIntro({ onComplete }: { onComplete: () => void }) {
  const completedRef = useRef(false);
  const settlingRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [stamped, setStamped] = useState(false);
  const [settling, setSettling] = useState(false);
  const [landed, setLanded] = useState(false);
  const [profile, setProfile] = useState<IntroProfile>(MOBILE_PROFILE);
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

    const nextProfile = window.matchMedia("(max-width: 767px)").matches
      ? MOBILE_PROFILE
      : DESKTOP_PROFILE;
    setProfile(nextProfile);

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
        setSlot(measureSlot(false));
        setReady(true);
      }
    });

    const fallback = window.setTimeout(() => {
      if (!cancelled) {
        setSlot(measureSlot(false));
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

    const stampTimer = window.setTimeout(() => setStamped(true), profile.stampMs);
    const settleTimer = window.setTimeout(() => {
      settlingRef.current = true;
      setSlot(measureSlot(true));
      setSettling(true);
    }, profile.settleMs);
    const landTimer = window.setTimeout(() => setLanded(true), profile.landMs);
    const doneTimer = window.setTimeout(finish, profile.introMs);

    function onResize() {
      setSlot(measureSlot(settlingRef.current));
    }
    window.addEventListener("resize", onResize);

    return () => {
      window.clearTimeout(stampTimer);
      window.clearTimeout(settleTimer);
      window.clearTimeout(landTimer);
      window.clearTimeout(doneTimer);
      window.removeEventListener("resize", onResize);
      document.body.style.overflow = previousOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, profile]);

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
        animate={{ opacity: landed ? 0 : 1 }}
        transition={{ duration: profile.mobile ? 1.1 : 1.05, ease: EASE_SETTLE }}
      />

      <motion.div
        className="pointer-events-none absolute inset-x-0 top-[8%] z-10 flex flex-col items-center px-4 text-center sm:top-[7%]"
        initial={{ opacity: 0, y: 14, scale: 1.04 }}
        animate={
          stamped
            ? settling
              ? { opacity: 0, y: -8, scale: 0.99 }
              : { opacity: 1, y: 0, scale: 1 }
            : { opacity: 0, y: 14, scale: 1.04 }
        }
        transition={{
          duration: stamped && !settling ? (profile.mobile ? 1.25 : 1.35) : 0.75,
          ease: EASE_OUT,
        }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.92)_0%,transparent_72%)] sm:h-72 sm:w-72"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LOGO_SRC}
          alt="MikaZone"
          className="relative h-28 w-auto max-w-[min(92vw,560px)] object-contain sm:h-40"
        />
        <motion.p
          className="relative mt-4 text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500 sm:mt-5 sm:text-sm"
          initial={{ opacity: 0, y: 8 }}
          animate={
            stamped && !settling ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }
          }
          transition={{
            duration: profile.mobile ? 0.85 : 0.9,
            delay: stamped ? 0.35 : 0,
            ease: EASE_SETTLE,
          }}
        >
          Official USA partner
        </motion.p>
      </motion.div>

      {slot ? (
        <motion.div
          className="absolute top-0 left-0 z-20"
          initial={false}
          animate={{ x: slot.x, y: slot.y }}
          transition={
            settling
              ? profile.mobile
                ? { duration: 1.5, ease: EASE_SETTLE }
                : { type: "spring", stiffness: 80, damping: 22, mass: 1.2 }
              : { duration: 0 }
          }
          style={{ width: slot.width, willChange: "transform" }}
        >
          <div className="relative grid grid-cols-3 items-end gap-1 sm:gap-3">
            {SACK_LINEUP.map((sack, index) => (
              <motion.div
                key={sack.productId}
                className="origin-bottom"
                initial={{ y: "-70vh", opacity: 0 }}
                animate={ready ? { y: 0, opacity: 1 } : { y: "-70vh", opacity: 0 }}
                transition={
                  profile.mobile
                    ? {
                        y: {
                          delay: 0.1 + index * 0.14,
                          duration: 1.35,
                          ease: EASE_OUT,
                        },
                        opacity: { duration: 0.32, delay: 0.1 + index * 0.14 },
                      }
                    : {
                        y: {
                          delay: 0.08 + index * 0.11,
                          type: "spring",
                          stiffness: 160,
                          damping: 18,
                          mass: 1.35,
                        },
                        opacity: { duration: 0.2, delay: 0.08 + index * 0.11 },
                      }
                }
                style={{ backfaceVisibility: "hidden" }}
              >
                <PackShot
                  sack={sack}
                  index={index}
                  lite
                  showCaption
                  revealCaption={landed}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : null}

      {!settling ? (
        <button
          type="button"
          onClick={finish}
          className="absolute right-3 top-[max(0.6rem,env(safe-area-inset-top))] z-50 min-h-11 px-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 sm:right-5"
        >
          Skip
        </button>
      ) : null}
    </div>
  );
}
