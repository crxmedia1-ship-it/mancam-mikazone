"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { FileDown, UserRound } from "lucide-react";
import {
  CATALOG_FILTERS,
  PRODUCT_CATEGORIES,
  PRODUCTS,
  type CatalogFilterId,
  type Product,
} from "@/data/products";

type ProductCatalogProps = {
  onViewSpecs: (product: Product) => void;
  onDownloadCatalog: () => void;
  onRegister: () => void;
  registered?: boolean;
};

export function ProductCatalog({
  onViewSpecs,
  onDownloadCatalog,
  onRegister,
  registered = false,
}: ProductCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<CatalogFilterId>("all");

  const visibleProducts = useMemo(() => {
    if (selectedCategory === "all") return PRODUCTS;
    return PRODUCTS.filter((product) => product.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <section
      id="products"
      className="w-full bg-slate-50 px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-10 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-mika">
              Full lineup
            </p>
            <h2 className="font-display mt-2 text-[1.85rem] leading-[1.08] tracking-tight text-slate-900 sm:text-4xl">
              Ten grades. One catalog.
            </h2>
            <p className="mt-2 text-[14px] leading-6 text-slate-600 sm:text-[15px]">
              Open a card for the specs. Download the full catalog or leave
              your details above.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:min-w-[16rem]">
            <button
              type="button"
              onClick={onDownloadCatalog}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 text-sm font-bold text-slate-900 sm:min-h-14"
            >
              <FileDown className="size-5 shrink-0" />
              Download catalog
            </button>
            <button
              type="button"
              onClick={onRegister}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 text-sm font-bold text-white sm:min-h-14"
            >
              <UserRound className="size-5 shrink-0" />
              {registered ? "You’re registered" : "Leave your details"}
            </button>
          </div>
        </div>

        <div className="sticky top-0 z-20 -mx-4 mt-5 bg-slate-50/95 px-4 py-3 backdrop-blur-md sm:mx-0 sm:mt-8 sm:px-0">
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
            {CATALOG_FILTERS.map((item) => {
              const active = item.id === selectedCategory;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedCategory(item.id)}
                  className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold tracking-wide transition ${
                    active
                      ? "bg-slate-900 text-white"
                      : "bg-white text-slate-800 ring-1 ring-slate-200 hover:ring-slate-400"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 grid gap-2.5 sm:mt-6 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewSpecs={() => onViewSpecs(product)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({
  product,
  onViewSpecs,
}: {
  product: Product;
  onViewSpecs: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onViewSpecs}
      className="group flex h-full flex-row overflow-hidden rounded-[22px] border border-slate-200 bg-white text-left shadow-[0_10px_30px_-24px_rgba(15,23,42,0.45)] transition-colors sm:flex-col sm:rounded-[26px]"
    >
      <PackVisual product={product} />
      <div className="flex min-w-0 flex-1 flex-col justify-center px-3 py-3 sm:px-5 sm:pb-5 sm:pt-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            {PRODUCT_CATEGORIES[product.category].label}
          </span>
          <span className="hidden font-mono text-[11px] text-slate-400 sm:inline">
            {product.sku}
          </span>
        </div>
        <h3 className="mt-1 text-[1.05rem] font-semibold leading-6 tracking-tight text-slate-900 sm:mt-2 sm:text-[1.15rem]">
          {product.shortName}
        </h3>
        <p className="mt-0.5 line-clamp-1 text-[12px] text-slate-500 sm:mt-1 sm:text-[13px]">
          {product.chemicalName}
        </p>
        <p className="mt-2 hidden line-clamp-2 text-[14px] leading-6 text-slate-600 sm:mt-3 sm:block">
          {product.summary}
        </p>
        <span className="mt-3 inline-flex min-h-9 items-center justify-center rounded-xl border border-slate-200 px-3 text-[13px] font-bold text-slate-900 sm:mt-5 sm:min-h-11 sm:rounded-2xl sm:px-4 sm:text-sm">
          Open specs
        </span>
      </div>
    </button>
  );
}

function PackVisual({ product }: { product: Product }) {
  return (
    <div className="relative flex h-28 w-[5.5rem] shrink-0 items-end justify-center overflow-hidden bg-gradient-to-b from-slate-50 to-white sm:h-36 sm:w-full">
      <div
        className="absolute inset-x-0 top-0 h-1.5"
        style={{ backgroundColor: product.accent }}
      />
      {product.packFront ? (
        <Image
          src={product.packFront}
          alt=""
          width={180}
          height={220}
          className="relative mb-1.5 h-24 w-auto object-contain drop-shadow-[0_10px_14px_rgba(15,23,42,0.14)] sm:mb-2 sm:h-32"
        />
      ) : (
        <span
          className="sack-placeholder mb-3 flex h-[7.25rem] w-[4.6rem] flex-col overflow-hidden rounded-t-[6px] rounded-b-[10px] shadow-[0_10px_18px_rgba(15,23,42,0.16)]"
          style={{ backgroundColor: product.accent }}
          aria-hidden="true"
        >
          <span className="h-3 bg-white/25" />
          <span className="mt-auto bg-white px-1.5 py-2 text-center">
            <span className="block text-[9px] font-bold leading-tight text-slate-800">
              {product.shortName}
            </span>
          </span>
        </span>
      )}
    </div>
  );
}
