import DeisResults from './deis/DeisResults';

export type ValueList = (number | string)[];

export interface DeisCredentials
{
	xCsrfToken: string;
	jSessionID: string;
	executorID: string;
}

// Stub
export interface DeisResult
{
	data:
	{
		valueList: ValueList[]
	},
	stringTable:
	{
		valueList: string[]
	},
}

export interface Writer
{
	name: string;
	isEnabled?(): boolean;
	getRequiredPayloads(): string[];
	write(results: DeisResults): void;
}

export type Row = { [key: string]: string | number };
