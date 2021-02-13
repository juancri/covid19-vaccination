
import * as fs from 'fs';
import * as path from 'path';

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import { DeisCredentials, DeisResult } from '../Types';
import DeisAuthScrapper from './DeisAuthScraper';

const BASE_URL = 'https://informesdeis.minsal.cl/reportData/jobs?indexStrings=true&embeddedData=true&wait=30';
const PAYLOAD_1 = fs.readFileSync(path.join(__dirname, '../../payloads/1.json')).toString();

export default class DeisClient
{
	private credentials: DeisCredentials | null = null;
	private credentialsPromise: Promise<DeisCredentials>;
	private jobId: string = uuidv4();
	private sequence = 1;

	public constructor()
	{
		this.credentialsPromise = DeisAuthScrapper.getCredentials();
	}

	public async print(): Promise<void>
	{
		await this.init();
		console.log(this.credentials);
	}

	public async query1(): Promise<DeisResult>
	{
		await this.init();
		const result = await axios({
			method: 'post',
			url: this.getUrl(),
			data: PAYLOAD_1,
			headers: {
				'x-csrf-token': this.credentials?.xCsrfToken,
				'cookie': `JSESSIONID=${this.credentials?.jSessionID}`,
				'content-type': 'application/vnd.sas.report.query+json'
			},
		});
		const content = JSON.parse(result.data.results.content);
		return content.results[0] as DeisResult;
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
		return BASE_URL +
			`&executorId=${this.credentials?.executorID}` +
			`&jobId=${this.jobId}` +
			`&sequence=${seq}`;
	}
}
