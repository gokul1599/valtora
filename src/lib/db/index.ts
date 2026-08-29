import {
  collectionOf,
  type WithId,
  deleteOne,
  insertOne,
  loadDb,
  persistDb,
  replaceCollection,
  updateOne,
  upsertOne,
} from "./store";
import type {
  AiConversation,
  AiGeneration,
  Blueprint,
  BusinessModel,
  Competitor,
  Document,
  Feature,
  LaunchItem,
  MarketingPlan,
  MarketResearch,
  Mvp,
  Persona,
  ProductVision,
  RoadmapTask,
  Startup,
  StartupAssessment,
  StartupProfile,
  Subscription,
  TechnicalPlan,
  User,
  UserStory,
} from "../types";

/** Users are keyed by id in a nested map for fast lookup. */
export async function getUserByEmail(email: string): Promise<User | null> {
  const db = await loadDb();
  const users = Object.values(db.users) as User[];
  return (
    users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    ) ?? null
  );
}

export async function getUserById(id: string): Promise<User | null> {
  const db = await loadDb();
  return (db.users[id] as User) ?? null;
}

export async function createUser(
  user: User
): Promise<User> {
  const db = await loadDb();
  db.users[user.id] = user;
  await persistDb(db);
  return user;
}

export async function updateUser(
  id: string,
  patch: Partial<User>
): Promise<User | null> {
  const db = await loadDb();
  if (!db.users[id]) return null;
  db.users[id] = {
    ...(db.users[id] as User),
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  await persistDb(db);
  return db.users[id] as User;
}

export async function updateUserByIdentity(
  email: string,
  patch: Partial<User>
): Promise<User | null> {
  const user = await getUserByEmail(email);
  if (!user) return null;
  return updateUser(user.id, patch);
}

/* ── Startups ─────────────────────────────────────────────── */

export async function getStartups(userId: string): Promise<Startup[]> {
  const all = await collectionOf<Startup>("startups");
  return all.filter((s) => s.userId === userId);
}

export async function getStartup(id: string): Promise<Startup | null> {
  const all = await collectionOf<Startup>("startups");
  return all.find((s) => s.id === id) ?? null;
}

export async function createStartup(s: Startup): Promise<Startup> {
  return insertOne("startups", s);
}

export async function updateStartup(
  id: string,
  patch: Partial<Startup>
): Promise<Startup | null> {
  return updateOne("startups", id, { ...patch, updatedAt: new Date().toISOString() });
}

export async function deleteStartup(id: string): Promise<boolean> {
  return deleteOne("startups", id);
}

/** Verify the current user owns the startup, protecting against tampering. */
export async function userOwnsStartup(
  userId: string,
  startupId: string
): Promise<boolean> {
  const s = await getStartup(startupId);
  return !!s && s.userId === userId;
}

export async function getActiveStartupForUser(
  startupId: string,
  userId: string
): Promise<Startup | null> {
  if (!(await userOwnsStartup(userId, startupId))) return null;
  return getStartup(startupId);
}

/* ── Profile ──────────────────────────────────────────────── */

export async function getProfile(startupId: string): Promise<StartupProfile | null> {
  const all = await collectionOf<StartupProfile>("profiles");
  return all.find((p) => p.startupId === startupId) ?? null;
}

export async function setProfile(p: StartupProfile): Promise<StartupProfile> {
  const existing = (await getProfile(p.startupId)) as WithId<unknown> | null;
  if (existing) return updateOne("profiles", existing.id, p) as Promise<StartupProfile>;
  return insertOne("profiles", { ...p, id: existingId(p) });
}

function existingId(p: StartupProfile): string {
  // profiles carry a synthetic id; keep deterministic sourcing by startupId
  return `profile_${p.startupId}`;
}

/* ── Blueprint ────────────────────────────────────────────── */

export async function getBlueprint(startupId: string): Promise<Blueprint | null> {
  const all = await collectionOf<Blueprint>("blueprints");
  return all.find((b) => b.startupId === startupId) ?? null;
}

export async function saveBlueprint(b: Blueprint): Promise<Blueprint> {
  const existing = (await getBlueprint(b.startupId)) as WithId<unknown> | null;
  if (existing)
    return updateOne("blueprints", existing.id, b) as Promise<Blueprint>;
  return insertOne("blueprints", { ...b, id: `blueprint_${b.startupId}` });
}

/* ── Personas ─────────────────────────────────────────────── */

export async function getPersonas(startupId: string): Promise<Persona[]> {
  const all = await collectionOf<Persona>("personas");
  return all.filter((p) => p.startupId === startupId).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function getPersona(id: string): Promise<Persona | null> {
  const all = await collectionOf<Persona>("personas");
  return all.find((p) => p.id === id) ?? null;
}

export async function createPersona(p: Persona): Promise<Persona> {
  return insertOne("personas", p);
}

export async function updatePersona(id: string, patch: Partial<Persona>): Promise<Persona | null> {
  return updateOne("personas", id, patch);
}

export async function deletePersona(id: string): Promise<boolean> {
  return deleteOne("personas", id);
}

export async function replacePersonas(startupId: string, items: Persona[]): Promise<void> {
  const rest = (await collectionOf<Persona>("personas")).filter(
    (p) => p.startupId !== startupId
  );
  await replaceCollection("personas", [...rest, ...items]);
}

/* ── Competitors ──────────────────────────────────────────── */

export async function getCompetitors(startupId: string): Promise<Competitor[]> {
  const all = await collectionOf<Competitor>("competitors");
  return all.filter((c) => c.startupId === startupId);
}

export async function getCompetitor(id: string): Promise<Competitor | null> {
  const all = await collectionOf<Competitor>("competitors");
  return all.find((c) => c.id === id) ?? null;
}

export async function replaceCompetitors(startupId: string, items: Competitor[]): Promise<void> {
  const rest = (await collectionOf<Competitor>("competitors")).filter(
    (c) => c.startupId !== startupId
  );
  await replaceCollection("competitors", [...rest, ...items]);
}

export async function updateCompetitor(id: string, patch: Partial<Competitor>): Promise<Competitor | null> {
  return updateOne("competitors", id, patch);
}

export async function deleteCompetitor(id: string): Promise<boolean> {
  return deleteOne("competitors", id);
}

export async function createCompetitor(c: Competitor): Promise<Competitor> {
  return insertOne("competitors", c);
}

/* ── Market research ──────────────────────────────────────── */

export async function getMarket(startupId: string): Promise<MarketResearch | null> {
  const all = await collectionOf<MarketResearch>("market");
  return all.find((m) => m.startupId === startupId) ?? null;
}

export async function saveMarket(m: MarketResearch): Promise<MarketResearch> {
  const existing = (await getMarket(m.startupId)) as WithId<unknown> | null;
  if (existing) return updateOne("market", existing.id, m) as Promise<MarketResearch>;
  return insertOne("market", { ...m, id: `market_${m.startupId}` });
}

/* ── Features ─────────────────────────────────────────────── */

export async function getFeatures(startupId: string): Promise<Feature[]> {
  const all = await collectionOf<Feature>("features");
  return all
    .filter((f) => f.startupId === startupId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function getFeature(id: string): Promise<Feature | null> {
  const all = await collectionOf<Feature>("features");
  return all.find((f) => f.id === id) ?? null;
}

export async function createFeature(f: Feature): Promise<Feature> {
  return insertOne("features", f);
}

export async function updateFeature(id: string, patch: Partial<Feature>): Promise<Feature | null> {
  return updateOne("features", id, patch);
}

export async function deleteFeature(id: string): Promise<boolean> {
  return deleteOne("features", id);
}

export async function replaceFeatures(startupId: string, items: Feature[]): Promise<void> {
  const rest = (await collectionOf<Feature>("features")).filter(
    (f) => f.startupId !== startupId
  );
  await replaceCollection("features", [...rest, ...items]);
}

/* ── User stories ─────────────────────────────────────────── */

export async function getUserStories(startupId: string): Promise<UserStory[]> {
  const all = await collectionOf<UserStory>("userStories");
  return all.filter((s) => s.startupId === startupId);
}

export async function createUserStory(s: UserStory): Promise<UserStory> {
  return insertOne("userStories", s);
}

export async function deleteUserStory(id: string): Promise<boolean> {
  return deleteOne("userStories", id);
}

export async function replaceUserStories(startupId: string, items: UserStory[]): Promise<void> {
  const rest = (await collectionOf<UserStory>("userStories")).filter(
    (s) => s.startupId !== startupId
  );
  await replaceCollection("userStories", [...rest, ...items]);
}

/* ── MVP ──────────────────────────────────────────────────── */

export async function getMvp(startupId: string): Promise<Mvp | null> {
  const all = await collectionOf<Mvp>("mvps");
  return all.find((m) => m.startupId === startupId) ?? null;
}

export async function saveMvp(m: Mvp): Promise<Mvp> {
  const existing = (await getMvp(m.startupId)) as WithId<unknown> | null;
  if (existing) return updateOne("mvps", existing.id, m) as Promise<Mvp>;
  return insertOne("mvps", { ...m, id: `mvp_${m.startupId}` });
}

/* ── Business model ───────────────────────────────────────── */

export async function getBusinessModel(startupId: string): Promise<BusinessModel | null> {
  const all = await collectionOf<BusinessModel>("businessModels");
  return all.find((b) => b.startupId === startupId) ?? null;
}

export async function saveBusinessModel(b: BusinessModel): Promise<BusinessModel> {
  const existing = (await getBusinessModel(b.startupId)) as WithId<unknown> | null;
  if (existing) return updateOne("businessModels", existing.id, b) as Promise<BusinessModel>;
  return insertOne("businessModels", { ...b, id: `bm_${b.startupId}` });
}

/* ── Product vision ───────────────────────────────────────── */

export async function getProductVision(startupId: string): Promise<ProductVision | null> {
  const all = await collectionOf<ProductVision>("productVisions");
  return all.find((p) => p.startupId === startupId) ?? null;
}

export async function saveProductVision(p: ProductVision): Promise<ProductVision> {
  const existing = (await getProductVision(p.startupId)) as WithId<unknown> | null;
  if (existing) return updateOne("productVisions", existing.id, p) as Promise<ProductVision>;
  return insertOne("productVisions", { ...p, id: `pv_${p.startupId}` });
}

/* ── Roadmap ──────────────────────────────────────────────── */

export async function getRoadmap(startupId: string): Promise<RoadmapTask[]> {
  const all = await collectionOf<RoadmapTask>("roadmaps");
  return all
    .filter((t) => t.startupId === startupId)
    .sort((a, b) => a.order - b.order);
}

export async function getRoadmapTask(id: string): Promise<RoadmapTask | null> {
  const all = await collectionOf<RoadmapTask>("roadmaps");
  return all.find((t) => t.id === id) ?? null;
}

export async function createRoadmapTask(t: RoadmapTask): Promise<RoadmapTask> {
  return insertOne("roadmaps", t);
}

export async function updateRoadmapTask(id: string, patch: Partial<RoadmapTask>): Promise<RoadmapTask | null> {
  return updateOne("roadmaps", id, patch);
}

export async function deleteRoadmapTask(id: string): Promise<boolean> {
  return deleteOne("roadmaps", id);
}

export async function replaceRoadmap(startupId: string, items: RoadmapTask[]): Promise<void> {
  const rest = (await collectionOf<RoadmapTask>("roadmaps")).filter(
    (t) => t.startupId !== startupId
  );
  await replaceCollection("roadmaps", [...rest, ...items]);
}

/* ── Technical plan ───────────────────────────────────────── */

export async function getTechnicalPlan(startupId: string): Promise<TechnicalPlan | null> {
  const all = await collectionOf<TechnicalPlan>("technical");
  return all.find((t) => t.startupId === startupId) ?? null;
}

export async function saveTechnicalPlan(t: TechnicalPlan): Promise<TechnicalPlan> {
  const existing = (await getTechnicalPlan(t.startupId)) as WithId<unknown> | null;
  if (existing)
    return updateOne("technical", existing.id, t) as Promise<TechnicalPlan>;
  return insertOne("technical", { ...t, id: `tech_${t.startupId}` });
}

/* ── Marketing ────────────────────────────────────────────── */

export async function getMarketing(startupId: string): Promise<MarketingPlan | null> {
  const all = await collectionOf<MarketingPlan>("marketing");
  return all.find((m) => m.startupId === startupId) ?? null;
}

export async function saveMarketing(m: MarketingPlan): Promise<MarketingPlan> {
  const existing = (await getMarketing(m.startupId)) as WithId<unknown> | null;
  if (existing) return updateOne("marketing", existing.id, m) as Promise<MarketingPlan>;
  return insertOne("marketing", { ...m, id: `mkt_${m.startupId}` });
}

/* ── Launch ───────────────────────────────────────────────── */

export async function getLaunch(startupId: string): Promise<LaunchItem[]> {
  const all = await collectionOf<LaunchItem>("launches");
  return all
    .filter((l) => l.startupId === startupId)
    .sort((a, b) => a.order - b.order);
}

export async function getLaunchItem(id: string): Promise<LaunchItem | null> {
  const all = await collectionOf<LaunchItem>("launches");
  return all.find((l) => l.id === id) ?? null;
}

export async function createLaunchItem(l: LaunchItem): Promise<LaunchItem> {
  return insertOne("launches", l);
}

export async function updateLaunchItem(id: string, patch: Partial<LaunchItem>): Promise<LaunchItem | null> {
  return updateOne("launches", id, patch);
}

export async function replaceLaunch(startupId: string, items: LaunchItem[]): Promise<void> {
  const rest = (await collectionOf<LaunchItem>("launches")).filter(
    (l) => l.startupId !== startupId
  );
  await replaceCollection("launches", [...rest, ...items]);
}

/* ── Assessment ───────────────────────────────────────────── */

export async function getAssessment(startupId: string): Promise<StartupAssessment | null> {
  const all = await collectionOf<StartupAssessment>("assessments");
  return all.find((a) => a.startupId === startupId) ?? null;
}

export async function saveAssessment(a: StartupAssessment): Promise<StartupAssessment> {
  const existing = (await getAssessment(a.startupId)) as WithId<unknown> | null;
  if (existing) return updateOne("assessments", existing.id, a) as Promise<StartupAssessment>;
  return insertOne("assessments", { ...a, id: `assess_${a.startupId}` });
}

/* ── AI conversations ─────────────────────────────────────── */

export async function getConversations(startupId: string): Promise<AiConversation[]> {
  const all = await collectionOf<AiConversation>("conversations");
  return all
    .filter((c) => c.startupId === startupId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getConversation(id: string): Promise<AiConversation | null> {
  const all = await collectionOf<AiConversation>("conversations");
  return all.find((c) => c.id === id) ?? null;
}

export async function createConversation(c: AiConversation): Promise<AiConversation> {
  return insertOne("conversations", c);
}

export async function appendMessage(conversationId: string, ...messages: any[]): Promise<AiConversation | null> {
  const conv = await getConversation(conversationId);
  if (!conv) return null;
  return updateOne("conversations", conversationId, {
    messages: [...conv.messages, ...messages],
    updatedAt: new Date().toISOString(),
  } as Partial<AiConversation>);
}

export async function deleteConversation(id: string): Promise<boolean> {
  return deleteOne("conversations", id);
}

export async function updateMessage(conversationId: string, messageId: string, patch: any): Promise<AiConversation | null> {
  const conv = await getConversation(conversationId);
  if (!conv) return null;
  const messages = conv.messages.map((m) =>
    m.id === messageId ? { ...m, ...patch } : m
  );
  return updateOne("conversations", conversationId, { messages } as Partial<AiConversation>);
}

/* ── AI generations (usage) ───────────────────────────────── */

export async function createGeneration(g: AiGeneration): Promise<AiGeneration> {
  return insertOne("generations", g);
}

export async function countGenerationsThisMonth(userId: string): Promise<number> {
  const start = new Date();
  start.setUTCDate(1);
  start.setUTCHours(0, 0, 0, 0);
  const all = await collectionOf<AiGeneration>("generations");
  return all.filter(
    (g) => g.userId === userId && new Date(g.createdAt) >= start
  ).length;
}

/* ── Documents ────────────────────────────────────────────── */

export async function getDocuments(startupId: string): Promise<Document[]> {
  const all = await collectionOf<Document>("documents");
  return all.filter((d) => d.startupId === startupId).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function createDocument(d: Document): Promise<Document> {
  return insertOne("documents", d);
}

export async function getDocument(id: string): Promise<Document | null> {
  const all = await collectionOf<Document>("documents");
  return all.find((d) => d.id === id) ?? null;
}

export async function deleteDocument(id: string): Promise<boolean> {
  return deleteOne("documents", id);
}

/* ── Subscriptions ────────────────────────────────────────── */

export async function getSubscription(userId: string): Promise<Subscription | null> {
  const all = await collectionOf<Subscription>("subscriptions");
  return all.find((s) => s.userId === userId) ?? null;
}

export async function upsertSubscription(s: Subscription): Promise<Subscription> {
  const existing = (await getSubscription(s.userId)) as WithId<unknown> | null;
  if (existing) return updateOne("subscriptions", existing.id, s) as Promise<Subscription>;
  return upsertOne("subscriptions", { ...s, id: `sub_${s.userId}` });
}

/** Convenience namespace for the repository layer. */
export const db = {
  getUserByEmail,
  getUserById,
  createUser,
  updateUser,
  updateUserByIdentity,
  getStartups,
  getStartup,
  createStartup,
  updateStartup,
  deleteStartup,
  userOwnsStartup,
  getActiveStartupForUser,
  getProfile,
  setProfile,
  getBlueprint,
  saveBlueprint,
  getPersonas,
  getPersona,
  createPersona,
  updatePersona,
  deletePersona,
  replacePersonas,
  getCompetitors,
  getCompetitor,
  replaceCompetitors,
  updateCompetitor,
  deleteCompetitor,
  createCompetitor,
  getMarket,
  saveMarket,
  getFeatures,
  getFeature,
  createFeature,
  updateFeature,
  deleteFeature,
  replaceFeatures,
  getUserStories,
  createUserStory,
  deleteUserStory,
  replaceUserStories,
  getMvp,
  saveMvp,
  getBusinessModel,
  saveBusinessModel,
  getProductVision,
  saveProductVision,
  getRoadmap,
  getRoadmapTask,
  createRoadmapTask,
  updateRoadmapTask,
  deleteRoadmapTask,
  replaceRoadmap,
  getTechnicalPlan,
  saveTechnicalPlan,
  getMarketing,
  saveMarketing,
  getLaunch,
  getLaunchItem,
  createLaunchItem,
  updateLaunchItem,
  replaceLaunch,
  getAssessment,
  saveAssessment,
  getConversations,
  getConversation,
  createConversation,
  appendMessage,
  deleteConversation,
  updateMessage,
  createGeneration,
  countGenerationsThisMonth,
  getDocuments,
  createDocument,
  getDocument,
  deleteDocument,
  getSubscription,
  upsertSubscription,
};