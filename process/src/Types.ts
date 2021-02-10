
export type ValueList = (number | string)[];

// Stub
export interface DeisResult
{
	data:
	{
		valueList: ValueList[]
	}
}

export type Row = { [key: string]: string | number };
