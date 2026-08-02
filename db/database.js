const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const isVercel = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
const dbPath = isVercel
  ? path.join('/tmp', 'localhands.db')
  : path.join(__dirname, '../data/localhands.db');

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
