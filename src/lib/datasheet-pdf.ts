import type { Product, TechnicalSpecifications } from "@/data/products";

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN = 50;
const LINE_HEIGHT = 14;
const MAX_CHARS = 92;

function toWinAnsi(text: string): string {
  return text
    .replaceAll("–", "-")
    .replaceAll("—", "-")
    .replaceAll("’", "'")
    .replaceAll("‘", "'")
    .replaceAll("“", '"')
    .replaceAll("”", '"')
    .replaceAll("×", "x")
    .replaceAll("°", " deg")
    .replaceAll("·", ".")
    .replaceAll("≥", ">=")
    .replaceAll("≤", "<=")
    .replaceAll("±", "+/-");
}

function escapePdfText(text: string): string {
  return toWinAnsi(text)
    .replaceAll("\\", "\\\\")
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)");
}

function wrapLine(text: string, maxChars = MAX_CHARS): string[] {
  const normalized = toWinAnsi(text).replace(/\s+/g, " ").trim();
  if (!normalized) return [];

  const words = normalized.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) lines.push(current);
  return lines;
}

function specEntries(specs: TechnicalSpecifications): Array<[string, string]> {
  const rows: Array<[string, string]> = [["Appearance", specs.appearance]];

  const optional: Array<[keyof TechnicalSpecifications, string]> = [
    ["pH", "pH"],
    ["moisture", "Moisture"],
    ["viscosity", "Viscosity"],
    ["particleSize", "Particle size"],
    ["bulkDensity", "Bulk density"],
    ["solidContent", "Solid content"],
    ["purity", "Purity"],
    ["ashContent", "Ash content"],
    ["gelationTemperature", "Gelation temperature"],
    ["hydroxypropylContent", "Hydroxypropyl content"],
    ["waterInsoluble", "Water insoluble"],
    ["fiberLength", "Fiber length"],
    ["casNumber", "CAS"],
    ["hsCode", "HS code"],
  ];

  for (const [key, label] of optional) {
    const value = specs[key];
    if (typeof value === "string" && value.length > 0) {
      rows.push([label, value]);
    }
  }

  for (const extra of specs.additional ?? []) {
    rows.push([extra.label, extra.value]);
  }

  return rows;
}

function productLines(product: Product): string[] {
  const lines: string[] = [
    "MANCAM GLOBAL SUPPLY  |  MikaZone USA",
    "Technical Data Sheet",
    "",
    product.name,
    `${product.brand}  ·  ${product.sku}`,
    product.chemicalName,
    "",
    ...wrapLine(product.summary),
    "",
    "Recommended dosage",
    ...wrapLine(product.recommendedDosage),
    "",
    "Technical specifications",
  ];

  for (const [label, value] of specEntries(product.specifications)) {
    lines.push(...wrapLine(`${label}: ${value}`));
  }

  lines.push("", "Recommended applications");
  for (const application of product.applications) {
    lines.push(...wrapLine(`- ${application}`));
  }

  lines.push("", "Key benefits");
  for (const benefit of product.benefits) {
    lines.push(...wrapLine(`- ${benefit}`));
  }

  lines.push(
    "",
    "Packaging",
    ...wrapLine(product.packaging.primary),
    ...wrapLine(product.packaging.pallet),
    ...wrapLine(product.packaging.notes),
    "",
    "This sheet is provided for stand visitors after registration. Confirm grades and",
    "dose with Mancam / MikaZone technical service before production use.",
  );

  return lines;
}

function pageContentStream(lines: string[]): string {
  const commands = ["BT", "/F1 11 Tf", `${MARGIN} ${PAGE_HEIGHT - MARGIN} Td`, "12 TL"];

  lines.forEach((line, index) => {
    const fontSize = index === 3 ? 16 : 11;
    if (index === 0) {
      commands.push("/F1 10 Tf");
    } else if (index === 3) {
      commands.push("/F1 16 Tf");
    } else if (index === 4) {
      commands.push("/F1 11 Tf");
    }

    commands.push(`(${escapePdfText(line)}) Tj`, "T*");
    if (fontSize === 16) {
      commands.push("16 TL");
    } else {
      commands.push(`${LINE_HEIGHT} TL`);
    }
  });

  commands.push("ET");
  return commands.join("\n");
}

function buildPdf(products: readonly Product[]): string {
  const objects: string[] = [];
  const pageIds: number[] = [];

  objects.push("<< /Type /Catalog /Pages 2 0 R >>");
  objects.push("");

  const fontId = 3 + products.length * 2;
  products.forEach((product, index) => {
    const pageObjectId = 3 + index * 2;
    const contentObjectId = pageObjectId + 1;
    pageIds.push(pageObjectId);

    const stream = pageContentStream(productLines(product));
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Contents ${contentObjectId} 0 R /Resources << /Font << /F1 ${fontId} 0 R >> >> >>`,
    );
    objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
  });

  objects[1] =
    `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

  let body = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(body.length);
    body += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = body.length;
  body += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i += 1) {
    body += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  body += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return body;
}

export function downloadProductDatasheets(products: readonly Product[]): void {
  if (products.length === 0 || typeof document === "undefined") {
    return;
  }

  const pdf = buildPdf(products);
  const blob = new Blob([pdf], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const fileName =
    products.length === 1
      ? `MikaZone-${products[0].slug}-TDS.pdf`
      : "MikaZone-Technical-Datasheets.pdf";

  anchor.href = url;
  anchor.download = fileName;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
