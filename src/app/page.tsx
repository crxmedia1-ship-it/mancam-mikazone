"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import { FileDown, Lock, Phone } from "lucide-react";
import { Hero3DIntro } from "@/components/Hero3DIntro";
import { LeadCaptureModal } from "@/components/LeadCaptureModal";
import { ProductCatalog } from "@/components/ProductCatalog";
import { ProductTheater } from "@/components/ProductTheater";
import { StandGuide } from "@/components/StandGuide";
import { getProductById, type Product } from "@/data/products";
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
  const [hasChosen, setHasChosen] = useState(false);
  const [registered, setRegistered] = useState(false);

  const guideStep: 1 | 2 | 3 = modalOpen ? 2 : registered ? 3 : 1;

  function openFullDossier() {
    setSelectedProductIds([]);
    setModalOpen(true);
  }

  function openProductSpecs(product: Product) {
    setHasChosen(true);
    setSelectedProductIds([product.id]);
    setModalOpen(true);
  }

  function openProductById(productId: string) {
    const product = getProductById(productId);
    if (product) openProductSpecs(product);
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
      <section className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-white pb-[calc(7.75rem+env(safe-area-inset-bottom))] sm:min-h-0 sm:pb-0">
        <div
          aria-hidden="true"
          className="hero-mesh pointer-events-none absolute inset-0 opacity-70"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-12 size-72 rounded-full bg-mika/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-3xl px-4 py-2 sm:px-6 sm:py-5 lg:max-w-5xl lg:px-8">
          <div className="flex items-center justify-between gap-3">
            <Image
              src={MIKAZONE_LOGO}
              alt="MikaZone USA — Mancam Global Supply"
              width={320}
              height={107}
              priority
              className="h-10 w-auto max-w-[min(58%,180px)] object-contain object-left sm:h-14 sm:max-w-[240px]"
            />
            <div className="shrink-0 text-right">
              <p className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-mika sm:block sm:text-[11px]">
                Official partner
              </p>
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 transition hover:text-mika"
              >
                <Phone className="size-3" />
                {STAND_PHONE_SHORT}
              </a>
              {eventPin ? (
                <p className="mt-0.5 text-[10px] font-medium text-slate-400 sm:text-[11px]">
                  Event {eventPin}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="sticky top-0 z-30 border-b border-emerald-100/80 bg-white/90 px-4 py-1.5 backdrop-blur-md sm:px-6 sm:py-2 lg:px-8">
          <div className="mx-auto max-w-3xl lg:max-w-5xl">
            <StandGuide step={guideStep} />
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 pb-2 pt-4 sm:px-6 sm:pt-10 lg:max-w-5xl lg:px-8">
          <p className="text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-mika sm:text-sm">
            BuildExpo South Florida 2026
          </p>
          <h1 className="mt-1.5 text-center text-[1.65rem] font-semibold leading-[1.12] tracking-tight text-slate-900 sm:text-5xl">
            {registered ? (
              <>
                Specs unlocked.{" "}
                <span className="text-mika">Browse or WhatsApp the booth.</span>
              </>
            ) : (
              <>
                Tap a bag.{" "}
                <span className="text-mika">Unlock the specs.</span>
              </>
            )}
          </h1>
          <p className="mx-auto mt-2 hidden max-w-md text-center text-sm leading-6 text-slate-600 sm:mt-3 sm:block sm:text-base">
            {registered
              ? "Your PDF is downloading. Need another grade? Tap a bag or browse the catalog."
              : "Three grades on the table. One tap opens registration. PDF at the stand."}
          </p>

          <div className="mt-3 flex flex-1 flex-col justify-end sm:mt-8 sm:justify-center">
            <ProductTheater
              onSelectProduct={openProductById}
              coach={!hasChosen && !registered}
            />
          </div>

          <div className="mt-8 hidden flex-col items-center gap-3 sm:flex">
            <button
              type="button"
              onClick={openFullDossier}
              className="inline-flex min-h-14 w-full max-w-md items-center justify-center gap-3 bg-[#10B981] px-6 text-sm font-bold tracking-wide text-white shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:bg-emerald-700"
            >
              <FileDown className="size-5 shrink-0" />
              {registered
                ? "Download full dossier again"
                : "Get the full 10-grade dossier"}
            </button>
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-500 underline-offset-4 transition hover:text-mika hover:underline"
            >
              Instant factory pricing · WhatsApp {STAND_PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>

      <ProductCatalog onViewSpecs={openProductSpecs} />

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:hidden">
        <button
          type="button"
          onClick={openFullDossier}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 bg-[#10B981] px-4 text-[13px] font-bold tracking-wide text-white"
        >
          <FileDown className="size-4 shrink-0" />
          {registered ? "Full dossier PDF" : "Get dossier & pricing"}
        </button>
        <a
          href={WHATSAPP_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 text-sm font-bold text-white"
        >
          <WhatsAppMark className="size-4 shrink-0" />
          Chat booth · {STAND_PHONE_SHORT}
        </a>
      </div>

      <a
        href={WHATSAPP_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-4 z-40 hidden max-w-[min(calc(100vw-2rem),20rem)] items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-[#1ebe5d] sm:inline-flex"
      >
        <WhatsAppMark className="size-5 shrink-0" />
        <span className="leading-tight">
          Chat Booth Rep ({STAND_PHONE_SHORT})
        </span>
      </a>

      <LeadCaptureModal
        key={modalOpen ? selectedProductIds.join("|") || "dossier" : "closed"}
        open={modalOpen}
        initialProductIds={selectedProductIds}
        dossierMode={selectedProductIds.length === 0}
        onClose={() => setModalOpen(false)}
        onRegistered={() => setRegistered(true)}
      />

      <footer className="mt-auto w-full bg-slate-900 pb-[calc(8.5rem+env(safe-area-inset-bottom))] sm:pb-0">
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
