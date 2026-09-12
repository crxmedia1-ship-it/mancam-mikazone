export const MIKAZONE_CATALOG_HREF = "/catalog/mikazone-catalog-usa.pdf";
export const MIKAZONE_CATALOG_FILENAME = "MikaZone-Catalog-USA.pdf";

export function downloadMikaZoneCatalog() {
  if (typeof document === "undefined") return;

  const anchor = document.createElement("a");
  anchor.href = MIKAZONE_CATALOG_HREF;
  anchor.download = MIKAZONE_CATALOG_FILENAME;
  anchor.rel = "noopener";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
}
