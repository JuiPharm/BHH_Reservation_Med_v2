import { apiRequest } from './api.js';

const DEFAULTS = Object.freeze({
  PRIORITY: Object.freeze([
    { Code: 'NORMAL', DisplayName: 'ปกติ (Normal)', SortOrder: 1, Active: true },
    { Code: 'URGENT', DisplayName: 'ด่วน (Urgent)', SortOrder: 2, Active: true },
    { Code: 'CRITICAL', DisplayName: 'ด่วนที่สุด (Critical)', SortOrder: 3, Active: true },
  ]),
  DOSAGE_FORM: Object.freeze([
    'TABLET', 'CAPSULE', 'SYRUP', 'SUSPENSION', 'ORAL_SOLUTION',
    'INJECTION', 'CREAM', 'OINTMENT', 'GEL', 'EYE_DROPS', 'EAR_DROPS',
    'NASAL_SPRAY', 'INHALER', 'SUPPOSITORY', 'PATCH', 'POWDER',
    'GRANULE', 'SOLUTION', 'OTHER'
  ].map((code, idx) => ({ Code: code, DisplayName: code, SortOrder: idx + 1, Active: true }))),
  UNIT: Object.freeze([
    'TABLET', 'CAPSULE', 'BOTTLE', 'VIAL', 'AMPOULE', 'TUBE', 'BOX',
    'PACK', 'SACHET', 'PIECE', 'ML', 'G', 'MG', 'DOSE', 'INHALER',
    'PATCH', 'SUPPOSITORY', 'OTHER'
  ].map((code, idx) => ({ Code: code, DisplayName: code, SortOrder: idx + 1, Active: true }))),
});

const cache = new Map();

function cleanTypes(types) {
  return [...new Set((Array.isArray(types) ? types : [types]).map((type) => String(type || '').trim()).filter(Boolean))];
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export async function loadMasterData(types, request = apiRequest) {
  const wanted = cleanTypes(types);
  const missing = wanted.filter((type) => !cache.has(type));
  if (missing.length) {
    try {
      const response = await request('GET_MASTER_DATA', { types: missing });
      const data = response && response.data && typeof response.data === 'object' ? response.data : {};
      missing.forEach((type) => {
        const list = Array.isArray(data[type]) && data[type].length > 0 ? data[type] : (DEFAULTS[type] || []);
        cache.set(type, list);
      });
    } catch (_error) {
      missing.forEach((type) => {
        if (!cache.has(type)) cache.set(type, DEFAULTS[type] || []);
      });
    }
  }
  return wanted.reduce((result, type) => ({ ...result, [type]: clone(cache.get(type) || DEFAULTS[type] || []) }), {});
}

export function clearMasterDataCache() {
  cache.clear();
}
