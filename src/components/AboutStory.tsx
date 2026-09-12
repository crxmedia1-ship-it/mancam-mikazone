import Image from "next/image";
import { FileDown, Phone, UserRound } from "lucide-react";
import {
  COMPANY_NAME,
  PARTNER_NAME,
  STAND_PHONE_DISPLAY,
  STAND_TEL_HREF,
} from "@/lib/contact";

const MIKAZONE_LOGO =
  "https://res.cloudinary.com/dgphys1xd/image/upload/v1788991971/PHOTO-2026-09-07-18-40-08_zw0udk.jpg";

const USES = [
  "Tile adhesives",
  "Dry-mix mortars",
  "Wall putties",
  "EIFS / ETICS",
  "Gypsum systems",
  "Waterproofing",
  "Architectural coatings",
  "Ready-mix concrete",
] as const;

const APPLICATIONS = [
  "Tile adhesive",
  "Wall putty",
  "Water-based paints",
  "EIFS",
  "Spray mortar",
  "Self-leveling",
] as const;

const LINES = [
  {
    kicker: "Mortars",
    title: "Cellulose ethers & VAE",
    body: "HPMC MK 200P for water retention, open time, and sag resistance in C2 adhesives, putties, plasters, and EIFS. VAE RPP 3510 for flexible adhesion, crack bridging, and freeze–thaw.",
  },
  {
    kicker: "Coatings",
    title: "HEC for paints",
    body: "Non-ionic thickener for waterborne architectural paints and stone coatings. Color acceptance, ICI/KU viscosity, and spatter resistance from the MikaZone HEC ladder.",
  },
  {
    kicker: "Concrete",
    title: "PCE, fibers, CaFo",
    body: "PC 201–204 superplasticizers, PP monofilament and synthetic macrofiber, and CaFo 98% — water reduction, crack control, and early strength for plants and job sites.",
  },
] as const;

function PhotoSlot({
  label,
  note,
  aspect,
  bleed = false,
}: {
  label: string;
  note: string;
  aspect: string;
  bleed?: boolean;
}) {
  return (
    <figure className={bleed ? "-mx-4 sm:-mx-6 lg:-mx-8 xl:-mx-12" : ""}>
      <div
        className={`relative overflow-hidden bg-[#eef1f4] ${aspect} ${
          bleed ? "sm:rounded-none" : "rounded-[26px] ring-1 ring-slate-200/80"
        }`}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,rgba(255,255,255,0.55)_0%,transparent_46%),linear-gradient(to_top,rgba(10,31,61,0.22),transparent_42%)]"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgb(15 23 42 / 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgb(15 23 42 / 0.05) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <p className="font-display text-[1.45rem] leading-none tracking-tight text-navy sm:text-3xl">
            {label}
          </p>
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
            Photo to come
          </p>
        </div>
      </div>
      <figcaption className={`mt-2.5 text-[13px] leading-5 text-slate-500 ${bleed ? "px-4 sm:px-6 lg:px-8 xl:px-12" : ""}`}>
        {note}
      </figcaption>
    </figure>
  );
}

