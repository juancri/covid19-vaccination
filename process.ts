
// Dependencies
import * as fs from 'fs';
import * as path from 'path';
import { Parser } from 'json2csv';
import * as Enumerable from 'linq';

// Local
import excelToLuxonDate from './excelToLuxonDate';

// Constants
const DATA_FILE_PATH = path.join(__dirname, 'data.json');
const OUTPUT_DATE_FORMAT = 'yyyy-MM-dd';
const OUTPUT_FILE_PATH = path.join(__dirname, 'output.csv');

const dataString = fs.readFileSync(DATA_FILE_PATH).toString();
const data = JSON.parse(dataString);
const contentString = data.results.content;
const content = JSON.parse(contentString);
const values = content.results[0].data.valueList;
const dates = values[0].map((n: number) => excelToLuxonDate(n).toFormat(OUTPUT_DATE_FORMAT));
const vaccinations = values[1];
const row: { [key: string]: any } = Enumerable
	.from(dates)
	.zip(Enumerable.from(vaccinations), (date, value) => ({ date, value }))
	.toObject(x => x.date, x => x.value);
row.country = 'Chile';
const parser = new Parser({ fields: ['country', ...dates]});
const csv = parser.parse(row);
fs.writeFileSync(OUTPUT_FILE_PATH, csv);
