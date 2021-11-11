import type { Message } from 'discord.js';

export const reactionComponent = (message: Message) => {
	let reactionsArray: ReactionArray = [];
	message.reactions.cache.forEach((reaction) => {
		const emojiName = reaction.emoji.name as string;
		reactionsArray.push({
			name: reaction.emoji.name ?? reaction.emoji.id,
			emoji: reaction.emoji.url ?? `https://abs.twimg.com/emoji/v2/svg/${emojiName.codePointAt(0)?.toString().toLowerCase()}.svg`,
			count: reaction.count
		});
	});

	let reactionComponentArray = reactionsArray.map((v) => {
		return `<discord-reaction name="${v.name}" emoji="${v.emoji}" count="${v.count}"> \n</discord-reaction>`;
	});

	if (reactionsArray.length > 0) return `<discord-reactions slot="reactions">\n${reactionComponentArray.join('\n')}\n </discord-reactions>`;
	else return '';
};

export interface ReactionArray extends Array<ReactionArrayObject> {}
export interface ReactionArrayObject {
	name: string | null;
	emoji: string;
	count: number;
}
