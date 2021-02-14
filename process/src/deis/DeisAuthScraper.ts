
import puppeteer, { HTTPRequest } from 'puppeteer';

import { DeisCredentials } from '../Types';
import { sleep } from '../util/sleep';

export default class DeisAuthScrapper
{
	public static async getCredentials(): Promise<DeisCredentials>
	{
		const browser = await puppeteer.launch({ headless: true });
		const page = await browser.newPage();
		await page.setRequestInterception(true);
		const requests: HTTPRequest[] = [];

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

			// Save
			requests.push(request);
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
		console.log('Sleeping...');
		await sleep(5_000);
		// Get first request
		if (!requests.length)
			throw new Error('No requests found');
		const request = requests[requests.length - 1];

		// Save data
		// Token
		const xCsrfToken = request.headers()['x-csrf-token'];

		// Cookie
		const cookies = await page.cookies('https://informesdeis.minsal.cl/reportData/jobs');
		const jSessionID = cookies[0].value;

		// Get executor
		const url = new URL(request.url());
		const executorID = url.searchParams.get('executorId');
		if (!executorID)
			throw new Error(`No executor id found: ${url.searchParams}`);

		// Done
		await browser.close();
		return { xCsrfToken, jSessionID, executorID };
	}
}