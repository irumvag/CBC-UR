#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const { addEvent, listEvents, deleteEvent } = require('./src/events');

const DATA_FILE = path.join(__dirname, 'events.json');
const PUBLIC_DIR = path.join(__dirname, 'public');
const PORT = process.env.PORT || 3000;

function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try { resolve(body ? JSON.parse(body) : {}); }
      catch { reject(new Error('Invalid JSON')); }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  // Serve static files
  if (method === 'GET' && !url.startsWith('/api/')) {
    const filePath = path.join(PUBLIC_DIR, url === '/' ? 'index.html' : url);
    const ext = path.extname(filePath);
    const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript' };
    try {
      const content = fs.readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': types[ext] || 'text/plain' });
      res.end(content);
    } catch {
      res.writeHead(404);
      res.end('Not found');
    }
    return;
  }

  // API routes
  res.setHeader('Access-Control-Allow-Origin', '*');

  // GET /api/events — list upcoming events
  if (method === 'GET' && url === '/api/events') {
    try {
      const events = listEvents(DATA_FILE);
      sendJson(res, 200, events);
    } catch (err) {
      sendJson(res, 500, { error: err.message });
    }
    return;
  }

  // POST /api/events — add event
  if (method === 'POST' && url === '/api/events') {
    try {
      const body = await readBody(req);
      const event = addEvent(DATA_FILE, body);
      sendJson(res, 201, event);
    } catch (err) {
      sendJson(res, 400, { error: err.message });
    }
    return;
  }

  // DELETE /api/events/:name — delete event
  if (method === 'DELETE' && url.startsWith('/api/events/')) {
    const name = decodeURIComponent(url.slice('/api/events/'.length));
    try {
      const deleted = deleteEvent(DATA_FILE, name);
      if (deleted) {
        sendJson(res, 200, { message: `Event "${name}" deleted.` });
      } else {
        sendJson(res, 404, { error: `Event "${name}" not found.` });
      }
    } catch (err) {
      sendJson(res, 400, { error: err.message });
    }
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`Campus Event Manager running at http://localhost:${PORT}`);
});
