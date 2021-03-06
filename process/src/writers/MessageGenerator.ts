
import fs from 'fs';
import path from 'path';

import formatNumber from 'format-number';
import Enumerable from 'linq';

import { Context, DeisResult } from '../Types';
import DeisDateConverter from '../deis/DeisDateConverter';
import DeisResults from '../deis/DeisResults';
import DeisClient from '../deis/DeisClient';

const TOTAL_POPULATION = 15_000_000;
const INTEGER_FORMAT = formatNumber({ integerSeparator: '.' });
const PERCENTAGE_FORMAT = formatNumber({ decimal: ',', truncate: 2 });
const FILE_PATH = path.join(__dirname, '../../../output/status.txt');

export default class MessageGenerator
{
	public static getRequiredPayloads(): string[]
	{
		return ['doses'];
	}

	public static write(_context: Context, _client: DeisClient, results: DeisResults): void
	{
		// Get the right result
		const result = results.get('doses');

		// Add
		const total1 = this.getTotal(result, 0);
		const total2 = this.getTotal(result, 1);

		// Write
		const dateNumber = Enumerable
			.from(result.data.valueList[0])
			.max();
		const date = DeisDateConverter.convert(dateNumber);
		const firstRatio = total1 / TOTAL_POPULATION * 100;
		const secondRatio = total2 / TOTAL_POPULATION * 100;
		const message = `Vacunación en Chile hasta el ${date.toFormat('dd/MM/yyyy')}:\n\n` +
			`Primera dosis: ${INTEGER_FORMAT(total1)} personas (${PERCENTAGE_FORMAT(firstRatio)}%)\n` +
			`Segunda dosis: ${INTEGER_FORMAT(total2)} personas (${PERCENTAGE_FORMAT(secondRatio)}%)\n\n` +
			'(Calculado en base a un universo a vacunar de 15 millones de personas)\n\n' +
			'#Covid19Chile';
		console.log(message);
		fs.writeFileSync(FILE_PATH, message);
	}

	private static getTotal(result: DeisResult, dose: number): number
	{
		const doses = result.data.valueList[1];
		const values = result.data.valueList[2];
		return Enumerable
			.from(values)
			.select((value, index) => ({ value, index }))
			.where(x => doses[x.index] === dose)
			.select(x => x.value)
			.sum();
	}
}
