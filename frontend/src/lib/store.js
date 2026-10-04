const STORAGE_KEY = "olpaw_cat_payload";

export function saveCatPayload(payload) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  return payload;
}

export function getCatPayload() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

export function clearCatPayload() {
  localStorage.removeItem(STORAGE_KEY);
}