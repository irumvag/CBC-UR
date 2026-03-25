#!/usr/bin/env node

const path = require('path');
const { addEvent, listEvents, deleteEvent } = require('./src/events');

const DATA_FILE = path.join(__dirname, 'events.json');

function parseArgs(argv) {
  const args = argv.slice(2);
  const command = args[0];
  const flags = {};
  for (let i = 1; i < args.length; i++) {
    if (args[i].startsWith('--') && i + 1 < args.length && !args[i + 1].startsWith('--')) {
      flags[args[i].slice(2)] = args[i + 1];
      i++;
    }
  }
  return { command, flags };
}

function printHelp() {
  console.log(`
Campus Event CLI — Manage your campus events

Usage:
  node index.js <command> [options]

Commands:
  add       Add a new event
    --name         Event name (required)
    --date         Event date in YYYY-MM-DD format (required)
    --location     Event location (required)
    --description  Event description (optional)

  list      List upcoming events (today and future)

  delete    Delete an event by name
    --name         Name of the event to delete (required)

  help      Show this help message

Examples:
  node index.js add --name "Hackathon 2026" --date 2026-05-01 --location "CS Building" --description "24-hour coding event"
  node index.js list
  node index.js delete --name "Hackathon 2026"
`);
}

function main() {
  const { command, flags } = parseArgs(process.argv);

  switch (command) {
    case 'add': {
      try {
        const event = addEvent(DATA_FILE, {
          name: flags.name || '',
          date: flags.date || '',
          location: flags.location || '',
          description: flags.description || ''
        });
        console.log(`Event added successfully:`);
        console.log(`  Name:        ${event.name}`);
        console.log(`  Date:        ${event.date}`);
        console.log(`  Location:    ${event.location}`);
        if (event.description) console.log(`  Description: ${event.description}`);
      } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
      }
      break;
    }

    case 'list': {
      const events = listEvents(DATA_FILE);
      if (events.length === 0) {
        console.log('No upcoming events found.');
      } else {
        console.log(`Upcoming Events (${events.length}):\n`);
        events.forEach((e, i) => {
          console.log(`${i + 1}. ${e.name}`);
          console.log(`   Date:     ${e.date}`);
          console.log(`   Location: ${e.location}`);
          if (e.description) console.log(`   Details:  ${e.description}`);
          console.log();
        });
      }
      break;
    }

    case 'delete': {
      try {
        const deleted = deleteEvent(DATA_FILE, flags.name || '');
        if (deleted) {
          console.log(`Event "${flags.name}" deleted successfully.`);
        } else {
          console.log(`No event found with name "${flags.name}".`);
          process.exit(1);
        }
      } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
      }
      break;
    }

    case 'help':
    case undefined:
      printHelp();
      break;

    default:
      console.error(`Unknown command: "${command}". Run "node index.js help" for usage.`);
      process.exit(1);
  }
}

main();
