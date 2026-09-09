import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Stand team | Mancam MikaZone",
  description: "Stand dashboard for live MikaZone prospects, ratings, and Excel export.",
};

export default function AdminLeadsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
