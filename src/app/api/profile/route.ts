import { requireUser } from "@/lib/api-helpers";
import { db } from "@/lib/db";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json().catch(() => ({}));

    const schema = z.object({
      name: z.string().min(1, "Name is required").max(60),
    });
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ ok: false, error: parsed.error.issues[0]?.message ?? "Invalid data" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const updated = await db.user.update({
      where: { id: user.id },
      data: { name: parsed.data.name.trim() },
      select: { id: true, name: true, email: true, plan: true },
    });

    return new Response(JSON.stringify({ ok: true, user: updated }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    if (err instanceof Response) return err;
    return new Response(
      JSON.stringify({ ok: false, error: err instanceof Error ? err.message : "Request failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}