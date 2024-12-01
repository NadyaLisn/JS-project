import config from "../config/config";


export class Auth {


    static accessTokenKey = 'accessToken';
    static refreshTokenKey = 'refreshToken';
    static userInfoTokenKey = 'userInfo';


    static setAuthInfo(accessToken, refreshToken, userInfo = null) {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
        if (userInfo) {
            localStorage.setItem(this.userInfoTokenKey, JSON.stringify(userInfo));
        }

    }


    static removeAuthInfo() {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userInfoTokenKey);
    }

    static getAuthInfo(key = null) {
        if (key && [this.accessTokenKey, this.refreshTokenKey, this.userInfoTokenKey].includes(key)) {
            return localStorage.getItem(key);

            // if (key === this.accessTokenKey) {
            //     return localStorage.getItem(this.accessTokenKey);
            // } else if (key === this.refreshTokenKey) {
            //     return localStorage.getItem(this.refreshTokenKey);
            // } else if (key === this.userInfoTokenKey) {
            //     return localStorage.getItem(this.userInfoTokenKey);
            // } else {
            //     return null;
            // }

        } else {
            return {
                [this.accessTokenKey]: localStorage.getItem(this.accessTokenKey),
                [this.refreshTokenKey]: localStorage.getItem(this.refreshTokenKey),
                [this.userInfoTokenKey]: localStorage.getItem(this.userInfoTokenKey),
            }
        }

    }

    // static async processUnauthorizedResponse() {
    //
    //     const refreshToken = localStorage.getItem(this.refreshTokenKey);
    //     if (refreshToken) {
    //         const response = await fetch(config.host + '/refresh', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-type': 'application/json',
    //                 'Accept': 'application/json'
    //             },
    //             body: JSON.stringify({refreshToken: refreshToken})
    //         });
    //         if (response && response.status === 200) {
    //             const result = await response.json();
    //             if (result && !result.error) {
    //                 this.setTokens(result.accessToken, result.refreshToken);
    //                 return true;
    //             }
    //         }
    //     }
    //
    //     this.removeTokens();
    //     location.href = '#/';
    //     return false;
    // }

    static setTokens(accessToken, refreshToken) {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
    }


    // static setUserInfo(info) {
    //     localStorage.setItem(this.userInfoKey, JSON.stringify(info));
    // }
    //
    // static getUserInfo() {
    //     const userInfo = localStorage.getItem(this.userInfoKey);
    //     if (userInfo) {
    //         return JSON.parse(userInfo);
    //     }
    //
    //     return null;
    // }
}