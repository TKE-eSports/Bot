import { ApplyOptions } from '@sapphire/decorators';
import { ApiRequest, ApiResponse, methods, Route, RouteOptions } from '@sapphire/plugin-api';

@ApplyOptions<RouteOptions>({
    route: 'nsfw/bin/:id',
    name: 'NsfwBin'
})
export class UserRoute extends Route {
    public async [methods.GET](request: ApiRequest, response: ApiResponse) {
        const bin = await this.container.database.get("bin", request.params.id);
        if (bin) return response.json(bin);
        else return response.json({ message: "No record found with that id" });
    }
}