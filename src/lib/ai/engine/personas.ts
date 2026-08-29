import type { Persona, StartupContext } from "../../types";
import { newId, now as tsNow } from "../../db/store";
import { firstSentence, keywords, capitalize, lower } from "./helpers";

export function generatePersonas(ctx: StartupContext): Persona[] {
  const { profile } = ctx;
  const kws = keywords(profile.idea, 3);
  const aud = profile.audience.trim();
  const ts = tsNow();
  const seg = aud.split(/[.,;]/)[0].trim() || "the target";
  const isConsumer = /(consumer|home|parent|student|people|patient|everyone)/i.test(aud);
  const isTech = /(developer|engineer|analyst|it)/i.test(aud);

  const primaryRole = isConsumer
    ? `Early user who hits "${firstProblem(profile.problem)}" at least once a week`
    : isTech
      ? `Technical owner burned by ${firstProblem(profile.problem)}`
      : `Day-to-day owner ${firstProblem(profile.problem)} for ${lower(seg)}`;

  const p1: Persona = {
    id: newId("persona"),
    startupId: ctx.startup.id,
    name: "The Frustrated Owner",
    role: primaryRole,
    demographics: `${capitalize(seg)} — ${isConsumer ? "25–45, mobile-first" : "30–55, mid-level decision-maker"}; early adopter`,
    goals: `Stop spending time on ${firstProblem(profile.problem)}. Wants a tool that "just works" so they can focus on ${kwOr(kws, "the real work")}.`,
    painPoints: `Current option is a workaround that breaks weekly; nobody is accountable for the result; costs more time than money but no one measures it.`,
    quote: `"If something actually finished this for me, I would switch tomorrow."`,
    channel: isTech ? "Developer communities, newsletters, X" : isConsumer ? "TikTok / Instagram, recommendations" : "LinkedIn, industry Slack/Discord groups",
    priority: "primary",
    createdAt: ts,
  };

  const p2: Persona = {
    id: newId("persona"),
    startupId: ctx.startup.id,
    name: "The Responsible & Risk-Aware",
    role: `Accountable for outcomes related to ${firstProblem(profile.problem)} across the team`,
    demographics: `${capitalize(seg)} — typically the person who gets blamed when it goes wrong`,
    goals: `Want proof it works before adopting. Will champion the tool internally if the numbers are real.`,
    painPoints: `Has been burned by bought-but-abandoned tools; needs a measurable win (time, cost, quality) within weeks.`,
    quote: `"Show me one real team using it and I will put it in front of our decision."`,
    channel: "Web search, vendor comparisons, one trusted analyst or newsletter",
    priority: "secondary",
    createdAt: ts,
  };

  return [p1, p2];
}

function firstProblem(text: string): string {
  const f = firstSentence(text.trim());
  return f.slice(0, 80) + (f.length > 80 ? "…" : "");
}
function kwOr(kws: string[], fallback: string): string {
  return kws[0] ?? fallback;
}