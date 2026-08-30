import { requireUser } from "@/lib/api-helpers";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await requireUser();
    const month = new Date().toISOString().slice(0, 7);
    const usage = await db.usage.findUnique({
      where: { userId_month: { userId: user.id, month } },
    });

    const total = await db.usage.aggregate({
      _sum: { generations: true, tokensIn: true, tokensOut: true },
    });

    return new Response(
      JSON.stringify({
        ok: true,
        generations: usage?.generations ?? 0,
        tokensIn: usage?.tokensIn ?? 0,
        tokensOut: usage?.tokensOut ?? 0,
        totals: {
          generations: total._sum.generations ?? 0,
          tokensIn: total._sum.tokensIn ?? 0,
          tokensOut: total._sum.tokensOut ?? 0,
        },
        month,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    if (err instanceof Response) return err;
    return new Response(
      JSON.stringify({ ok: false, error: err instanceof Error ? err.message : "Request failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}