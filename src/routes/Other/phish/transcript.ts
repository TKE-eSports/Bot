import { ApplyOptions } from '@sapphire/decorators';
import { ApiRequest, ApiResponse, methods, MimeTypes, Route, RouteOptions } from '@sapphire/plugin-api';

@ApplyOptions<RouteOptions>({
	route: 'phish/transcript/:id',
	name: 'PhishTranscript',
})
export class UserRoute extends Route {
	public async [methods.GET](request: ApiRequest, response: ApiResponse) {
		const transcript = await this.container.database.get("transcript", request.params.id);
		if (transcript) return response.setContentType('text/html' as MimeTypes).end(transcript);
		else return response.json({ message: "No record found with that id" })
	}
}