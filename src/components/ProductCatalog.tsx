"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
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
    if (selectedCategory === "all") {
      return PRODUCTS;
    }

    return PRODUCTS.filter((product) => product.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <section
      id="catalog"
      className="w-full bg-slate-50 px-4 py-12 pb-8 sm:px-6 lg:px-8 lg:py-16"
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
            Step 1, continued
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Need another grade? Browse all 10.
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Filter, tap View Specs, register once, and the PDF unlocks.
          </p>
        </div>

        <div className="sticky top-[4.75rem] z-20 -mx-4 mt-8 bg-slate-50/95 px-4 py-3 backdrop-blur-md sm:top-0 sm:mx-0 sm:px-0">
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
            {CATALOG_FILTERS.map((item) => {
              const active = item.id === selectedCategory;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedCategory(item.id)}
                  className={`shrink-0 rounded-sm px-4 py-2.5 text-sm font-semibold tracking-wide transition ${
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
    <article className="group flex h-full flex-col border border-slate-200 bg-white transition hover:border-slate-300 hover:shadow-[0_18px_40px_-24px_rgba(15,23,42,0.35)]">
      {product.packFront ? (
        <div className="relative flex h-44 items-end justify-center overflow-hidden bg-gradient-to-b from-slate-50 to-white">
          <div
            className="absolute inset-x-0 top-0 h-1.5"
            style={{ backgroundColor: product.accent }}
          />
          <Image
            src={product.packFront}
            alt={`${product.shortName} packaging`}
            width={220}
            height={280}
            className={`relative h-40 w-auto object-contain drop-shadow-[0_12px_18px_rgba(15,23,42,0.16)] transition duration-500 group-hover:-translate-y-1 group-hover:scale-[1.04] ${
              product.packSide ? "group-hover:opacity-0" : ""
            }`}
          />
          {product.packSide ? (
            <Image
              src={product.packSide}
              alt=""
              width={180}
              height={280}
              className="absolute bottom-0 h-40 w-auto object-contain opacity-0 drop-shadow-[0_12px_18px_rgba(15,23,42,0.16)] transition duration-500 group-hover:opacity-100"
            />
          ) : null}
        </div>
      ) : (
        <div className="h-1.5" style={{ backgroundColor: product.accent }} />
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-sm bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-700">
            {PRODUCT_CATEGORIES[product.category].label}
          </span>
          <span className="font-mono text-[11px] text-slate-400">{product.sku}</span>
        </div>

        {product.badge ? (
          <p className="mt-3 inline-flex w-fit rounded-sm border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-bold tracking-[0.08em] text-emerald-800">
            {product.badge}
          </p>
        ) : null}

        <h3 className="mt-4 text-xl font-semibold leading-7 text-slate-900">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-slate-500">{product.chemicalName}</p>

        <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
          {product.summary}
        </p>

        <ul className="mt-4 space-y-2 text-sm text-slate-700">
          {product.benefits.slice(0, 3).map((benefit) => (
            <li key={benefit} className="flex gap-2">
              <span className="mt-2 size-1.5 shrink-0 bg-gold" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-1 flex-col justify-end">
          <p className="text-xs text-slate-500">Pack: {product.packaging.primary}</p>
          <button
            type="button"
            onClick={onViewSpecs}
            className="mt-3 inline-flex h-12 items-center justify-center gap-2 bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            View Specs & Download
            <ArrowUpRight className="size-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
