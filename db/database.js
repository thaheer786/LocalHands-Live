const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../data/localhands.db');
const dataDir = path.dirname(dbPath);

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new DatabaseSync(dbPath);

// Helper functions for DatabaseSync
function queryAll(sql, params = []) {
  const stmt = db.prepare(sql);
  return stmt.all(...params);
}

function queryGet(sql, params = []) {
  const stmt = db.prepare(sql);
  return stmt.get(...params);
}

function executeRun(sql, params = []) {
  const stmt = db.prepare(sql);
  return stmt.run(...params);
}

function execSchema(sql) {
  db.exec(sql);
}

module.exports = {
  db,
  queryAll,
  queryGet,
  executeRun,
  execSchema
};
