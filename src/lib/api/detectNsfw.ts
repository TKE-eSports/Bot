import { fetch, FetchResultTypes } from "@sapphire/fetch";
import {AsyncQueue} from "@sapphire/async-queue"

const BASE_URL = "https://nsfw-demo.sashido.io/api/image/classify";

const queue = new AsyncQueue();
export const detectNsfw = async (image: string) => {
    queue.wait();
    const response = await fetch<NsfwResponse[]>(`${BASE_URL}?url=${image}`, FetchResultTypes.JSON);
    queue.shift();
    return response;
};

interface NsfwResponse {
    className: string;
    probability: number;
}