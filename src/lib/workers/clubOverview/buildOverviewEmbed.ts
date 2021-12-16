import { fetch, FetchResultTypes } from "@sapphire/fetch";
import { MessageActionRow, MessageEmbed, MessageOptions, MessageSelectMenu } from "discord.js";
import { ClubOverview } from "../../../config";
import { getClub, Club } from "../../api/brawlstars";
import { entranceEmoji, separate, splitChunk } from "./modules";

export const buildOverviewEmbed = async () => {
    const clubs = await fetch<Clubs[]>(ClubOverview.clubs, FetchResultTypes.JSON);
    const allClubs = await Promise.all(clubs.map(async (club) => { return await getClub(club.tag) }));
    const resolvedClubs = allClubs.filter(club => club !== null) as Club[];

    const totalClubs = resolvedClubs.length;
    const totalTrophies = resolvedClubs.reduce((acc, club) => acc + club.trophies, 0);
    const totalMembers = resolvedClubs.reduce((acc, club) => acc + club.members.length, 0);

    const averageTrophies = totalTrophies / totalClubs;
    const averageRequired = resolvedClubs.reduce((acc, club) => acc + club.requiredTrophies, 0) / totalClubs;
    const averageMembers = resolvedClubs.reduce((acc, club) => acc + club.members.length, 0) / totalClubs;

    const totalMemberRole = resolvedClubs.reduce((acc, club) => acc + club.members.filter((m) => m.role === "member").length, 0);
    const totalSeniorRole = resolvedClubs.reduce((acc, club) => acc + club.members.filter((m) => m.role === "senior").length, 0);
    const totalVicePresidentRole = resolvedClubs.reduce((acc, club) => acc + club.members.filter((m) => m.role === "vicePresident").length, 0);
    const totalPresidentRole = resolvedClubs.reduce((acc, club) => acc + club.members.filter((m) => m.role === "president").length, 0);


    const clubInfoEmbed = new MessageEmbed(ClubOverview.infoEmbed)
        .addFields(
            {
                name: `Total Clubs`,
                value: `<:Club:789421935967862785> ${separate(totalClubs) || "0"}`,
                inline: true
            },
            {
                name: `Total Trophies`,
                value: `<:Club_Trophies:789425841661804544> ${separate(totalTrophies)}`,
                inline: true
            },
            {
                name: `Average Trophies`,
                value: `<:Trophy_B:794043009699545089> ${separate(averageTrophies)}`,
                inline: true
            },
            {
                name: `Average Required`,
                value: `<:Trophy_R:820529622638395463> ${separate(averageRequired)}`,
                inline: true
            },
            {
                name: `Average Members`,
                value: `<:Members:789425597742972948> ${separate(averageMembers)}`,
                inline: true
            },
            {
                name: `Members Information`,
                value: `<:Member:792430014326898740> **Members**: ${separate(totalMemberRole)}\n<:Seniors:789425351768014888> **Seniors**: ${totalSeniorRole}\n<:VicePresidents:789425469375119360> **Vice-Presidents**: ${separate(totalVicePresidentRole)}\n<:President:789425708929253396> **Presidents**: ${separate(totalPresidentRole)}\n\n<:Description:792420384732872784> **Total Members**: ${separate(totalMembers)}`,
                inline: false
            }
        );

    const overviewEmbeds: MessageEmbed[] = [];
    splitChunk(resolvedClubs.sort((a, b) => b.trophies - a.trophies), 15).map((clubs: any) => {
        const embed = new MessageEmbed(ClubOverview.overViewEmbed);
        clubs.forEach((club: any) => {
            const president = club.members.find((member: any) => member.role === "president");
            const field = [
                `🔗 [Link: \`${club.tag}\`](https://brawlify.com/stats/club/${club.tag.replace("#", "")})`,
                `${entranceEmoji(club)}`,
                `<:Trophy_H:794043128432427009> **${separate(club.trophies)}**`,
                `<:Required_Trophies:789425152789053451>  **Req: ${separate(club.requiredTrophies)}**`,
                `<:Member:792430014326898740> **Mem: ${club.members.length}**`,
                `<:President:789425708929253396> [${president.name}](https://brawlify.com/stats/profile/${president.tag.replace("#", "")})`,
            ]
            embed.addField(club.name, field.join("\n"), true);
            embed.setTimestamp();
        });
        overviewEmbeds.push(embed);
    });

    const selectClubMenu = new MessageSelectMenu()
        .setCustomId(ClubOverview.selectMenuId)
        .setPlaceholder("Select a club to view its stats!")
        .addOptions(resolvedClubs.sort((a, b) => b.trophies - a.trophies).map((club) => {
            return {
                label: club.name,
                description: `${club.tag}`,
                value: club.tag,
            }
        }));

    return { embeds: [clubInfoEmbed, ...overviewEmbeds], components: [new MessageActionRow().setComponents(selectClubMenu)] } as MessageOptions;
}

interface Clubs {
    tag: string,
    name: string
}