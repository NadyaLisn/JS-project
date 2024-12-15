import {Auth} from "../../utils/auth";
import {HttpUtils} from "../../utils/http-utils";

export class Logout {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!Auth.getAuthInfo(Auth.accessTokenKey) || !Auth.getAuthInfo(Auth.refreshTokenKey)) {
            return this.openNewRoute('/login');
        }
        this.logout().then();
    }
    async logout() {

        await HttpUtils.request('/logout', 'POST', false, {
            refreshToken: Auth.getAuthInfo(Auth.refreshTokenKey)
        });

        Auth.removeAuthInfo();

        this.openNewRoute('/login');
    }
}