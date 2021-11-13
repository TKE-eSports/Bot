import { container } from '@sapphire/framework';
import { Message, MessageCollector, ReactionCollector, TextChannel } from 'discord.js';
import type { DisTube } from 'distube';
import { emojis, Music } from '../../../config';
import { failEmbed } from '../../constants/embed';
import { editMessage } from './modules';
const { logger, client } = container;

export const loadMusicBoard = async (music: DisTube) => {
	const MUSIC_CHANNEL = (await client.channels.fetch(Music.channelId ?? 'undefined')) as TextChannel | undefined;
	const MUSIC_MESSAGE = await MUSIC_CHANNEL?.messages.fetch(Music.messageId ?? 'undefined');
	if (!MUSIC_CHANNEL || !MUSIC_MESSAGE || MUSIC_MESSAGE.author.id !== client.user?.id) return logger.error('Unable to load music board');

	const messageCollector = new MessageCollector(MUSIC_CHANNEL, { filter: (msg) => msg.content !== '' && !msg.system });
	editMessage(music.client);
	messageCollector.on('collect', async (message) => {
		if (message.author.bot && message.author.id !== client.user?.id && message.deletable) message.delete().catch();
		else if (message.member?.voice && message.member.voice.channelId === Music.voiceChannelId) {
			try {
				message.react(emojis.loading);
				await music.play(message, message.content);
				if (message.deletable) message.delete();
			} catch (e) {
				logger.warn(e);
				const msg = await message.channel.send({ embeds: [failEmbed('An unexpected error has ocurred.')] });
				setTimeout(() => {
					msg.delete();
				}, 1000 * 6);
				if (message.deletable) message.delete();
			}
		} else {
			const msg = await message.channel.send({
				embeds: [failEmbed(`${message.member?.toString()} you need to be connected to <#${Music.voiceChannelId}> in order to play songs.`)]
			});
			setTimeout(() => {
				msg.delete();
			}, 1000 * 6);
			if (message.deletable) message.delete().catch();
		}
	});

	const reactionCollector = new ReactionCollector(MUSIC_MESSAGE, {
		filter: (msgReaction, user) => Object.values(Music.emojis).includes(msgReaction.emoji.toString()) && !user.bot
	});
	reactionCollector.on('collect', async (messageReaction, user) => {
		messageReaction.users.remove(user);
		const queue = music.getQueue(messageReaction.message as Message);
		if (!queue || queue.songs.length === 0) {
			return;
		}
		switch (messageReaction.emoji.name) {
			case 'Rewind':
				queue.seek(queue.currentTime - 10 <= 0 ? 0 : queue.currentTime - 10);
				break;

			case 'PlayPause':
				if (queue.paused) queue.resume();
				else if (queue.playing) queue.pause();
				editMessage(client, queue, queue.songs[0]);
				break;

			case 'Stop':
				await queue.stop();
				editMessage(client, queue);
				break;

			case 'FastForward':
				queue.seek(queue.currentTime + 10);
				break;

			case 'Skip':
				try {
					const newSong = await queue.skip();
					editMessage(client, queue, newSong);
				} catch (_) {}
				break;

			case 'VolumeDown':
				queue.setVolume(queue.volume - 10 <= 1 ? 1 : queue.volume - 10);
				break;

			case 'VolumeUp':
				queue.setVolume(queue.volume + 10 >= 100 ? 100 : queue.volume + 10);
				break;

			case 'Repeat':
				queue.setRepeatMode(1);
				editMessage(client, queue, queue.songs[0]);
				break;

			case 'Shuffle':
				try {
					const newQueue = await queue.shuffle();
					editMessage(client, newQueue, queue.songs[0]);
				} catch (_) {}
				break;

			default:
				break;
		}
	});
};
