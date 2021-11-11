import type { ListenerOptions, PieceContext } from '@sapphire/framework';
import { Listener, Store } from '@sapphire/framework';
import { blue, gray, green, magenta, magentaBright, white, yellow } from 'colorette';
import { container } from '@sapphire/framework';
import DisTube from 'distube';
import { loadMusicBoard } from '../lib/music/musicBoard';
import SpotifyPlugin from '@distube/spotify';
import SoundCloudPlugin from '@distube/soundcloud';
import { Music } from '../config';
import { connectDatabase } from '../lib/database/database';
import { updateOverViewEmbed } from '../lib/clubOverview/updateOverviewEmbed';

const dev = process.env.NODE_ENV !== 'production';

export class UserEvent extends Listener {
	private readonly style = dev ? yellow : blue;

	public constructor(context: PieceContext, options?: ListenerOptions) {
		super(context, {
			...options,
			once: true
		});
	}

	public run() {
		this.printBanner();
		this.printStoreDebugInformation();

		this.loadMusic();
		updateOverViewEmbed();
		this.loadDatabase();

		// Unloads and loads the listeners again
		this.refreshListeners();
	}

	private printBanner() {
		const success = green('+');

		const llc = dev ? magentaBright : white;
		const blc = dev ? magenta : blue;

		const line01 = llc('');
		const line02 = llc('');
		const line03 = llc('');

		// Offset Pad
		const pad = ' '.repeat(7);

		console.log(
			String.raw`
${line01} ${pad}${blc('1.0.0')}
${line02} ${pad}[${success}] Gateway
${line03}${dev ? ` ${pad}${blc('<')}${llc('/')}${blc('>')} ${llc('DEVELOPMENT MODE')}` : ''}
		`.trim()
		);
	}

	private printStoreDebugInformation() {
		const { client, logger } = this.container;
		const stores = [...client.stores.values()];
		const last = stores.pop()!;

		for (const store of stores) logger.info(this.styleStore(store, false));
		logger.info(this.styleStore(last, true));
	}

	private styleStore(store: Store<any>, last: boolean) {
		return gray(`${last ? '└─' : '├─'} Loaded ${this.style(store.size.toString().padEnd(3, ' '))} ${store.name}.`);
	}

	private refreshListeners() {
		this.container.stores.get('listeners').loadAll();
	}

	private loadMusic() {
		if (!Music.enabled) {
			this.container.logger.debug('Music module is disabled');
		} else if (Music.enabled) {
			container.music = new DisTube(this.container.client, {
				leaveOnEmpty: true,
				leaveOnFinish: false,
				leaveOnStop: false,
				nsfw: false,
				plugins: [new SpotifyPlugin({ emitEventsAfterFetching: true }), new SoundCloudPlugin()]
			});
			loadMusicBoard(container.music);
		}
	}

	private async loadDatabase() {
		const db = await connectDatabase();
		container.database = db;
	}
}

declare module '@sapphire/pieces' {
	interface Container {
		music: DisTube;
		database: any
	}
}