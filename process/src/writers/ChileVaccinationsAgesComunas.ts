
import Enumerable from 'linq';
import { DateTime } from 'luxon';
import Bluebird from 'bluebird';
import cloneDeep from 'lodash.clonedeep';

import DeisClient from '../deis/DeisClient';
import DeisResults from '../deis/DeisResults';
import { Context, DeisResult, Row } from '../Types';
import Logger from '../util/Logger';
import joinCsv from '../util/csv/join';
import readCsv from '../util/csv/read';
import writeCsv from '../util/csv/write';
import { sleep } from '../util/sleep';

interface Temp
{
	group: string;
	first: number;
	second: number;
}

interface Status
{
	done: number;
}

const TIME_ZONE = 'America/Santiago';
const TODAY = DateTime.utc().setZone(TIME_ZONE);
const TODAY_ISO = TODAY.toISODate() as string;
const FILE_NAME = 'chile-vaccination-ages-comunas.csv';
const CONCURRENCY_OPTIONS = { concurrency: 5 };

const logger = Logger.get('ChileVaccinationsAgesComunas');

export default class ChileVaccinationsAgesComunas
{
	public static getRequiredPayloads(): string[]
	{
		return ['ages-comunas'];
	}

	public static async write(context: Context, client: DeisClient, results: DeisResults): Promise<void>
	{
		// Get payload
		const comunasResult = results.get('ages-comunas');
		const allComunas = comunasResult.stringTable.valueList;
		const comunas = context.test ?
			allComunas.slice(0, 10) :
			allComunas;
		const payload = JSON.parse(client.getPayload('ages-comuna'));

		// Run with concurrency
		const status: Status = { done: 0 };
		const comunasPromise = Bluebird.map(
			comunas,
			(comuna: string) => this.getComuna(client, comuna, payload, status),
			CONCURRENCY_OPTIONS);

		// Wait for requests
		while (!comunasPromise.isFulfilled())
		{
			const done = status.done;
			const total = comunas.length;
			logger.info(`Waiting for requests: ${done} / ${total}`);
			await sleep(1_000);
		}
		const allRows = await comunasPromise;
		const rows = allRows.flatMap((r: Row[]) => r);

		// Join with previous
		const previous = readCsv(FILE_NAME);
		const joined = joinCsv(previous, rows, ['Comuna', 'Age', 'Dose']);
		writeCsv(joined, FILE_NAME);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private static async getComuna(client: DeisClient, comuna: string, originalPayload: any, status: Status): Promise<Row[]>
	{
		try
		{
			logger.debug(`Querying ${comuna}...`);
			const payload = cloneDeep(originalPayload);
			const queryComuna = comuna.replace(/'/g, '\'\'');
			const firstExpression = payload.sasReportState.data.queryRequests[0].expressions[0];
			const queryValue = `eq(\${bi7487},'${queryComuna}')`;
			firstExpression.containedValue = queryValue;
			const payloadString = JSON.stringify(payload);
			const result = await client.queryPayload(payloadString);
			const groupNames = this.getGroupNames(result);
			return this.getRows(
				comuna,
				groupNames,
				result);
		}
		finally
		{
			status.done++;
		}
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
