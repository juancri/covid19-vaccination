
import DeisClient from './deis/DeisClient';
import ChileVaccinationsWriter from './csv/ChileVaccinationsWriter';
import MessageGenerator from './MessageGenerator';
import ChileVaccinationsTypeWriter from './csv/ChileVaccinationsTypeWriter';

(async() =>
{
	try
	{
		// const rows = CsvLoader.load();
		const client = new DeisClient();
		const results = await client.queryAll();
		ChileVaccinationsWriter.write(results);
		ChileVaccinationsTypeWriter.write(results);
		console.log(MessageGenerator.generate(results));
	}
	catch (e)
	{
		console.log(e);
	}
})();
