
import Writers from './csv/Writers';
import DeisClient from './deis/DeisClient';
import generateMessage from './util/generateMessage';
import Logger from './util/Logger';

const logger = Logger.get('main');

(async() =>
{
	try
	{
		const client = new DeisClient();
		const results = await client.queryAll();
		Writers.write(results);
		console.log(generateMessage(results));
	}
	catch (e)
	{
		logger.error('General error');
		logger.error(e.stack);
	}
})();
