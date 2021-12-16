import { ApplyOptions } from '@sapphire/decorators';
import { fetch, FetchResultTypes } from '@sapphire/fetch';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { GuildMember, MessageAttachment, MessageEmbed, TextChannel } from 'discord.js';
import { WelcomeLogging } from '../../config';
import { Events } from '../../lib/constants/events';

const API_URL = `https://api.popcatdev.repl.co/welcomecard`;

@ApplyOptions<ListenerOptions>({
    event: Events.Default.GuildMemberAdd
})
export class UserEvent extends Listener {
    public async run(member: GuildMember) {
        if (!member.guild.id || member.guild.id !== WelcomeLogging.guildId) return;
        const channel = member.guild.channels.cache.get(WelcomeLogging.channelId ?? "") as TextChannel;
        if (!channel) return;

        const welcomeImage = await this.generateWelcomeImage(member);
        const embed = new MessageEmbed()
            .setAuthor(`Welcome ${member.displayName} to ${member.guild.name}`, member.user.displayAvatarURL({ dynamic: true }), "https://discord.gg/dfkwTAV")
            .setDescription(WelcomeLogging.message)
            .setImage(`attachment://${welcomeImage[0]}`)
            .setFooter(member.guild.name)
            .setTimestamp();
        channel.send({ embeds: [embed], files: [welcomeImage[1]] })
    }

    private async generateWelcomeImage(member: GuildMember) {
        try {
            const res = await fetch(`${API_URL}?background=https://iili.io/RAPyWg.png&text1=%20&text2=%20&text3=${encodeURI(`To ${member.guild.name}`)}&avatar=${member.user.displayAvatarURL({ dynamic: false, format: "png" })}`, FetchResultTypes.Buffer)
            const attachment = new MessageAttachment(Buffer.from(res), "welcome.png")
            return ["welcome.png", attachment];
        } catch (e) {
            const attachment = new MessageAttachment(`https://iili.io/qyDK74.gif`, "welcome.gif")
            return ["welcome.gif", attachment];
        }
    }
}