
import Enumerable from 'linq';

import { Context, Writer } from '../Types';
import Logger from '../util/Logger';
import DeisResults from '../deis/DeisResults';

import ChileVaccinations from './ChileVaccinations';
import ChileVaccinationsComunas from './ChileVaccinationsComunas';
import DeisClient from '../deis/DeisClient';
import ChileVaccinationsType from './ChileVaccinationsType';
import MessageGenerator from './MessageGenerator';

const logger = Logger.get('Writers');

const WRITERS: Writer[] = [
	ChileVaccinations,
	ChileVaccinationsType,
	ChileVaccinationsComunas,
	MessageGenerator,
];

export default class Writers
{
	public static getRequiredPayloads(): string[] {
		return Enumerable
			.from(WRITERS)
			.where(w => !w.isEnabled || w.isEnabled())
			.selectMany(w => w.getRequiredPayloads())
			.distinct()
			.orderBy(p => p)
			.toArray();
	}

	public static async write(context: Context, client: DeisClient, results: DeisResults): Promise<void>
	{
		for (const writer of WRITERS)
		{
			if (writer.isEnabled && !writer.isEnabled())
			{
				logger.info(`Skipping: ${writer.name}...`);
				continue;
			}

			logger.info(`Writing ${writer.name}...`);
			await Promise.resolve(writer.write(context, client, results));
		}
	}
}
