import { ApplyOptions } from '@sapphire/decorators';
import { ApiRequest, ApiResponse, methods, MimeTypes, Route, RouteOptions } from '@sapphire/plugin-api';
import { getCDNStats } from '../../../lib/api/cdnStats';

@ApplyOptions<RouteOptions>({
	route: 'cdn/graph',
	name: 'CdnGraph',
})
export class UserRoute extends Route {
	public async [methods.GET](_request: ApiRequest, response: ApiResponse) {
		const {graph} = await getCDNStats();
        response.setContentType(MimeTypes.ImagePng).end(graph);
	}
}