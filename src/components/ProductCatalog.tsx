"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  CATALOG_FILTERS,
  PRODUCT_CATEGORIES,
  PRODUCTS,
  type CatalogFilterId,
  type Product,
} from "@/data/products";

type ProductCatalogProps = {
  onViewSpecs: (product: Product) => void;
};

export function ProductCatalog({ onViewSpecs }: ProductCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<CatalogFilterId>("all");

  const visibleProducts = useMemo(() => {
    if (selectedCategory === "all") return PRODUCTS;
    return PRODUCTS.filter((product) => product.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <section
      id="products"
      className="w-full bg-slate-50 px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-mika">
            Full lineup
          </p>
          <h2 className="font-display mt-2 text-[2.1rem] leading-[1.08] tracking-tight text-slate-900 sm:text-5xl">
            Ten grades. One catalog.
          </h2>
          <p className="mt-3 text-[15px] leading-6 text-slate-600">
            Open a card for the grade. Catalog is free — no login.
          </p>
        </div>

        <div className="sticky top-0 z-20 -mx-4 mt-8 bg-slate-50/95 px-4 py-3 backdrop-blur-md sm:mx-0 sm:px-0">
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

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
      className="group flex h-full flex-col overflow-hidden rounded-[26px] border border-slate-200 bg-white text-left shadow-[0_10px_30px_-24px_rgba(15,23,42,0.45)] transition-colors"
    >
      <PackVisual product={product} />
      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            {PRODUCT_CATEGORIES[product.category].label}
          </span>
          <span className="font-mono text-[11px] text-slate-400">{product.sku}</span>
        </div>
        <h3 className="mt-2 text-[1.15rem] font-semibold leading-6 tracking-tight text-slate-900">
          {product.shortName}
        </h3>
        <p className="mt-1 line-clamp-1 text-[13px] text-slate-500">
          {product.chemicalName}
        </p>
        <p className="mt-3 line-clamp-2 text-[14px] leading-6 text-slate-600">
          {product.summary}
        </p>
        <span className="mt-5 inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-200 px-4 text-sm font-bold text-slate-900">
          Open specs
        </span>
      </div>
    </button>
  );
}

function PackVisual({ product }: { product: Product }) {
  return (
    <div className="relative flex h-36 items-end justify-center overflow-hidden bg-gradient-to-b from-slate-50 to-white">
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
          className="relative mb-2 h-32 w-auto object-contain drop-shadow-[0_10px_14px_rgba(15,23,42,0.14)]"
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
