import { Listener, ListenerOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { MessageEmbed, User } from 'discord.js';
import { Events } from '../../../lib/constants/events';
import type { Message } from 'discord.js';
import { Modmail } from '../../../config';

@ApplyOptions<ListenerOptions>({
	event: Events.Modmail.ChannelMessageCreate
})
export class UserEvent extends Listener {
	public async run(message: Message, { receiver }: EventEmittedOptions) {
		try {
			await receiver.send({ ...this.makeUserMessageEmbed(message) });
			await message.react(Modmail.emoji.success);
		} catch (_) {
			await message.react(Modmail.emoji.error);
		}
	}

	private makeUserMessageEmbed(message: Message) {
		let embeds: MessageEmbed[] = [];
		if (message.attachments.size > 0) {
			message.attachments.forEach((attachment) => {
				const userMessageEmbed = new MessageEmbed({ ...Modmail.preMessage.dmMessageSend }).setColor('BLURPLE');
				if (message.content !== '') userMessageEmbed.setDescription(message.content);
				userMessageEmbed.setImage(attachment.proxyURL);
				embeds.push(userMessageEmbed);
			});
		} else {
			const userMessageEmbed = new MessageEmbed({ ...Modmail.preMessage.dmMessageSend }).setColor('BLURPLE');
			if (message.content !== '') userMessageEmbed.setDescription(message.content);
			embeds.push(userMessageEmbed);
		}
		return {
			embeds: embeds.length === 0 ? undefined : embeds,
			stickers: message.stickers.map((sticker) => sticker).length === 0 ? undefined : message.stickers.map((sticker) => sticker)
		};
	}
}

interface EventEmittedOptions {
	receiver: User;
}
