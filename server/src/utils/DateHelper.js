import { startOfMonth, endOfMonth, addDays } from 'date-fns';

const IST_OFFSET_MINUTES = 330; // IST = UTC +5:30

// Returns a Date at IST midnight for given year, month, day (in UTC timezone)
function getUTCDateAtISTMidnight(year, month, day = 1) {
  return new Date(Date.UTC(year, month, day, 0, 0, 0) - IST_OFFSET_MINUTES * 60 * 1000);
}

// Returns Date for start of month at IST midnight (UTC timezone)
export function getISTMonthStartDate(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth();
  return getUTCDateAtISTMidnight(year, month, 1);
}

// Returns Date for last day of month at IST midnight (UTC timezone)
export function getISTMonthEndDate(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const lastDay = new Date(year, month + 1, 0).getDate();
  return getUTCDateAtISTMidnight(year, month, lastDay);
}

// Formats a Date as 'yyyy-MM-dd' string in IST timezone
export function getBillingMonth(date = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(date);
}

// Returns the start of the month date string in IST timezone like '2025-08-01'
export function getBillingMonthStart(date = new Date()) {
  // Get start of month at local midnight (server timezone)
  const localStart = addDays(startOfMonth(date), 1);

  // Convert localStart to timestamp, subtract IST offset in ms to get UTC time for IST midnight
  const utcTimestamp = localStart.getTime() - IST_OFFSET_MINUTES * 60 * 1000;

  // Return UTC Date object matching IST midnight start of month
  return new Date(utcTimestamp);
}

// Returns 'yyyy-MM-dd' string for start of month in IST timezone
export function getMonthStartDateString(date = new Date()) {
  const start = startOfMonth(date);
  return getBillingMonth(start);
}

// Returns 'yyyy-MM-dd' string for end of month in IST timezone
export function getMonthEndDateString(date = new Date()) {
  const end = endOfMonth(date);
  return getBillingMonth(end);
}
