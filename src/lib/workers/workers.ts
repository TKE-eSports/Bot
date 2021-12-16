import { individualClubEmbed } from "./clubOverview/individualClubEmbed";
import { updateOverViewEmbed } from "./clubOverview/updateOverviewEmbed"

export const loadWorkers = async () => {
    updateOverViewEmbed();
    individualClubEmbed();
}