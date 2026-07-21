// Always construct dates from "YYYY-MM[-DD]" strings via Date.UTC + a "UTC" timeZone option,
// never bare `new Date(isoDateString)` — the latter is subject to local-timezone shifts that
// can render a date like "2025-06-01" as May in timezones behind UTC.

export function formatMonthYear(isoDate: string): string {
	const [year, month] = isoDate.split('-').map(Number);
	return new Date(Date.UTC(year, month - 1)).toLocaleDateString('en-US', {
		month: 'short',
		year: 'numeric',
		timeZone: 'UTC'
	});
}

/** Whole days from now until the given ISO date (negative if it's in the past). */
export function daysUntil(isoDate: string): number {
	const [year, month, day] = isoDate.split('-').map(Number);
	const target = Date.UTC(year, month - 1, day || 1);
	return Math.floor((target - Date.now()) / (1000 * 60 * 60 * 24));
}
