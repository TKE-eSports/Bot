import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { Message, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { AntiNsfw, WebServer } from '../../../../config';
import type { DetectNsfwResponse } from '../../../../lib/api/detectNsfw';
import { Events } from '../../../../lib/constants/events';
import { nanoid } from 'nanoid';

@ApplyOptions<ListenerOptions>({
    event: Events.Nsfw.NsfwDetect
})
export class UserEvent extends Listener {
    public async run(message: Message, response: NsfwDetectFormattedResponse) {
        if (response.isPorn || response.isHentai) {
            const embed = new MessageEmbed(AntiNsfw.ads)
                .setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL({ dynamic: true }))
                .addField(`Nsfw Image(s) Detected`, response.images.map((url) => `${url}`).join("\n"));

            const uniqueId = nanoid(10);
            const actionRow = new MessageActionRow().addComponents(
                [
                    new MessageButton()
                        .setStyle('LINK')
                        .setLabel('View Raw Output')
                        .setURL(`${WebServer.host}/nsfw/bin/${uniqueId}`)
                ]
            );
            await message.reply({ embeds: [embed], components: [actionRow] });
            if (message.deletable) message.delete();
            this.container.database.set("bin", uniqueId, response);
        }
    }
}

interface NsfwDetectFormattedResponse {
    images: string[],
    isPorn: boolean;
    isHentai: boolean;
    isSexy: boolean;
    isNeutral: boolean;
    isDrawing: boolean;
    response: DetectNsfwResponse[][];
}