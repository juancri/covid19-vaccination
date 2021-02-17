
import Enumerable from 'linq';

import { DeisResult, DeisResults, Row } from '../Types';
import DeisDateConverter from '../deis/DeisDateConverter';
import writeCsv from '../util/csv/write';

interface DoseData
{
	excelDate: number,
	dose: number,
	value: number
}

const ZERO_ENUMERABLE = Enumerable.from([0]);

export default class ChileVaccinationsType
{
	public static write(results: DeisResults): void
	{
		const dosesResult = results['doses'];
		const dates = Enumerable.from(dosesResult.data.valueList[0]);
		const minDate = dates.min();
		const maxDate = dates.max();
		const rows = [
			...ChileVaccinationsType.getRows('Total', dosesResult, minDate, maxDate),
			...ChileVaccinationsType.getRows('Pfizer', results['pfizer'], minDate, maxDate),
			...ChileVaccinationsType.getRows('Sinovac', results['sinovac'], minDate, maxDate),
		];

		writeCsv(rows, 'chile-vaccination-type.csv');
	}

	private static getRows(name: string, result: DeisResult,
		minDate: number, maxDate: number): Row[]
	{
		const data: DoseData[] = ChileVaccinationsType.getDoseData(result);
		const first: Row = { Type: name, Dose: 'First' };
		const second: Row = { Type: name, Dose: 'Second' };
		for (let dateNumber = minDate; dateNumber <= maxDate; dateNumber++)
		{
			const date = DeisDateConverter.convert(dateNumber);
			const isoDate = date.toISODate();
			first[isoDate] = ChileVaccinationsType.getValue(data, dateNumber, 0);
			second[isoDate] = ChileVaccinationsType.getValue(data, dateNumber, 1);
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
		return Enumerable
			.from(data)
			.where(x => x.excelDate <= excelDate)
			.where(x => x.dose === dose)
			.select(x => x.value)
			.concat(ZERO_ENUMERABLE)
			.sum();
	}
}
