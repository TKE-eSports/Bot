import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';
import { Message, MessageAttachment, MessageEmbed } from 'discord.js';
import { CDN } from '../../config';
import { getCDNStats, generateChart } from '../../lib/api/cdnStats';

@ApplyOptions<CommandOptions>({
    description: 'Shows jsDelivr CDN stats.',
    aliases: ['jsdelivr'],
    enabled: false
})
export class UserCommand extends Command {
    public async messageRun(message: Message) {
        const response = await getCDNStats();
        const graph = await generateChart(response);

        const graphImage = new MessageAttachment(Buffer.from(graph));
        const embed = new MessageEmbed()
            .setColor("#E84D3D")
            .setAuthor("jsDelivr", `${CDN.url}/logos/jsdelivr.png?timestamps=${Date.now()}`, "https://www.jsdelivr.com")
            .setThumbnail(`${CDN.url}/logos/jsdelivr.png?timestamps=${Date.now()}`)
            .addField("CDN Rank", this.separate(response.rank), true)
            .addField("Total Request", this.separate(response.total), true)
            .addField(`Recorded Dates`, `**Total**: ${this.separate(Object.keys(response.dates).length)}\n**Last Recorded**: \`${Object.keys(response.dates).reverse()[0]}\``)
            .setImage(`attachment://file.jpg`)
        message.channel.send({ embeds: [embed], files: [graphImage] });
    }

    public separate = (x: number) => {
        const num = Math.round(x);
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}