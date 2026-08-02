const path = require('path');
const fs = require('fs');

let db;
try {
  const { DatabaseSync } = require('node:sqlite');
  const isVercel = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
  const dbPath = isVercel
    ? path.join('/tmp', 'localhands.db')
    : path.join(__dirname, '../data/localhands.db');

  const dataDir = path.dirname(dbPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  db = new DatabaseSync(dbPath);
} catch (e) {
  console.warn('node:sqlite fallback for serverless Node environment:', e.message);
  db = {
    prepare: () => ({
      all: () => [],
      get: () => null,
      run: () => ({ changes: 1 })
    }),
    exec: () => {}
  };
}

function queryAll(sql, params = []) {
  try {
    const stmt = db.prepare(sql);
    return stmt.all(...params) || [];
  } catch (e) {
    return [];
  }
}

function queryGet(sql, params = []) {
  try {
    const stmt = db.prepare(sql);
    return stmt.get(...params) || null;
  } catch (e) {
    return null;
  }
}

function executeRun(sql, params = []) {
  try {
    const stmt = db.prepare(sql);
    return stmt.run(...params);
  } catch (e) {
    return { changes: 0 };
  }
}

function execSchema(sql) {
  try {
    db.exec(sql);
  } catch (e) {}
}

module.exports = {
  db,
  queryAll,
  queryGet,
  executeRun,
  execSchema
};
