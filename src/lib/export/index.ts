import { createDocument, getDocuments } from "../db";
import type { Document } from "../types";
import { newId } from "../db/store";
import { blueprintToMarkdown, roadmapToCsv, startupToJson, fileSlug } from "./exporters";
import { blueprintToPrintHtml } from "./pdf";
import type { ExportBundle } from "./exporters";

export type ExportKind = "markdown" | "json" | "csv" | "pdf";

export async function buildExport(
  startupId: string,
  kind: ExportKind,
  bundle: ExportBundle,
  extra?: { roadmap?: { phase: string; title: string; status: string; priority: string; dueDate?: string }[] }
): Promise<Document> {
  let title: string;
  let content: string;

  switch (kind) {
    case "markdown":
      title = `${fileSlug(bundle.startup.name, "blueprint")}.md`;
      content = blueprintToMarkdown(bundle);
      break;
    case "json":
      title = `${fileSlug(bundle.startup.name, "export")}.json`;
      content = startupToJson(bundle);
      break;
    case "csv":
      title = `${fileSlug(bundle.startup.name, "roadmap")}.csv`;
      content = roadmapToCsv(extra?.roadmap ?? []);
      break;
    case "pdf":
      title = `${fileSlug(bundle.startup.name, "blueprint")}.html`;
      content = blueprintToPrintHtml(blueprintToMarkdown(bundle), bundle.startup.name);
      break;
  }

  return createDocument({
    id: newId("doc"),
    startupId,
    kind,
    title,
    content,
    createdAt: new Date().toISOString(),
  });
}

export { getDocuments };
export type { Document };  // re-export for the API layer stability