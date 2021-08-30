export default (days: number, date = new Date()) => {
  const dateTimestamp = date.getTime();

  const daysInMs = days * 24 * 60 * 60 * 1000;

  return new Date(dateTimestamp + daysInMs);
};
