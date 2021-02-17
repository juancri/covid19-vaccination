
import Enumerable from 'linq';

import { Writer } from '../Types';
import Logger from '../util/Logger';
import DeisResults from '../deis/DeisResults';

import ChileVaccinations from './ChileVaccinations';
import ChileVaccinationsType from './ChileVaccinationsType';
import ChileVaccinationsGroups from './ChileVaccinationsGroups';
import ChileVaccinationsAges from './ChileVaccinationsAges';
import MessageGenerator from './MessageGenerator';

const logger = Logger.get('Writers');

const WRITERS: Writer[] = [
	ChileVaccinations,
	ChileVaccinationsType,
	ChileVaccinationsGroups,
	ChileVaccinationsAges,
	MessageGenerator,
];

export default class Writers
{
	public static getRequiredPayloads(): string[] {
		return Enumerable
			.from(WRITERS)
			.selectMany(w => w.getRequiredPayloads())
			.distinct()
			.orderBy(p => p)
			.toArray();
	}

	public static write(results: DeisResults): void
	{
		for (const writer of WRITERS)
		{
			logger.info(`Writing ${writer.name}...`);
			writer.write(results);
		}
	}
}
