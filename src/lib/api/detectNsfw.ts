import { fetch, FetchResultTypes } from "@sapphire/fetch";

const BASE_URL = "https://api.tke-esports.tk/api/nsfw/classify";

export const detectNsfw = async (image: string): Promise<DetectNsfwResponse[] | null> => {
    const response = await fetch<DetectNsfwAPIResponse>(`${BASE_URL}?image=${image}`, FetchResultTypes.JSON);
    if (!response.status) return null;
    else return response.data;
};

export interface DetectNsfwAPIResponse {
    status: boolean;
    data: {
        className: string;
        probability: number;
    }[];
}

export interface DetectNsfwResponse {
    className: string;
    probability: number;
}