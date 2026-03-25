const os = require('os');
const path = require('path');
const fs = require('fs');
const { isValidDate, addEvent, listEvents, deleteEvent } = require('../src/events');

function tmpFile() {
  return path.join(os.tmpdir(), `events-test-${Date.now()}-${Math.random().toString(36).slice(2)}.json`);
}

afterEach(() => {
  // cleanup is per-test via unique paths
});

// ── isValidDate ──────────────────────────────────────────────────────────────

describe('isValidDate', () => {
  test('accepts a valid date', () => {
    expect(isValidDate('2026-05-01')).toBe(true);
  });

  test('rejects invalid month', () => {
    expect(isValidDate('2026-13-01')).toBe(false);
  });

  test('rejects wrong format', () => {
    expect(isValidDate('01/05/2026')).toBe(false);
  });

  test('rejects empty string', () => {
    expect(isValidDate('')).toBe(false);
  });
});

// ── addEvent ─────────────────────────────────────────────────────────────────

describe('addEvent', () => {
  test('happy path returns new event object', () => {
    const file = tmpFile();
    const event = addEvent(file, { name: 'Hackathon', date: '2027-05-01', location: 'CS Building', description: '24h coding' });
    expect(event).toMatchObject({ name: 'Hackathon', date: '2027-05-01', location: 'CS Building' });
    expect(event.id).toBeDefined();
    expect(event.createdAt).toBeDefined();
    fs.unlinkSync(file);
  });

  test('persists event to file', () => {
    const file = tmpFile();
    addEvent(file, { name: 'Career Fair', date: '2027-03-15', location: 'Main Hall' });
    const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
    expect(raw).toHaveLength(1);
    expect(raw[0].name).toBe('Career Fair');
    fs.unlinkSync(file);
  });

  test('rejects duplicate name (case-insensitive)', () => {
    const file = tmpFile();
    addEvent(file, { name: 'Game Night', date: '2027-06-10', location: 'Student Center' });
    expect(() => addEvent(file, { name: 'game night', date: '2027-07-10', location: 'Gym' }))
      .toThrow(/already exists/i);
    fs.unlinkSync(file);
  });

  test('rejects invalid date', () => {
    const file = tmpFile();
    expect(() => addEvent(file, { name: 'Bad Date Event', date: '2027-99-99', location: 'Nowhere' }))
      .toThrow(/invalid date/i);
  });

  test('rejects empty name', () => {
    const file = tmpFile();
    expect(() => addEvent(file, { name: '', date: '2027-05-01', location: 'Somewhere' }))
      .toThrow(/name is required/i);
  });

  test('rejects empty location', () => {
    const file = tmpFile();
    expect(() => addEvent(file, { name: 'Art Show', date: '2027-05-01', location: '' }))
      .toThrow(/location is required/i);
  });
});

// ── listEvents ───────────────────────────────────────────────────────────────

describe('listEvents', () => {
  test('returns empty array for missing file', () => {
    const file = tmpFile();
    expect(listEvents(file)).toEqual([]);
  });

  test('filters out past events', () => {
    const file = tmpFile();
    addEvent(file, { name: 'Past Event', date: '2020-01-01', location: 'Old Hall' });
    addEvent(file, { name: 'Future Event', date: '2028-01-01', location: 'New Hall' });
    const result = listEvents(file);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Future Event');
    fs.unlinkSync(file);
  });

  test('sorts events ascending by date', () => {
    const file = tmpFile();
    addEvent(file, { name: 'Event C', date: '2028-12-01', location: 'Room C' });
    addEvent(file, { name: 'Event A', date: '2028-01-01', location: 'Room A' });
    addEvent(file, { name: 'Event B', date: '2028-06-15', location: 'Room B' });
    const result = listEvents(file);
    expect(result.map(e => e.name)).toEqual(['Event A', 'Event B', 'Event C']);
    fs.unlinkSync(file);
  });

  test('does not mutate the file', () => {
    const file = tmpFile();
    addEvent(file, { name: 'Stable Event', date: '2028-03-01', location: 'Hall' });
    const before = fs.readFileSync(file, 'utf8');
    listEvents(file);
    const after = fs.readFileSync(file, 'utf8');
    expect(after).toBe(before);
    fs.unlinkSync(file);
  });
});

// ── deleteEvent ──────────────────────────────────────────────────────────────

describe('deleteEvent', () => {
  test('successfully deletes an event', () => {
    const file = tmpFile();
    addEvent(file, { name: 'Delete Me', date: '2028-04-01', location: 'Room 1' });
    expect(deleteEvent(file, 'Delete Me')).toBe(true);
    expect(listEvents(file)).toHaveLength(0);
    fs.unlinkSync(file);
  });

  test('case-insensitive match', () => {
    const file = tmpFile();
    addEvent(file, { name: 'Spring Fest', date: '2028-04-20', location: 'Quad' });
    expect(deleteEvent(file, 'spring fest')).toBe(true);
    fs.unlinkSync(file);
  });

  test('returns false when event not found', () => {
    const file = tmpFile();
    expect(deleteEvent(file, 'Nonexistent Event')).toBe(false);
  });

  test('throws on empty name', () => {
    const file = tmpFile();
    expect(() => deleteEvent(file, '')).toThrow(/name is required/i);
  });

  test('preserves other events when deleting', () => {
    const file = tmpFile();
    addEvent(file, { name: 'Keep Me', date: '2028-05-01', location: 'Hall A' });
    addEvent(file, { name: 'Remove Me', date: '2028-05-02', location: 'Hall B' });
    deleteEvent(file, 'Remove Me');
    const remaining = JSON.parse(fs.readFileSync(file, 'utf8'));
    expect(remaining).toHaveLength(1);
    expect(remaining[0].name).toBe('Keep Me');
    fs.unlinkSync(file);
  });
});
