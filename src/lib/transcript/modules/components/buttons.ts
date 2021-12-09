import type { Message } from 'discord.js';
import { parse } from 'twemoji-parser';

export const buttonComponent = (message: Message) => {
	const messageActionRowComponent = message.components
		.map((component) => component.components)
		.map((components) => components.filter((cmp) => cmp.type === 'BUTTON'));
	let actionRows: string[] = [];
	messageActionRowComponent.forEach((messageActionRow) => {
		let components: string[] = [];
		messageActionRow.forEach((button: any) => {
			const emoji = button.emoji
				? button.emoji.id
					? `https://cdn.discordapp.com/emojis/${button.emoji.id}.png`
					: parse(button.emoji.name)[0].url
				: null;
			components.push(
				`<discord-button type="${getButtonType(button.style)}" ${button.url ? `url="${button.url}"` : ''} ${emoji ? `emoji="${emoji}"` : ''
				} ${button.emoji?.name ? `emoji-name="${button.emoji.name}"` : ''}> ${button.label} </discord-button>`
			);
		});
		actionRows.push(components.length > 0 ? `<discord-action-row>\n${components.join('\n')}\n</discord-action-row>` : '');
	});
	return actionRows.join('\n');
};

function getButtonType(type: string) {
	if (type === 'DANGER') return 'destructive';
	else return type.toLowerCase();
}
