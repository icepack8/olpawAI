const STORAGE_KEY = "olpaw_cat_payloads";

function readPayloads() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveCatPayload(catId, payload) {
  if (catId === undefined || catId === null) {
    console.warn("saveCatPayload: catId is required");
    return payload;
  }

  const payloads = readPayloads();

  payloads[String(catId)] = {
    ...payload,
    catId: Number(catId),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(payloads));

  return payload;
}

export function getCatPayload(catId) {
  const payloads = readPayloads();

  if (catId === undefined || catId === null) {
    return null;
  }

  return payloads[String(catId)] || null;
}

export function clearCatPayload(catId) {
  const payloads = readPayloads();

  if (catId === undefined || catId === null) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }

  delete payloads[String(catId)];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(payloads));
}