// Converted to TypeScript - migrated
/**
 * Firebase Firestore REST API Helper
 * Provides common functions for interacting with Firestore via REST API
 */

const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;

/**
 * Convert JS value to Firestore format
 */
export function toFirestoreValue(value) {
  if (value === null || value === undefined) return { nullValue: null };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") {
    return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  }
  if (typeof value === "string") return { stringValue: value };
  if (value instanceof Date) return { timestampValue: value.toISOString() };
  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(toFirestoreValue) } };
  }
  if (typeof value === "object") {
    const fields = {};
    for (const [k, v] of Object.entries(value)) {
      fields[k] = toFirestoreValue(v);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(value) };
}

/**
 * Parse Firestore value to JS value
 */
export function parseFirestoreValue(value) {
  if (!value) return null;
  if (value.stringValue !== undefined) return value.stringValue;
  if (value.integerValue !== undefined) return parseInt(value.integerValue);
  if (value.doubleValue !== undefined) return value.doubleValue;
  if (value.booleanValue !== undefined) return value.booleanValue;
  if (value.timestampValue !== undefined) return new Date(value.timestampValue);
  if (value.nullValue !== undefined) return null;
  if (value.mapValue !== undefined) {
    const result = {};
    for (const [k, v] of Object.entries(value.mapValue.fields || {})) {
      result[k] = parseFirestoreValue(v);
    }
    return result;
  }
  if (value.arrayValue !== undefined) {
    return (value.arrayValue.values || []).map(parseFirestoreValue);
  }
  return null;
}

/**
 * Parse a Firestore document to a plain JS object
 */
export function parseDocument(doc) {
  if (!doc || !doc.fields) return null;
  const result = {};
  // Extract document ID from the name path
  const nameParts = doc.name.split("/");
  result._id = nameParts[nameParts.length - 1];
  result.id = result._id;
  
  for (const [key, value] of Object.entries(doc.fields)) {
    result[key] = parseFirestoreValue(value);
  }
  return result;
}

/**
 * Get a single document by ID
 */
export async function getDocument(collection, docId) {
  const url = `${FIRESTORE_URL}/${collection}/${encodeURIComponent(docId)}?key=${FIREBASE_API_KEY}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    if (response.status === 404) return null;
    const error = await response.json();
    throw new Error(error.error?.message || "Failed to get document");
  }
  
  const doc = await response.json();
  return parseDocument(doc);
}

/**
 * Get all documents from a collection
 */
export async function getCollection(collection, options = {}) {
  let url = `${FIRESTORE_URL}/${collection}?key=${FIREBASE_API_KEY}`;
  
  if (options.pageSize) {
    url += `&pageSize=${options.pageSize}`;
  }
  if (options.pageToken) {
    url += `&pageToken=${options.pageToken}`;
  }
  if (options.orderBy) {
    url += `&orderBy=${options.orderBy}`;
  }
  
  const response = await fetch(url);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Failed to get collection");
  }
  
  const data = await response.json();
  const documents = (data.documents || []).map(parseDocument);
  
  return {
    documents,
    nextPageToken: data.nextPageToken,
  };
}

/**
 * Create a new document
 */
export async function createDocument(collection, docId, data) {
  const url = docId
    ? `${FIRESTORE_URL}/${collection}?documentId=${encodeURIComponent(docId)}&key=${FIREBASE_API_KEY}`
    : `${FIRESTORE_URL}/${collection}?key=${FIREBASE_API_KEY}`;
  
  const fields = {};
  for (const [key, value] of Object.entries(data)) {
    fields[key] = toFirestoreValue(value);
  }
  
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Failed to create document");
  }
  
  const doc = await response.json();
  return parseDocument(doc);
}

/**
 * Update an existing document
 */
export async function updateDocument(collection, docId, data) {
  const fields = {};
  const updateMask = [];
  
  for (const [key, value] of Object.entries(data)) {
    fields[key] = toFirestoreValue(value);
    updateMask.push(key);
  }
  
  const maskParam = updateMask.map(f => `updateMask.fieldPaths=${f}`).join("&");
  const url = `${FIRESTORE_URL}/${collection}/${encodeURIComponent(docId)}?${maskParam}&key=${FIREBASE_API_KEY}`;
  
  const response = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Failed to update document");
  }
  
  const doc = await response.json();
  return parseDocument(doc);
}

/**
 * Delete a document
 */
export async function deleteDocument(collection, docId) {
  const url = `${FIRESTORE_URL}/${collection}/${encodeURIComponent(docId)}?key=${FIREBASE_API_KEY}`;
  
  const response = await fetch(url, {
    method: "DELETE",
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Failed to delete document");
  }
  
  return true;
}

/**
 * Check if a document exists
 */
export async function documentExists(collection, docId) {
  const url = `${FIRESTORE_URL}/${collection}/${encodeURIComponent(docId)}?key=${FIREBASE_API_KEY}`;
  const response = await fetch(url);
  return response.ok;
}

/**
 * Run a structured query (for filtering)
 */
export async function runQuery(collection, filters = [], orderBy = null, limit = null) {
  const url = `${FIRESTORE_URL}:runQuery?key=${FIREBASE_API_KEY}`;
  
  const structuredQuery = {
    from: [{ collectionId: collection }],
  };
  
  if (filters.length > 0) {
    if (filters.length === 1) {
      structuredQuery.where = filters[0];
    } else {
      structuredQuery.where = {
        compositeFilter: {
          op: "AND",
          filters: filters,
        },
      };
    }
  }
  
  if (orderBy) {
    structuredQuery.orderBy = Array.isArray(orderBy) ? orderBy : [orderBy];
  }
  
  if (limit) {
    structuredQuery.limit = limit;
  }
  
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ structuredQuery }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Query failed");
  }
  
  const results = await response.json();
  return results
    .filter(r => r.document)
    .map(r => parseDocument(r.document));
}

/**
 * Create a field filter for queries
 */
export function fieldFilter(field, op, value) {
  return {
    fieldFilter: {
      field: { fieldPath: field },
      op: op, // EQUAL, NOT_EQUAL, LESS_THAN, GREATER_THAN, etc.
      value: toFirestoreValue(value),
    },
  };
}

export default {
  getDocument,
  getCollection,
  createDocument,
  updateDocument,
  deleteDocument,
  documentExists,
  runQuery,
  fieldFilter,
  parseDocument,
  parseFirestoreValue,
  toFirestoreValue,
};

