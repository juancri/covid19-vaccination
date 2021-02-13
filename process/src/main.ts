
import CsvLoader from './CsvLoader';
import CsvWriter from './CsvWriter';
import DataJoiner from './DataJoiner';
import DeisClient from './deis/DeisClient';
import JsonLoader from './JsonLoader';
import MessageGenerator from './MessageGenerator';

(async() =>
{
	try
	{
		const rows = CsvLoader.load();
		const client = new DeisClient();
		await client.print();
		const result = await client.query1();
		const newValues = JsonLoader.load(result);
		DataJoiner.add(rows, newValues);
		CsvWriter.write(rows);
		console.log(MessageGenerator.generate(rows));
	}
	catch (e)
	{
		console.log(e);
	}
})();
