
import * as fs from 'fs';
import * as path from 'path';
import stringify from 'csv-stringify/lib/sync';

import { Row } from './Types';

const FILE_PATH = path.join(__dirname, '../../output/chile-vaccination.csv');
const STRINGIFY_OPTIONS = { header: true };

export default class CsvWriter
{
	public static write(csv: Row[]): void
	{
		const csvOutput = stringify(csv, STRINGIFY_OPTIONS);
		fs.writeFileSync(FILE_PATH, csvOutput);
	}
}
