import { ColorResolvable, MessageEmbed } from 'discord.js';
import { colors, emojis } from '../../config';

export const successEmbed = (content: string) => {
	return new MessageEmbed().setColor(colors.success as ColorResolvable).setDescription(`${emojis.success} | ${content}`);
};

export const failEmbed = (content: string) => {
	return new MessageEmbed().setColor(colors.fail as ColorResolvable).setDescription(`${emojis.fail} | ${content}`);
};
