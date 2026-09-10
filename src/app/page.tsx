"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, FileDown, Lock } from "lucide-react";
import { Hero3DIntro } from "@/components/Hero3DIntro";
import { LeadCaptureModal } from "@/components/LeadCaptureModal";
import { ProductCatalog } from "@/components/ProductCatalog";
import { type Product } from "@/data/products";

const MIKAZONE_LOGO =
  "https://res.cloudinary.com/dgphys1xd/image/upload/v1788991971/PHOTO-2026-09-07-18-40-08_zw0udk.jpg";

export default function Home() {
  const eventPin = process.env.NEXT_PUBLIC_EVENT_PIN;
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  function openFullDossier() {
    setSelectedProductIds([]);
    setModalOpen(true);
  }

  function openProductSpecs(product: Product) {
    setSelectedProductIds([product.id]);
    setModalOpen(true);
  }

  return (
    <div className="flex min-h-full flex-col bg-white">
      <Hero3DIntro />
      <section className="relative w-full overflow-hidden bg-white">
        <div
          aria-hidden="true"
          className="hero-mesh pointer-events-none absolute inset-0 opacity-70"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-12 size-72 rounded-full bg-mika/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <Image
              src={MIKAZONE_LOGO}
              alt="MikaZone USA — Mancam Global Supply"
              width={320}
              height={107}
              priority
              className="h-14 w-auto max-w-[min(70%,240px)] object-contain object-left sm:h-16 sm:max-w-[300px]"
            />
            <div className="shrink-0 text-right">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-mika sm:text-[11px]">
                Official partner
              </p>
              {eventPin ? (
                <p className="mt-1 text-[11px] font-medium text-slate-400">
                  Event {eventPin}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="relative mx-auto flex min-h-[72vh] max-w-7xl flex-col justify-center px-4 pb-28 pt-10 sm:px-6 sm:pt-16 lg:px-8 lg:pb-32">
          <p
            className="hero-fade text-sm font-semibold uppercase tracking-[0.28em] text-mika"
            style={{ animationDelay: "60ms" }}
          >
            BuildExpo South Florida 2026
          </p>
          <h1
            className="hero-fade mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-6xl sm:leading-[1.05]"
            style={{ animationDelay: "140ms" }}
          >
            High Performance{" "}
            <span className="text-mika">Construction Additives</span>
          </h1>
          <p
            className="hero-fade mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg"
            style={{ animationDelay: "220ms" }}
          >
            Direct factory supply for dry-mix mortar plants, coatings
            formulators, and concrete producers. Download full technical
            dossiers, TDS, and volume pricing.
          </p>

          <div
            className="hero-fade mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
            style={{ animationDelay: "320ms" }}
          >
            <button
              type="button"
              onClick={openFullDossier}
              className="inline-flex min-h-14 w-full items-center justify-center gap-3 bg-[#10B981] px-6 text-sm font-bold tracking-wide text-white shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-emerald-700/30 sm:min-h-16 sm:w-auto sm:min-w-[22rem] sm:px-8 sm:text-base"
            >
              <FileDown className="size-5 shrink-0 sm:size-6" />
              DOWNLOAD TECHNICAL DOSSIER & PRICING
            </button>
            <a
              href="#catalog"
              className="inline-flex min-h-12 items-center justify-center px-2 text-sm font-semibold text-slate-500 underline-offset-4 hover:text-mika hover:underline"
            >
              Browse grades below
            </a>
          </div>
        </div>

        <a
          href="#catalog"
          className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-mika"
          aria-label="Scroll to technical catalog"
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Catalog
          </span>
          <ChevronDown className="size-7 animate-bounce" />
        </a>
      </section>

      <ProductCatalog onViewSpecs={openProductSpecs} />

      <LeadCaptureModal
        key={modalOpen ? selectedProductIds.join("|") || "dossier" : "closed"}
        open={modalOpen}
        initialProductIds={selectedProductIds}
        dossierMode={selectedProductIds.length === 0}
        onClose={() => setModalOpen(false)}
      />

      <footer className="mt-auto w-full bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-xs text-white/35">
            Mancam Global Supply · Official MikaZone USA partner
          </p>
          <a
            href="/admin/leads"
            className="inline-flex size-9 items-center justify-center text-white/25 transition hover:text-mika"
            aria-label="Stand team — prospect dashboard"
            title="Stand team"
          >
            <Lock className="size-4" />
          </a>
        </div>
      </footer>
    </div>
  );
}
