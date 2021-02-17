
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
	getRequiredPayloads(): string[];
	write(results: DeisResults): void;
}

export type DeisResults = { [key: string]: DeisResult };

export type Row = { [key: string]: string | number };
