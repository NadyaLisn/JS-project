import {HttpUtils} from "../../utils/http-utils";
import config from "../../config/config";


export class CategoryIncome {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.getCategoryIncome().then()

    }

    async getCategoryIncome() {
        const result = await HttpUtils.request('/categories/income');
        if(result.redirect) {
            return this.openNewRoute(result.redirect)
        }

        console.log(result)

        if (result.error || !result.response) {
            return  alert('Ошибка')

        }

        this.showRecords(result.response)
    }

    showRecords(incomeList) {
console.log(incomeList)
    }

}