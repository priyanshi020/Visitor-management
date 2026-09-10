import { describe, expect, it } from 'vitest';
import {
  isFutureOrTodayDate,
  isNonEmpty,
  isValidEmail,
  isValidPhone,
  isValidUnit,
} from './validators';

describe('isValidEmail', () => {
  it('accepts a well-formed email', () => {
    expect(isValidEmail('admin@example.com')).toBe(true);
  });
  it('rejects a malformed email', () => {
    expect(isValidEmail('not-an-email')).toBe(false);
  });
});

describe('isValidPhone', () => {
  it('accepts a valid phone number', () => {
    expect(isValidPhone('+91 98765 43210')).toBe(true);
  });
  it('rejects letters', () => {
    expect(isValidPhone('abcdefg')).toBe(false);
  });
});

describe('isNonEmpty', () => {
  it('rejects whitespace-only strings', () => {
    expect(isNonEmpty('   ')).toBe(false);
  });
  it('accepts non-empty strings', () => {
    expect(isNonEmpty('hello')).toBe(true);
  });
});

describe('isValidUnit', () => {
  it('accepts alphanumeric with dash', () => {
    expect(isValidUnit('A-101')).toBe(true);
  });
  it('rejects special characters', () => {
    expect(isValidUnit('A#101!')).toBe(false);
  });
});

describe('isFutureOrTodayDate', () => {
  it('rejects empty date', () => {
    expect(isFutureOrTodayDate('')).toBe(false);
  });
  it('rejects a past date', () => {
    expect(isFutureOrTodayDate('2000-01-01')).toBe(false);
  });
  it('accepts a future date', () => {
    expect(isFutureOrTodayDate('2099-01-01')).toBe(true);
  });
});
