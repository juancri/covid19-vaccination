
import { DeisResult } from '../Types';

export default class DeisResults
{
	private results: Map<string, DeisResult>;

	constructor(results: Map<string, DeisResult>)
	{
		this.results = results;
	}

	public get(name: string): DeisResult
	{
		const found = this.results.get(name);
		if (!found)
			throw new Error(`Result not found: ${name}`);

		return found;
	}
}
