import { fetch, FetchMethods, FetchResultTypes } from '@sapphire/fetch';
import { AsyncQueue } from '@sapphire/async-queue';
const queue = new AsyncQueue();

const BASE_URL = `https://api.tke-esports.tk/api/text/analyze`;

export const perspectiveApi = async (content: String) => {
	await queue.wait();
	const apiResponse = await fetch<ApiResponse>(
		BASE_URL,
		{
			method: FetchMethods.Post,
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({content: content})
		},
		FetchResultTypes.JSON
	);
	queue.shift();
	return apiResponse;
};

export interface ApiResponse {
	status: boolean;
	data: ApiResponseData[];
}

export interface ApiResponseData {
    label: string;
	results: {
		probabilities: {
			[key: string]: number;
		};
		match: boolean;
	}[];
}