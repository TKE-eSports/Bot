import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { Modmail } from '../../config';
import { Events } from '../../lib/constants/events';

@ApplyOptions<ListenerOptions>({
	event: Events.Default.MessageCreate
})
export class UserEvent extends Listener {
	public async run(message: Message) {
		if (message.author.bot || !message.channel.isThread() || message.system) return;
		if (message.channel.parentId !== Modmail.config.channelId) return;
		const threadAuthor = await this.container.client.users.fetch(message.channel.name).catch(() => null);
		if (threadAuthor) this.container.client.emit(Events.Modmail.ChannelMessageCreate, message, { receiver: threadAuthor });
	}
}