export function AboutStory({
  registered,
  onDownloadCatalog,
  onRegister,
}: {
  registered: boolean;
  onDownloadCatalog: () => void;
  onRegister: () => void;
}) {
  return (
    <article
      id="about"
      className="bg-white pb-[max(2rem,env(safe-area-inset-bottom))]"
    >
      <header className="mx-auto max-w-3xl px-4 pt-8 sm:max-w-4xl sm:px-6 sm:pt-12 lg:px-8 xl:max-w-5xl xl:px-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-mika">
          Who we are
        </p>
        <h2 className="font-display mt-3 text-[2.15rem] leading-[0.98] tracking-tight text-navy sm:text-6xl sm:leading-[0.96]">
          Building better solutions together.
        </h2>
        <p className="mt-5 max-w-2xl text-[16px] leading-8 text-slate-600 sm:mt-6 sm:text-[18px] sm:leading-9">
          {COMPANY_NAME} is the official {PARTNER_NAME} partner. MikaZone
          researches, produces, and supplies construction additives — cellulose
          ethers, redispersible powders, PCE, and specialties — for dry-mix,
          coatings, and concrete plants.
        </p>
      </header>

      <div className="mt-8 sm:mt-10">
        <PhotoSlot
          bleed
          aspect="aspect-[16/10] sm:aspect-[21/9]"
          label="Plant / mill"
          note="Production floor — drop in a wide mill or warehouse still."
        />
      </div>

      <section className="mx-auto mt-12 max-w-6xl px-4 sm:mt-16 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky">
              About MikaZone
            </p>
            <h3 className="font-display mt-3 text-[1.85rem] leading-[1.04] tracking-tight text-navy sm:text-[2.6rem]">
              Your global partner in construction additive solutions.
            </h3>
            <p className="mt-5 text-[16px] leading-8 text-slate-600 sm:text-[17px] sm:leading-8">
              MikaZone is a specialized manufacturer engaged in the research,
              development, production, and marketing of chemical additives for
              construction materials — backed by a modern plant and a strict
              quality-control system.
            </p>
            <p className="mt-4 text-[16px] leading-8 text-slate-600 sm:text-[17px] sm:leading-8">
              Grades are specified into tile adhesives, dry-mix mortars, wall
              putties, thermal insulation systems (EIFS), gypsum, waterproofing,
              architectural coatings, and ready-mix. The aim is reliable product,
              technical support, and formulations that last.
            </p>
          </div>
          <PhotoSlot
            aspect="aspect-[4/3]"
            label="Application lab"
            note="QC / applications lab — a bench or mixer still works here."
          />
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-6xl px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="overflow-hidden rounded-[28px] bg-mika px-6 py-8 text-white sm:px-10 sm:py-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">
            Where it goes
          </p>
          <p className="font-display mt-3 max-w-xl text-[1.7rem] leading-[1.08] tracking-tight sm:text-[2.15rem]">
            Specified into the systems U.S. plants already run.
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
            {USES.map((item) => (
              <li key={item} className="text-[14px] leading-5 text-white/95 sm:text-[15px]">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-6xl px-4 sm:px-6 lg:px-8 xl:px-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-mika">
          Recommended applications
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {APPLICATIONS.map((item) => (
            <span
              key={item}
              className="rounded-full bg-slate-50 px-3.5 py-2 text-[13px] font-medium tracking-tight text-navy ring-1 ring-slate-200/80"
            >
              {item}
            </span>
          ))}
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
          <PhotoSlot
            aspect="aspect-[3/4] sm:aspect-[4/5]"
            label="On the wall"
            note="Trowel, EIFS, or putty in use."
          />
          <PhotoSlot
            aspect="aspect-[3/4] sm:aspect-[4/5]"
            label="BuildExpo stand"
            note="The South Florida booth, Sep 30 – Oct 1."
          />
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-6xl px-4 sm:px-6 lg:px-8 xl:px-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky">
          From the USA catalog
        </p>
        <h3 className="font-display mt-3 max-w-2xl text-[1.85rem] leading-[1.04] tracking-tight text-navy sm:text-[2.55rem]">
          Mortars, coatings, and concrete — one toolbox.
        </h3>
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)] lg:items-start">
          <ul className="space-y-7">
            {LINES.map((line) => (
              <li key={line.title} className="border-t border-slate-200/90 pt-6 first:border-t-0 first:pt-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-mika">
                  {line.kicker}
                </p>
                <h4 className="font-display mt-1.5 text-[1.45rem] leading-none tracking-tight text-navy sm:text-[1.7rem]">
                  {line.title}
                </h4>
                <p className="mt-3 max-w-xl text-[15px] leading-7 text-slate-600 sm:text-[16px] sm:leading-8">
                  {line.body}
                </p>
              </li>
            ))}
          </ul>
          <div>
            <Image
              src="/about/mikazone-applications.png"
              alt="MikaZone cellulose ether families: HPMC, MHEC, HEC, and modified cellulose"
              width={720}
              height={520}
              className="h-auto w-full rounded-[26px] bg-slate-50 object-contain p-3 ring-1 ring-slate-200/80"
            />
            <p className="mt-2.5 text-[13px] leading-5 text-slate-500">
              HPMC · MHEC · HEC · modified cellulose — the ether families in the
              USA catalog.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 xl:px-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-mika">
            Packaging & storage
          </p>
          <h3 className="font-display mt-3 max-w-2xl text-[1.85rem] leading-[1.04] tracking-tight text-navy sm:text-[2.4rem]">
            25 kg PE-lined bags. Palletized, shrink-wrapped, ready to quote.
          </h3>
          <p className="mt-4 max-w-2xl text-[16px] leading-8 text-slate-600">
            Standard pack is a multi-layer paper bag with PE liner. 20 ft
            container: 600 kg × 20 pallets, 12,000 kg. 40 ft: 700 kg × 40
            pallets, 28,000 kg. Store dry and cool; use within 12 months. Keep
            pallets unstacked to avoid caking.
          </p>
        </div>
        <div className="mt-8">
          <PhotoSlot
            bleed
            aspect="aspect-[16/9] sm:aspect-[21/8]"
            label="Bags & logistics"
            note="Pallet stacks, container, or pack still — full-width works here."
          />
        </div>
      </section>

      <div className="mx-auto mt-14 max-w-[34rem] px-4 sm:max-w-[38rem] sm:px-6">
        <div className="relative overflow-hidden rounded-[22px] bg-[linear-gradient(155deg,#f8f9fb_0%,#e6e9ee_38%,#f4f5f7_68%,#d9dee6_100%)] px-6 py-6 shadow-[0_24px_50px_-28px_rgba(10,31,61,0.35),inset_0_1px_0_rgba(255,255,255,0.9)] ring-1 ring-white/80 sm:px-8 sm:py-7">
          <span
            aria-hidden
            className="absolute inset-y-5 left-0 w-1 rounded-r-full bg-mika"
          />
          <span
            aria-hidden
            className="absolute inset-y-5 right-0 w-1 rounded-l-full bg-sky"
          />

          <Image
            src={MIKAZONE_LOGO}
            alt={`${PARTNER_NAME} — ${COMPANY_NAME}`}
            width={280}
            height={90}
            className="mx-auto h-10 w-auto object-contain sm:h-12"
          />

          <p className="mt-4 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-sky">
            Official USA partner
          </p>
          <h3 className="font-display mt-1 text-center text-[1.55rem] leading-none tracking-tight text-navy sm:text-[1.85rem]">
            {COMPANY_NAME}
          </h3>
          <p className="mt-2 text-center text-[13px] text-slate-500">
            {PARTNER_NAME} · BuildExpo South Florida · Sep 30 – Oct 1
          </p>

          <a
            href={STAND_TEL_HREF}
            className="mt-5 flex flex-col items-center rounded-2xl bg-white/55 py-3 ring-1 ring-white/80"
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Stand line
            </span>
            <span className="mt-1 inline-flex items-center gap-2 text-[1.15rem] font-semibold tracking-tight text-navy">
              <Phone className="size-4 text-sky" />
              {STAND_PHONE_DISPLAY}
            </span>
          </a>

          <p className="mt-4 text-center text-[13px] leading-5 text-slate-500">
            Pricing and samples after the show.
          </p>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={onDownloadCatalog}
              className="btn-shine btn-sky inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-[13px] font-bold text-white"
            >
              <FileDown className="size-4" />
              <span>Download catalog</span>
            </button>
            <button
              type="button"
              onClick={onRegister}
              className="btn-shine btn-mika inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-[13px] font-bold text-white"
            >
              <UserRound className="size-4" />
              <span>{registered ? "You’re registered" : "Leave your details"}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
