
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
	}
}

export type Row = { [key: string]: string | number };
