"use client";

import { useState, type PointerEvent } from "react";
import { PackShot } from "@/components/PackShot";
import { SACK_LINEUP, SACK_REST_ROTATE } from "@/data/sacks";

type ProductTheaterProps = {
  onSelectProduct: (productId: string) => void;
  coach?: boolean;
};

export function ProductTheater({
  onSelectProduct,
  coach = false,
}: ProductTheaterProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  function handleMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    setParallax({ x: px * 10, y: py * 6 });
  }

  return (
    <div
      className="product-studio relative mx-auto w-full max-w-2xl"
      onPointerMove={handleMove}
      onPointerLeave={() => setParallax({ x: 0, y: 0 })}
    >
      <div
        className="pointer-events-none absolute inset-x-6 bottom-16 h-24 rounded-[100%] bg-slate-900/[0.07] blur-3xl"
        aria-hidden="true"
      />
      <div
        className="relative grid grid-cols-3 items-end gap-1 transition-transform duration-500 ease-out sm:gap-3"
        style={{
          transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0)`,
        }}
      >
        {SACK_LINEUP.map((sack, index) => (
          <PackShot
            key={sack.productId}
            sack={sack}
            index={index}
            restRotate={SACK_REST_ROTATE[index]}
            dimmed={Boolean(activeId) && activeId !== sack.productId}
            coach={coach}
            onSelect={() => onSelectProduct(sack.productId)}
            onActiveChange={(active) =>
              setActiveId(active ? sack.productId : null)
            }
          />
        ))}
      </div>
      <p className="mt-2 text-center text-[12px] font-semibold text-slate-600 sm:mt-3 sm:text-sm">
        HPMC · HEC · RDP — tap for specs
      </p>
    </div>
  );
}
