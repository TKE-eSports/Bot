import { Listener } from '@sapphire/framework';
import type { VoiceState } from 'discord.js';
import { Music } from '../../config';
import { editMessage } from '../../lib/workers/music/modules';

export class UserEvent extends Listener {
	public run(oldState: VoiceState, newState: VoiceState) {
		if (newState.member?.user.bot || newState.channelId === oldState.channelId) return;
		const queue = this.container.music.getQueue(newState);
		if (!queue) return;

		if (
			newState.channelId !== Music.voiceChannelId &&
			oldState.channelId === Music.voiceChannelId &&
			oldState.channel?.members.filter((m) => !m.user.bot).size === 0 &&
			queue.playing &&
			!queue.paused
		) {
			queue.pause();
			editMessage(this.container.client, queue, queue.songs[0]);
		}

		if (newState.channelId === Music.voiceChannelId && queue.paused) {
			queue.resume();
			editMessage(this.container.client, queue, queue.songs[0]);
		}
	}
}
