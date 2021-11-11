import type { Message } from 'discord.js';

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
					: `https://abs.twimg.com/emoji/v2/svg/${button.emoji.name.codePointAt(0)?.toString().toLowerCase()}.svg`
				: null;
			components.push(
				`<discord-button type="${getButtonType(button.style)}" ${button.url ? `url="${button.url}"` : ''} ${
					emoji ? `emoji="${emoji}"` : ''
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
