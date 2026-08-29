import { NextRequest, NextResponse } from "next/server";
import { apiUser } from "@/lib/api-helpers";
import { db } from "@/lib/db";

export const runtime = "nodejs";

const contentTypes: Record<string, string> = {
  markdown: "text/markdown",
  csv: "text/csv",
  json: "application/json",
  pdf: "text/html",
};

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await apiUser();
  if (error) return error;
  const { id } = await params;

  const doc = await db.getDocument(id);
  if (!doc) return NextResponse.json({ error: "Document not found" }, { status: 404 });
  const startup = await db.getStartup(doc.startupId);
  if (!startup || startup.userId !== user.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  return new NextResponse(doc.content, {
    headers: {
      "Content-Type": contentTypes[doc.kind] ?? "text/plain",
      "Content-Disposition": `attachment; filename="${doc.title}"`,
      "Cache-Control": "no-store",
    },
  });
}