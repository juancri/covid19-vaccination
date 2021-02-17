
import * as fs from 'fs';
import * as path from 'path';

import parse from 'csv-parse/lib/sync';

import { Row } from '../../Types';

const OPTIONS = {
	columns: true,
	skip_empty_lines: true
};

export default function readCsv(fileName: string): Row[]
{
	try
	{
		const filePath = path.join(__dirname, '../../../../output/', fileName);
		const input = fs.readFileSync(filePath).toString();
		return parse(input, OPTIONS);
	}
	catch (e)
	{
		throw new Error(`Error opening: ${fileName} ${e}`);
	}
}
