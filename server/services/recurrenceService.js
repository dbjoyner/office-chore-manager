const { addDays, addWeeks, addMonths, parseISO, isBefore, isAfter, isEqual, startOfDay } = require('date-fns');

/**
 * Expand a chore with a recurrence pattern into individual instances
 * for the given date range [rangeStart, rangeEnd].
 */
function expandRecurrence(chore, rangeStart, rangeEnd) {
  if (!chore.recurrence) {
    return [chore];
  }

  const instances = [];
  const choreDate = startOfDay(parseISO(chore.date));
  const start = startOfDay(parseISO(rangeStart));
  const end = startOfDay(parseISO(rangeEnd));
  const recEnd = chore.recurrenceEndDate
    ? startOfDay(parseISO(chore.recurrenceEndDate))
    : null;

  const advanceFn = getAdvanceFn(chore.recurrence);
  if (!advanceFn) return [chore];

  let current = choreDate;
  let index = 0;

  while (!isAfter(current, end)) {
    if (recEnd && isAfter(current, recEnd)) break;

    if (!isBefore(current, start) || isEqual(current, start)) {
      instances.push({
        ...chore,
        id: index === 0 ? chore.id : `${chore.id}_r${index}`,
        date: current.toISOString().split('T')[0],
        recurrenceIndex: index,
        parentId: chore.id,
      });
    }

    index++;
    current = advanceFn(choreDate, index);
  }

  return instances;
}

function getAdvanceFn(recurrence) {
  switch (recurrence) {
    case 'daily':
      return (base, n) => addDays(base, n);
    case 'weekly':
      return (base, n) => addWeeks(base, n);
    case 'biweekly':
      return (base, n) => addWeeks(base, n * 2);
    case 'monthly':
      return (base, n) => addMonths(base, n);
    default:
      return null;
  }
}

module.exports = { expandRecurrence };
