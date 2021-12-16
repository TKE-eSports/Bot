interface Updated {
    data: number;
    history: number;
}
interface Club {
    tag: string;
    name: string;
    trophies: number;
    requiredTrophies: number;
    memberCount: number;
    description: string;
    updated: Updated;
}
interface Player {
    tag: string;
    name: string;
}
interface Data {
    joined: boolean;
    player: Player;
    type: string;
    old: string;
    new: string;
    promote?: boolean;
}
interface History {
    type: string;
    data: Data;
    timestamp: number;
}
export interface ClubLog {
    club: Club;
    history: History[];
}

export const ClubLogColors = {
    joined: "#D4EDDA",
    left: "#F8D7DA",
    promoted: "#D1ECF1",
    demoted: "#FFF3CD",
    settings: "#E2E3E5",
}

export const formClubLogMessage = (clubLogData: ClubLog) => {
    return clubLogData.history.map((history) => {
        let output = null;
        let color = null;
        switch (history.type) {
            case "members":
                color = history.data.joined ? ClubLogColors.joined : ClubLogColors.left;
                output = `[${history.data.player.name}](https://brawlify.com/stats/profile/${history.data.player.tag.replace("#", "")}) **${history.data.joined ? "joined" : "left"}** the club.`;
                break;

            case "roles":
                color = history.data.promote ? ClubLogColors.promoted : ClubLogColors.demoted;
                output = `[${history.data.player.name}](https://brawlify.com/stats/profile/${history.data.player.tag.replace("#", "")}) got **${history.data.promote ? "promoted" : "demoted"}** to ${history.data.new} from ${history.data.old}.`;
                break;

            case "settings":
                color = ClubLogColors.settings;
                if (history.data.type === "description") output = `**Description** changed from ${history.data.old.length} characters long to ${history.data.new.length} characters long.`;
                else if (history.data.type === "requirement") output = `**Requirement** changed from ${history.data.old} trophies to ${history.data.new} trophies.`;
                else if (history.data.type === "status") output = `**Status** changed from ${history.data.old} to ${history.data.new}.`;
                break;
        }
        return { text: output, color };
    }).filter((data) => data.text !== null && data.color !== null);
}