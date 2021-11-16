import { fetch, FetchResultTypes } from "@sapphire/fetch";

const BASE_URL = "https://nsfw-demo.sashido.io/api/image/classify";

export const detectNsfw  = async (image: string) : Promise<DetectNsfwResponse[] | null> => {
    const response = await fetch<DetectNsfwResponse[]>(`${BASE_URL}?url=${image}`, FetchResultTypes.JSON);
    if (!JSON.stringify(response).includes("className")) return null;
    else return response;
};

export interface DetectNsfwResponse {
    className: string;
    probability: number;
}