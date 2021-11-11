import { ApplyOptions } from '@sapphire/decorators';
import { ApiRequest, ApiResponse, methods, Route, RouteOptions } from '@sapphire/plugin-api';
import { phishingDomains } from '../../../lib/api/phishDomains';

@ApplyOptions<RouteOptions>({
    route: 'phish/websites',
    name: 'phishWebsites',
})
export class UserRoute extends Route {
    public async [methods.GET](_request: ApiRequest, response: ApiResponse) {
        response.json([...phishingDomains]);
    }
}