import { fetch, FetchMethods, FetchResultTypes } from '@sapphire/fetch';
import { AsyncQueue } from '@sapphire/async-queue';
import { AntiProfanity } from '../../config';
const queue = new AsyncQueue();

const BASE_URL = `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${AntiProfanity.api}`;

export const perspectiveApi = async (content: String) => {
	await queue.wait();
	const apiResponse = await fetch<PerspectiveApiResponse>(
		BASE_URL,
		{
			method: FetchMethods.Post,
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ comment: { text: content }, languages: ['en'], requestedAttributes: { TOXICITY: {} } })
		},
		FetchResultTypes.JSON
	);
	queue.shift();
	return apiResponse;
};

export interface PerspectiveApiResponse {
	attributeScores: {
		TOXICITY: {
			summaryScore: {
				value: number;
				type: string;
			};
		};
	};
}
