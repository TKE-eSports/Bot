import { fetch, FetchResultTypes } from "@sapphire/fetch";

const BASE_URL = "https://bsproxy.royaleapi.dev/v1";

export const encodeTag = (tag: string) => {
    return tag.startsWith("#") ? encodeURIComponent(tag) : `${encodeURIComponent("#" + tag)}`;
}

export const getClub = async (tag: string) => {
    const response = await fetch<Club>(`${BASE_URL}/clubs/${encodeTag(tag)}`, {
        headers: {
            "Authorization": `Bearer ${process.env.BRAWL_STARS_API}`
        }
    }, FetchResultTypes.JSON);
    return response;
}

export const getPlayer = async (tag: string) => {
    const response = await fetch(`${BASE_URL}/players/${encodeTag(tag)}`, {
        headers: {
            "Authorization": `Bearer ${process.env.BRAWL_STARS_API}`
        }
    }, FetchResultTypes.JSON);
    return response;
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