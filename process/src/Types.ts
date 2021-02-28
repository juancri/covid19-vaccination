import DeisClient from './deis/DeisClient';
import DeisResults from './deis/DeisResults';

export type ValueList = (number | string)[];

export interface Context
{
	test: boolean;
}

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
	write(context: Context, client: DeisClient, results: DeisResults): void | Promise<void>;
}

export type Row = { [key: string]: string | number };
