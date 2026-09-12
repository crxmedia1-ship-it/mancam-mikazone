"use client";

import { PackShot } from "@/components/PackShot";
import { SACK_LINEUP } from "@/data/sacks";

type ProductTheaterProps = {
  onSelectProduct: (productId: string) => void;
  dormant?: boolean;
};

export function ProductTheater({
  onSelectProduct,
  dormant = false,
}: ProductTheaterProps) {
  return (
    <div className="product-studio relative mx-auto w-full max-w-2xl">
      <div
        className="pointer-events-none absolute inset-x-8 bottom-14 h-16 rounded-[100%] bg-slate-900/[0.06] blur-3xl"
        aria-hidden="true"
      />
      <div
        id="stand-bags"
        className={`relative grid grid-cols-3 items-end gap-1 sm:gap-3 ${
          dormant ? "invisible" : ""
        }`}
      >
        {SACK_LINEUP.map((sack, index) => (
          <PackShot
            key={sack.productId}
            sack={sack}
            index={index}
            alive={!dormant}
            onSelect={() => onSelectProduct(sack.productId)}
          />
        ))}
      </div>
      <p
        className={`mt-2 text-center text-[12px] font-semibold text-slate-600 sm:mt-3 sm:text-sm ${
          dormant ? "invisible" : ""
        }`}
      >
        HPMC · HEC · RDP — tap for specs
      </p>
    </div>
  );
}
