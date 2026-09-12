"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import { FileDown, Lock, Phone, UserRound } from "lucide-react";
import { Hero3DIntro } from "@/components/Hero3DIntro";
import { LeadCaptureModal } from "@/components/LeadCaptureModal";
import { ProductCatalog } from "@/components/ProductCatalog";
import { ProductSheet } from "@/components/ProductSheet";
import { ProductTheater } from "@/components/ProductTheater";
import { StandGuide } from "@/components/StandGuide";
import { StandTracker, recordStandEvent } from "@/components/StandTracker";
import { PRODUCTS, getProductById, type Product } from "@/data/products";
import { downloadProductDatasheets } from "@/lib/datasheet-pdf";
import {
  COMPANY_NAME,
  PARTNER_NAME,
  STAND_PHONE_DISPLAY,
  STAND_PHONE_SHORT,
  STAND_TEL_HREF,
} from "@/lib/contact";

const MIKAZONE_LOGO =
  "https://res.cloudinary.com/dgphys1xd/image/upload/v1788991971/PHOTO-2026-09-07-18-40-08_zw0udk.jpg";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [registered, setRegistered] = useState(false);
  const [hasViewed, setHasViewed] = useState(false);

  function openRegister(productIds: string[] = []) {
    setActiveProduct(null);
    setSelectedProductIds(productIds);
    setModalOpen(true);
    recordStandEvent("register_open", productIds[0]);
  }

  function openProductSpecs(product: Product) {
    setHasViewed(true);
    setActiveProduct(product);
    recordStandEvent("product_view", product.id);
  }

  function openProductById(productId: string) {
    const product = getProductById(productId);
    if (product) openProductSpecs(product);
  }

  function downloadBrochure() {
    downloadProductDatasheets(PRODUCTS);
    recordStandEvent("brochure_download");
  }

  return (
    <div className="flex min-h-full flex-col bg-white">
      <StandTracker />
      <AnimatePresence>
        {showIntro ? (
          <Hero3DIntro
            key="hero-intro"
            onComplete={() => setShowIntro(false)}
          />
        ) : null}
      </AnimatePresence>
      <section className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-white pb-[calc(5.75rem+env(safe-area-inset-bottom))] sm:min-h-0 sm:pb-0">
        <div
          aria-hidden="true"
          className="hero-mesh pointer-events-none absolute inset-0 opacity-70"
        />

        <div className="relative mx-auto w-full max-w-3xl px-4 py-2.5 sm:px-6 sm:py-5 lg:max-w-5xl lg:px-8">
          <div className="flex items-center justify-between gap-3">
            <Image
              src={MIKAZONE_LOGO}
              alt={`${PARTNER_NAME} — ${COMPANY_NAME}`}
              width={320}
              height={107}
              priority
              className="h-10 w-auto max-w-[min(58%,180px)] object-contain object-left sm:h-14 sm:max-w-[240px]"
            />
            <a
              href={STAND_TEL_HREF}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 transition hover:text-mika sm:text-sm"
            >
              <Phone className="size-3.5" />
              {STAND_PHONE_SHORT}
            </a>
          </div>
        </div>

        <div className="sticky top-0 z-30 hidden border-b border-slate-200/80 bg-white/90 px-4 py-2 backdrop-blur-md sm:block sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-slate-50/90 px-3 lg:max-w-5xl">
            <StandGuide />
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 pb-2 pt-3 sm:px-6 sm:pt-10 lg:max-w-5xl lg:px-8">
          <p className="text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-mika sm:text-xs">
            BuildExpo South Florida · Sep 30 – Oct 1
          </p>
          <p className="mt-1.5 text-center text-[13px] font-semibold leading-5 text-slate-700 sm:text-base">
            {COMPANY_NAME}
          </p>
          <h1 className="mt-1 text-center text-[1.55rem] font-semibold leading-[1.12] tracking-tight text-slate-900 sm:text-5xl">
            Official {PARTNER_NAME} partner.
          </h1>
          <p className="mx-auto mt-2 max-w-md text-center text-[13px] leading-5 text-slate-600 sm:mt-3 sm:text-base sm:leading-6">
            Tap a bag for specs. Brochure is free. Register if you want a quote
            after the show.
          </p>

          <div className="mt-4 flex flex-1 flex-col justify-end sm:mt-10 sm:justify-center">
            <ProductTheater onSelectProduct={openProductById} coach={!hasViewed} />
          </div>

          <div className="mt-8 hidden w-full max-w-xl flex-col gap-3 self-center sm:flex sm:flex-row">
            <button
              type="button"
              onClick={downloadBrochure}
              className="inline-flex min-h-14 flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-slate-900 bg-white px-6 text-sm font-bold text-slate-900"
            >
              <FileDown className="size-5 shrink-0" />
              Download brochure
            </button>
            <button
              type="button"
              onClick={() => openRegister()}
              className="inline-flex min-h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 text-sm font-bold text-white shadow-[0_10px_24px_-10px_rgba(5,150,105,0.9)]"
            >
              <UserRound className="size-5 shrink-0" />
              {registered ? "You’re registered" : "Register for follow-up"}
            </button>
          </div>
        </div>
      </section>

      <AboutSection />

      <ProductCatalog onViewSpecs={openProductSpecs} />

      <section
        id="register"
        className="bg-white px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
      >
        <div className="mx-auto max-w-xl rounded-[28px] border border-slate-200 bg-slate-50 px-5 py-8 text-center sm:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-mika">
            After the show
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            Want a quote or samples?
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Name, company, phone, email, and the grades you liked. We follow up
            commercially. The brochure stays free.
          </p>
          <button
            type="button"
            onClick={() => openRegister()}
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 text-sm font-bold text-white shadow-[0_10px_24px_-10px_rgba(5,150,105,0.9)]"
          >
            <UserRound className="size-4" />
            {registered ? "Update my details" : "Register for follow-up"}
          </button>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/96 px-4 pt-2.5 pb-[max(0.7rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:hidden">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={downloadBrochure}
            className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-2xl border-2 border-slate-900 bg-white px-3 text-[13px] font-bold text-slate-900"
          >
            <FileDown className="size-4 shrink-0" />
            Brochure
          </button>
          <button
            type="button"
            onClick={() => openRegister()}
            className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-2xl bg-emerald-600 px-3 text-[13px] font-bold text-white shadow-[0_8px_18px_-8px_rgba(5,150,105,0.95)]"
          >
            <UserRound className="size-4 shrink-0" />
            Register
          </button>
        </div>
      </div>

      <ProductSheet
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
        onRegister={(product) => openRegister([product.id])}
        onDownload={(product) => recordStandEvent("brochure_download", product.id)}
      />

      <LeadCaptureModal
        key={modalOpen ? selectedProductIds.join("|") || "register" : "closed"}
        open={modalOpen}
        initialProductIds={selectedProductIds}
        onClose={() => setModalOpen(false)}
        onRegistered={() => setRegistered(true)}
      />

      <footer className="mt-auto w-full bg-slate-900 pb-[calc(5.75rem+env(safe-area-inset-bottom))] sm:pb-0">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-xs text-white/35">
            {COMPANY_NAME} · Official {PARTNER_NAME} partner
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

function AboutSection() {
  return (
    <section id="about" className="bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-mika">
          Who we are
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          {COMPANY_NAME}
        </h2>
        <p className="mt-3 text-[15px] leading-7 text-slate-600">
          Official {PARTNER_NAME} partner for the U.S. market. Cellulose ethers,
          redispersible powders, and construction additives — factory-direct,
          with technical support at this stand.
        </p>
        <dl className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Event
            </dt>
            <dd className="mt-1 text-sm font-semibold text-slate-900">
              BuildExpo South Florida 2026
            </dd>
            <dd className="text-sm text-slate-500">Sep 30 – Oct 1 · Broward County</dd>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Stand line
            </dt>
            <dd className="mt-1">
              <a
                href={STAND_TEL_HREF}
                className="text-sm font-semibold text-emerald-700"
              >
                {STAND_PHONE_DISPLAY}
              </a>
            </dd>
            <dd className="text-sm text-slate-500">Call or text the booth</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
