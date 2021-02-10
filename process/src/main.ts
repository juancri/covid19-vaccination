
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
		const deisResults = await DeisClient.getFiles();
		const result = deisResults.get(4422);
		if (!result)
		{
			const available = Array
				.from(deisResults.keys())
				.map(n => n.toString())
				.join(', ');
			throw new Error(`Result not found: 4422. Available: ${available}`);
		}
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
