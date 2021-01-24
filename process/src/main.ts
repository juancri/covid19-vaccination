
import CsvLoader from './CsvLoader';
import CsvWriter from './CsvWriter';
import DataJoiner from './DataJoiner';
import JsonLoader from './JsonLoader';
import MessageGenerator from './MessageGenerator';

const rows = CsvLoader.load();
const newValues = JsonLoader.load();
DataJoiner.add(rows, newValues);
CsvWriter.write(rows);
console.log(MessageGenerator.generate(rows));
