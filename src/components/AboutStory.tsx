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

const PHOTO_SLOTS = [
  { label: "Plant / mill", note: "Photo to come" },
  { label: "BuildExpo stand", note: "Photo to come" },
  { label: "Application", note: "Photo to come" },
  { label: "Lab / team", note: "Photo to come" },
] as const;

const CATALOG_KEYS = [
  {
    title: "Cellulose ethers",
    body: "HPMC MK 200P for water retention and open time in C2 adhesives, putties, plasters, and EIFS. HEC for ICI/KU viscosity in waterborne paints.",
  },
  {
    title: "VAE RPP 3510",
    body: "Redispersible polymer for flexible adhesion, crack bridging, and freeze–thaw. The pair with HPMC MK 200P on C2 and EIFS systems.",
  },
  {
    title: "MikaUltra stack",
    body: "HPS, PCE PC 201–204, SHP, GR-7011, DE401/DE402, CaFo 98%, and PP / macro fibers — the dry-mix toolbox around the base ethers.",
  },
  {
    title: "How it ships",
    body: "Standard pack is 25 kg PE-lined bags. Typical HPMC dose 0.20–0.50% of dry mix; VAE 1–5%. Samples and quotes after the show.",
  },
] as const;

function PhotoSlot({ label, note }: { label: string; note: string }) {
  return (
    <figure className="flex min-h-[160px] flex-col overflow-hidden rounded-[22px] bg-slate-50 ring-1 ring-slate-200/80 sm:min-h-[200px]">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 text-center">
        <p className="text-[15px] font-semibold tracking-tight text-navy">
          {label}
        </p>
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          {note}
        </p>
      </div>
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
      className="bg-white px-4 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-12 lg:px-8 xl:px-12"
    >
      <div className="mx-auto max-w-3xl xl:max-w-4xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-mika">
          Who we are
        </p>
        <h2 className="font-display mt-3 text-[1.85rem] leading-[1.08] tracking-tight text-navy sm:text-5xl">
          The factory-direct line to MikaZone.
        </h2>
        <p className="mt-4 text-[15px] leading-7 text-slate-600 sm:mt-5 sm:text-lg sm:leading-8">
          {COMPANY_NAME} is the official {PARTNER_NAME} partner for U.S. dry-mix,
          coatings, and concrete plants. Ten catalog grades — cellulose ethers,
          redispersible powders, and MikaUltra additives — with technical
          support at this stand.
        </p>
      </div>

      <div className="mx-auto mt-8 grid max-w-5xl grid-cols-2 gap-3 xl:max-w-6xl">
        {PHOTO_SLOTS.map((slot) => (
          <PhotoSlot key={slot.label} label={slot.label} note={slot.note} />
        ))}
      </div>

      <div className="mx-auto mt-12 max-w-3xl xl:max-w-4xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky">
          From the USA catalog
        </p>
        <h3 className="font-display mt-2 text-[1.65rem] leading-[1.08] tracking-tight text-navy sm:text-4xl">
          What plants specify at this stand.
        </h3>
      </div>

      <ul className="mx-auto mt-6 grid max-w-5xl gap-3 sm:grid-cols-2 xl:max-w-6xl">
        {CATALOG_KEYS.map((item) => (
          <li
            key={item.title}
            className="rounded-[22px] bg-slate-50 px-5 py-5 ring-1 ring-slate-200/80"
          >
            <p className="text-sm font-semibold tracking-tight text-navy">
              {item.title}
            </p>
            <p className="mt-2 text-[14px] leading-6 text-slate-600">{item.body}</p>
          </li>
        ))}
      </ul>

      <div className="mx-auto mt-12 max-w-[34rem] xl:max-w-[38rem]">
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
            Official partner
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
