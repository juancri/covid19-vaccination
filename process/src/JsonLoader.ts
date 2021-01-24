
import * as fs from 'fs';
import * as path from 'path';

const DATA_FILE_PATH = path.join(__dirname, '..', 'data.json');

export default class JsonLoader
{
	public static load(): number[][]
	{
		const dataString = fs.readFileSync(DATA_FILE_PATH).toString();
		const data = JSON.parse(dataString);
		const contentString = data.results.content;
		const content = JSON.parse(contentString);
		const values = content.results[0].data.valueList;
		const first = JsonLoader.convertValues(values[1]);
		const second = JsonLoader.convertValues(values[2]);
		return [first, second];
	}

	private static convertValues(values: (number | string)[]): number[]
	{
		return values.map(x =>
		{
			if (typeof x === 'string')
				return 0;
			return x;
		});
	}
}
