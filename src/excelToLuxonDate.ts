
import { DateTime } from 'luxon';

const DATE_ZERO = DateTime.fromISO('1960-01-01');

export default (n: number): DateTime => {
	return DATE_ZERO.plus({ days: n });
};
