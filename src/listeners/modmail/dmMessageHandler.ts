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
		if (message.channel.type !== 'DM' || message.author.bot) return;
		else if (!Modmail.config.channelId || !Modmail.config.guildId) return this.container.logger.warn('Unable to resolve modmail config.');
		const modmailGuild = this.container.client.guilds.cache.get(Modmail.config.guildId);
		if (!modmailGuild) return this.container.logger.warn('Modmail guild not found.');
		const modmailChannel = modmailGuild.channels.cache.get(Modmail.config.channelId);
		if (!modmailChannel || modmailChannel.type !== 'GUILD_TEXT' || !modmailChannel.isText())
			return this.container.logger.warn('Modmail channel not found or the channel is not a text channel.');

		await modmailChannel.threads.fetch();
		const userThread = modmailChannel.threads.cache.find((c) => c.name === message.author.id);

		if (userThread) {
			this.container.client.emit(Events.Modmail.DmMessageCreate, message, { thread: userThread, modmailChannel, modmailGuild });
		} else if (!userThread) {
			this.container.client.emit(Events.Modmail.DmMessageCreate, message, { thread: null, modmailChannel, modmailGuild });
		}
	}
}
