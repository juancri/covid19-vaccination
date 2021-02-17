
import ChileVaccinations from './ChileVaccinations';
import ChileVaccinationsType from './ChileVaccinationsType';
import ChileVaccinationsGroups from './ChileVaccinationsGroups';
import ChileVaccinationsAges from './ChileVaccinationsAges';
import { DeisResults, Writer } from '../Types';
import Logger from '../util/Logger';

const logger = Logger.get('Writers');

const WRITERS: Writer[] = [
	ChileVaccinations,
	ChileVaccinationsType,
	ChileVaccinationsGroups,
	ChileVaccinationsAges,
];

export default class Writers
{
	public static write(results: DeisResults): void
	{
		for (const writer of WRITERS)
		{
			logger.info(`Writing ${writer.name}...`);
			writer.write(results);
		}
	}
}
