import {HttpUtils} from "../../utils/http-utils";

export class CategoryExpensesCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.inputName = document.getElementById('inputNameCategory');
        this.btnCreate = document.getElementById('btn-create');
        document.getElementById('cancel').onclick = function () {
            history.back();
        }
        this.btnCreate.addEventListener('click', this.categoryCreate.bind(this))

    }

    async categoryCreate() {
        const result = await HttpUtils.request('/categories/expense', 'POST', false, {title: this.inputName.value});
        if (result && !result.error) {
            console.log(result)
            this.openNewRoute('/categories/expense')
        } else {

            alert('Введите название категории')
        }
    }

}