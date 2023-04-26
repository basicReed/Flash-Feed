export function convertToLocalTime(serverTime) {
  // Get the user's current timezone offset in minutes
  const userTimezoneOffset = new Date().getTimezoneOffset();

  // Convert the server time to UTC
  const serverTimeUTC = new Date(serverTime).getTime();

  // Apply the user's timezone offset to the server time
  const localTimeUTC = serverTimeUTC - userTimezoneOffset * 60000;

  // Convert the UTC time to a local date object
  const localDate = new Date(localTimeUTC);

  // Return the local date as a string in a desired format
  return localDate.toLocaleString();
}
