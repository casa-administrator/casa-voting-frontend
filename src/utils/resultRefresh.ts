export const RESULTS_REFRESH_INTERVAL =
  2 * 60 * 1000;

/**
 * Returns milliseconds until the next
 * globally aligned refresh boundary.
 *
 * Example:
 * 14:01:20 -> next refresh 14:02:00
 * 14:03:45 -> next refresh 14:04:00
 */
export function getNextResultsRefreshDelay() {
  const now = Date.now();

  const remainder =
    now % RESULTS_REFRESH_INTERVAL;

  return (
    RESULTS_REFRESH_INTERVAL -
    remainder
  );
}