import type { Message } from 'discord.js';

export const attachmentComponent = (message: Message) => {
	let discordAttachmentArray: string[] = [];
	message.attachments.forEach((attachment) => {
		discordAttachmentArray.push(
			`<discord-attachment slot="attachments" url="${attachment.proxyURL}" height="${attachment.height}" width="${attachment.width}" alt="${attachment.name}"/>`
		);
	});
	return discordAttachmentArray.join('\n') ?? '';
};
