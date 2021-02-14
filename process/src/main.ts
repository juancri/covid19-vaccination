
import DeisClient from './deis/DeisClient';
import ChileVaccinationsWriter from './csv/ChileVaccinationsWriter';
import MessageGenerator from './MessageGenerator';

(async() =>
{
	try
	{
		// const rows = CsvLoader.load();
		const client = new DeisClient();
		const results = await client.queryAll();
		ChileVaccinationsWriter.write(results);
		console.log(MessageGenerator.generate(results));
	}
	catch (e)
	{
		console.log(e);
	}
})();
