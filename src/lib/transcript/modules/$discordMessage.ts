import type { Message, Collection } from 'discord.js';

export const $discordMessage = (messageCollection: Collection<string, Message>) => {
	const messageArray = messageCollection.map((message) => {
		return {
			id: message.author.id,
			author: message.author.username,
			avatar: message.author.displayAvatarURL({ dynamic: true }),
			bot: message.author.bot,
			verified: message.author.bot ? message.author.flags?.has('VERIFIED_BOT') : null,
			roleColor: message.member?.displayHexColor ?? '#FFFFFF'
		} as MessageObject;
	});

	let messageObject: Profiles = {};
	messageArray.forEach((profile: MessageObject) => {
		messageObject[profile.id] = profile;
	});

	return `<script>\n\nwindow.$discordMessage = {\nprofiles:${JSON.stringify(messageObject)}}\n\n</script>`;
};

export interface Profiles {
	[id: string]: MessageObject;
}

export interface MessageObject {
	id: string;
	author: string;
	avatar: string;
	bot: boolean;
	verified: boolean | null;
	roleColor: string;
}
