import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'
import { getActiveDateFnsLocale } from './date-locale'

export type IanaTimezone = string

// For system timestamps (created_at, updated_at, joined_at, expires_at, date_joined)
export function formatDateInTz(iso: string, timezone: IanaTimezone, fmt = 'MMM d, yyyy'): string {
  return formatInTimeZone(parseISO(iso), timezone, fmt, { locale: getActiveDateFnsLocale() })
}

export function formatDatetimeInTz(
  iso: string,
  timezone: IanaTimezone,
  fmt = 'MMM d, yyyy, h:mm a',
): string {
  return formatInTimeZone(parseISO(iso), timezone, fmt, { locale: getActiveDateFnsLocale() })
}

// For business calendar dates (invoice issue_date, due_date) — no timezone conversion.
// T12:00:00 prevents the midnight-UTC-renders-as-yesterday trap in UTC-offset browsers.
export function formatCalendarDate(isoDate: string, fmt = 'MMM d, yyyy'): string {
  return format(parseISO(`${isoDate}T12:00:00`), fmt, { locale: getActiveDateFnsLocale() })
}

// For relative countdowns (e.g. invitation expiry)
export function formatRelative(iso: string): string {
  return formatDistanceToNow(parseISO(iso), { addSuffix: true, locale: getActiveDateFnsLocale() })
}
