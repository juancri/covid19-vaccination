
import Writers from './writers/Writers';
import DeisClient from './deis/DeisClient';
import Logger from './util/Logger';
import loadContext from './util/loadContext';

const logger = Logger.get('main');

(async() =>
{
	try
	{
		logger.info('Loading context...');
		const context = loadContext();
		logger.info('Creating client...');
		const client = new DeisClient();
		logger.info('Getting payloads...');
		const payloads = Writers.getRequiredPayloads();
		logger.info('Querying payloads...');
		const results = await client.queryAll(payloads);
		logger.info('Writing results...');
		await Writers.write(context, client, results);
		logger.info('Done!');
	}
	catch (e)
	{
		logger.error('General error');
		logger.error(e);
		process.exit(1);
	}
})();
