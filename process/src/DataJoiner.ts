
import * as Enumerable from 'linq';
import { DateTime } from 'luxon';

import { Row } from './Types';

export default class DataJoiner
{
	public static add(rows: Row[], values: number[][]): void
	{
		const date = DateTime.local().toISODate();
		rows.forEach((row, index) => {
			const previousTotal = DataJoiner.getPreviousTotal(row);
			const dailyValue = DataJoiner.getDailyValue(values, index);
			const dailyTotal = previousTotal + dailyValue;
			row[date] = dailyTotal;
		});
	}

	private static getPreviousTotal(row: Row): number
	{
		const keys = Object.keys(row);
		const numbers = Enumerable
			.from(keys)
			.select(key => row[key])
			.where(value => typeof value === 'number')
			.toArray() as number[];
		if (numbers.length === 0)
			return 0;
		return Enumerable
			.from(numbers)
			.sum();
	}

	private static getDailyValue(values: number[][], index: number): number
	{
		if (index < 2)
			return DataJoiner.getDailyTotal(values[index]);
		const groupIndex = index % 2;
		const valueIndex = Math.floor((index - 2) / 2);
		return values[groupIndex][valueIndex];
	}

	private static getDailyTotal(values: number[]): number {
		return Enumerable
			.from(values)
			.sum();
	}
}
