const fs = require('fs');

function readEvents(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeEvents(filePath, events) {
  fs.writeFileSync(filePath, JSON.stringify(events, null, 2), 'utf8');
}

module.exports = { readEvents, writeEvents };
