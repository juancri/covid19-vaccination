
import Enumerable from 'linq';
import { DateTime } from 'luxon';

import { DeisResult, DeisResults, Row } from '../Types';
import joinCsv from '../util/csv/join';
import readCsv from '../util/csv/read';
import writeCsv from '../util/csv/write';

interface Temp
{
	group: string;
	first: number;
	second: number;
}

const TIME_ZONE = 'America/Santiago';
const TODAY = DateTime.utc().setZone(TIME_ZONE);
const TODAY_ISO = TODAY.toISODate();
const FILE_NAME = 'chile-vaccination-ages.csv';

export default class ChileVaccinationsAges
{
	public static getRequiredPayloads(): string[]
	{
		return ['ages'];
	}

	public static write(results: DeisResults): void
	{
		const result = results['ages'];
		const groupNames = ChileVaccinationsAges.getGroupNames(result);
		const previous = readCsv(FILE_NAME);
		const current: Row[] = ChileVaccinationsAges.getRows(groupNames, result);
		const joined = joinCsv(previous, current, ['Age', 'Dose']);

		writeCsv(joined, FILE_NAME);
	}

	private static getGroupNames(result: DeisResult): Map<number, string>
	{
		return new Map<number, string>([
			...Enumerable
				.from(result.stringTable.valueList)
				.select((name, index) => [index, name])
				.toArray() as [number, string][],
			[-100, 'Total'],
			[-1, 'Desconocido']
		]);
	}

	private static getRows(groupNames: Map<number, string>, result: DeisResult): Row[]
	{
		const groupIndexes = Enumerable.from(result.data.valueList[0]);
		const firstDoses = Enumerable.from(result.data.valueList[2]);
		const secondDoses = Enumerable.from(result.data.valueList[3]);

		return groupIndexes
			.zip(firstDoses, secondDoses,
				(groupIndex: number, first: number|string, second: number|string) => ({
					group: groupNames.get(groupIndex),
					first: ChileVaccinationsAges.convert(first),
					second: ChileVaccinationsAges.convert(second)
				}))
			.selectMany(x =>
			{
				const x2 = x as Temp;
				return [
					{
						Age: x2.group,
						Dose: 'First',
						[TODAY_ISO]: x2.first
					},
					{
						Age: x2.group,
						Dose: 'Second',
						[TODAY_ISO]: x2.second
					}
				];
			})
			.toArray() as Row[];
	}

	private static convert(input: number | string): number
	{
		return typeof input === 'number' ?
			input :
			0;
	}
}
