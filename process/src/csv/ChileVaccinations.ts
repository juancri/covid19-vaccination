
import * as Enumerable from 'linq';

import { DeisResult, DeisResults, Row } from '../Types';
import DeisDateConverter from '../deis/DeisDateConverter';
import writeCsv from '../util/writeCsv';

interface DoseData
{
	excelDate: number,
	dose: number,
	value: number
}

const REGION_RESULTS: Map<string, string> = new Map([
	['doses-arica', 'Arica y Parinacota'],
	['doses-tarapaca', 'Tarapacá'],
	['doses-antofagasta', 'Antofagasta'],
	['doses-atacama', 'Atacama'],
	['doses-coquimbo', 'Coquimbo'],
	['doses-valparaiso', 'Valparaíso'],
	['doses-metropolitana', 'Metropolitana'],
	['doses-ohiggins', 'O’Higgins'],
	['doses-maule', 'Maule'],
	['doses-nuble', 'Ñuble'],
	['doses-biobio', 'Biobío'],
	['doses-araucania', 'Araucanía'],
	['doses-losrios', 'Los Ríos'],
	['doses-loslagos', 'Los Lagos'],
	['doses-aysen', 'Aysén'],
	['doses-magallanes', 'Magallanes'],
]);

export default class ChileVaccinations
{
	public static write(results: DeisResults): void
	{
		// Get the right results
		const totalResult = results['doses'];

		// Get date range
		const dates = Enumerable.from(totalResult.data.valueList[0]);
		const minDate = dates.min();
		const maxDate = dates.max();

		// Create rows
		const rows = [
			...ChileVaccinations.getRows('Total', totalResult, minDate, maxDate),
			...Array
				.from(REGION_RESULTS.entries())
				.flatMap(entry => ChileVaccinations.getRows(
					entry[1], results[entry[0]], minDate, maxDate))
		];

		// Write
		writeCsv(rows, 'chile-vaccination.csv');
	}

	private static getRows(name: string, result: DeisResult,
		minDate: number, maxDate: number): Row[]
	{
		const data: DoseData[] = ChileVaccinations.getDoseData(result);
		const first: Row = { Region: name, Dose: 'First' };
		const second: Row = { Region: name, Dose: 'Second' };
		for (let dateNumber = minDate; dateNumber <= maxDate; dateNumber++)
		{
			const date = DeisDateConverter.convert(dateNumber);
			const isoDate = date.toISODate();
			first[isoDate] = ChileVaccinations.getValue(data, dateNumber, 0);
			second[isoDate] = ChileVaccinations.getValue(data, dateNumber, 1);
		}

		return [first, second];
	}

	private static getDoseData(result: DeisResult): DoseData[]
	{
		const dates = Enumerable.from(result.data.valueList[0]);
		const doses = Enumerable.from(result.data.valueList[1]);
		const values = Enumerable.from(result.data.valueList[2]);
		return dates
			.zip(doses, values,
				(excelDate: number, dose: number, value: number) =>
					({ excelDate, dose, value }))
			.toArray() as DoseData[];
	}

	private static getValue(data: DoseData[], excelDate: number, dose: number): number
	{
		const found = Enumerable
			.from(data)
			.where(x => x.excelDate <= excelDate)
			.where(x => x.dose === dose)
			.select(x => x.value)
			.toArray();
		if (!found.length)
			return 0;
		return Enumerable
			.from(found)
			.sum();
	}
}