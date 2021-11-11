import { ApplyOptions } from '@sapphire/decorators';
import { ApiRequest, ApiResponse, methods, MimeTypes, Route, RouteOptions } from '@sapphire/plugin-api';
import { Collection, TextChannel, ThreadChannel } from 'discord.js';
import { Modmail } from '../../config';
import { generateTranscript } from '../../lib/transcript';

@ApplyOptions<RouteOptions>({
	route: 'modmail/:id'
})
export class UserRoute extends Route {
	public async [methods.GET](request: ApiRequest, response: ApiResponse) {
		try {
			const modmailChannel = (await this.container.client.channels.fetch(Modmail.config.channelId as string)) as TextChannel;
			if (!modmailChannel) return response.json({ message: 'Modmail channel not found' });

			const { threads } = await modmailChannel.threads.fetch().catch(() => ({ threads: new Collection<string, ThreadChannel>() }));
			const targetThread = threads.get(request.params.id);
			if (!targetThread) return response.json({ message: 'Requested thread channel not found' });

			const messageCollection = await targetThread.messages.fetch({ limit: 100 });
			const transcript = generateTranscript(messageCollection);
			response.setContentType('text/html' as MimeTypes).end(transcript);
		} catch (e) {
			response.json({ message: 'An unexpected error has ocurred' });
			this.container.logger.warn('Modmail transcript error:\n' + e);
		}
	}
}
