// Main IndexedDB database name.
const DB_NAME = "life-game-db";

// Keep version 1 for the first database release.
const DB_VERSION = 1;

// IndexedDB store names.
const TRADING_STORE_NAME = "tradingRecords";
const GYM_STORE_NAME = "gymRecords";
const NO_FAP_STORE_NAME = "noFapRecords";

// Stores included in backup/import.
const STORE_NAMES = [
  TRADING_STORE_NAME,
  GYM_STORE_NAME,
  NO_FAP_STORE_NAME,
];

// ================================
// OPEN DATABASE
// ================================
export function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      // Create Trading store.
      if (!db.objectStoreNames.contains(TRADING_STORE_NAME)) {
        db.createObjectStore(TRADING_STORE_NAME, {
          keyPath: "id",
        });
      }

      // Create Gym store.
      if (!db.objectStoreNames.contains(GYM_STORE_NAME)) {
        db.createObjectStore(GYM_STORE_NAME, {
          keyPath: "id",
        });
      }

      // Create No Fap store.
      if (!db.objectStoreNames.contains(NO_FAP_STORE_NAME)) {
        db.createObjectStore(NO_FAP_STORE_NAME, {
          keyPath: "id",
        });
      }
    };

    request.onsuccess = () => {
      const db = request.result;

      // Close old database connections when another tab upgrades
      // the database to a newer version in the future.
      db.onversionchange = () => {
        db.close();
      };

      resolve(db);
    };

    request.onerror = () => {
      console.error("IndexedDB open error:", request.error);
      reject(request.error);
    };
  });
}

// ================================
// TRADING RECORD
// ================================
export async function getTradingRecord() {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      TRADING_STORE_NAME,
      "readonly"
    );

    const store = transaction.objectStore(TRADING_STORE_NAME);
    const request = store.get("current");

    request.onsuccess = () => {
      resolve(request.result || null);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function saveTradingRecord(record) {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      TRADING_STORE_NAME,
      "readwrite"
    );

    const store = transaction.objectStore(TRADING_STORE_NAME);

    transaction.oncomplete = () => {
      resolve();
    };

    transaction.onerror = () => {
      reject(transaction.error);
    };

    transaction.onabort = () => {
      reject(new Error("Trading transaction aborted"));
    };

    store.put({
      ...record,
      id: "current",
    });
  });
}

// ================================
// GYM RECORDS
// ================================
export async function getGymRecord(id) {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      GYM_STORE_NAME,
      "readonly"
    );

    const store = transaction.objectStore(GYM_STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => {
      resolve(request.result || null);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function saveGymRecord(record) {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      GYM_STORE_NAME,
      "readwrite"
    );

    const store = transaction.objectStore(GYM_STORE_NAME);

    transaction.oncomplete = () => {
      resolve();
    };

    transaction.onerror = () => {
      reject(transaction.error);
    };

    transaction.onabort = () => {
      reject(new Error("Gym transaction aborted"));
    };

    store.put(record);
  });
}

export async function getAllGymRecords() {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      GYM_STORE_NAME,
      "readonly"
    );

    const store = transaction.objectStore(GYM_STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result || []);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

// ================================
// NO FAP RECORDS
// ================================

// Read one immutable No Fap record.
export async function getNoFapRecord(date) {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      NO_FAP_STORE_NAME,
      "readonly"
    );

    const store = transaction.objectStore(NO_FAP_STORE_NAME);
    const request = store.get(date);

    request.onsuccess = () => {
      resolve(request.result || null);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

// Add a No Fap record.
//
// add() is intentionally used instead of put().
// If the date already exists, IndexedDB rejects the operation.
export async function addNoFapRecord(record) {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      NO_FAP_STORE_NAME,
      "readwrite"
    );

    const store = transaction.objectStore(NO_FAP_STORE_NAME);

    transaction.oncomplete = () => {
      resolve();
    };

    transaction.onerror = () => {
      reject(transaction.error);
    };

    transaction.onabort = () => {
      reject(new Error("No Fap transaction aborted"));
    };

    store.add(record);
  });
}

