
import Enumerable from 'linq';
import { DateTime } from 'luxon';
import DeisClient from '../deis/DeisClient';
import DeisResults from '../deis/DeisResults';

import { DeisResult, Row } from '../Types';
import Logger from '../util/Logger';
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
const FILE_NAME = 'chile-vaccination-ages-comunas.csv';

const logger = Logger.get('ChileVaccinationsAgesComunas');

export default class ChileVaccinationsAgesComunas
{
	public static getRequiredPayloads(): string[]
	{
		return ['ages-comunas'];
	}

	public static async write(client: DeisClient, results: DeisResults): Promise<void>
	{
		// Get
		const comunasResult = results.get('ages-comunas');
		const comunas = comunasResult.stringTable.valueList;
		const payload = JSON.parse(client.getPayload('ages-comuna'));
		const firstExpression = payload.sasReportState.data.queryRequests[0].expressions[0];
		const rows: Row[] = [];
		for (const comuna of comunas)
		{
			logger.debug(`Querying ${comuna}...`);
			const queryComuna = comuna.replace('\'', '\'\'');
			const queryValue = `eq(\${bi7487},'${queryComuna}')`;
			firstExpression.containedValue = queryValue;
			const payloadString = JSON.stringify(payload);
			const result = await client.queryPayload(payloadString);
			const groupNames = this.getGroupNames(result);
			rows.push(...this.getRows(
				comuna,
				groupNames,
				result));
		}

		// Join with previous
		const previous = readCsv(FILE_NAME);
		const joined = joinCsv(previous, rows, ['Comuna', 'Age', 'Dose']);
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

	private static getRows(comuna: string, groupNames: Map<number, string>, result: DeisResult): Row[]
	{
		const groupIndexes = Enumerable.from(result.data.valueList[0]);
		const firstDoses = Enumerable.from(result.data.valueList[2]);
		const secondDoses = Enumerable.from(result.data.valueList[3]);

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
						Comuna: comuna,
						Age: x2.group,
						Dose: 'First',
						[TODAY_ISO]: x2.first
					},
					{
						Comuna: comuna,
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
