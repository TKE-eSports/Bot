import { fetch, FetchResultTypes } from "@sapphire/fetch";
import type { ChartConfiguration } from "chart.js";
import type { ClubLog } from "../workers/clubLogs/modules";
import { chart } from "./chart";

const BRAWL_STARS_API_URL = "https://bsproxy.royaleapi.dev/v1";
const BRAWLAPI_API_URL = "https://api.brawlapi.com/v1";
const BRAWLAPI_API = "y3@b$#MgW7!#L4@yX#&3*K#$qCYWu7HU6TL6f4jrLx9Y*PRRuw8^vU4k8HynZ%jN2VJRScD$px9gj85L8Y8JkvXe*Uy3Lh5NpKj&jtfz$LoiNp^H3C97v@Q!R7NJ*iHRRPBkxGZHhec@9eb53@TWpT^bAH^4r&VxNwvp4y!3@@x7Y@fKgbTTV7!Y6@G9fr5NENZbuE84#Wgpy254ZB!mX*83KuX#b!5BMh2F!G9#5Z*p2psC9PpDT5&E4^4J5Juw";

export const encodeTag = (tag: string) => {
    return tag.startsWith("#") ? encodeURIComponent(tag) : `${encodeURIComponent("#" + tag)}`;
}

export const getClub = async (tag: string) => {
    const response = await fetch<Club>(`${BRAWL_STARS_API_URL}/clubs/${encodeTag(tag)}`, {
        headers: {
            "Authorization": `Bearer ${process.env.BRAWL_STARS_API}`
        }
    }, FetchResultTypes.JSON);
    return response;
}

export const getPlayer = async (tag: string) => {
    const response = await fetch(`${BRAWL_STARS_API_URL}/players/${encodeTag(tag)}`, {
        headers: {
            "Authorization": `Bearer ${process.env.BRAWL_STARS_API}`
        }
    }, FetchResultTypes.JSON);
    return response;
}

export const getClubLogs = async (tag: string) => {
    try {
        const response = await fetch<ClubLog>(`${BRAWLAPI_API_URL}/clublog/${tag.replace("#", "")}`, FetchResultTypes.JSON)
        return response;
    } catch (e) {
        return null;
    }
}

export const generateClubGraph = async (tag: string) => {
    const response = await fetch<GraphResponse>(`${BRAWLAPI_API_URL}/graphs/club/${tag.replace("#", "")}`, {
        headers: {
            "Authorization": BRAWLAPI_API
        }
    }, FetchResultTypes.JSON);

    const chartConfig: ChartConfiguration = {
        type: 'line',
        data: {
            datasets: [{
                data: response.data,
                borderColor: '#FFFF',
            }],
            labels: response.labels
        },
        options: {
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: false
                }
            }
        }
    }
    return await chart.renderToBuffer(chartConfig, "image/png")
}

export const generatePlayerGraph = async (tag: string) => {
    const response = await fetch<GraphResponse>(`${BRAWLAPI_API_URL}/graphs/player/${tag.replace("#", "")}`, {
        headers: {
            "Authorization": BRAWLAPI_API
        }
    }, FetchResultTypes.JSON);

    const chartConfig: ChartConfiguration = {
        type: 'line',
        data: {
            datasets: [{
                data: response.data,
                borderColor: '#FFFF',
            }],
            labels: response.labels
        },
        options: {
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: false
                }
            }
        }
    }
    return await chart.renderToBuffer(chartConfig, "image/png")
}

interface Club {
    tag: string,
    name: string,
    description: string,
    type: string,
    badgeId: number,
    requiredTrophies: number,
    trophies: number,
    members: {
        tag: string,
        name: string,
        role: string,
        expLevel: number,
        trophies: number
    }[]
}

interface GraphResponse {
    number: { daily: number, weekly: number, seasonal: number },
    labels: string[],
    data: number[],
    tag: string
}