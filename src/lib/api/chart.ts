import { ChartJSNodeCanvas } from "chartjs-node-canvas";
const defaultChart = new ChartJSNodeCanvas({ width: 500, height: 300, backgroundColour: '#1E1E1E' });
defaultChart.registerFont("./src/static/fonts/sans_serif.ttf", { family: "Custom_Font" });
export const chart = defaultChart;