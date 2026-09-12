"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import { Hero3DIntro } from "@/components/Hero3DIntro";
import { LeadCaptureModal } from "@/components/LeadCaptureModal";
import { AboutStory } from "@/components/AboutStory";
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
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 pb-2 pt-2 sm:px-6 sm:pt-3 lg:px-8 xl:max-w-[92rem] 2xl:max-w-[110rem]">
          <Image
            src={MIKAZONE_LOGO}
            alt={`${PARTNER_NAME} — ${COMPANY_NAME}`}
            width={560}
            height={180}
            priority
            className="h-[4.35rem] w-auto max-w-[min(92%,360px)] object-contain sm:h-[5.75rem] sm:max-w-[440px] xl:h-[6.5rem] xl:max-w-[520px]"
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
          className={`absolute inset-0 min-h-0 overflow-x-hidden overflow-y-auto overscroll-y-contain ${
            pane === "about" ? "z-10" : "pointer-events-none invisible"
          }`}
          aria-hidden={pane !== "about"}
        >
          <AboutStory
            registered={registered}
            onDownloadCatalog={downloadBrochure}
            onRegister={() => openRegister()}
          />
        </div>

        <div
          className={`absolute inset-0 min-h-0 overflow-x-hidden overflow-y-auto overscroll-y-contain ${
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

      <div className="relative mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:px-6 sm:pt-5 lg:max-w-5xl lg:px-8 xl:max-w-[92rem] 2xl:max-w-[110rem]">
        <p className="text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-mika sm:text-xs">
          BuildExpo South Florida · Sep 30 – Oct 1
        </p>
        <h1 className="font-display mt-1.5 text-center text-[1.85rem] leading-[1.05] tracking-tight text-slate-900 sm:mt-2 sm:text-5xl xl:text-6xl 2xl:text-7xl">
          Mancam Global Supply.
        </h1>
        <p className="mx-auto mt-2 max-w-lg text-center text-[13px] leading-5 text-slate-600 sm:mt-3 sm:text-base sm:leading-6 xl:max-w-2xl xl:text-lg">
          Official {PARTNER_NAME} partner. Factory-direct cellulose ethers,
          RDP, and construction additives for U.S. plants.
        </p>

        <div className="mt-3 flex min-h-0 flex-1 flex-col justify-center sm:mt-6">
          <ProductTheater
            onSelectProduct={onSelectProduct}
            dormant={dormant}
          />
        </div>

        <div className="mt-3 w-full max-w-xl self-center sm:mt-6 xl:max-w-2xl">
          <button
            type="button"
            onClick={onRegister}
            className="btn-shine btn-mika relative flex w-full flex-col items-center rounded-[26px] px-5 py-4 text-white"
          >
            <span className="font-display relative text-[1.45rem] leading-none tracking-tight sm:text-[1.7rem]">
              {registered ? "You’re registered." : "Leave your details."}
            </span>
            <span className="relative mt-2 text-[12px] font-medium tracking-wide text-white/80 sm:text-[13px]">
              Name, company, phone — we quote after the show.
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}