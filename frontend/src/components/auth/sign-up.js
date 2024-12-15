import {Auth} from "../../utils/auth";
import {HttpUtils} from "../../utils/http-utils";


export class SignUp {

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (Auth.getAuthInfo(Auth.accessTokenKey)) {
            return this.openNewRoute('/');
        }
        this.commonErrorElement = document.getElementById('common-error');
        this.nameElement = document.getElementById('name');
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.passwordRepeatElement = document.getElementById('password-repeat');
        document.getElementById('btn-form').addEventListener('click', this.signUp.bind(this));
    }

    validateForm() {
        let isValid = true;

        if (this.nameElement.value && this.nameElement.value.match(/^[А-ЯЁ][а-яё]*([-][А-ЯЁ][а-яё]*)?\s[А-ЯЁ][а-яё]*\s[А-ЯЁ][а-яё]*$/)) {
            this.nameElement.classList.remove('is-invalid');
        } else {
            this.nameElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.emailElement.value && this.emailElement.value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
            this.emailElement.classList.remove('is-invalid');
        } else {
            this.emailElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.passwordElement.value && this.passwordElement.value.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)) {
            this.passwordElement.classList.remove('is-invalid');
        } else {
            this.passwordElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.passwordRepeatElement.value && this.passwordRepeatElement.value === this.passwordElement.value) {
            this.passwordRepeatElement.classList.remove('is-invalid');
        } else {
            this.passwordRepeatElement.classList.add('is-invalid');
            isValid = false;
        }
        return isValid;
    }

    async signUp() {
        this.commonErrorElement.style.display = 'none';
        let fullName = this.nameElement.value.split(' ');
        if (this.validateForm()) {

            const result = await HttpUtils.request('/signup', 'POST', false, {
                name: fullName[1],
                lastName: fullName[0],
                email: this.emailElement.value,
                password: this.passwordElement.value,
                passwordRepeat: this.passwordRepeatElement.value,
            })

            console.log(result)

            if (result.error || !result.response || (result.response && !result.response.user)) {
                this.commonErrorElement.style.display = 'block';
                return;
            }

            this.openNewRoute('/login');
        }
    }
}