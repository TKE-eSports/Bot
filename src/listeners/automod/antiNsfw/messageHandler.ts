import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import type { GuildMember, Message } from 'discord.js';
import { AntiNsfw } from '../../../config';
import { detectNsfw, DetectNsfwResponse } from '../../../lib/api/detectNsfw';
import { Events } from '../../../lib/constants/events';

@ApplyOptions<ListenerOptions>({
    name: "antiNsfw/messageHandler",
    event: Events.Default.MessageCreate
})
export class UserEvent extends Listener {
    public async run(message: Message) {
        if (!AntiNsfw.enabled) return;
        if (message.author.bot || !message.member || message.system || message.content === '' || !message.channel.isText() || message.guildId !== AntiNsfw.guildId) return;
        else if (this.comparePerms(message.member)) return;

        const images = this.extractImages(message);
        if (images.length > 0) {
            const nsfwDetectedInImages = images.map(async (image) => { return await detectNsfw(image) });
            const resolvedResponse = await Promise.all(nsfwDetectedInImages);
            const nsfwResponse = resolvedResponse.filter((response) => response !== null) as DetectNsfwResponse[][];
            if (nsfwResponse.length > 0) {
                const formattedResponse = {
                    images: images,
                    isPorn: nsfwResponse.some((response) => response.some((response) => response.className === 'Porn' && response.probability >= 0.7)),
                    isHentai: nsfwResponse.some((response) => response.some((response) => response.className === 'Hentai' && response.probability >= 0.7)),
                    isSexy: nsfwResponse.some((response) => response.some((response) => response.className === 'Sexy' && response.probability >= 0.7)),
                    isNeutral: nsfwResponse.some((response) => response.some((response) => response.className === 'Neutral' && response.probability >= 0.7)),
                    isDrawing: nsfwResponse.some((response) => response.some((response) => response.className === 'Drawing' && response.probability >= 0.7)),
                    response: nsfwResponse
                }
                if (formattedResponse.isPorn || formattedResponse.isHentai) {
                    this.container.client.emit(Events.Nsfw.NsfwDetect, message, formattedResponse);
                }
            }
        }
    }

    private comparePerms(member: GuildMember) {
        const booleanPerms = AntiNsfw.excludedPermissions.map((perm) => member.permissions.has(perm));
        return booleanPerms.includes(true);
    }

    private extractImages(message: Message) {
        const imageRegex = new RegExp(/\b(https?:\/\/\S+(?:png|jpe?g|gif)\S*)\b/igm);
        const contentMatches = message.content.match(imageRegex) ?? [];
        const attachments = message.attachments.filter((attachment) => attachment.proxyURL.includes('png') || attachment.proxyURL.includes('jpg') || attachment.proxyURL.includes('jpeg') || attachment.proxyURL.includes('gif')).map((attachment) => attachment.proxyURL);
        const embeds = message.embeds.filter((embed) => embed.type === 'image').map((embed) => embed.url);
        return [...new Set([...attachments, ...embeds, ...contentMatches])] as string[];
    }
}