const { v4: uuidv4 } = require('uuid');
const store = require('./fileStore');
const { expandRecurrence } = require('./recurrenceService');

const COLLECTION = 'chores';

async function getChores(from, to) {
  const chores = await store.read(COLLECTION);
  const expanded = chores.flatMap(chore => expandRecurrence(chore, from, to));
  return expanded;
}

async function getChoreById(id) {
  return store.findById(COLLECTION, id);
}

async function createChore(data, userId) {
  const chore = {
    id: uuidv4(),
    title: data.title,
    description: data.description || '',
    assigneeId: data.assigneeId || null,
    date: data.date,
    startTime: data.startTime || null,
    endTime: data.endTime || null,
    allDay: data.allDay !== false,
    recurrence: data.recurrence || null,
    recurrenceEndDate: data.recurrenceEndDate || null,
    createdBy: userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await store.insert(COLLECTION, chore);
  return chore;
}

async function updateChore(id, data) {
  const allowed = ['title', 'description', 'assigneeId', 'date', 'startTime', 'endTime', 'allDay', 'recurrence', 'recurrenceEndDate'];
  const updates = {};
  for (const key of allowed) {
    if (data[key] !== undefined) updates[key] = data[key];
  }
  return store.update(COLLECTION, id, updates);
}

async function deleteChore(id) {
  return store.remove(COLLECTION, id);
}

async function moveChore(id, newDate) {
  return store.update(COLLECTION, id, { date: newDate });
}

async function assignChore(id, assigneeId) {
  return store.update(COLLECTION, id, { assigneeId });
}

module.exports = { getChores, getChoreById, createChore, updateChore, deleteChore, moveChore, assignChore };
