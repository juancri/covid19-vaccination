
import DeisClient from './deis/DeisClient';
import ChileVaccinationsWriter from './csv/ChileVaccinationsWriter';
import MessageGenerator from './MessageGenerator';
import ChileVaccinationsTypeWrite from './csv/ChileVaccinationsTypeWrite';

(async() =>
{
	try
	{
		// const rows = CsvLoader.load();
		const client = new DeisClient();
		const results = await client.queryAll();
		ChileVaccinationsWriter.write(results);
		ChileVaccinationsTypeWrite.write(results);
		console.log(MessageGenerator.generate(results));
	}
	catch (e)
	{
		console.log(e);
	}
})();
