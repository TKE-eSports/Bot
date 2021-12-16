import { updateIndividualClubEmbed } from "./clubOverview/individualClubEmbed";
import { updateOverViewEmbed } from "./clubOverview/updateOverviewEmbed"

export const loadWorkers = async () => {
    updateOverViewEmbed();
    updateIndividualClubEmbed();
}