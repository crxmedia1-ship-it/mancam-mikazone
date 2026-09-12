"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import { FileDown, Phone, UserRound } from "lucide-react";
import { Hero3DIntro } from "@/components/Hero3DIntro";
import { LeadCaptureModal } from "@/components/LeadCaptureModal";
import { ProductCatalog } from "@/components/ProductCatalog";
import { ProductSheet } from "@/components/ProductSheet";
import { ProductTheater } from "@/components/ProductTheater";
import {
  StandGuide,
  hashFromPane,
  paneFromHash,
  type StandPaneId,
} from "@/components/StandGuide";
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
  const [pane, setPane] = useState<StandPaneId>("home");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [registered, setRegistered] = useState(false);

  function selectPane(next: StandPaneId) {
    setPane(next);
    const nextHash = hashFromPane(next);
    const url = `${window.location.pathname}${window.location.search}${nextHash}`;
    window.history.replaceState(null, "", url);
  }

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

  useEffect(() => {
    function applyHash() {
      if (showIntro) {
        setPane("home");
        return;
      }
      const hash = window.location.hash;
      if (hash === "#register") {
        setPane("home");
        setModalOpen(true);
        return;
      }
      setPane(paneFromHash(hash));
    }

    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [showIntro]);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-white">
      <StandTracker />
      <AnimatePresence>
        {showIntro ? (
          <Hero3DIntro
            key="hero-intro"
            onComplete={() => setShowIntro(false)}
          />
        ) : null}
      </AnimatePresence>

      <header className="relative z-30 shrink-0 border-b border-slate-200/80 bg-white/95 pt-[env(safe-area-inset-top)] backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 pb-2 pt-2 sm:px-6 sm:pt-3 lg:px-8">
          <Image
            src={MIKAZONE_LOGO}
            alt={`${PARTNER_NAME} — ${COMPANY_NAME}`}
            width={560}
            height={180}
            priority
            className="h-[4.35rem] w-auto max-w-[min(92%,360px)] object-contain sm:h-[5.75rem] sm:max-w-[440px]"
          />
          <div className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50/90 px-1.5">
            <StandGuide active={pane} onSelect={selectPane} />
          </div>
        </div>
      </header>

      <main className="relative min-h-0 flex-1 overflow-hidden">
        <div
          className={`absolute inset-0 flex min-h-0 flex-col ${
            pane === "home" ? "z-10" : "pointer-events-none invisible"
          }`}
          aria-hidden={pane !== "home"}
        >
          <HomePane
            registered={registered}
            dormant={showIntro}
            onSelectProduct={openProductById}
            onRegister={() => openRegister()}
          />
        </div>

        <div
          className={`absolute inset-0 min-h-0 overflow-y-auto overscroll-y-contain ${
            pane === "about" ? "z-10" : "pointer-events-none invisible"
          }`}
          aria-hidden={pane !== "about"}
        >
          <AboutSection
            registered={registered}
            onDownloadCatalog={downloadBrochure}
            onRegister={() => openRegister()}
          />
        </div>

        <div
          className={`absolute inset-0 min-h-0 overflow-y-auto overscroll-y-contain ${
            pane === "catalog" ? "z-10" : "pointer-events-none invisible"
          }`}
          aria-hidden={pane !== "catalog"}
        >
          <ProductCatalog
            onViewSpecs={openProductSpecs}
            onDownloadCatalog={downloadBrochure}
            onRegister={() => openRegister()}
            registered={registered}
          />
        </div>
      </main>

      <ProductSheet
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
      />

      <LeadCaptureModal
        key={modalOpen ? selectedProductIds.join("|") || "register" : "closed"}
        open={modalOpen}
        initialProductIds={selectedProductIds}
        onClose={() => setModalOpen(false)}
        onRegistered={() => setRegistered(true)}
      />
    </div>
  );
}

function HomePane({
  registered,
  dormant,
  onSelectProduct,
  onRegister,
}: {
  registered: boolean;
  dormant: boolean;
  onSelectProduct: (productId: string) => void;
  onRegister: () => void;
}) {
  return (
    <section className="relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-white">
      <div
        aria-hidden="true"
        className="hero-mesh pointer-events-none absolute inset-0 opacity-70"
      />
      <div
        aria-hidden="true"
        className="usa-flag-wash pointer-events-none absolute inset-0"
      />

      <div className="relative mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:px-6 sm:pt-5 lg:max-w-5xl lg:px-8">
        <p className="text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-mika sm:text-xs">
          BuildExpo South Florida · Sep 30 – Oct 1
        </p>
        <h1 className="font-display mt-1.5 text-center text-[1.85rem] leading-[1.05] tracking-tight text-slate-900 sm:mt-2 sm:text-5xl">
          Mancam Global Supply.
        </h1>
        <p className="mx-auto mt-2 max-w-lg text-center text-[13px] leading-5 text-slate-600 sm:mt-3 sm:text-base sm:leading-6">
          Official {PARTNER_NAME} partner. Factory-direct cellulose ethers,
          RDP, and construction additives for U.S. plants.
        </p>

        <div className="mt-3 flex min-h-0 flex-1 flex-col justify-center sm:mt-6">
          <ProductTheater
            onSelectProduct={onSelectProduct}
            dormant={dormant}
          />
        </div>

        <div className="mt-3 w-full max-w-xl self-center sm:mt-6">
          <p className="text-center text-[13px] leading-5 text-slate-600 sm:text-sm">
            Leave name, company, phone, and the grades you want. We follow up
            with pricing and samples.
          </p>
          <button
            type="button"
            onClick={onRegister}
            className="mt-2.5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 text-sm font-bold text-white sm:min-h-14 sm:text-base"
          >
            <UserRound className="size-5 shrink-0" />
            {registered ? "You’re registered" : "Leave your details"}
          </button>
        </div>
      </div>
    </section>
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
    <section
      id="about"
      className="relative overflow-hidden bg-sand px-4 py-8 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-12 lg:px-8"
    >
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
        <h2 className="font-display mt-2 max-w-2xl text-[1.85rem] leading-[1.08] tracking-tight text-slate-900 sm:text-4xl">
          Factory-direct MikaZone for U.S. plants.
        </h2>
        <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-600 sm:text-lg sm:leading-8">
          {COMPANY_NAME} is the official {PARTNER_NAME} partner in the United
          States. Cellulose ethers, redispersible powders, and construction
          additives — with technical support at this stand.
        </p>

        <ul className="mt-6 grid gap-3 sm:grid-cols-3">
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
              className="rounded-2xl bg-white px-4 py-4 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.4)]"
              style={{ borderTop: `3px solid ${item.accent}` }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                {item.kicker}
              </p>
              <p className="mt-1.5 text-sm font-bold text-slate-900">{item.label}</p>
              <p className="mt-1.5 text-[13px] leading-5 text-slate-600">{item.body}</p>
            </li>
          ))}
        </ul>

        <div className="mt-8 overflow-hidden rounded-[28px] bg-white shadow-[0_30px_60px_-36px_rgba(15,23,42,0.28)]">
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

        <div className="mt-6 overflow-hidden rounded-[28px] bg-slate-900 px-5 py-6 text-white sm:px-8 sm:py-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-lg">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
                Next step
              </p>
              <h3 className="font-display mt-2 text-[1.5rem] leading-tight tracking-tight sm:text-3xl">
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
                {registered ? "You’re registered" : "Leave your details"}
              </button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-slate-400">
          {COMPANY_NAME} · Official {PARTNER_NAME} partner
        </p>
      </div>
    </section>
  );
}
