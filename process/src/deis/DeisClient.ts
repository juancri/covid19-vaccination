
import * as fs from 'fs';
import * as path from 'path';

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import { DeisCredentials, DeisResult } from '../Types';
import DeisAuthScrapper from './DeisAuthScraper';
import Logger from '../util/Logger';
import DeisResults from './DeisResults';

const logger = Logger.get('DeisClient');

const BASE_URL = 'https://informesdeis.minsal.cl/reportData/jobs?indexStrings=true&embeddedData=true&wait=30';

export default class DeisClient
{
	private credentials: DeisCredentials | null = null;
	private credentialsPromise = DeisAuthScrapper.getCredentials();
	private sequence = 1;

	public async queryAll(payloads: string[]): Promise<DeisResults>
	{
		await this.init();
		const results = new Map<string, DeisResult>();
		for (const payloadName of payloads)
		{
			logger.debug(`Loading ${payloadName}...`);
			const result = await this.query(payloadName);
			results.set(payloadName, result);
		}

		return new DeisResults(results);
	}

	public getPayload(name: string): string
	{
		const fileName = `${name}.json`;
		const filePath = path.join(__dirname, '../../payloads', fileName);
		return fs.readFileSync(filePath).toString();
	}

	public async queryPayload(payload: string): Promise<DeisResult>
	{
		await this.init();
		const url = this.getUrl();
		const result = await axios({
			method: 'post',
			url: url,
			data: payload,
			headers: {
				'x-csrf-token': this.credentials?.xCsrfToken,
				'cookie': `JSESSIONID=${this.credentials?.jSessionID}`,
				'content-type': 'application/vnd.sas.report.query+json'
			},
		});
		const content = JSON.parse(result.data.results.content);
		return content.results[0] as DeisResult;
	}

	private async query(name: string): Promise<DeisResult>
	{
		const payload = this.getPayload(name);
		const result = await this.queryPayload(payload);
		return result;
	}

	private async init(): Promise<void>
	{
		if (this.credentials)
			return;

		this.credentials = await this.credentialsPromise;
	}

	private getUrl(): string
	{
		const seq = this.sequence++;
		const jobId = uuidv4();
		return BASE_URL +
			`&executorId=${this.credentials?.executorID}` +
			`&jobId=${jobId}` +
			`&sequence=${seq}`;
	}

}
