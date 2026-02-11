const { v4: uuidv4 } = require('uuid');
const store = require('./fileStore');

const COLLECTION = 'notifications';

async function createNotification({ userId, type, choreId, message }) {
  // Deduplicate: don't create if same type+choreId+userId exists and is unread
  const existing = await store.findOne(COLLECTION, n =>
    n.userId === userId && n.type === type && n.choreId === choreId && !n.read
  );
  if (existing) return existing;

  const notification = {
    id: uuidv4(),
    userId,
    type,
    choreId,
    message,
    read: false,
    createdAt: new Date().toISOString(),
  };
  await store.insert(COLLECTION, notification);
  return notification;
}

async function getUserNotifications(userId) {
  return store.findMany(COLLECTION, n => n.userId === userId);
}

async function markRead(id, userId) {
  const notif = await store.findById(COLLECTION, id);
  if (!notif || notif.userId !== userId) return null;
  return store.update(COLLECTION, id, { read: true });
}

async function markAllRead(userId) {
  const all = await store.read(COLLECTION);
  const updated = all.map(n =>
    n.userId === userId && !n.read ? { ...n, read: true, updatedAt: new Date().toISOString() } : n
  );
  await store.write(COLLECTION, updated);
  return true;
}

module.exports = { createNotification, getUserNotifications, markRead, markAllRead };
