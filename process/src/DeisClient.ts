
import puppeteer from 'puppeteer';

import { DeisResult } from './Types';
import { sleep } from './util/sleep';

interface Result {
	url: string;
	postData: string | undefined;
	body: string;
}

const KNOWN_QUERIES: string[] = [
	'dd4422',
	'Pfizer',
	'Sinovac'
];

export default class DeisClient
{
	private files: Map<string, DeisResult> | null = null;

	public async loadFiles(): Promise<void>
	{
		const browser = await puppeteer.launch({ headless: false });
		const page = await browser.newPage();
		await page.setRequestInterception(true);
		const results: Result[] = [];

		page.on('request', request => {
			request.continue();
		});

		page.on('requestfinished', async(request) => {

			// Check URL
			const url = request.url();
			if (!url.includes('reportData/jobs'))
				return;

			// Check status
			const response = await request.response();
			const status = response.status();
			if ((status >= 300) && (status <= 399)) {
				return;
			}

			// Get data
			const buffer = await response.buffer();
			const postData = request.postData();
			const result = {
				url,
				postData,
				body: buffer.toString()
			};
			results.push(result);
		});

		console.log('Opening...');
		console.log('Setting viewport...');
		await page.setViewport({ width: 2500, height: 1080 });
		await page.goto(
			'https://informesdeis.minsal.cl/SASVisualAnalytics/?reportUri=%2Freports%2Freports%2F1a8cc7ff-7df0-474f-a147-929ee45d1900&sectionIndex=0&sso_guest=true&reportViewOnly=true&reportContextBar=false&sas-welcome=false',
			{ waitUntil: 'domcontentloaded' });
		let frame = null;
		// eslint-disable-next-line no-constant-condition
		while(true)
		{
			console.log('Sleeping...');
			await sleep(5_000);
			console.log('Looking for frame');
			const frames = page.frames();
			console.log(`Found ${frames.length} frames`);
			if (frames.length < 2)
				continue;
			frame = frames[1];
			console.log(`Frame: ${!!frame}`);
			if (!frame)
				continue;
			console.log(`Frame wait for selector: ${!!(frame.waitForSelector)}`);
			if (!frame.waitForSelector)
				continue;
			break;
		}
		console.log('Waiting for selector...');
		await frame.waitForSelector('#appSplitView-reportPanelView-0-sectionTabBar--header > #appSplitView-reportPanelView-0-sectionTabBar--header-scrollContainer > #appSplitView-reportPanelView-0-sectionTabBar--header-head > #__filter0-appSplitView-reportPanelView-0-sectionTabBar--header-6 > .sapMITBContentArrow');
		console.log('Clicking...');
		await frame.click('#appSplitView-reportPanelView-0-sectionTabBar--header > #appSplitView-reportPanelView-0-sectionTabBar--header-scrollContainer > #appSplitView-reportPanelView-0-sectionTabBar--header-head > #__filter0-appSplitView-reportPanelView-0-sectionTabBar--header-6 > .sapMITBContentArrow');
		console.log('Sleeping...');
		await sleep(5_000);
		console.log('Closing...');
		await browser.close();

		const data: [string, DeisResult][] = results
			.map(r => [DeisClient.getDeisName(r), DeisClient.getDeisResult(r)])
			.filter(p => p[0] !== null) as [string, DeisResult][];
		this.files = new Map(data);
	}

	public findFile(name: string): DeisResult
	{
		if (!this.files)
			throw new Error('Files have not been loaded yet');

		const result = this.files.get(name);
		if (!result)
		{
			const available = Array
				.from(this.files.keys())
				.join(', ');
			throw new Error(`Result not found: ${name}. Available: ${available}`);
		}

		return result;
	}

	private static getDeisName(r: Result): string | null
	{
		return KNOWN_QUERIES
			.find(q => r.postData?.includes(q)) || null;
	}

	private static getDeisResult(r: Result): DeisResult
	{
		const body = JSON.parse(r.body);
		const content = JSON.parse(body.results.content);
		return content.results[0] as DeisResult;
	}
}
