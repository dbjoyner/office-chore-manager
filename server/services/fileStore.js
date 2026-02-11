const fs = require('fs');
const path = require('path');
const lockfile = require('proper-lockfile');
const { DATA_DIR } = require('../config');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getFilePath(collection) {
  return path.join(DATA_DIR, `${collection}.json`);
}

function ensureFile(collection) {
  const filePath = getFilePath(collection);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]', 'utf8');
  }
  return filePath;
}

async function read(collection) {
  const filePath = ensureFile(collection);
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
}

async function write(collection, data) {
  const filePath = ensureFile(collection);
  let release;
  try {
    release = await lockfile.lock(filePath, { retries: { retries: 5, minTimeout: 50 } });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } finally {
    if (release) await release();
  }
}

async function findById(collection, id) {
  const items = await read(collection);
  return items.find(item => item.id === id) || null;
}

async function insert(collection, item) {
  const items = await read(collection);
  items.push(item);
  await write(collection, items);
  return item;
}

async function update(collection, id, updates) {
  const items = await read(collection);
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
  await write(collection, items);
  return items[index];
}

async function remove(collection, id) {
  const items = await read(collection);
  const filtered = items.filter(item => item.id !== id);
  if (filtered.length === items.length) return false;
  await write(collection, filtered);
  return true;
}

async function findOne(collection, predicate) {
  const items = await read(collection);
  return items.find(predicate) || null;
}

async function findMany(collection, predicate) {
  const items = await read(collection);
  return predicate ? items.filter(predicate) : items;
}

module.exports = { read, write, findById, insert, update, remove, findOne, findMany };
