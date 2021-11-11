import { container } from "@sapphire/framework";
import { InteractionCollector, MessageEmbed, TextChannel } from "discord.js";
import { ClubOverview } from "../../config";
import { getClub } from "../api/brawlstars";
import { buildOverviewEmbed } from "./buildOverviewEmbed";
import { separate, list, entranceEmoji } from "./modules";

const _load = async () => {
    const channel = container.client.channels.cache.get(ClubOverview.channelId ?? "") as TextChannel | undefined;
    if (!channel) return container.logger.debug("Could not find club overview channel");
    const message = await channel.messages.fetch(ClubOverview.messageId ?? "");
    if (!message) return container.logger.debug("Could not find club overview message");

    setInterval(async () => {
        const payload = await buildOverviewEmbed();
        await message.edit(payload);
    }, ClubOverview.updateInterval);

    _collector(channel);
}

const _collector = async (channel: TextChannel) => {
    const collector = new InteractionCollector(container.client, { interactionType: "MESSAGE_COMPONENT", channel: channel, filter: (interaction) => interaction.isSelectMenu() && interaction.customId === ClubOverview.selectMenuId });
    collector.on("collect", async (interaction) => {
        if (!interaction.isSelectMenu()) return;
        const club = await getClub(interaction.values[0]);

        const president = club.members.find(m => m.role === "president");
        const embed = new MessageEmbed()
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
            .addField(`Top Presidents (${list(club, "vicePresident")[0]} + 1)`, list(club, "vicePresident")[1], true)
            .setFooter(`Timestamps`, "https://cdn.discordapp.com/emojis/829363765124005939.png")
            .setTimestamp();
        interaction.reply({ embeds: [embed], ephemeral: true });
    });
}

export const updateOverViewEmbed = () => {
    _load();
}