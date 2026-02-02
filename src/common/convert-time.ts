import type { HomeAssistant } from '@hass/types';
import { localize } from '@localize/localize';

/**
 * Converts a number of seconds into a string formatted as "HH:MM:SS".
 *
 * @param totalSeconds - The total number of seconds to convert.
 * @returns A string representing the time in "HH:MM:SS" format, with each unit zero-padded to two digits.
 *
 * @example
 * ```typescript
 * formatSecondsToHHMMSS(3661); // Returns "01:01:01"
 * ```
 */
export const formatSecondsToHHMMSS = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const paddedHours = String(hours).padStart(2, '0');
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(seconds).padStart(2, '0');

  return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
};

/**
 * Parses a time string or number into seconds.
 * Supports various formats:
 * - Numbers: treated as seconds
 * - Strings with units: "10s", "5m", "1h", "4h:20m:69s"
 * - Plain number strings: "60"
 *
 * @param input - The time value to parse
 * @returns The total number of seconds
 *
 * @example
 * ```typescript
 * parseTimeToSeconds(60); // Returns 60
 * parseTimeToSeconds("60"); // Returns 60
 * parseTimeToSeconds("10s"); // Returns 10
 * parseTimeToSeconds("5m"); // Returns 300
 * parseTimeToSeconds("1h"); // Returns 3600
 * parseTimeToSeconds("4h:20m:69s"); // Returns 15669
 * ```
 */
export const parseTimeToSeconds = (input: number | string): number => {
  if (typeof input === 'number') {
    return input;
  }

  const str = input.toString().trim();

  // Check if it's a plain number string
  if (/^\d+$/.test(str)) {
    return Number.parseInt(str, 10);
  }

  // Handle complex format like "4h:20m:69s"
  if (str.includes(':')) {
    const parts = str.split(':');
    let totalSeconds = 0;

    for (const part of parts) {
      const match = /^(\d+)([hms]?)$/.exec(part);
      if (match?.[1]) {
        const value = Number.parseInt(match[1], 10);
        const unit = match[2] || 's'; // default to seconds if no unit

        switch (unit) {
          case 'h':
            totalSeconds += value * 3600;
            break;
          case 'm':
            totalSeconds += value * 60;
            break;
          case 's':
            totalSeconds += value;
            break;
        }
      }
    }
    return totalSeconds;
  }

  // Handle simple format like "10s", "5m", "1h"
  const match = /^(\d+)([hms])$/.exec(str);
  if (match?.[1] && match?.[2]) {
    const value = Number.parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 'h':
        return value * 3600;
      case 'm':
        return value * 60;
      case 's':
        return value;
    }
  }

  // If we get here, the input is invalid
  return 0;
};

/**
 * Formats seconds into a human-readable string.
 * Uses the most appropriate unit and shows nice rounded values when possible.
 *
 * @param seconds - The number of seconds to format
 * @param hass - The Home Assistant instance for translations
 * @returns A formatted string like "1 minute", "5 minutes", "1 hour", etc.
 *
 * @example
 * ```typescript
 * formatSecondsToHuman(60, hass); // Returns "1 minute"
 * formatSecondsToHuman(300, hass); // Returns "5 minutes"
 * formatSecondsToHuman(3600, hass); // Returns "1 hour"
 * formatSecondsToHuman(90, hass); // Returns "90 seconds"
 * ```
 */
export const formatSecondsToHuman = (
  seconds: number,
  hass: HomeAssistant,
): string => {
  if (seconds === 0) return `0 ${localize(hass, 'card.units.seconds')}`;

  // Hours - only if it divides evenly
  if (seconds >= 3600 && seconds % 3600 === 0) {
    const hours = seconds / 3600;
    const unit =
      hours === 1
        ? localize(hass, 'card.units.hour')
        : localize(hass, 'card.units.hours');
    return hours === 1 ? `1 ${unit}` : `${hours} ${unit}`;
  }

  // Minutes - only if it divides evenly AND less than an hour, OR if it divides evenly and is a reasonable number of minutes
  if (seconds >= 60 && seconds % 60 === 0 && seconds < 3600) {
    const minutes = seconds / 60;
    const unit =
      minutes === 1
        ? localize(hass, 'card.units.minute')
        : localize(hass, 'card.units.minutes');
    return minutes === 1 ? `1 ${unit}` : `${minutes} ${unit}`;
  }

  // Seconds - for everything else (including times that are many minutes but not whole hours)
  const unit =
    seconds === 1
      ? localize(hass, 'card.units.second')
      : localize(hass, 'card.units.seconds');
  return seconds === 1 ? `1 ${unit}` : `${seconds} ${unit}`;
};
