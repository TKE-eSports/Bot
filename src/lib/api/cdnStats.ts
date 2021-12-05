import { fetch } from "@sapphire/fetch";
import type { ChartConfiguration } from "chart.js";
import { CDN } from "../../config";
import { chart } from "./chart";

const BASE_URL = `https://data.jsdelivr.com/v1/package/gh/${CDN.name}/stats/date/month`;

export const getCDNStats = async () => {
    const response = await fetch<CDNStats>(`${BASE_URL}`);
    return response;
}

export const generateChart = async (data: CDNStats) => {
    const response = Object.keys(data.dates).reverse().slice(0, 12).reverse().map((date) => {
        return {
            data: data.dates[date].total,
            label: date
        }
    });

    const chartConfig: ChartConfiguration = {
        type: 'line',
        data: {
            datasets: [{
                data: response.map((res) => res.data),
                borderColor: '#E84D3D',
            }],
            labels: response.map((res) => res.label)
        },
        options: {
            plugins: {
                legend: {
                    display: false,
                },
                title: {
                    display: false
                }
            }
        }
    };
    return await chart.renderToBuffer(chartConfig);
}

interface CDNStats {
    rank: number,
    total: number,
    dates: {
        [date: string]: {
            total: number,
            versions: any,
            commits: any,
            branches: any
        }
    }
}