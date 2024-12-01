import {HttpUtils} from "../../utils/http-utils";

export class CategoryIncome {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.getCategoryIncome().then()

    }

    async getCategoryIncome() {
        const result = await HttpUtils.request('/categories/income');

        console.log(result)

        if (result.error || !result.response) {
            return  alert('Ошибка')

        }

        this.showRecords(result.response)
    }

    showRecords() {

    }

}