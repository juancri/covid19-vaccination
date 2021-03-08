
import Enumerable from 'linq';
import { DateTime } from 'luxon';
import DeisClient from '../deis/DeisClient';
import DeisResults from '../deis/DeisResults';

import { Context, DeisResult, Row } from '../Types';
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
const FILE_NAME = 'chile-vaccination-groups.csv';
const DEFAULT_GROUP_NAMES: [number, string][] = [
	[-100, 'Total'],
	[-1, 'Desconocido'],
];

export default class ChileVaccinationsGroups
{
	public static isEnabled(): boolean
	{
		return true;
	}

	public static getRequiredPayloads(): string[]
	{
		return ['groups'];
	}

	public static write(_context: Context, _client: DeisClient, results: DeisResults): void
	{
		const result = results.get('groups');
		const groupNames = this.getGroupNames(result);
		const previous = readCsv(FILE_NAME);
		const current: Row[] = this.getRows(groupNames, result);
		const joined = joinCsv(previous, current, ['Group', 'Dose']);

		writeCsv(joined, FILE_NAME);
	}

	private static getGroupNames(result: DeisResult): Map<number, string>
	{
		return new Map<number, string>([
			...Enumerable
				.from(result.stringTable.valueList)
				.select((name, index) => [index, name])
				.toArray() as [number, string][],
			...DEFAULT_GROUP_NAMES
		]);
	}

	private static getRows(groupNames: Map<number, string>, result: DeisResult): Row[]
	{
		const groupIndexes = Enumerable.from(result.data.valueList[1]);
		const firstDoses = Enumerable.from(result.data.valueList[3]);
		const secondDoses = Enumerable.from(result.data.valueList[4]);

		return groupIndexes
			.zip(firstDoses, secondDoses,
				(groupIndex: number, first: number|string, second: number|string) => ({
					group: groupNames.get(groupIndex),
					first: this.convert(first),
					second: this.convert(second)
				}))
			.selectMany(x =>
			{
				const x2 = x as Temp;
				return [
					{
						Group: x2.group,
						Dose: 'First',
						[TODAY_ISO]: x2.first
					},
					{
						Group: x2.group,
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
