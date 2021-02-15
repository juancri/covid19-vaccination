
import formatNumber from 'format-number';
import * as Enumerable from 'linq';

import { DeisResult, DeisResults } from '../Types';
import DeisDateConverter from '../deis/DeisDateConverter';

const TOTAL_POPULATION = 15_000_000;
const INTEGER_FORMAT = formatNumber({ integerSeparator: '.' });
const PERCENTAGE_FORMAT = formatNumber({ decimal: ',', truncate: 2 });

class MessageGenerator
{
	public static generate(results: DeisResults): string
	{
		// Get the right result
		const result = results['doses'];

		// Add
		const total1 = MessageGenerator.getTotal(result, 0);
		const total2 = MessageGenerator.getTotal(result, 1);

		// Write
		const dateNumber = Enumerable
			.from(result.data.valueList[0])
			.max();
		const date = DeisDateConverter.convert(dateNumber);
		const firstRatio = total1 / TOTAL_POPULATION * 100;
		const secondRatio = total2 / TOTAL_POPULATION * 100;
		return `Vacunación en Chile hasta el ${date.toFormat('dd/MM/yyyy')}:\n\n` +
			`Primera dosis: ${INTEGER_FORMAT(total1)} personas (${PERCENTAGE_FORMAT(firstRatio)}%)\n` +
			`Segunda dosis: ${INTEGER_FORMAT(total2)} personas (${PERCENTAGE_FORMAT(secondRatio)}%)\n\n` +
			'(Calculado en base a un universo a vacunar de 15 millones de personas)\n\n' +
			'#Covid19Chile';
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

export default MessageGenerator.generate;
