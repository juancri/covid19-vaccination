
import Writers from './writers/Writers';
import DeisClient from './deis/DeisClient';
import Logger from './util/Logger';
import loadContext from './util/loadContext';

const logger = Logger.get('main');

(async() =>
{
	try
	{
		const context = loadContext();
		const client = new DeisClient();
		const payloads = Writers.getRequiredPayloads();
		const results = await client.queryAll(payloads);
		await Writers.write(context, client, results);
	}
	catch (e)
	{
		logger.error('General error');
		logger.error(e.stack);
		process.exit(1);
	}
})();
