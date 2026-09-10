import MockAdapter from 'axios-mock-adapter';
import { apiClient } from './client';
import type { LoginCredentials, NewVisitor, Visitor } from '../types';

const STORAGE_KEY = 'vms_visitors';
const VALID_EMAIL = 'admin@example.com';
const VALID_PASSWORD = 'admin123';

const seedVisitors: Visitor[] = [
  {
    id: 'v-1',
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    unit: 'A-101',
    visitDate: '2026-09-11',
    status: 'pending',
    createdAt: new Date('2026-09-09T10:00:00Z').toISOString(),
  },
  {
    id: 'v-2',
    name: 'Priya Patel',
    phone: '+91 91234 56789',
    unit: 'B-204',
    visitDate: '2026-09-12',
    status: 'approved',
    createdAt: new Date('2026-09-08T09:30:00Z').toISOString(),
  },
  {
    id: 'v-3',
    name: 'John Mathew',
    phone: '+91 99887 76655',
    unit: 'C-305',
    visitDate: '2026-09-10',
    status: 'rejected',
    createdAt: new Date('2026-09-07T14:15:00Z').toISOString(),
  },
];

function loadVisitors(): Visitor[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedVisitors));
    return seedVisitors;
  }
  try {
    return JSON.parse(raw) as Visitor[];
  } catch {
    return seedVisitors;
  }
}

function saveVisitors(visitors: Visitor[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(visitors));
}

function genId(): string {
  return `v-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export function installMockServer() {
  const mock = new MockAdapter(apiClient, { delayResponse: 500 });

  mock.onPost('/auth/login').reply((config) => {
    const body = JSON.parse(config.data) as LoginCredentials;
    if (body.email === VALID_EMAIL && body.password === VALID_PASSWORD) {
      return [
        200,
        {
          user: { id: 'u-1', email: VALID_EMAIL, name: 'Admin User' },
          token: 'mock-jwt-token',
        },
      ];
    }
    return [401, { message: 'Invalid email or password' }];
  });

  mock.onGet('/visitors').reply(() => {
    return [200, loadVisitors()];
  });

  mock.onGet(/\/visitors\/[\w-]+$/).reply((config) => {
    const id = config.url?.split('/').pop();
    const visitor = loadVisitors().find((v) => v.id === id);
    if (!visitor) return [404, { message: 'Visitor not found' }];
    return [200, visitor];
  });

  mock.onPost('/visitors').reply((config) => {
    const body = JSON.parse(config.data) as NewVisitor;
    const visitors = loadVisitors();
    const newVisitor: Visitor = {
      id: genId(),
      ...body,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    visitors.unshift(newVisitor);
    saveVisitors(visitors);
    return [201, newVisitor];
  });

  mock.onPut(/\/visitors\/[\w-]+$/).reply((config) => {
    const id = config.url?.split('/').pop();
    const body = JSON.parse(config.data) as Partial<Visitor>;
    const visitors = loadVisitors();
    const index = visitors.findIndex((v) => v.id === id);
    if (index === -1) return [404, { message: 'Visitor not found' }];
    visitors[index] = { ...visitors[index], ...body };
    saveVisitors(visitors);
    return [200, visitors[index]];
  });

  mock.onDelete(/\/visitors\/[\w-]+$/).reply((config) => {
    const id = config.url?.split('/').pop();
    const visitors = loadVisitors();
    const index = visitors.findIndex((v) => v.id === id);
    if (index === -1) return [404, { message: 'Visitor not found' }];
    const remaining = visitors.filter((v) => v.id !== id);
    saveVisitors(remaining);
    return [204];
  });

  mock.onPatch(/\/visitors\/[\w-]+\/approve$/).reply((config) => {
    const id = config.url?.split('/')[2];
    const visitors = loadVisitors();
    const index = visitors.findIndex((v) => v.id === id);
    if (index === -1) return [404, { message: 'Visitor not found' }];
    visitors[index].status = 'approved';
    saveVisitors(visitors);
    return [200, visitors[index]];
  });

  mock.onPatch(/\/visitors\/[\w-]+\/reject$/).reply((config) => {
    const id = config.url?.split('/')[2];
    const visitors = loadVisitors();
    const index = visitors.findIndex((v) => v.id === id);
    if (index === -1) return [404, { message: 'Visitor not found' }];
    visitors[index].status = 'rejected';
    saveVisitors(visitors);
    return [200, visitors[index]];
  });

  return mock;
}
