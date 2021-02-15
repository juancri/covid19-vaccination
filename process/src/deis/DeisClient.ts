
import * as fs from 'fs';
import * as path from 'path';

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import { DeisCredentials, DeisResult, DeisResults } from '../Types';
import DeisAuthScrapper from './DeisAuthScraper';
import Logger from '../util/Logger';

const logger = Logger.get('DeisClient');

const BASE_URL = 'https://informesdeis.minsal.cl/reportData/jobs?indexStrings=true&embeddedData=true&wait=30';

const VALID_PAYLOADS: string[] = [
	'doses',
	'doses-arica',
	'doses-tarapaca',
	'doses-antofagasta',
	'doses-atacama',
	'doses-coquimbo',
	'doses-valparaiso',
	'doses-metropolitana',
	'doses-ohiggins',
	'doses-maule',
	'doses-nuble',
	'doses-biobio',
	'doses-araucania',
	'doses-losrios',
	'doses-loslagos',
	'doses-aysen',
	'doses-magallanes',
	'pfizer',
	'sinovac',
	'groups',
	'ages',
];

export default class DeisClient
{
	private credentials: DeisCredentials | null = null;
	private credentialsPromise: Promise<DeisCredentials>;
	private sequence = 1;

	public constructor()
	{
		this.credentialsPromise = DeisAuthScrapper.getCredentials();
	}

	public async queryAll(): Promise<DeisResults>
	{
		await this.init();
		const results: DeisResults = {};
		for (const payloadName of VALID_PAYLOADS)
		{
			logger.debug(`Loading ${payloadName}...`);
			const result = await this.query(payloadName);
			results[payloadName] = result;
		}

		return results;
	}

	private async query(name: string): Promise<DeisResult>
	{
		const found = VALID_PAYLOADS.includes(name);
		if (!found)
			throw new Error(`Payload not found: ${name}`);

		await this.init();
		const payload = this.getPayload(name);
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

	private getPayload(name: string): string
	{
		const fileName = `${name}.json`;
		const filePath = path.join(__dirname, '../../payloads', fileName);
		return fs.readFileSync(filePath).toString();
	}
}
