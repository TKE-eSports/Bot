import { ApplyOptions } from '@sapphire/decorators';
import { ApiRequest, ApiResponse, methods, MimeTypes, Route, RouteOptions } from '@sapphire/plugin-api';
import { generatePlayerGraph } from '../../../../lib/api/brawlstars';

@ApplyOptions<RouteOptions>({
    route: 'brawlstars/graph/player/:tag'
})
export class UserRoute extends Route {
    public async [methods.GET](request: ApiRequest, response: ApiResponse) {
        const graph = await generatePlayerGraph(request.params.tag);
        response.setContentType(MimeTypes.ImagePng).end(graph);
    }
}