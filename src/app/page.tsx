"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import { FileDown, Phone, UserRound } from "lucide-react";
import { Hero3DIntro } from "@/components/Hero3DIntro";
import { LeadCaptureModal } from "@/components/LeadCaptureModal";
import { ProductCatalog } from "@/components/ProductCatalog";
import { ProductSheet } from "@/components/ProductSheet";
import { ProductTheater } from "@/components/ProductTheater";
import { StandGuide } from "@/components/StandGuide";
import { StandTracker, recordStandEvent } from "@/components/StandTracker";
import { getProductById, type Product } from "@/data/products";
import { downloadMikaZoneCatalog } from "@/lib/catalog";
import {
  COMPANY_NAME,
  PARTNER_NAME,
  STAND_PHONE_DISPLAY,
  STAND_TEL_HREF,
} from "@/lib/contact";
import { SACK_LINEUP } from "@/data/sacks";

const MIKAZONE_LOGO =
  "https://res.cloudinary.com/dgphys1xd/image/upload/v1788991971/PHOTO-2026-09-07-18-40-08_zw0udk.jpg";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [registered, setRegistered] = useState(false);
  const overlayOpen = Boolean(activeProduct) || modalOpen;

  function openRegister(productIds: string[] = []) {
    setActiveProduct(null);
    setSelectedProductIds(productIds);
    setModalOpen(true);
    recordStandEvent("register_open", productIds[0]);
  }

  function openProductSpecs(product: Product) {
    setActiveProduct(product);
    recordStandEvent("product_view", product.id);
  }

  function openProductById(productId: string) {
    const product = getProductById(productId);
    if (product) openProductSpecs(product);
  }

  function downloadBrochure() {
    downloadMikaZoneCatalog();
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

        <div className="relative mx-auto flex w-full max-w-3xl justify-center px-4 py-3 sm:px-6 sm:py-5 lg:max-w-5xl lg:px-8">
          <Image
            src={MIKAZONE_LOGO}
            alt={`${PARTNER_NAME} — ${COMPANY_NAME}`}
            width={420}
            height={140}
            priority
            className="h-14 w-auto max-w-[min(78%,280px)] object-contain sm:h-[4.5rem] sm:max-w-[320px]"
          />
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
          <h1 className="mt-2 text-center text-[1.55rem] font-semibold leading-[1.12] tracking-tight text-slate-900 sm:text-5xl">
            Cellulose ethers for U.S. plants.
          </h1>
          <p className="mx-auto mt-2 max-w-md text-center text-[13px] leading-5 text-slate-600 sm:mt-3 sm:text-base sm:leading-6">
            {COMPANY_NAME} is the official {PARTNER_NAME} partner.
            Tap a bag for the grade — the catalog is free.
          </p>

          <div className="mt-4 flex flex-1 flex-col justify-end sm:mt-10 sm:justify-center">
            <ProductTheater
              onSelectProduct={openProductById}
              dormant={showIntro}
            />
          </div>

          <div className="mt-8 hidden w-full max-w-xl flex-col gap-3 self-center sm:flex sm:flex-row">
            <button
              type="button"
              onClick={downloadBrochure}
              className="inline-flex min-h-14 flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-6 text-sm font-bold text-slate-900"
            >
              <FileDown className="size-5 shrink-0" />
              Download catalog
            </button>
            <button
              type="button"
              onClick={() => openRegister()}
              className="inline-flex min-h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 text-sm font-bold text-white"
            >
              <UserRound className="size-5 shrink-0" />
              {registered ? "You’re registered" : "Request a quote"}
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
            commercially. The catalog stays free.
          </p>
          <button
            type="button"
            onClick={() => openRegister()}
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 text-sm font-bold text-white"
          >
            <UserRound className="size-4" />
            {registered ? "Update my details" : "Register at the stand"}
          </button>
        </div>
      </section>

      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/96 px-4 pt-2.5 pb-[max(0.7rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:hidden ${
          overlayOpen ? "hidden" : ""
        }`}
      >
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={downloadBrochure}
            className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-2xl border border-slate-300 bg-white px-3 text-[13px] font-bold text-slate-900"
          >
            <FileDown className="size-4 shrink-0" />
            Catalog
          </button>
          <button
            type="button"
            onClick={() => openRegister()}
            className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-2xl bg-emerald-600 px-3 text-[13px] font-bold text-white"
          >
            <UserRound className="size-4 shrink-0" />
            Quote
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
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-xs text-white/35">
            {COMPANY_NAME} · Official {PARTNER_NAME} partner
          </p>
        </div>
      </footer>
    </div>
  );
}

function AboutSection() {
  return (
    <section id="about" className="bg-sand px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-mika">
            Who we are
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {COMPANY_NAME}
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-slate-600 sm:text-base">
            Official {PARTNER_NAME} partner. We bring MikaZone cellulose ethers,
            redispersible powders, and construction additives to U.S. dry-mix
            plants, coatings formulators, and concrete producers — factory-direct,
            with technical support at this stand.
          </p>
          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="border-t border-slate-300/80 pt-4">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                At BuildExpo
              </dt>
              <dd className="mt-1.5 text-sm font-semibold text-slate-900">
                South Florida · Sep 30 – Oct 1
              </dd>
            </div>
            <div className="border-t border-slate-300/80 pt-4">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Stand line
              </dt>
              <dd className="mt-1.5">
                <a
                  href={STAND_TEL_HREF}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900"
                >
                  <Phone className="size-3.5 text-mika" />
                  {STAND_PHONE_DISPLAY}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div className="relative">
          <div
            className="pointer-events-none absolute inset-x-8 bottom-6 h-16 rounded-[100%] bg-slate-900/10 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative grid grid-cols-3 items-end gap-2 rounded-[28px] bg-white px-4 py-8 shadow-[0_30px_60px_-36px_rgba(15,23,42,0.35)] sm:px-8">
            {SACK_LINEUP.map((sack) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={sack.productId}
                src={sack.front}
                alt={sack.shortName}
                className="mx-auto h-auto max-h-44 w-full object-contain drop-shadow-[0_16px_20px_rgba(15,23,42,0.14)] sm:max-h-56"
              />
            ))}
          </div>
          <p className="mt-4 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            HPMC · HEC · RDP
          </p>
        </div>
      </div>
    </section>
  );
}
