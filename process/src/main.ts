
import CsvLoader from './CsvLoader';
import CsvWriter from './CsvWriter';
import DataJoiner from './DataJoiner';
import DeisClient from './DeisClient';
import JsonLoader from './JsonLoader';
import MessageGenerator from './MessageGenerator';

(async() =>
{
	try
	{
		const rows = CsvLoader.load();
		const client = new DeisClient();
		await client.loadFiles();
		const result = client.findFile('dd4422');
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
