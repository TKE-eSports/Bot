import { Events as DefaultEvents } from '@sapphire/framework';

export const Events = {
	Default: {
		...DefaultEvents,
		InteractionCreate: 'interactionCreate'
	},
	Music: {
		AddList: 'addList',
		AddSong: 'addSong',
		Empty: 'empty',
		Error: 'error',
		Finish: 'finish',
		InitQueue: 'initQueue',
		NoRelated: 'noRelated',
		PlaySong: 'playSong',
		SearchNoResult: 'searchNoResult',
		SearchResult: 'searchResult',
		SearchCancel: 'searchCancel',
		SearchInvalidAnswer: 'searchInvalidAnswer',
		SearchDone: 'searchDone',
		Disconnect: 'disconnect',
		DeleteQueue: 'deleteQueue',
		FinishSong: 'finishSong'
	},
	Modmail: {
		DmMessageCreate: 'modmailDmMessageCreate',
		ChannelMessageCreate: 'modmailChannelMessageCreate',
		SessionStart: 'modmailSessionStart',
		SessionEnd: 'modmailSessionEnd'
	},
	Profanity: {
		ProfanityDetect: 'profanityDetect'
	},
	Phishing: {
		PhishingDetect: 'phishingDetect'
	},
	Nsfw: {
		NsfwDetect: 'nsfwDetect'
	}
};