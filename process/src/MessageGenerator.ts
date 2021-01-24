
import { DateTime } from 'luxon';
import formatNumber from 'format-number';

import { Row } from './Types';

const TOTAL_POPULATION = 15_000_000;
const INTEGER_FORMAT = formatNumber({ integerSeparator: '.' });
const PERCENTAGE_FORMAT = formatNumber({ decimal: ',', truncate: 2 });

export default class MessageGenerator
{
	public static generate(rows: Row[]): string
	{
		// Add
		const row1 = rows[0];
		const row2 = rows[1];
		const total1 = MessageGenerator.getTotal(row1);
		const total2 = MessageGenerator.getTotal(row2);

		// Write
		const date = DateTime.local();
		const firstRatio = total1 / TOTAL_POPULATION * 100;
		const secondRatio = total2 / TOTAL_POPULATION * 100;
		return `Vacunación en Chile hasta el ${date.toFormat('dd/MM/yyyy')}:\n\n` +
			`Primera dosis: ${INTEGER_FORMAT(total1)} personas (${PERCENTAGE_FORMAT(firstRatio)}%)\n` +
			`Segunda dosis: ${INTEGER_FORMAT(total2)} personas (${PERCENTAGE_FORMAT(secondRatio)}%)\n\n` +
			'(Calculado en base a un universo a vacunar de 15 millones de personas)\n\n' +
			'#Covid19Chile';
	}

	private static getTotal(row: Row): number
	{
		const keys = Object.keys(row);
		const lastKey = keys[keys.length - 1];
		return row[lastKey] as number;
	}
}
