import { ApplyOptions } from '@sapphire/decorators';
import { fetch } from '@sapphire/fetch';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { Collection, Message, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { AntiPhish, WebServer } from '../../../../config';
import { Events } from '../../../../lib/constants/events';
import { createAndSaveTranscript } from '../../../../lib/transcript';

@ApplyOptions<ListenerOptions>({
    event: Events.Phishing.PhishingDetect
})
export class UserEvent extends Listener {
    public async run(message: Message, response: string[]) {
        const embed = new MessageEmbed(AntiPhish.ads)
            .setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())
            .addField("Phishing Domain Found", `${response.map((value) => `● ${value}`).join("\n")}`)
            .setColor("RED");

        const transcript = await createAndSaveTranscript(new Collection<string, Message>().set(message.id, message));
        const actionRow = new MessageActionRow().addComponents(
            [
                new MessageButton()
                    .setStyle('LINK')
                    .setLabel('View Message')
                    .setURL(`${WebServer.host}/phish/transcript/${transcript.id}`)
            ]
        );
        const msg = await message.reply({ embeds: [embed], components: [actionRow] });
        if (message.deletable) message.delete();

        try {
            await fetch("https://api.tke-esports.tk/api/screenshot/generate?url=" + encodeURIComponent(response[0]));
            await msg.edit({ embeds: [embed.setImage("https://api.tke-esports.tk/api/screenshot/generate?url=" + encodeURIComponent(response[0]))] });
        } catch (_) {}

    }
}