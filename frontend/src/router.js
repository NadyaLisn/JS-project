import {Main} from "./components/main.js";

import {Login} from "./components/auth/login";
import {SignUp} from "./components/auth/sign-up";
import {Logout} from "./components/auth/logout";
import {CategoryIncome} from "./components/income/category-income";
import {CategoryExpenses} from "./components/expenses/category-expenses";
import {CategoryIncomeCreate} from "./components/income/category-income-create";
import {CategoryIncomeEdit} from "./components/income/category-income-edit";
import {CategoryExpensesCreate} from "./components/expenses/category-expenses-create";
import {CategoryExpensesEdit} from "./components/expenses/category-expenses-edit";
import {Operations} from "./components/operations/operations";
import {OperationsDelete} from "./components/operations/operations-delete";
import {OperationsEdit} from "./components/operations/operations-edit";
import {OperationsCreate} from "./components/operations/operations-create";
import {HttpUtils} from "./utils/http-utils";
import {Auth} from "./utils/auth";

export class Router {
    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');

        this.initEvents();

        this.routes = [
            {
                route: '/',
                title: 'Главная',
                filePathTemplate: '/templates/pages/main.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Main(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/auth/login.html',
                useLayout: false,
                load: () => {
                    new Login(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/signup',
                title: 'Регистрация',
                filePathTemplate: '/templates/auth/sign-up.html',
                useLayout: false,
                load: () => {
                    new SignUp(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/404',
                title: 'Страница не найдена',
                filePathTemplate: '/templates/pages/404.html',
                useLayout: false,

            },
            {
                route: '/logout',
                load: () => {
                    new Logout(this.openNewRoute.bind(this))
                }
            },
            {
                route: '/categories/income',
                title: 'Доходы',
                filePathTemplate: '/templates/pages/income/income.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CategoryIncome(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/categories/expense',
                title: 'Расходы',
                filePathTemplate: '/templates/pages/expenses/expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CategoryExpenses(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/income-category-create',
                title: 'Расходы',
                filePathTemplate: '/templates/pages/income/income-category-create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CategoryIncomeCreate(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/income-category-edit',
                title: 'Редактирование категории доходов',
                filePathTemplate: '/templates/pages/income/income-category-edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CategoryIncomeEdit(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/expenses-category-create',
                title: 'Создание категории расходов',
                filePathTemplate: '/templates/pages/expenses/expenses-category-create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CategoryExpensesCreate(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/expenses-category-edit',
                title: 'Создание категории доходов',
                filePathTemplate: '/templates/pages/expenses/expenses-category-edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CategoryExpensesEdit(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/operations',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/pages/operations/operations.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Operations(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/operations-edit',
                title: 'Редактирование',
                filePathTemplate: '/templates/pages/operations/operations-edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OperationsEdit(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/operations-create',
                title: 'Создание дохода/расхода',
                filePathTemplate: '/templates/pages/operations/operations-create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OperationsCreate(this.openNewRoute.bind(this))
                },
            },
            {
                route: '/operations-delete',
                load: () => {
                    new OperationsDelete(this.openNewRoute.bind(this))
                },
            },

        ]
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this));
    }

    async openNewRoute(url) {
        history.pushState({}, '', url);
        await this.activateRoute();

    }

    async activateRoute() {
        const urlRoute = window.location.pathname;
        const newRoute = this.routes.find(item => item.route === urlRoute);
        if (newRoute) {
            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title
            }

            if (newRoute.filePathTemplate) {
                let contentBlock = this.contentPageElement;
                if (newRoute.useLayout) {
                    this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text())
                    contentBlock = document.getElementById('content-page');
                    this.activateMenuItem(newRoute);
                    this.balanceAll().then();
                    this.userName().then();
                }
                contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text())
            }
            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load()
            }
        } else {
            history.pushState({}, '', '/404');
            await this.activateRoute();
        }
    }

    async clickHandler(e) {

        let element = null;
        if (e.target.nodeName === 'A') {
            element = e.target;
        } else if (e.target.parentNode === 'A') {
            element = e.target.parentNode;
        }
        if (element) {
            e.preventDefault();
            const url = element.href.replace(window.location.origin, '')
            if (!url ||
                url === '/#' || url.startsWith('javascript:void(0)')) {
                return;
            }
            await this.openNewRoute(url);
        }
    }

    activateMenuItem(route) {
        document.querySelectorAll('.sidebar .nav-link').forEach(item => {
            const href = item.getAttribute('href');
            if ((route.route.includes(href) && href !== '/') || (route.route === '/' && href === '/')) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        })
    }


//баланс
    async balanceAll() {
        this.balanceShowElement = document.getElementById('balance');
        try {
            const result = await HttpUtils.request('/balance');
            if (result) {
                this.balanceShowElement.innerText =  result.response.balance;
            } else {
                alert('Ошибка при получении баланса, обратитесь в поддержку');
            }
        } catch {
            alert('Ошибка при получении баланса, обратитесь в поддержку');;
        }
    }

    async userName() {
        this.userNameElement = document.getElementById('user-full-name');
        const userInfo =  Auth.getAuthInfo(Auth.userInfoTokenKey);
        let userName = JSON.parse(userInfo);
        this.userNameElement.innerText = userName.name + ' ' + userName.lastName;
    }
}
