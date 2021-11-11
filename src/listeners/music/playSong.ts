import { Listener, ListenerOptions, container } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import type { Queue, Song } from 'distube';
import { editMessage } from '../../lib/music/modules';

@ApplyOptions<ListenerOptions>({
	emitter: container.music
})
export class UserEvent extends Listener {
	public run(queue: Queue, song: Song) {
		editMessage(this.container.client, queue, song);
	}
}
