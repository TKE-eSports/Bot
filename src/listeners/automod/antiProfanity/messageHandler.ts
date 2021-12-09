import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import type { GuildMember, Message } from 'discord.js';
import { AntiProfanity } from '../../../config';
import { Events } from '../../../lib/constants/events';
import { perspectiveApi } from '../../../lib/api/antiProfanity';

@ApplyOptions<ListenerOptions>({
	name: "antiProfanity/messageHandler",
	event: Events.Default.MessageCreate
})
export class UserEvent extends Listener {
	public async run(message: Message) {
		if (message.author.bot || !message.member || message.system || message.content === '' || !message.channel.isText() || message.guildId !== AntiProfanity.guildId) return;
		else if (this.comparePerms(message.member)) return;

		const response = await perspectiveApi(message.content);
		const data = response.data.filter((data) => data.results.some((m) => m.match === true));
		if (data.length > 0) {
			this.container.client.emit(Events.Profanity.ProfanityDetect, message, data);
		}
	}

	private comparePerms(member: GuildMember) {
		const booleanPerms = AntiProfanity.excludedPermissions.map((perm) => member.permissions.has(perm));
		return booleanPerms.includes(true);
	}
}
