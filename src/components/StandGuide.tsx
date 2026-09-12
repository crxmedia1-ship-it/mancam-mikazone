const LINKS = [
  { href: "#products", label: "Products" },
  { href: "#about", label: "Who we are" },
  { href: "#register", label: "Register" },
] as const;

export function StandGuide() {
  return (
    <nav aria-label="Stand sections">
      <ul className="flex items-center justify-between gap-1">
        {LINKS.map((item) => (
          <li key={item.href} className="min-w-0 flex-1">
            <a
              href={item.href}
              className="flex min-h-9 items-center justify-center rounded-full px-2 text-sm font-semibold text-slate-700 hover:bg-white hover:text-slate-900"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
