import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

test('dashboard does not suppress the admin navigation link with data-v2-pending', () => {
  const html = fs.readFileSync(path.join(root, 'frontend/dashboard.html'), 'utf8');
  assert.match(html, /<a\s+href="admin\.html"\s+data-admin-only>/);
  assert.doesNotMatch(html, /<a\s+href="admin\.html"[^>]*data-v2-pending/);
});

test('admin page contains canonical V2 roles in the create user modal', () => {
  const html = fs.readFileSync(path.join(root, 'frontend/admin.html'), 'utf8');
  for (const role of ['REQUESTER', 'PHARMACY_OPERATOR', 'PHARMACY_MANAGER', 'SYSTEM_ADMIN', 'REPORT_VIEWER']) {
    assert.match(html, new RegExp(`<option\\s+value="${role}"`));
  }
});

test('admin.js exports user management functions calling corresponding API actions', async () => {
  const adminJs = await import('../../frontend/js/admin.js');
  assert.equal(typeof adminJs.fetchUsersList, 'function');
  assert.equal(typeof adminJs.createUser, 'function');
  assert.equal(typeof adminJs.resetUserPin, 'function');
  assert.equal(typeof adminJs.updateUserStatus, 'function');

  let calledAction = null;
  let calledPayload = null;
  const mockRequest = async (action, payload) => {
    calledAction = action;
    calledPayload = payload;
    return { data: { success: true } };
  };

  await adminJs.fetchUsersList(mockRequest);
  assert.equal(calledAction, 'LIST_USERS');

  await adminJs.createUser({ staffId: 'TEST01', role: 'REQUESTER' }, mockRequest);
  assert.equal(calledAction, 'CREATE_USER');
  assert.equal(calledPayload.staffId, 'TEST01');

  await adminJs.resetUserPin({ staffId: 'TEST01', newPin: 'newpin123' }, mockRequest);
  assert.equal(calledAction, 'RESET_USER_PIN');

  await adminJs.updateUserStatus('TEST01', true, mockRequest);
  assert.equal(calledAction, 'UPDATE_USER');
  assert.equal(calledPayload.staffId, 'TEST01');
  assert.equal(calledPayload.active, true);
});
