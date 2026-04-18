// Converted to TypeScript - migrated
/**
 * Firebase Admin SDK Initialization
 * For server-side operations with Firebase
 */

import { parseFirestoreValue, toFirestoreValue, type FirestoreDocument } from "./firebase";

type QueryOperator = "==" | ">=" | "<=";
type QueryDirection = "asc" | "desc";

interface QueryFilter {
  field: string;
  op: QueryOperator;
  value: unknown;
}

interface QueryOrder {
  field: string;
  direction: QueryDirection;
}

interface QueryState {
  collection: string;
  filters: QueryFilter[];
  orderBy: QueryOrder[];
  limit?: number;
  offset?: number;
}

interface ServiceAccountConfig {
  projectId?: string;
  clientEmail: string;
  privateKey: string;
}

interface RestDocumentSnapshot {
  id: string;
  exists: boolean;
  data: () => Record<string, unknown> | undefined;
}

interface RestQuerySnapshot {
  docs: RestDocumentSnapshot[];
  empty: boolean;
  forEach: (callback: (doc: RestDocumentSnapshot) => void) => void;
}

interface RestAggregateSnapshot {
  data: () => { count: number };
}

interface RestDocumentReference {
  id: string;
  get: () => Promise<RestDocumentSnapshot>;
  update: (data: Record<string, unknown>) => Promise<void>;
  delete: () => Promise<void>;
}

interface RestQueryReference {
  where: (field: string, op: QueryOperator, value: unknown) => RestQueryReference;
  orderBy: (field: string, direction?: QueryDirection) => RestQueryReference;
  limit: (value: number) => RestQueryReference;
  offset: (value: number) => RestQueryReference;
  get: () => Promise<RestQuerySnapshot>;
  count: () => { get: () => Promise<RestAggregateSnapshot> };
}

interface RestCollectionReference extends RestQueryReference {
  doc: (documentId: string) => RestDocumentReference;
  add: (data: Record<string, unknown>) => Promise<{ id: string }>;
}

interface RestFirestore {
  collection: (collection: string) => RestCollectionReference;
}

let cachedAdminApp: unknown | null | undefined;
let cachedRestFirestore: RestFirestore | undefined;

function getProjectId() {
  return process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
}

function getApiKey() {
  return process.env.FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
}

function getRestBaseUrl() {
  const projectId = getProjectId();
  const apiKey = getApiKey();

  if (!projectId || !apiKey) {
    throw new Error(
      "Firebase REST fallback requires NEXT_PUBLIC_FIREBASE_PROJECT_ID and NEXT_PUBLIC_FIREBASE_API_KEY"
    );
  }

  return {
    apiKey,
    projectId,
    baseUrl: `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`,
  };
}

function normalizePrivateKey(value?: string) {
  return value?.replace(/\\n/g, "\n");
}

