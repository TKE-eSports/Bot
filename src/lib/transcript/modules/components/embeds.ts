import type { Message, TextChannel } from 'discord.js';
import { toHTML } from 'discord-markdown';

export const embedComponent = (message: Message) => {
	const { client } = message;
	const options = {
		discordCallback: {
			embed: true,
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

	let embedsArray: string[] = [];
	message.embeds.forEach((embed) => {
		let discordEmbedInfo: DiscordEmbedInfoObject = {};
		discordEmbedInfo.slot = 'embeds';
		discordEmbedInfo.color = embed.hexColor ?? '0x000000';
		if (embed.author) {
			discordEmbedInfo['author-name'] = embed.author.name;
			if (embed.author.url) discordEmbedInfo['author-url'] = embed.author.url;
			if (embed.author.iconURL) discordEmbedInfo['author-image'] = embed.author.iconURL;
		}
		if (embed.image?.url) discordEmbedInfo['image'] = embed.image.url;
		if (embed.thumbnail?.url) discordEmbedInfo['thumbnail'] = embed.thumbnail.url;
		if (embed.title) discordEmbedInfo['embed-title'] = embed.title;
		if (embed.url) discordEmbedInfo.url = embed.url;
		if (embed.footer?.iconURL) discordEmbedInfo['footer-image'] = embed.footer.iconURL;
		if (embed.timestamp) discordEmbedInfo.timestamp = embed.timestamp; // Change this to string

		let discordEmbedFieldsArray: string[] = [];
		embed.fields.forEach((field, index) => {
			discordEmbedFieldsArray.push(
				`<discord-embed-field field-title="${toHTML(field.name, options)}" ${
					field.inline ? `inline inline-index="${index + 1}"` : ''
				}>\n${toHTML(field.value, options)}\n</discord-embed-field>`
			);
		});
		const FOOTER = embed.footer?.text ? `<span slot="footer">${embed.footer.text}</span>` : '';

		const START = `<discord-embed slot="${discordEmbedInfo.slot}" ${
			discordEmbedInfo['author-image'] ? `author-image="${discordEmbedInfo['author-image']}"` : ''
		} ${discordEmbedInfo['author-name'] ? `author-name="${discordEmbedInfo['author-name']}"` : ''} ${
			discordEmbedInfo['author-url'] ? `author-url="${discordEmbedInfo['author-url']}"` : ''
		} ${discordEmbedInfo['embed-title'] ? `embed-title="${discordEmbedInfo['embed-title']}"` : ''} ${
			discordEmbedInfo['url'] ? `url="${discordEmbedInfo['url']}"` : ''
		} ${discordEmbedInfo['footer-image'] ? `footer-image="${discordEmbedInfo['footer-image']}"` : ''} ${
			discordEmbedInfo['image'] ? `image="${discordEmbedInfo['image']}"` : ''
		} ${discordEmbedInfo['thumbnail'] ? `thumbnail="${discordEmbedInfo['thumbnail']}"` : ''} ${
			discordEmbedInfo['timestamp'] ? `timestamp="${discordEmbedInfo['timestamp']}"` : ''
		} ${discordEmbedInfo['color'] ? `color="${discordEmbedInfo['color']}"` : ''} ${
			discordEmbedInfo['image'] ? `image="${discordEmbedInfo['image']}"` : ''
		}  ${discordEmbedInfo['thumbnail'] ? `thumbnail="${discordEmbedInfo['thumbnail']}"` : ''}>`;
		const MIDDLE = embed.description ? toHTML(embed.description, options) : '';
		const FIELDS = discordEmbedFieldsArray.join('\n');

		const output = `${START}${MIDDLE}<discord-embed-fields slot="fields"> ${FIELDS} </discord-embed-fields>${FOOTER}</discord-embed>`;
		embedsArray.push(output);
	});

	return embedsArray.join('\n\n') ?? '';
};

interface DiscordEmbedInfoObject {
	slot?: 'embeds';

	'author-name'?: string;
	'author-image'?: string;
	'author-url'?: string;

	'embed-title'?: string;
	url?: string;

	'footer-image'?: string;
	image?: string;
	thumbnail?: string;

	timestamp?: number; // Change this to string
	color?: string;
}
