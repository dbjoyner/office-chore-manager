const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { JWT_SECRET, JWT_EXPIRY } = require('../config');
const store = require('./fileStore');

const COLLECTION = 'users';

// Predefined colors for team members
const COLORS = ['#0078D4', '#E74856', '#00CC6A', '#FF8C00', '#7B68EE', '#00B7C3', '#EA005E', '#8764B8'];

async function signup({ email, displayName, password }) {
  const existing = await store.findOne(COLLECTION, u => u.email === email);
  if (existing) {
    throw new Error('Email already registered');
  }

  const users = await store.read(COLLECTION);
  const role = users.length === 0 ? 'admin' : 'member';
  const color = COLORS[users.length % COLORS.length];

  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: uuidv4(),
    email,
    displayName,
    passwordHash,
    role,
    color,
    createdAt: new Date().toISOString(),
  };

  await store.insert(COLLECTION, user);
  const token = generateToken(user);
  return { user: sanitize(user), token };
}

async function login({ email, password }) {
  const user = await store.findOne(COLLECTION, u => u.email === email);
  if (!user) throw new Error('Invalid credentials');

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error('Invalid credentials');

  const token = generateToken(user);
  return { user: sanitize(user), token };
}

function generateToken(user) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

function sanitize(user) {
  const { passwordHash, ...safe } = user;
  return safe;
}

async function getById(id) {
  const user = await store.findById(COLLECTION, id);
  return user ? sanitize(user) : null;
}

async function getAllUsers() {
  const users = await store.read(COLLECTION);
  return users.map(sanitize);
}

async function removeUser(id) {
  return store.remove(COLLECTION, id);
}

module.exports = { signup, login, getById, getAllUsers, removeUser, sanitize };
