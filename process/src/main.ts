
import DeisClient from './deis/DeisClient';
import ChileVaccinations from './csv/ChileVaccinations';
import ChileVaccinationsType from './csv/ChileVaccinationsType';
import generateMessage from './util/generateMessage';

(async() =>
{
	try
	{
		// const rows = CsvLoader.load();
		const client = new DeisClient();
		const results = await client.queryAll();
		ChileVaccinations.write(results);
		ChileVaccinationsType.write(results);
		console.log(generateMessage(results));
	}
	catch (e)
	{
		console.log(e);
	}
})();
