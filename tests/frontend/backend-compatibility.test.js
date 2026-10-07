const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../..');
const jsDir = path.join(root, 'frontend', 'js');

const ALLOWED_BACKEND_ACTIONS = new Set([
  'CANCEL_ORDER',
  'CONFIRM_PATIENT_RECEIVED',
  'CREATE_ORDER',
  'CREATE_USER',
  'DECIDE_CANCELLATION',
  'GET_ADMIN_DASHBOARD',
  'GET_APPOINTMENT_ACTION',
  'GET_MASTER_DATA',
  'GET_ORDER_CHANGE_LOG',
  'GET_ORDER_DETAIL',
  'GET_RESCHEDULE_ORDER',
  'GET_RESCHEDULE_REFERENCE',
  'GET_STAFF_DASHBOARD',
  'GET_V2_DASHBOARD',
  'LIST_USERS',
  'LOGIN',
  'LOGIN_V2',
  'LOGOUT',
  'LOGOUT_V2',
  'MARK_ORDER_PURCHASED',
  'RESEND_FAILED_EMAIL',
  'RESET_USER_PIN',
  'SEND_ORDER_EMAIL',
  'SUBMIT_APPOINTMENT_RESCHEDULE',
  'SUBMIT_PATIENT_NO_SHOW',
  'UPDATE_ORDER',
  'UPDATE_RECEIVED_ITEMS',
  'UPDATE_USER',
]);

function frontendSources() {
  return fs.readdirSync(jsDir)
    .filter((name) => name.endsWith('.js'))
    .map((name) => fs.readFileSync(path.join(jsDir, name), 'utf8'))
    .join('\n');
}

function requestedActions(source) {
  const actions = new Set();
  for (const match of source.matchAll(/(?:apiRequest|request)\(\s*['"]([A-Z0-9_]+)['"]/gu)) actions.add(match[1]);
  for (const match of source.matchAll(/requestAction\s*=\s*action\s*===\s*['"]NO_SHOW['"]\s*\?\s*['"]([A-Z0-9_]+)['"]\s*:\s*['"]([A-Z0-9_]+)['"]/gu)) {
    actions.add(match[1]);
    actions.add(match[2]);
  }
  return actions;
}

test('v2 frontend only calls backend actions in the approved compatibility allowlist', () => {
  const observed = requestedActions(frontendSources());
  const unexpected = [...observed].filter((action) => !ALLOWED_BACKEND_ACTIONS.has(action));
  assert.deepEqual(unexpected, []);
  assert.ok(observed.size >= 20, 'action scan unexpectedly found too few backend calls');
});

test('approved backend action list keeps critical mutation and appointment actions', () => {
  for (const action of [
    'CREATE_ORDER', 'UPDATE_ORDER', 'CANCEL_ORDER',
    'MARK_ORDER_PURCHASED', 'UPDATE_RECEIVED_ITEMS',
    'SEND_ORDER_EMAIL', 'CONFIRM_PATIENT_RECEIVED',
    'SUBMIT_PATIENT_NO_SHOW', 'SUBMIT_APPOINTMENT_RESCHEDULE',
  ]) {
    assert.equal(ALLOWED_BACKEND_ACTIONS.has(action), true, action);
  }
});


test('v2 frontend authentication and dashboard use isolated v2 backend actions', () => {
  const auth = fs.readFileSync(path.join(jsDir, 'auth.js'), 'utf8');
  const dashboard = fs.readFileSync(path.join(jsDir, 'dashboard.js'), 'utf8');
  const session = fs.readFileSync(path.join(jsDir, 'session.js'), 'utf8');
  assert.match(auth, /apiRequest\('LOGIN_V2'/);
  assert.match(auth, /apiRequest\('LOGOUT_V2'/);
  assert.match(dashboard, /request\('GET_V2_DASHBOARD'/);
  assert.match(session, /medication-reservation\.session\.v2/);
  assert.doesNotMatch(session, /medication-reservation\.session\.v1/);
});
