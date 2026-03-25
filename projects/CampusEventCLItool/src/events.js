const { readEvents, writeEvents } = require('./storage');

function isValidDate(dateStr) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const d = new Date(dateStr);
  return d instanceof Date && !isNaN(d) && d.toISOString().startsWith(dateStr);
}

function addEvent(filePath, { name, date, location, description }) {
  if (!name || !name.trim()) throw new Error('Event name is required.');
  if (!location || !location.trim()) throw new Error('Event location is required.');
  if (!isValidDate(date)) throw new Error(`Invalid date "${date}". Use YYYY-MM-DD format.`);

  const events = readEvents(filePath);
  const duplicate = events.find(e => e.name.toLowerCase() === name.trim().toLowerCase());
  if (duplicate) throw new Error(`An event named "${name}" already exists.`);

  const newEvent = {
    id: Date.now().toString(),
    name: name.trim(),
    date,
    location: location.trim(),
    description: description ? description.trim() : '',
    createdAt: new Date().toISOString()
  };

  events.push(newEvent);
  writeEvents(filePath, events);
  return newEvent;
}

function listEvents(filePath) {
  const events = readEvents(filePath);
  const today = new Date().toISOString().split('T')[0];
  return events
    .filter(e => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
}

function deleteEvent(filePath, name) {
  if (!name || !name.trim()) throw new Error('Event name is required to delete.');
  const events = readEvents(filePath);
  const index = events.findIndex(e => e.name.toLowerCase() === name.trim().toLowerCase());
  if (index === -1) return false;
  events.splice(index, 1);
  writeEvents(filePath, events);
  return true;
}

module.exports = { isValidDate, addEvent, listEvents, deleteEvent };
