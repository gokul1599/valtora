import { redirect } from "next/navigation";
import { currentUser } from "./auth/session";
import {
  getStartups,
  getStartup,
  getProfile,
  getAssessment,
  getCompetitors,
  getMarket,
  getFeatures,
  getPersonas,
  getProductVision,
  getBusinessModel,
  getRoadmap,
  getMarketing,
  getMvp,
  getBlueprint,
  getTechnicalPlan,
  getLaunch,
  updateUser,
} from "./db";
import type { StartupContext } from "./ai/context";
import type { Startup, User } from "./types";

export { getStartup }; // re-export for API routes

export interface StartupData {
  user: User;
  startups: Startup[];
  startup: Startup;
  context: StartupContext;
}

/** Load the session user's current (active) startup. */
export async function requireStartup(): Promise<StartupData> {
  const user = await currentUser();
  if (!user) redirect("/login");

  const startups = await getStartups(user.id);
  if (startups.length === 0) redirect("/onboarding");

  let startup =
    (user.activeStartupId && (await getStartup(user.activeStartupId))) ?? null;
  if (!startup || startup.userId !== user.id) {
    startup = startups[0];
    await updateUser(user.id, { activeStartupId: startup.id });
  }

  const [profile, assessment, competitors, market, features, personas, productVision, businessModel, roadmap, marketing, mvp] =
    await Promise.all([
      getProfile(startup.id),
      getAssessment(startup.id),
      getCompetitors(startup.id),
      getMarket(startup.id),
      getFeatures(startup.id),
      getPersonas(startup.id),
      getProductVision(startup.id),
      getBusinessModel(startup.id),
      getRoadmap(startup.id),
      getMarketing(startup.id),
      getMvp(startup.id),
    ]);

  const context: StartupContext = {
    startup,
    profile: profile ?? {
      startupId: startup.id,
      idea: "",
      audience: "",
      problem: "",
      monetization: "",
      journeyStage: "just-idea",
      updatedAt: new Date().toISOString(),
    },
    assessment,
    competitors,
    market,
    features,
    personas,
    productVision,
    businessModel,
    roadmap,
    marketing,
    mvpRecord: mvp,
  };

  return { user, startups, startup, context };
}

/** Load just the dashboard shell data (user + startup list). */
export async function loadShell() {
  const user = await currentUser();
  if (!user) redirect("/login");
  const startups = await getStartups(user.id);
  let startup: Startup | null = null;
  if (startups.length > 0) {
    const active = user.activeStartupId
      ? await getStartup(user.activeStartupId)
      : null;
    startup = active && active.userId === user.id ? active : startups[0];
  }
  return { user, startups, startup };
}

/** Load a dashboard page: shell data + full startup context, redirecting appropriately. */
export async function loadDashboardData(): Promise<StartupData> {
  const shell = await loadShell();
  if (!shell.startup) redirect("/onboarding");
  const context = await buildContextFor(shell.startup);
  return { user: shell.user, startups: shell.startups, startup: shell.startup, context };
}

/** Assemble the full startup context for AI operations (ownership pre-checked). */
export async function buildContextFor(
  startup: Startup
): Promise<StartupContext> {
  const [profile, assessment, competitors, market, features, personas, productVision, businessModel, roadmap, marketing, mvp, blueprint, technical, launch] =
    await Promise.all([
      getProfile(startup.id),
      getAssessment(startup.id),
      getCompetitors(startup.id),
      getMarket(startup.id),
      getFeatures(startup.id),
      getPersonas(startup.id),
      getProductVision(startup.id),
      getBusinessModel(startup.id),
      getRoadmap(startup.id),
      getMarketing(startup.id),
      getMvp(startup.id),
      getBlueprint(startup.id),
      getTechnicalPlan(startup.id),
      getLaunch(startup.id),
    ]);

  return {
    startup,
    profile: profile ?? {
      startupId: startup.id,
      idea: "",
      audience: "",
      problem: "",
      monetization: "",
      journeyStage: "just-idea",
      updatedAt: new Date().toISOString(),
    },
    assessment,
    competitors,
    market,
    features,
    personas,
    productVision,
    businessModel,
    roadmap,
    marketing,
    mvpRecord: mvp,
    technical,
    launch,
    blueprintVersion: blueprint?.version,
  };
}