// Get complete No Fap history.
export async function getAllNoFapRecords() {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      NO_FAP_STORE_NAME,
      "readonly"
    );

    const store = transaction.objectStore(NO_FAP_STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result || []);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

// ================================
// SAFE DATA HELPERS
// ================================

// Safely read a field that might not exist in older records.
export function getOptionalField(
  record,
  field,
  defaultValue = null
) {
  if (!record || record[field] === undefined) {
    return defaultValue;
  }

  return record[field];
}

// Safely handle arrays from stored data.
export function getSafeArray(value) {
  return Array.isArray(value) ? value : [];
}

// ================================
// DATABASE EXPORT
// ================================

// Export all LIFE GAME data.
export async function exportDatabase() {
  const db = await openDatabase();

  const exportedData = {};

  for (const storeName of STORE_NAMES) {
    exportedData[storeName] = await new Promise(
      (resolve, reject) => {
        const transaction = db.transaction(
          storeName,
          "readonly"
        );

        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = () => {
          resolve(request.result || []);
        };

        request.onerror = () => {
          reject(request.error);
        };
      }
    );
  }

  return {
    app: "LIFE GAME",
    backupVersion: 1,
    databaseVersion: DB_VERSION,
    exportedAt: new Date().toISOString(),
    data: exportedData,
  };
}

// ================================
// DOWNLOAD BACKUP
// ================================

// Create and download a JSON backup file.
export async function downloadDatabaseBackup() {
  const backup = await exportDatabase();

  const json = JSON.stringify(backup, null, 2);

  const blob = new Blob([json], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = `life-game-backup-${new Date()
    .toISOString()
    .slice(0, 10)}.json`;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

// ================================
// BACKUP VALIDATION
// ================================

// Check whether an imported file looks like a LIFE GAME backup.
export function validateBackup(backup) {
  if (!backup || typeof backup !== "object") {
    return false;
  }

  if (backup.app !== "LIFE GAME") {
    return false;
  }

  if (!backup.data || typeof backup.data !== "object") {
    return false;
  }

  // Missing stores are allowed.
  // This makes older backups compatible when new stores
  // are added in future versions.
  for (const storeName of STORE_NAMES) {
    if (
      backup.data[storeName] !== undefined &&
      !Array.isArray(backup.data[storeName])
    ) {
      return false;
    }
  }

  return true;
}

// ================================
// IMPORT DATABASE
// ================================

// Replace current database data with backup data.
export async function importDatabase(backup) {
  if (!validateBackup(backup)) {
    throw new Error("Invalid LIFE GAME backup file.");
  }

  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      STORE_NAMES,
      "readwrite"
    );

    // Clear all current data first.
    for (const storeName of STORE_NAMES) {
      transaction.objectStore(storeName).clear();
    }

    // Restore backup data.
    for (const storeName of STORE_NAMES) {
      const records = getSafeArray(
        backup.data[storeName]
      );

      const store = transaction.objectStore(storeName);

      for (const record of records) {
        store.put(record);
      }
    }

    transaction.oncomplete = () => {
      resolve();
    };

    transaction.onerror = () => {
      reject(transaction.error);
    };

    transaction.onabort = () => {
      reject(
        new Error("Database import transaction aborted.")
      );
    };
  });
}

// ================================
// IMPORT FROM FILE
// ================================

// Read a JSON backup file and restore it.
export async function importDatabaseFromFile(file) {
  if (!file) {
    throw new Error("No backup file selected.");
  }

  const text = await file.text();

  let backup;

  try {
    backup = JSON.parse(text);
  } catch {
    throw new Error(
      "The selected file is not valid JSON."
    );
  }

  await importDatabase(backup);
}