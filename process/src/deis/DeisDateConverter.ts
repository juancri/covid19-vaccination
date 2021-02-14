
import { DateTime } from 'luxon';

const BASE_DATE = DateTime.fromISO('1960-01-01', { zone: 'utc' });

export default class DeisDateConverter
{
	public static convert(dateNumber: number): DateTime
	{
		return BASE_DATE.plus({ days: dateNumber });
	}
}
