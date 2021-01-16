
// Dependencies
import * as fs from 'fs';
import * as path from 'path';

import * as Enumerable from 'linq';
import { DateTime } from 'luxon';
import parse from 'csv-parse/lib/sync';
import stringify from 'csv-stringify/lib/sync';
import prompts from 'prompts';

// Constants
const FILE_PATH = path.join(__dirname, '../output.csv');
const PARSE_OPTIONS = { columns: true };
const STRINGIFY_OPTIONS = { header: true };
const PROMPT_CONFIG = [
	{ type: 'number', name: 'firstTotal', message: 'First dose:' },
	{ type: 'number', name: 'secondTotal', message: 'Second dose:' },
	{ type: 'text', name: 'date', message: 'Date:' }
];
const TOTAL_POPULATION = 15_000_000;

const getTotal = (row: { [key: string]: string }) =>
{
	return Enumerable
		.from(Object.keys(row))
		.skip(1)
		.select(k => row[k])
		.select(v => parseInt(v))
		.sum();
};

(async() =>
{
	// Read
	const csvString = fs.readFileSync(FILE_PATH).toString();
	const csv = parse(csvString, PARSE_OPTIONS);

	// Input
	const output = await prompts(PROMPT_CONFIG as Array<prompts.PromptObject<string>>);
	const { firstTotal, secondTotal } = output;
	const date = output.date || DateTime.local().toISODate();

	// Add
	const row1 = csv[0];
	const row2 = csv[1];
	const oldFirst = getTotal(row1);
	const oldSecond = getTotal(row2);
	row1[date] = firstTotal - oldFirst;
	row2[date] = secondTotal - oldSecond;

	// Write
	const csvOutput = stringify(csv, STRINGIFY_OPTIONS);
	fs.writeFileSync(FILE_PATH, csvOutput);

	// Show percentages
	const firstRatio = firstTotal / TOTAL_POPULATION * 100;
	const secondRatio = secondTotal / TOTAL_POPULATION * 100;
	console.log(`${firstRatio} ${secondRatio}`);
})();
