
import Bluebird from 'bluebird';
import Enumerable from 'linq';
import cloneDeep from 'lodash.clonedeep';

import DeisClient from '../deis/DeisClient';
import DeisResults from '../deis/DeisResults';
import { Context, Row, ValueList } from '../Types';
import Logger from '../util/Logger';
import writeCsv from '../util/csv/write';
import DeisDateConverter from '../deis/DeisDateConverter';
import { sleep } from '../util/sleep';

interface DoseData
{
	excelDate: number,
	dose: number,
	value: number
}

interface Status
{
	done: number;
}

const logger = Logger.get('ChileVaccinationsComunas');

const ZERO_ENUMERABLE = Enumerable.from([0]);
const CONCURRENCY_OPTIONS = { concurrency: 5 };

export default class ChileVaccinationsComunas
{
	public static getRequiredPayloads(): string[]
	{
		return ['doses-comunas'];
	}

	public static async write(context: Context, client: DeisClient, results: DeisResults): Promise<void>
	{
		const comunasResult = results.get('doses-comunas');
		const allComunas = comunasResult.stringTable.valueList;
		const comunas = context.test ?
			allComunas.slice(0, 10) :
			allComunas;
		const payload = JSON.parse(client.getPayload('doses-comuna'));

		// Run with concurrency
		const data = new Map<string, ValueList[]>();
		const status: Status = { done: 0 };
		const comunasPromise = Bluebird.map(
			comunas,
			(comuna: string) => this.getComuna(client, comuna, payload, status, data),
			CONCURRENCY_OPTIONS);

		// Wait for requests
		while (!comunasPromise.isFulfilled())
		{
			const done = status.done;
			const total = comunas.length;
			logger.info(`Waiting for requests: ${done} / ${total}`);
			await sleep(1_000);
		}

		const dates = Enumerable
			.from(Array.from(data.values()) as ValueList[][])
			.selectMany(v => v[0]);
		const minDate = dates.min();
		const maxDate = dates.max();
		const rows = Array
			.from(comunas)
			.flatMap(comuna => this.getRows(
				comuna, data.get(comuna) ?? [], minDate, maxDate));

		writeCsv(rows, 'chile-vaccination-comunas.csv');
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private static async getComuna(client: DeisClient, comuna: string, originalPayload: any,
		status: Status, data: Map<string, ValueList[]>): Promise<void>
	{
		try
		{
			logger.debug(`Querying ${comuna}...`);
			const payload = cloneDeep(originalPayload);
			const firstExpression = payload.sasReportState.data.queryRequests[0].expressions[0];
			const queryComuna = comuna.replace(/'/g, '\'\'');
			const queryValue = `eq(\${bi3905},'${queryComuna}')`;
			firstExpression.containedValue = queryValue;
			const payloadString = JSON.stringify(payload);
			const result = await client.queryPayload(payloadString);
			data.set(comuna, result.data.valueList);
		}
		finally
		{
			status.done++;
		}
	}

	private static getRows(name: string, valueList: ValueList[],
		minDate: number, maxDate: number): Row[]
	{
		const data: DoseData[] = this.getDoseData(valueList);
		const first: Row = { Comuna: name, Dose: 'First' };
		const second: Row = { Comuna: name, Dose: 'Second' };
		for (let dateNumber = minDate; dateNumber <= maxDate; dateNumber++)
		{
			const date = DeisDateConverter.convert(dateNumber);
			const isoDate = date.toISODate();
			first[isoDate] = this.getValue(data, dateNumber, 0);
			second[isoDate] = this.getValue(data, dateNumber, 1);
		}

		return [first, second];
	}

	private static getDoseData(valueList: ValueList[]): DoseData[]
	{
		const dates = Enumerable.from(valueList[0]);
		const doses = Enumerable.from(valueList[1]);
		const values = Enumerable.from(valueList[2]);
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
