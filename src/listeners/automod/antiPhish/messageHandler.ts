import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import type { GuildMember, Message } from 'discord.js';
import { AntiPhish } from '../../../config';
import { loadPhishDomains, phishingDomains } from '../../../lib/api/phishDomains';
import { Events } from '../../../lib/constants/events';
import parseDomain from "extract-domain";
loadPhishDomains();

@ApplyOptions<ListenerOptions>({
    name: "antiPhish/messageHandler",
    event: Events.Default.MessageCreate
})
export class UserEvent extends Listener {
    public async run(message: Message) {
        if (!AntiPhish.enabled) return;
        if (message.author.bot || !message.member || message.system || message.content === '' || !message.channel.isText() || message.guildId !== AntiPhish.guildId) return;
        else if (this.comparePerms(message.member)) return;
        const extractDomains = this.extractDomains(message.content);
        const detectedPhishingDomains = extractDomains.filter((domain) => phishingDomains.has(domain));

        if (detectedPhishingDomains.length > 0) {
            this.container.client.emit(Events.Phishing.PhishingDetect, message, detectedPhishingDomains);
        }
    }

    private comparePerms(member: GuildMember) {
        const booleanPerms = AntiPhish.excludedPermissions.map((perm) => member.permissions.has(perm));
        return booleanPerms.includes(true);
    }

    private extractDomains(content: string) {
        const REGEX = new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)?/gi);
        const matches = content.match(REGEX) ?? [];
        return matches.map((match) => {
            if (match.startsWith("http")) return parseDomain(match);
            return parseDomain(`http://${match}`);
        });
    }
}