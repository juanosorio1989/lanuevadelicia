import { describe, expect, it } from 'vitest';
import { restaurant } from '@/data/restaurant';
import { formatTime, getOpenStatus, nextClosedDates, nyNow, pickToday } from '@/lib/hours';

const H = restaurant.hours;

describe('getOpenStatus', () => {
  it('handles a regular Monday (EST)', () => {
    expect(getOpenStatus(new Date('2026-11-16T08:59:00-05:00'), H)).toEqual({ state: 'closed', opensAt: '09:00', opensDay: 'today' });
    expect(getOpenStatus(new Date('2026-11-16T09:00:00-05:00'), H)).toEqual({ state: 'open', closesAt: '21:00' });
    expect(getOpenStatus(new Date('2026-11-16T20:00:00-05:00'), H)).toEqual({ state: 'closing-soon', closesAt: '21:00' });
    expect(getOpenStatus(new Date('2026-11-16T19:59:00-05:00'), H)).toEqual({ state: 'open', closesAt: '21:00' });
    expect(getOpenStatus(new Date('2026-11-16T21:00:00-05:00'), H)).toEqual({ state: 'closed', opensAt: '09:00', opensDay: 'tomorrow' });
  });
  it('handles Friday closing at 22:00', () => {
    expect(getOpenStatus(new Date('2026-11-20T21:59:00-05:00'), H)).toEqual({ state: 'closing-soon', closesAt: '22:00' });
    expect(getOpenStatus(new Date('2026-11-20T22:00:00-05:00'), H).state).toBe('closed');
  });
  it('Sunday night opens Monday', () => {
    expect(getOpenStatus(new Date('2026-11-22T23:30:00-05:00'), H)).toEqual({ state: 'closed', opensAt: '09:00', opensDay: 'tomorrow' });
  });
  it('handles DST boundaries', () => {
    expect(getOpenStatus(new Date('2026-03-08T09:30:00-04:00'), H).state).toBe('open');
    expect(getOpenStatus(new Date('2026-11-01T08:30:00-05:00'), H)).toEqual({ state: 'closed', opensAt: '09:00', opensDay: 'today' });
  });
});

describe('nyNow / pickToday', () => {
  it('uses New York weekday regardless of machine timezone', () => {
    expect(nyNow(new Date('2026-11-17T03:00:00Z')).weekday).toBe(1);
    expect(pickToday(new Date('2026-11-17T03:00:00Z'), [{ day: 1, x: 'mon' }, { day: 2, x: 'tue' }])?.x).toBe('mon');
  });
});

describe('formatTime', () => {
  it('formats es and en', () => {
    expect(formatTime('21:00', 'es')).toBe('9:00 p.m.');
    expect(formatTime('09:00', 'en')).toBe('9:00 AM');
  });
});

describe('closed dates (January 1)', () => {
  const C = [{ month: 1, day: 1 }];
  it('is closed all day on January 1 and opens tomorrow', () => {
    expect(getOpenStatus(new Date('2027-01-01T12:00:00-05:00'), H, undefined, C)).toEqual({ state: 'closed', opensAt: '09:00', opensDay: 'tomorrow' });
    expect(getOpenStatus(new Date('2027-01-01T08:00:00-05:00'), H, undefined, C)).toEqual({ state: 'closed', opensAt: '09:00', opensDay: 'tomorrow' });
  });
  it('skips the closed day when looking ahead', () => {
    expect(getOpenStatus(new Date('2026-12-31T22:30:00-05:00'), H, undefined, C)).toEqual({ state: 'closed', opensAt: '09:00', opensDay: 6 });
    expect(getOpenStatus(new Date('2027-01-02T08:00:00-05:00'), H, undefined, C)).toEqual({ state: 'closed', opensAt: '09:00', opensDay: 'today' });
  });
  it('without closed dates January 1 is a normal day', () => {
    expect(getOpenStatus(new Date('2027-01-01T12:00:00-05:00'), H)).toEqual({ state: 'open', closesAt: '22:00' });
  });
  it('uses the New York date, not the machine date', () => {
    expect(getOpenStatus(new Date('2027-01-01T01:00:00Z'), H, undefined, C)).toEqual({ state: 'closing-soon', closesAt: '21:00' });
  });
});

describe('nextClosedDates', () => {
  const C = [{ month: 1, day: 1 }];
  it('lists the next ISO dates, today included', () => {
    expect(nextClosedDates(new Date('2026-11-15T12:00:00-05:00'), C, 2)).toEqual(['2027-01-01', '2028-01-01']);
    expect(nextClosedDates(new Date('2027-01-01T12:00:00-05:00'), C, 1)).toEqual(['2027-01-01']);
  });
});
