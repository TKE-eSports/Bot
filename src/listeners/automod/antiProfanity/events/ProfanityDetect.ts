import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { Collection, Message, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { AntiProfanity, DefaultTheme, WebServer } from '../../../../config';
import type { PerspectiveApiResponse } from '../../../../lib/api/perspectiveApi';
import { Events } from '../../../../lib/constants/events';
import { generateTranscript, saveTranscript } from '../../../../lib/transcript';

@ApplyOptions<ListenerOptions>({
	event: Events.Profanity.ProfanityDetect
})
export class UserEvent extends Listener {
	public async run(message: Message, response: PerspectiveApiResponse) {
		const embed = new MessageEmbed(AntiProfanity.ads)
			.setColor(DefaultTheme)
			.setDescription(
				`${message.member?.toString()}'s message has been flagged due to profanity. Score: **${response.attributeScores.TOXICITY.summaryScore.value
				}**.`
			);

		const saveTranscript = await this.createTranscript(message);

		const actionRow = new MessageActionRow().addComponents(
			[
				new MessageButton()
					.setStyle('LINK')
					.setLabel('View Message')
					.setURL(`${WebServer.host}/profanity/transcript/${saveTranscript.id}`),
				new MessageButton()
					.setStyle('LINK')
					.setLabel('Raw Information')
					.setURL(`${WebServer.host}/profanity/detect?text=${encodeURIComponent(message.content.slice(0, 1000))}`)
			]
		);

		await message.reply({ embeds: [embed], components: [actionRow] });
		if (message.deletable) message.delete();
	}

	private async createTranscript(message: Message) {
		const collection = new Collection<string, Message>();
		collection.set(message.id, message);

		const transcript = generateTranscript(collection);
		const savedTranscript = await saveTranscript(transcript);
		return savedTranscript;
	}
}
