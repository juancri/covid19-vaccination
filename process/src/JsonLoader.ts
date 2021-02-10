
import { DeisResult } from './Types';

export default class JsonLoader
{
	public static load(result: DeisResult): number[][]
	{
		const values = result.data.valueList;
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
