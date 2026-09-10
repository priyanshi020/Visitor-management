import { beforeEach, describe, expect, it } from 'vitest';
import reducer, { login, logout } from './authSlice';

describe('authSlice', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns the initial state', () => {
    const state = reducer(undefined, { type: '@@INIT' });
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.status).toBe('idle');
  });

  it('sets loading state on login.pending', () => {
    const state = reducer(undefined, { type: login.pending.type });
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('stores user and token on login.fulfilled', () => {
    const payload = { user: { id: 'u-1', email: 'admin@example.com', name: 'Admin' }, token: 'abc' };
    const state = reducer(undefined, { type: login.fulfilled.type, payload });
    expect(state.user).toEqual(payload.user);
    expect(state.token).toBe('abc');
    expect(localStorage.getItem('vms_token')).toBe('abc');
  });

  it('sets an error on login.rejected', () => {
    const state = reducer(undefined, {
      type: login.rejected.type,
      payload: 'Invalid email or password',
    });
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Invalid email or password');
  });

  it('clears user and token on logout', () => {
    const loggedIn = reducer(undefined, {
      type: login.fulfilled.type,
      payload: { user: { id: 'u-1', email: 'a@b.com', name: 'A' }, token: 'tok' },
    });
    const state = reducer(loggedIn, logout());
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(localStorage.getItem('vms_token')).toBeNull();
  });
});
