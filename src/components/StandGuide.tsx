export const STAND_PANES = [
  { id: "home", label: "Home", hash: "" },
  { id: "about", label: "Who we are", hash: "#about" },
  { id: "catalog", label: "Catalog", hash: "#products" },
] as const;

export type StandPaneId = (typeof STAND_PANES)[number]["id"];

export function paneFromHash(hash: string): StandPaneId {
  if (hash === "#about") return "about";
  if (hash === "#products" || hash === "#catalog") return "catalog";
  return "home";
}

export function hashFromPane(pane: StandPaneId): string {
  if (pane === "about") return "#about";
  if (pane === "catalog") return "#products";
  return "";
}

export function StandGuide({
  active,
  onSelect,
}: {
  active: StandPaneId;
  onSelect: (pane: StandPaneId) => void;
}) {
  return (
    <nav aria-label="Stand sections">
      <ul className="flex items-center justify-between gap-1">
        {STAND_PANES.map((item) => {
          const isActive = item.id === active;
          return (
            <li key={item.id} className="min-w-0 flex-1">
              <button
                type="button"
                aria-current={isActive ? "page" : undefined}
                onClick={() => onSelect(item.id)}
                className={`flex min-h-9 w-full items-center justify-center rounded-full px-2 text-[13px] font-semibold sm:text-sm ${
                  isActive
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:bg-white/80 hover:text-slate-900"
                }`}
              >
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
