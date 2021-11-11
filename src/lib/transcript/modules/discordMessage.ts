import type { Message } from 'discord.js';
import { embedComponent } from './components/embeds';
import { buttonComponent } from './components/buttons';
import { reactionComponent } from './components/reactions';
import { contentComponent } from './components/content';
import moment from 'moment';
import { attachmentComponent } from './components/attachment';

export const discordMessage = (message: Message) => {
	if (message.system) return ''; // TODO: Add system message support
	return `<discord-message profile="${message.author.id}" timestamp="${moment(message.createdAt).format('DD/MM/YYYY')}">${contentComponent(
		message
	)}\n${embedComponent(message)}\n${attachmentComponent(message)}\n${reactionComponent(message)}\n${buttonComponent(message)}\n</discord-message>`;
};
