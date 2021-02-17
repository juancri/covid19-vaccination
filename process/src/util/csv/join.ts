
import * as Enumerable from 'linq';

import { Row } from '../../Types';

export default function joinCsv(rows1: Row[], rows2: Row[], joiners: string[]): Row[]
{
	return Enumerable
		.from([ ...rows1, ...rows2 ])
		.groupBy(
			(r: Row) => joiners.map(k => r[k]),
			(r: Row) => r,
			(key, group) => ({ key, group }),
			key => JSON.stringify(key))
		.select(g => {
			const items = g.group.toArray();
			if (items.length === 1)
				return items[0];
			if (items.length === 2)
				return { ...items[0], ...items[1] };
			throw new Error(`Invalid number of items: ${items.length} for key: ${g.key}`);
		})
		.toArray() as Row[];
}
