const DB_NAME = "agape-ethiopia-offline";
const DB_VERSION = 1;
const STORE_NAME = "registrations";
const LEGACY_STORAGE_KEY = "agape-registration-offline-queue";

export type OfflineQueueItem = Record<string, unknown> & {
  localId?: string;
  queuedAt?: string;
  status?: "pending" | "synced" | "failed";
  lastError?: string;
};

function hasIndexedDb(): boolean {
  return typeof window !== "undefined" && "indexedDB" in window;
}

function readLegacyQueue(): OfflineQueueItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as OfflineQueueItem[]) : [];
  } catch {
    return [];
  }
}

function writeLegacyQueue(items: OfflineQueueItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage quota failures and keep the sync queue in IndexedDB when available.
  }
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!hasIndexedDb()) {
      reject(new Error("IndexedDB is unavailable in this browser."));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: "localId" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Unable to open offline database."));
  });
}

export async function readQueue(): Promise<OfflineQueueItem[]> {
  if (typeof window === "undefined") {
    return [];
  }

  if (!hasIndexedDb()) {
    return readLegacyQueue();
  }

  try {
    const database = await openDatabase();
    const result = await new Promise<OfflineQueueItem[]>((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve((request.result as OfflineQueueItem[]) ?? []);
      request.onerror = () => reject(request.error ?? new Error("Unable to load offline queue."));
    });

    return result.length > 0 ? result : readLegacyQueue();
  } catch {
    return readLegacyQueue();
  }
}

export async function writeQueue(items: OfflineQueueItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  if (!hasIndexedDb()) {
    writeLegacyQueue(items);
    return;
  }

  try {
    const database = await openDatabase();
    const transaction = database.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    store.clear();

    for (const item of items) {
      const record = {
        ...(item ?? {}),
        localId: item.localId ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        queuedAt: item.queuedAt ?? new Date().toISOString(),
        status: item.status ?? "pending",
      };
      store.put(record);
    }

    await new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error ?? new Error("Unable to save offline queue."));
    });

    if (items.length === 0) {
      writeLegacyQueue([]);
    }
  } catch {
    writeLegacyQueue(items);
  }
}

export async function queueItem(item: OfflineQueueItem) {
  const items = await readQueue();
  const withRecord = {
    ...item,
    localId: item.localId ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    queuedAt: item.queuedAt ?? new Date().toISOString(),
    status: item.status ?? "pending",
  };
  await writeQueue([...items, withRecord]);
  return withRecord;
}

export async function getQueueCount() {
  return (await readQueue()).length;
}
