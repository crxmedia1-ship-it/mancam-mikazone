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
      <section className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-white pb-10 sm:min-h-0 sm:pb-16">
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
          <h1 className="font-display mt-2 text-center text-[2.15rem] leading-[1.05] tracking-tight text-slate-900 sm:text-6xl">
            Catalog and specifications.
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-center text-[14px] leading-6 text-slate-600 sm:mt-4 sm:text-lg">
            Official MikaZone grades for the U.S. market. {COMPANY_NAME} is
            the {PARTNER_NAME} partner at this stand.
          </p>

          <div className="mt-4 flex flex-1 flex-col justify-end sm:mt-10 sm:justify-center">
            <ProductTheater
              onSelectProduct={openProductById}
              dormant={showIntro}
            />
          </div>

          <div className="mt-5 flex w-full max-w-xl flex-col gap-2.5 self-center sm:mt-8 sm:flex-row sm:gap-3">
            <button
              type="button"
              onClick={downloadBrochure}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 text-sm font-bold text-slate-900 sm:min-h-14"
            >
              <FileDown className="size-5 shrink-0" />
              Download catalog
            </button>
            <button
              type="button"
              onClick={() => openRegister()}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 text-sm font-bold text-white sm:min-h-14"
            >
              <UserRound className="size-5 shrink-0" />
              {registered ? "You’re registered" : "Request a quote"}
            </button>
          </div>
        </div>
      </section>

      <AboutSection
        registered={registered}
        onDownloadCatalog={downloadBrochure}
        onRegister={() => openRegister()}
      />

      <ProductCatalog onViewSpecs={openProductSpecs} />

      <section
        id="register"
        className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
      >
        <div className="mx-auto max-w-xl rounded-[28px] border border-slate-200 bg-slate-50 px-5 py-8 text-center sm:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-mika">
            Commercial follow-up
          </p>
          <h2 className="font-display mt-2 text-[1.85rem] tracking-tight text-slate-900">
            Request pricing and samples.
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Leave name, company, phone, email, and the grades you want. Mancam
            follows up with pricing and samples. The catalog stays free.
          </p>
          <button
            type="button"
            onClick={() => openRegister()}
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 text-sm font-bold text-white"
          >
            <UserRound className="size-4" />
            {registered ? "Update my details" : "Register for a quote"}
          </button>
        </div>
      </section>

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

      <footer className="mt-auto w-full bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-xs text-white/35">
            {COMPANY_NAME} · Official {PARTNER_NAME} partner
          </p>
        </div>
      </footer>
    </div>
  );
}

function AboutSection({
  registered,
  onDownloadCatalog,
  onRegister,
}: {
  registered: boolean;
  onDownloadCatalog: () => void;
  onRegister: () => void;
}) {
  return (
    <section id="about" className="relative overflow-hidden bg-sand px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-10 size-72 rounded-full bg-emerald-400/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 bottom-10 size-64 rounded-full bg-cyan-400/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-5xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-mika">
          Who we are
        </p>
        <h2 className="font-display mt-3 max-w-2xl text-[2.15rem] leading-[1.08] tracking-tight text-slate-900 sm:text-5xl">
          Factory-direct MikaZone for U.S. plants.
        </h2>
        <p className="mt-5 max-w-2xl text-[16px] leading-8 text-slate-600 sm:text-lg">
          {COMPANY_NAME} is the official {PARTNER_NAME} partner in the United
          States. Cellulose ethers, redispersible powders, and construction
          additives — with technical support at this stand.
        </p>

        <ul className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            {
              kicker: "Supply",
              label: "Factory-direct",
              body: "HPMC, HEC, RDP, and specialties shipped for U.S. dry-mix and coatings.",
              accent: "#4DB8C9",
            },
            {
              kicker: "Catalog",
              label: "Specs, no login",
              body: "Open any grade on this site. Download the full MikaZone USA catalog.",
              accent: "#E07A45",
            },
            {
              kicker: "Stand",
              label: "Talk applications",
              body: "Dosage, formulations, and samples with the team in South Florida.",
              accent: "#2BA090",
            },
          ].map((item) => (
            <li
              key={item.label}
              className="rounded-2xl bg-white px-4 py-5 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.4)]"
              style={{ borderTop: `3px solid ${item.accent}` }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                {item.kicker}
              </p>
              <p className="mt-1.5 text-base font-bold text-slate-900">{item.label}</p>
              <p className="mt-1.5 text-[13px] leading-5 text-slate-600">{item.body}</p>
            </li>
          ))}
        </ul>

        <div className="mt-10 overflow-hidden rounded-[28px] bg-white shadow-[0_30px_60px_-36px_rgba(15,23,42,0.28)]">
          <Image
            src="/about/mikazone-applications.png"
            alt="MikaZone HPMC, MHEC, HEC, and modified cellulose applications"
            width={1200}
            height={780}
            className="h-auto w-full object-contain"
          />
          <p className="border-t border-slate-100 px-5 py-3 text-center text-[12px] font-medium text-slate-500">
            HPMC · MHEC · HEC · Modified cellulose — applications from the MikaZone catalog
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-[28px] bg-slate-900 px-5 py-7 text-white sm:px-8 sm:py-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-lg">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
                Next step
              </p>
              <h3 className="font-display mt-2 text-[1.65rem] leading-tight tracking-tight sm:text-3xl">
                Take the catalog. Leave a quote request.
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/70">
                Pricing and samples after the show. Or call the stand line now.
              </p>
              <a
                href={STAND_TEL_HREF}
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-white"
              >
                <Phone className="size-4 text-emerald-400" />
                {STAND_PHONE_DISPLAY}
              </a>
            </div>
            <div className="flex w-full flex-col gap-2.5 sm:max-w-sm">
              <button
                type="button"
                onClick={onDownloadCatalog}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-bold text-slate-900"
              >
                <FileDown className="size-4" />
                Download catalog
              </button>
              <button
                type="button"
                onClick={onRegister}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 text-sm font-bold text-white"
              >
                <UserRound className="size-4" />
                {registered ? "You’re registered" : "Request a quote"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
