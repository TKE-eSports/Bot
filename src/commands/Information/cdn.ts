import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import { CDN, WebServer } from '../../config';
import { getCDNStats } from '../../lib/api/cdnStats';

@ApplyOptions<CommandOptions>({
    description: 'Shows jsDelivr CDN stats.',
    aliases: ['jsdelivr']
})
export class UserCommand extends Command {
    public async messageRun(message: Message) {
        const { response } = await getCDNStats();
        const embed = new MessageEmbed()
            .setColor("#E84D3D")
            .setAuthor("jsDelivr", `${CDN.url}/logos/jsdelivr.png`, "https://www.jsdelivr.com")
            .setThumbnail(`${CDN.url}/logos/jsdelivr.png`)
            .addField("CDN Rank", this.separate(response.rank), true)
            .addField("Total Request", this.separate(response.total), true)
            .addField(`Recorded Dates`, `**Total**: ${this.separate(Object.keys(response.dates).length)}\n**Last Recorded**: \`${Object.keys(response.dates).reverse()[0]}\``)
            .setImage(`${WebServer.host}/cdn/graph?timestamps=${Date.now()}`);
        message.channel.send({ embeds: [embed] });
    }

    public separate = (x: number) => {
        const num = Math.round(x);
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}