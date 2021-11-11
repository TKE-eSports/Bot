import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import type { Interaction } from 'discord.js';
import { Events } from '../../lib/constants/events';

@ApplyOptions<ListenerOptions>({
	event: Events.Default.InteractionCreate
})
export class UserEvent extends Listener {
	public async run(interaction: Interaction) {
		if (!interaction.isButton() || !interaction.channel?.isThread()) return;

		if (interaction.customId.endsWith('modmail-close')) {
			this.container.client.emit(Events.Modmail.SessionEnd, interaction);
		}
	}
}
