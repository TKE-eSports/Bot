import { ApplyOptions } from '@sapphire/decorators';
import { ApiRequest, ApiResponse, methods, Route, RouteOptions } from '@sapphire/plugin-api';
import { detectNsfw } from '../../../lib/api/detectNsfw';

@ApplyOptions<RouteOptions>({
    route: 'nsfw/detect',
    name: 'NsfwDetect'
})
export class UserRoute extends Route {
    public async [methods.GET](request: ApiRequest, response: ApiResponse) {
        const image = request.query.image;
        if(!image)return response.json({message: 'No image provided'});
        const res = await detectNsfw(image.toString());
        return response.json(res);
    }
}