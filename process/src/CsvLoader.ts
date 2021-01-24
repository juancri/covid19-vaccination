
import parse from 'csv-parse/lib/sync';
import * as fs from 'fs';
import * as path from 'path';
import { Row } from './Types';

const FILE_PATH = path.join(__dirname, '../../output/chile-vaccination.csv');
const PARSE_OPTIONS = { columns: true };

export default class CsvLoader
{
	public static load(): Row[]
	{
		const csvString = fs.readFileSync(FILE_PATH).toString();
		return parse(csvString, PARSE_OPTIONS);
	}
}
