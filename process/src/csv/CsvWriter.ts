
import * as fs from 'fs';
import * as path from 'path';
import stringify from 'csv-stringify/lib/sync';

import { Row } from '../Types';

const STRINGIFY_OPTIONS = { header: true };

export default class CsvWriter
{
	public static write(csv: Row[], fileName: string): void
	{
		const csvOutput = stringify(csv, STRINGIFY_OPTIONS);
		const filePath = path.join(__dirname, '../../../output/', fileName);
		fs.writeFileSync(filePath, csvOutput);
	}
}
