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
      <section className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-white pb-[calc(6.75rem+env(safe-area-inset-bottom))] sm:min-h-0 sm:pb-0">
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
          <p className="text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-mika sm:text-xs">
            BuildExpo South Florida · Sep 30 – Oct 1
          </p>
          <h1 className="font-display mt-2 text-center text-[2.35rem] leading-[1.02] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
            Tap a bag.
          </h1>
          <p className="mx-auto mt-3 max-w-md text-center text-[14px] leading-6 text-slate-600 sm:mt-4 sm:text-lg">
            See the grade. {COMPANY_NAME} — official {PARTNER_NAME} partner.
            Catalog is free.
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
        className="bg-white px-4 py-12 pb-[calc(7.5rem+env(safe-area-inset-bottom))] sm:px-6 sm:pb-16 lg:px-8 lg:py-16"
      >
        <div className="mx-auto max-w-xl rounded-[28px] border border-slate-200 bg-slate-50 px-5 py-8 text-center sm:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-mika">
            After the show
          </p>
          <h2 className="font-display mt-2 text-[1.85rem] tracking-tight text-slate-900">
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
        className={`fixed inset-x-3 z-40 sm:hidden ${
          overlayOpen ? "pointer-events-none hidden" : ""
        }`}
        style={{
          bottom: "max(0.75rem, env(safe-area-inset-bottom))",
        }}
      >
        <div className="grid grid-cols-2 gap-2 rounded-[22px] border border-slate-200/90 bg-white/92 p-2 shadow-[0_12px_40px_-16px_rgba(15,23,42,0.45)] backdrop-blur-md">
          <button
            type="button"
            onClick={downloadBrochure}
            className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3 text-[13px] font-bold text-slate-900"
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

      <footer className="mt-auto w-full bg-slate-900 pb-[calc(6.75rem+env(safe-area-inset-bottom))] sm:pb-0">
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
    <section
      id="about"
      className="bg-sand px-4 py-16 pb-[calc(7.5rem+env(safe-area-inset-bottom))] sm:px-6 sm:pb-16 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-5xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-mika">
          Who we are
        </p>
        <h2 className="font-display mt-3 max-w-xl text-[2.15rem] leading-[1.08] tracking-tight text-slate-900 sm:text-5xl">
          The official MikaZone partner in the United States.
        </h2>
        <p className="mt-5 max-w-2xl text-[16px] leading-8 text-slate-600 sm:text-lg sm:leading-8">
          {COMPANY_NAME} supplies cellulose ethers, redispersible powders, and
          construction additives — factory-direct — to dry-mix plants, coatings
          formulators, and concrete producers. Technical support is at this
          stand.
        </p>

        <div className="mt-10 overflow-hidden rounded-[28px] bg-white shadow-[0_30px_60px_-36px_rgba(15,23,42,0.28)]">
          <Image
            src="/about/mikazone-applications.png"
            alt="MikaZone HPMC, MHEC, HEC, and modified cellulose applications"
            width={1200}
            height={780}
            className="h-auto w-full object-contain"
          />
        </div>

        <dl className="mt-10 grid gap-8 sm:grid-cols-2">
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              At BuildExpo
            </dt>
            <dd className="mt-2 text-base font-medium text-slate-900">
              South Florida · Sep 30 – Oct 1
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Stand line
            </dt>
            <dd className="mt-2">
              <a
                href={STAND_TEL_HREF}
                className="inline-flex items-center gap-2 text-base font-medium text-slate-900"
              >
                <Phone className="size-4 text-mika" />
                {STAND_PHONE_DISPLAY}
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
