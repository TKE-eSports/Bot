import { fetch, FetchResultTypes } from "@sapphire/fetch"
import { ColorResolvable, MessageEmbed, WebhookClient } from "discord.js";
import { CDN, ClubOverview, WebServer } from "../../../config";
import { separate, list, entranceEmoji } from "./modules";
import { getClub, getClubLogs } from "../../api/brawlstars";
import { formClubLogMessage } from "../clubLogs/modules";

const CLUB_ICONS = "https://static.tke-esports.tk/Data/brawlstars/clubIcons.json";

export const individualClubEmbed = async () => {
    const data = await fetch<Data[]>(ClubOverview.individualClubs, FetchResultTypes.JSON);
    const clubIcons = await fetch<ClubIcons[]>(CLUB_ICONS, FetchResultTypes.JSON);
    const unResolvedClubs = data.map(async (club) => {
        return {
            id: club.id,
            token: club.token,
            messageId: club.messageId,
            clubData: await getClub(club.tag),
            clubLogs: await getClubLogs(club.tag)
        }
    });
    const clubs = await Promise.all(unResolvedClubs);

    clubs.forEach((data) => {
        const embeds: MessageEmbed[] = [];
        const club = data.clubData;
        const president = club.members.find(m => m.role === "president");
        const clubInfoEmbed = new MessageEmbed()
            .setColor(clubIcons.find((icon) => icon.id === club.badgeId)?.color.palette[1].hex as ColorResolvable ?? "DEFAULT")
            .setThumbnail(`https://cdn.brawlify.com/club/${club.badgeId}.png?v=1`)
            .setAuthor(`${club.name} (${club.tag})`, `https://cdn.brawlify.com/club/${club.badgeId}.png?v=1`, `https://brawlify.com/stats/club/${club.tag.replace("#", "")}`)
            .addField("Trophies", `<:Trophies:789421880036687883> ${separate(club.trophies)}`, true)
            .addField("Required Trophies", `<:Required_Trophies:789425152789053451> ${separate(club.requiredTrophies)}`, true)
            .addField("Entrance", entranceEmoji(club) || "Not Found", true)
            .addField("Current Members", `<:Club:789421935967862785> \`${club.members.length}\``, true)
            .addField("Trophy Range", `<:Trophy_R:820529622638395463> \`${separate(club.members.sort((a: any, b: any) => b.trophies - a.trophies)[0].trophies)}\` - \`${separate(club.members.sort((a: any, b: any) => a.trophies - b.trophies)[0].trophies)}\``, true)
            .addField("President", `<:Crown:829363141300846602> [${president?.name}](https://brawlify.com/stats/profile/${president?.tag.replace("#", "")})`, true)
            .addField("Description", `${club.description || "No Description"}`, false)
            .addField(`Top Members (${list(club, "member")[0]})`, list(club, "member")[1], true)
            .addField(`Top Seniors (${list(club, "senior")[0]})`, list(club, "senior")[1], true)
            .addField(`Top Presidents (${list(club, "vicePresident")[0]} + 1)`, list(club, "vicePresident")[1], true);
        embeds.push(clubInfoEmbed);

        if (data.clubLogs) {
            const logsData = formClubLogMessage(data.clubLogs);
            const clubLogsEmbed = new MessageEmbed()
                .setAuthor(`${club.name} — Club Logs`, `https://cdn.brawlify.com/club/${club.badgeId}.png?v=1`, `https://brawlify.com/stats/club/${club.tag.replace("#", "")}`)
                .setDescription(logsData.map((data) => data.text).slice(0, 20).join("\n"))
                .setColor(logsData[0].color as ColorResolvable);
            embeds.push(clubLogsEmbed);
        }

        const clubGraphEmbed = new MessageEmbed()
            .setImage(`${WebServer.host}/brawlstars/graph/club/${club.tag.replace("#", "")}?timestamps=${Date.now()}`)
            .setFooter("Data Provided by BrawlAPI", `${CDN.url}/logos/brawlify.png`)
            .setTimestamp();
        embeds.push(clubGraphEmbed);

        const webhook = new WebhookClient({ id: data.id, token: data.token });
        webhook.editMessage(data.messageId, { embeds: embeds, content: null }).catch((e) => { console.log(e) });
    });
}

export const updateIndividualClubEmbed = () => {
    setInterval(individualClubEmbed, ClubOverview.updateInterval);
}

interface Data {
    id: string,
    token: string,
    tag: string,
    messageId: string
}

interface ClubIcons {
    id: number,
    imageUrl: string,
    color: {
        dominant: {
            hex: string,
            rgb: string[]
        },
        palette: {
            hex: string,
            rgb: string[]
        }[]
    }
}