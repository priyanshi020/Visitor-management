import { describe, expect, it } from 'vitest';
import reducer, {
  addVisitor,
  approveVisitor,
  deleteVisitor,
  fetchVisitors,
  rejectVisitor,
} from './visitorsSlice';
import type { Visitor } from '../../types';

const sampleVisitor: Visitor = {
  id: 'v-1',
  name: 'Jane Doe',
  phone: '+1 555 0100',
  unit: 'A-1',
  visitDate: '2026-09-15',
  status: 'pending',
  createdAt: new Date().toISOString(),
};

describe('visitorsSlice', () => {
  it('returns the initial state', () => {
    const state = reducer(undefined, { type: '@@INIT' });
    expect(state.items).toEqual([]);
    expect(state.status).toBe('idle');
  });

  it('loads visitors on fetchVisitors.fulfilled', () => {
    const state = reducer(undefined, {
      type: fetchVisitors.fulfilled.type,
      payload: [sampleVisitor],
    });
    expect(state.items).toHaveLength(1);
    expect(state.status).toBe('idle');
  });

  it('sets an error on fetchVisitors.rejected', () => {
    const state = reducer(undefined, {
      type: fetchVisitors.rejected.type,
      payload: 'Network error',
    });
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Network error');
  });

  it('prepends a new visitor on addVisitor.fulfilled', () => {
    const initial = reducer(undefined, {
      type: fetchVisitors.fulfilled.type,
      payload: [sampleVisitor],
    });
    const newVisitor: Visitor = { ...sampleVisitor, id: 'v-2', name: 'John Smith' };
    const state = reducer(initial, { type: addVisitor.fulfilled.type, payload: newVisitor });
    expect(state.items).toHaveLength(2);
    expect(state.items[0].id).toBe('v-2');
  });

  it('updates status on approveVisitor.fulfilled', () => {
    const initial = reducer(undefined, {
      type: fetchVisitors.fulfilled.type,
      payload: [sampleVisitor],
    });
    const approved: Visitor = { ...sampleVisitor, status: 'approved' };
    const state = reducer(initial, { type: approveVisitor.fulfilled.type, payload: approved });
    expect(state.items[0].status).toBe('approved');
  });

  it('updates status on rejectVisitor.fulfilled', () => {
    const initial = reducer(undefined, {
      type: fetchVisitors.fulfilled.type,
      payload: [sampleVisitor],
    });
    const rejected: Visitor = { ...sampleVisitor, status: 'rejected' };
    const state = reducer(initial, { type: rejectVisitor.fulfilled.type, payload: rejected });
    expect(state.items[0].status).toBe('rejected');
  });

  it('removes a visitor on deleteVisitor.fulfilled', () => {
    const initial = reducer(undefined, {
      type: fetchVisitors.fulfilled.type,
      payload: [sampleVisitor],
    });
    const state = reducer(initial, { type: deleteVisitor.fulfilled.type, payload: sampleVisitor.id });
    expect(state.items).toHaveLength(0);
  });
});
