
// Dependencies
import * as fs from 'fs';
import * as path from 'path';

import formatNumber from 'format-number';
import * as Enumerable from 'linq';
import parse from 'csv-parse/lib/sync';
import { DateTime } from 'luxon';

// Constants
const FILE_PATH = path.join(__dirname, '../output.csv');
const PARSE_OPTIONS = { columns: true };
const TOTAL_POPULATION = 15_000_000;
const INTEGER_FORMAT = formatNumber({ integerSeparator: '.' });
const PERCENTAGE_FORMAT = formatNumber({ decimal: ',', truncate: 2 });

const getTotal = (row: { [key: string]: string }) =>
{
	return Enumerable
		.from(Object.keys(row))
		.skip(1)
		.select(k => row[k])
		.select(v => parseInt(v))
		.sum();
};

// Read
const csvString = fs.readFileSync(FILE_PATH).toString();
const csv = parse(csvString, PARSE_OPTIONS);

// Add
const row1 = csv[0];
const row2 = csv[1];
const total1 = getTotal(row1);
const total2 = getTotal(row2);

// Write
const date = DateTime.local();
const firstRatio = total1 / TOTAL_POPULATION * 100;
const secondRatio = total2 / TOTAL_POPULATION * 100;
console.log(
	`Vacunación en Chile hasta el ${date.toFormat('dd/MM/yyyy')}:\n\n` +
	`Primera dosis: ${INTEGER_FORMAT(total1)} personas (${PERCENTAGE_FORMAT(firstRatio)}%)\n` +
	`Segunda dosis: ${INTEGER_FORMAT(total2)} personas (${PERCENTAGE_FORMAT(secondRatio)}%)\n\n` +
	'(Calculado en base a un universo a vacunar de 15 millones de personas)\n\n' +
	'#Covid19Chile');
