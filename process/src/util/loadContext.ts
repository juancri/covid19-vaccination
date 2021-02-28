import minimist from 'minimist';

import { Context } from '../Types';

export default function loadContext(): Context
{
	const argv = minimist(process.argv.slice(2));
	const test = !!argv.test;
	return { test };
}
