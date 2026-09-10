"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import { ChevronDown, FileDown, Lock, Phone } from "lucide-react";
import { Hero3DIntro } from "@/components/Hero3DIntro";
import { LeadCaptureModal } from "@/components/LeadCaptureModal";
import { ProductCatalog } from "@/components/ProductCatalog";
import { type Product } from "@/data/products";
import {
  STAND_PHONE_DISPLAY,
  STAND_PHONE_SHORT,
  WHATSAPP_HREF,
} from "@/lib/contact";

const MIKAZONE_LOGO =
  "https://res.cloudinary.com/dgphys1xd/image/upload/v1788991971/PHOTO-2026-09-07-18-40-08_zw0udk.jpg";

export default function Home() {
  const eventPin = process.env.NEXT_PUBLIC_EVENT_PIN;
  const [showIntro, setShowIntro] = useState(true);
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
      <AnimatePresence>
        {showIntro ? (
          <Hero3DIntro
            key="hero-intro"
            onComplete={() => setShowIntro(false)}
          />
        ) : null}
      </AnimatePresence>
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
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 transition hover:text-mika"
              >
                <Phone className="size-3" />
                {STAND_PHONE_DISPLAY}
              </a>
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
            className="hero-fade mt-10 flex flex-col gap-4"
            style={{ animationDelay: "320ms" }}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
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
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-500 underline-offset-4 transition hover:text-mika hover:underline"
            >
              Need instant factory pricing? Call or WhatsApp {STAND_PHONE_DISPLAY}
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

      <a
        href={WHATSAPP_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-4 z-40 inline-flex max-w-[min(calc(100vw-2rem),20rem)] items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-[#1ebe5d]"
      >
        <WhatsAppMark className="size-5 shrink-0" />
        <span className="leading-tight">
          💬 Chat Booth Rep ({STAND_PHONE_SHORT})
        </span>
      </a>

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

function WhatsAppMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.198.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
    </svg>
  );
}
