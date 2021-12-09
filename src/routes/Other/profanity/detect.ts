import { ApplyOptions } from '@sapphire/decorators';
import { ApiRequest, ApiResponse, methods, Route, RouteOptions } from '@sapphire/plugin-api';
import { perspectiveApi } from '../../../lib/api/antiProfanity';

@ApplyOptions<RouteOptions>({
	route: 'profanity/detect',
	name: 'ProfanityDetect',
})
export class UserRoute extends Route {
	public async [methods.GET](request: ApiRequest, response: ApiResponse) {
		if (!request.query.text) return response.json({ message: 'No text provided to get analyse' });
		const output = await perspectiveApi(request.query.text.toString().slice(0, 1000));
		return response.json(output);
	}
}
