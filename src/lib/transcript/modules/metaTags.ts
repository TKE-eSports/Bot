import type { Collection, Message, TextChannel } from 'discord.js';
import { DefaultTheme } from '../../../config';

export const metaTagComponent = (messageCollection: Collection<string, Message>, id?: string) => {
	const message = messageCollection.first() ?? (messageCollection.last() as Message);
	const channel = message.channel as TextChannel;
	const user = message.client.users.cache.get(channel.name) ?? message.client.users.cache.get(channel.name.split(' | ')[0]);

	const tags = [
		`<meta property="og:type" content="website">`,
		`<meta property="og:site_name" content="TKE - Server">`,
		`<meta property="og:title" content="Transcript - ${id ?? message.channelId}">`,
		`<meta property="og:description" content="${user ? `This transcript is owned by ${user.tag} (${user.id}).` : ''}\nThere are ${messageCollection.size
		} messages in this transcript.">`,
		`<meta property="og:image" content="${channel.guild.iconURL({ dynamic: true })}">`,
		`<meta name="theme-color" content="${DefaultTheme}">`
	];
	return tags.join('\n');
};