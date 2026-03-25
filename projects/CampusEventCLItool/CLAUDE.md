# Campus Event CLI — Claude Code Configuration

## Scope Restriction

Claude should only operate within this directory (`CampusEventCLItool/`). Do not modify files outside this project directory.

## Architecture

| File               | Role                                      |
|--------------------|-------------------------------------------|
| `index.js`         | CLI entry point, arg parsing, command router |
| `src/events.js`    | Business logic: add, list, delete, validation |
| `src/storage.js`   | JSON read/write layer (no business logic)  |
| `tests/events.test.js` | Jest unit tests for all business logic |

## Behavior Guidelines

- **No new dependencies**: Do not add packages beyond `jest`. Use only Node.js built-ins.
- **Maintain tests**: Every change to `src/` must be reflected in `tests/events.test.js`. Keep coverage at 100%.
- **filePath pattern**: All functions in `src/events.js` and `src/storage.js` accept `filePath` as their first argument. Never hardcode file paths inside `src/`.
- **Date format**: Events use `YYYY-MM-DD` exclusively. Do not introduce other date formats.
- **Error handling**: Throw descriptive `Error` objects from `src/events.js`; catch and print them in `index.js`.
- **No mocking in tests**: Tests use real temp files via `os.tmpdir()`. Do not introduce jest mocks for fs or storage.

## Running the Project

```bash
# Install dependencies
npm install

# Run tests with coverage
npm test

# Run CLI
node index.js help
node index.js add --name "Event Name" --date 2026-05-01 --location "Location"
node index.js list
node index.js delete --name "Event Name"
```

## Data Storage

Events are persisted to `events.json` in the project root. This file is created automatically on first `add` and should be added to `.gitignore` if the project is version-controlled.