function getServiceAccountConfig(): ServiceAccountConfig | null {
  const rawJson =
    process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON ||
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON ||
    process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;

  if (rawJson) {
    try {
      const parsed = JSON.parse(rawJson) as {
        project_id?: string;
        client_email?: string;
        private_key?: string;
      };

      if (parsed.client_email && parsed.private_key) {
        return {
          projectId: parsed.project_id,
          clientEmail: parsed.client_email,
          privateKey: normalizePrivateKey(parsed.private_key) || parsed.private_key,
        };
      }
    } catch (error) {
      throw new Error(
        `Invalid Firebase service account JSON: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  const clientEmail =
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL ||
    process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = normalizePrivateKey(
    process.env.FIREBASE_ADMIN_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY
  );

  if (clientEmail && privateKey) {
    return {
      projectId: getProjectId(),
      clientEmail,
      privateKey,
    };
  }

  return null;
}

function shouldUseAdminSdk() {
  return Boolean(
    getServiceAccountConfig() ||
      process.env.GOOGLE_APPLICATION_CREDENTIALS ||
      process.env.FIRESTORE_EMULATOR_HOST
  );
}

function parseDocumentFields(document: FirestoreDocument) {
  const fields = document.fields || {};
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(fields)) {
    result[key] = parseFirestoreValue(value);
  }

  return result;
}

async function requestFirestore<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok) {
    let message = `Firestore REST request failed with status ${response.status}`;

    try {
      const errorPayload = (await response.json()) as {
        error?: { message?: string };
      };
      message = errorPayload.error?.message || message;
    } catch {}

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

function buildDocumentUrl(collection: string, documentId?: string) {
  const { apiKey, baseUrl } = getRestBaseUrl();
  const encodedId = documentId ? `/${encodeURIComponent(documentId)}` : "";
  return `${baseUrl}/${collection}${encodedId}?key=${apiKey}`;
}

async function getDocumentRaw(collection: string, documentId: string) {
  const response = await fetch(buildDocumentUrl(collection, documentId));

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    let message = `Failed to get document from ${collection}`;
    try {
      const errorPayload = (await response.json()) as { error?: { message?: string } };
      message = errorPayload.error?.message || message;
    } catch {}
    throw new Error(message);
  }

  return (await response.json()) as FirestoreDocument;
}

async function addDocument(collection: string, data: Record<string, unknown>) {
  const fields: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    fields[key] = toFirestoreValue(value);
  }

  const document = await requestFirestore<FirestoreDocument>(buildDocumentUrl(collection), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields }),
  });

  const id = document.name.split("/").pop() || "";
  return { id };
}

async function updateDocumentFields(collection: string, documentId: string, data: Record<string, unknown>) {
  const fields: Record<string, unknown> = {};
  const updateMask = Object.keys(data)
    .map((field) => `updateMask.fieldPaths=${encodeURIComponent(field)}`)
    .join("&");

  for (const [key, value] of Object.entries(data)) {
    fields[key] = toFirestoreValue(value);
  }

  const { apiKey, baseUrl } = getRestBaseUrl();
  await requestFirestore<FirestoreDocument>(
    `${baseUrl}/${collection}/${encodeURIComponent(documentId)}?${updateMask}&key=${apiKey}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields }),
    }
  );
}

async function deleteDocumentById(collection: string, documentId: string) {
  await requestFirestore<Record<string, never>>(buildDocumentUrl(collection, documentId), {
    method: "DELETE",
  });
}

function mapOperator(op: QueryOperator) {
  switch (op) {
    case "==":
      return "EQUAL";
    case ">=":
      return "GREATER_THAN_OR_EQUAL";
    case "<=":
      return "LESS_THAN_OR_EQUAL";
    default:
      throw new Error(`Unsupported Firestore operator: ${op}`);
  }
}

