
const DB_NAME = "life-game-db";
const DB_VERSION = 2;

const DAILY_STORE_NAME = "dailyRecords";
const TRADING_STORE_NAME = "tradingRecords";

export function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      // Daily records
      if (!db.objectStoreNames.contains(DAILY_STORE_NAME)) {
        db.createObjectStore(DAILY_STORE_NAME, {
          keyPath: "date",
        });
      }

      // Trading records
      if (!db.objectStoreNames.contains(TRADING_STORE_NAME)) {
        db.createObjectStore(TRADING_STORE_NAME, {
          keyPath: "id",
        });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      console.error(
        "IndexedDB open error:",
        request.error
      );

      reject(request.error);
    };
  });
}


// ================================
// DAILY RECORDS
// ================================

export async function getDailyRecord(date) {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      DAILY_STORE_NAME,
      "readonly"
    );

    const store = transaction.objectStore(
      DAILY_STORE_NAME
    );

    const request = store.get(date);

    request.onsuccess = () => {
      console.log(
        "Loaded daily record:",
        request.result
      );

      resolve(request.result || null);
    };

    request.onerror = () => {
      console.error(
        "IndexedDB read error:",
        request.error
      );

      reject(request.error);
    };
  });
}


export async function saveDailyRecord(record) {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      DAILY_STORE_NAME,
      "readwrite"
    );

    const store = transaction.objectStore(
      DAILY_STORE_NAME
    );

    transaction.oncomplete = () => {
      console.log(
        "Daily record saved:",
        record
      );

      resolve();
    };

    transaction.onerror = () => {
      console.error(
        "IndexedDB transaction error:",
        transaction.error
      );

      reject(transaction.error);
    };

    transaction.onabort = () => {
      console.error(
        "IndexedDB transaction aborted"
      );

      reject(
        new Error("Transaction aborted")
      );
    };

    store.put(record);
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

    const store = transaction.objectStore(
      TRADING_STORE_NAME
    );

    const request = store.get("current");

    request.onsuccess = () => {
      console.log(
        "Loaded trading record:",
        request.result
      );

      resolve(request.result || null);
    };

    request.onerror = () => {
      console.error(
        "Trading record read error:",
        request.error
      );

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

    const store = transaction.objectStore(
      TRADING_STORE_NAME
    );

    transaction.oncomplete = () => {
      console.log(
        "Trading record saved:",
        record
      );

      resolve();
    };

    transaction.onerror = () => {
      console.error(
        "Trading transaction error:",
        transaction.error
      );

      reject(transaction.error);
    };

    transaction.onabort = () => {
      console.error(
        "Trading transaction aborted"
      );

      reject(
        new Error("Trading transaction aborted")
      );
    };

    store.put({
      ...record,
      id: "current",
    });
  });
}
