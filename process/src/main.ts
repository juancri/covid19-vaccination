
import DeisClient from './deis/DeisClient';
import ChileVaccinations from './csv/ChileVaccinations';
import ChileVaccinationsType from './csv/ChileVaccinationsType';
import generateMessage from './util/generateMessage';
import logger from './util/Logger';

(async() =>
{
	try
	{
		const client = new DeisClient();
		const results = await client.queryAll();
		ChileVaccinations.write(results);
		ChileVaccinationsType.write(results);
		console.log(generateMessage(results));
	}
	catch (e)
	{
		logger.error('General error', e);
	}
})();
