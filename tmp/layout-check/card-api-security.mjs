import assert from 'node:assert/strict';
import { saveCardToApi, getCardBySlug } from '../../src/services/cardApi.js';

const data = new Map();
globalThis.localStorage = { getItem: key => data.get(key) || null, setItem: (key, value) => data.set(key, value) };
for (const status of [401, 403, 500]) {
  globalThis.fetch = async () => ({ ok: false, status, json: async () => ({ message: `Failure ${status}` }) });
  await assert.rejects(saveCardToApi('test-card', 'template_01', {}, 'token'), new RegExp(`Failure ${status}`));
}
globalThis.fetch = async () => { throw new Error('Network unavailable'); };
await assert.rejects(saveCardToApi('test-card', 'template_01', {}, 'token'), /Network unavailable/);
globalThis.fetch = async () => ({ ok: true, status: 200, json: async () => ({ success: true, card_url: '/v/test-card' }) });
assert.equal((await saveCardToApi('test-card', 'template_01', {}, 'token')).isBackendSaved, true);
globalThis.fetch = async () => ({ ok: false, status: 404 });
assert.equal(await getCardBySlug('test-card'), null);
globalThis.fetch = async () => ({ ok: false, status: 410, json: async () => ({ message: 'License expired' }) });
assert.deepEqual(await getCardBySlug('test-card'), { locked: true, message: 'License expired' });
globalThis.fetch = async () => ({ ok: false, status: 500 });
assert.equal(await getCardBySlug('test-card'), null);
console.log('PASS: failed saves never claim publication; deleted cards do not reappear from local drafts');