async function runQuery(state: QueryState) {
  const { apiKey, baseUrl } = getRestBaseUrl();
  const filters = state.filters.map((filter) => ({
    fieldFilter: {
      field: { fieldPath: filter.field },
      op: mapOperator(filter.op),
      value: toFirestoreValue(filter.value),
    },
  }));

  const where =
    filters.length === 0
      ? undefined
      : filters.length === 1
        ? filters[0]
        : {
            compositeFilter: {
              op: "AND",
              filters,
            },
          };

  const payload = {
    structuredQuery: {
      from: [{ collectionId: state.collection }],
      ...(where ? { where } : {}),
      ...(state.orderBy.length > 0
        ? {
            orderBy: state.orderBy.map((item) => ({
              field: { fieldPath: item.field },
              direction: item.direction === "desc" ? "DESCENDING" : "ASCENDING",
            })),
          }
        : {}),
      ...(typeof state.offset === "number" ? { offset: state.offset } : {}),
      ...(typeof state.limit === "number" ? { limit: state.limit } : {}),
    },
  };

  const rows = await requestFirestore<Array<{ document?: FirestoreDocument }>>(
    `${baseUrl}:runQuery?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  return rows.flatMap((row) => (row.document ? [row.document] : []));
}

function createDocumentSnapshot(documentId: string, document: FirestoreDocument | null): RestDocumentSnapshot {
  return {
    id: documentId,
    exists: Boolean(document),
    data: () => (document ? parseDocumentFields(document) : undefined),
  };
}

function createQuerySnapshot(documents: FirestoreDocument[]): RestQuerySnapshot {
  const docs = documents.map((document) => {
    const id = document.name.split("/").pop() || "";
    return createDocumentSnapshot(id, document);
  });

  return {
    docs,
    empty: docs.length === 0,
    forEach: (callback: (doc: (typeof docs)[number]) => void) => {
      docs.forEach(callback);
    },
  };
}

function createDocumentReference(collection: string, documentId: string): RestDocumentReference {
  return {
    id: documentId,
    get: async () => createDocumentSnapshot(documentId, await getDocumentRaw(collection, documentId)),
    update: async (data: Record<string, unknown>) => updateDocumentFields(collection, documentId, data),
    delete: async () => deleteDocumentById(collection, documentId),
  };
}

function createQueryReference(state: QueryState): RestQueryReference {
  return {
    where(field: string, op: QueryOperator, value: unknown) {
      return createQueryReference({
        ...state,
        filters: [...state.filters, { field, op, value }],
      });
    },
    orderBy(field: string, direction: QueryDirection = "asc") {
      return createQueryReference({
        ...state,
        orderBy: [...state.orderBy, { field, direction }],
      });
    },
    limit(value: number) {
      return createQueryReference({ ...state, limit: value });
    },
    offset(value: number) {
      return createQueryReference({ ...state, offset: value });
    },
    async get() {
      return createQuerySnapshot(await runQuery(state));
    },
    count() {
      return {
        get: async () => {
          const snapshot = createQuerySnapshot(await runQuery(state));
          return {
            data: () => ({ count: snapshot.docs.length }),
          };
        },
      };
    },
  };
}

function createCollectionReference(collection: string): RestCollectionReference {
  const query = createQueryReference({
    collection,
    filters: [],
    orderBy: [],
  });

  return {
    ...query,
    doc(documentId: string) {
      return createDocumentReference(collection, documentId);
    },
    add(data: Record<string, unknown>) {
      return addDocument(collection, data);
    },
  };
}

function getRestFirestore(): RestFirestore {
  if (!cachedRestFirestore) {
    cachedRestFirestore = {
      collection(collection: string) {
        return createCollectionReference(collection);
      },
    };
  }

  return cachedRestFirestore;
}

function getFirebaseAdmin() {
  if (!shouldUseAdminSdk()) {
    return null;
  }

  if (cachedAdminApp !== undefined) {
    return cachedAdminApp;
  }

  const projectId = getProjectId();
  if (!projectId) {
    throw new Error("Firebase Project ID not configured in environment variables");
  }

  // Lazy runtime import so local dev can use the REST fallback without loading firebase-admin.
  const { applicationDefault, cert, getApps, initializeApp } = require("firebase-admin/app") as typeof import("firebase-admin/app");

  const existingApp = getApps()[0];
  if (existingApp) {
    cachedAdminApp = existingApp;
    return cachedAdminApp;
  }

  const serviceAccount = getServiceAccountConfig();

  if (serviceAccount) {
    cachedAdminApp = initializeApp({
      projectId: serviceAccount.projectId || projectId,
      credential: cert({
        projectId: serviceAccount.projectId || projectId,
        clientEmail: serviceAccount.clientEmail,
        privateKey: serviceAccount.privateKey,
      }),
    });
    return cachedAdminApp;
  }

  if (process.env.FIRESTORE_EMULATOR_HOST) {
    cachedAdminApp = initializeApp({ projectId });
    return cachedAdminApp;
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    cachedAdminApp = initializeApp({
      projectId,
      credential: applicationDefault(),
    });
    return cachedAdminApp;
  }

  cachedAdminApp = null;
  return cachedAdminApp;
}

export function getFirestore(): RestFirestore | ReturnType<typeof import("firebase-admin/firestore").getFirestore> {
  const adminApp = getFirebaseAdmin();
  if (!adminApp) {
    return getRestFirestore();
  }

  const { getFirestore: getAdminFirestore } = require("firebase-admin/firestore") as typeof import("firebase-admin/firestore");
  return getAdminFirestore(adminApp as never);
}

export function getAuth() {
  const adminApp = getFirebaseAdmin();
  if (!adminApp) {
    throw new Error(
      "Firebase Admin Auth requires service account credentials. Set FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON or FIREBASE_ADMIN_CLIENT_EMAIL/FIREBASE_ADMIN_PRIVATE_KEY."
    );
  }

  const { getAuth: getAdminAuth } = require("firebase-admin/auth") as typeof import("firebase-admin/auth");
  return getAdminAuth(adminApp as never);
}

export default getFirebaseAdmin;
