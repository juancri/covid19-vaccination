
import ChileVaccinations from './ChileVaccinations';
import ChileVaccinationsType from './ChileVaccinationsType';
import ChileVaccinationsGroups from './ChileVaccinationsGroups';
import ChileVaccinationsAges from './ChileVaccinationsAges';
import { DeisResults } from '../Types';
import Logger from '../util/Logger';

const logger = Logger.get('Writers');

type Writer = (results: DeisResults) => void;
const WRITERS: Map<string, Writer> = new Map([
	['ChileVaccinations', ChileVaccinations.write],
	['ChileVaccinationsType', ChileVaccinationsType.write],
	['ChileVaccinationsGroups', ChileVaccinationsGroups.write],
	['ChileVaccinationsAges', ChileVaccinationsAges.write],
]);

export default class Writers
{
	public static write(results: DeisResults): void
	{
		for (const writer of WRITERS.entries())
		{
			logger.info(`Writing ${writer[0]}...`);
			writer[1](results);
		}
	}
}
