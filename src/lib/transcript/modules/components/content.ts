import { toHTML } from 'discord-markdown';
import type { Message, TextChannel } from 'discord.js';

export const contentComponent = (message: Message) => {
	const { client } = message;
	const options = {
		discordCallback: {
			user: (u: any) => {
				const user = client.users.cache.get(u.id) ?? message.guild?.members.cache.get(u.id)?.user;
				if (user) return `<discord-mention>${user.username}</discord-mention>`;
				else return `@${u.id}`;
			},
			channel: (c: any) => {
				const channel = client.channels.cache.get(c.id) as TextChannel | undefined;
				if (channel) return `<discord-mention type="channel">${channel.name}</discord-mention>`;
				else return `#${c.id}`;
			},
			role: (r: any) => {
				const role = message.guild?.roles.cache.get(r.id);
				if (role) return `<discord-mention type="role" color="${role.hexColor}">${role.name}</discord-mention>`;
				else return `@&${r.id}`;
			},
			everyone: () => `<discord-mention type="role" color="#FFFFFF">everyone</discord-mention>`,
			here: () => `<discord-mention type="role" color="#FFFFFF">here</discord-mention>`
		}
	};
	return toHTML(message.content, options as any);
};
