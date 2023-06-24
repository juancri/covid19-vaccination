
import puppeteer, { HTTPRequest } from 'puppeteer';

import { DeisCredentials } from '../Types';
import { sleep } from '../util/sleep';
import Logger from '../util/Logger';

const WAIT_FOR_SELECTOR_OPTIONS = { timeout: 120_000 };

const logger = Logger.get('DeisAuthScraper');

export default class DeisAuthScrapper
{
	public static async getCredentials(): Promise<DeisCredentials>
	{

		logger.info('Creating browser');
		const browser = await puppeteer.launch({ headless: true });

		try
		{
			logger.info('Creating page...');
			const page = await browser.newPage();
			logger.info('Intercepting page...');
			await page.setRequestInterception(true);
			const requests: HTTPRequest[] = [];

			page.on('request', request => {
				logger.debug('Handling request...');
				request.continue();
			});

			page.on('requestfinished', async(request) => {

				// Check URL
				const url = request.url();
				if (!url.includes('reportData/jobs'))
					return;

				// Check status
				const response = request.response();
				if (!response)
					throw new Error('Null response');

				const status = response.status();
				if ((status >= 300) && (status <= 399)) {
					return;
				}

				// Save
				requests.push(request);
			});

			logger.debug('Opening...');
			logger.debug('Setting viewport...');
			await page.setViewport({ width: 2500, height: 1080 });
			await page.goto(
				'https://informesdeis.minsal.cl/SASVisualAnalytics/?reportUri=%2Freports%2Freports%2F9037e283-1278-422c-84c4-16e42a7026c8&sectionIndex=1&sso_guest=true&sas-welcome=false',
				{ waitUntil: 'domcontentloaded' });
			let frame = null;
			// eslint-disable-next-line no-constant-condition
			while(true)
			{
				logger.debug('Sleeping...');
				await sleep(5_000);
				logger.debug('Looking for frame');
				const frames = page.frames();
				logger.debug(`Found ${frames.length} frames`);
				if (frames.length < 2)
					continue;
				frame = frames[1];
				break;
			}
			logger.debug('Waiting for selector...');
			await frame.waitForSelector(
				'#appSplitView-reportPanelView-0-sectionTabBar--header > #appSplitView-reportPanelView-0-sectionTabBar--header-scrollContainer > #appSplitView-reportPanelView-0-sectionTabBar--header-head > #__filter0-appSplitView-reportPanelView-0-sectionTabBar--header-6 > .sapMITBContentArrow',
				WAIT_FOR_SELECTOR_OPTIONS);
			logger.debug('Sleeping...');
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
			return { xCsrfToken, jSessionID, executorID };
		}
		finally
		{
			// Done
			await browser.close();
		}
	}
}
