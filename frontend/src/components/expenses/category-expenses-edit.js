import {UrlParams} from "../../utils/url-params";
import {HttpUtils} from "../../utils/http-utils";

export class CategoryExpensesEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.inputName = document.getElementById('inputNameCategory');
        this.btnSave = document.getElementById('btn-save');

        document.getElementById('cancel').onclick = function () {
            history.back();
        }
        const id = UrlParams.getUrlParam('id');
        if (!id) {
            this.openNewRoute('/categories/expense');
        }
        this.btnSave.addEventListener('click', this.categoryUpdate.bind(this, id));
        this.getCategory(id).then();
    }
    async getCategory(id) {
        try {
            const result = await HttpUtils.request('/categories/expense/' + id);
            if (result && !result.error) {
                console.log(result)
                this.inputName.value = result.response.title;
            }
        } catch  {
            alert('Ошибка')
        }
    }

    async categoryUpdate(id) {

        try {
            const result = await HttpUtils.request('/categories/expense/' + id, 'PUT', false, {title: this.inputName.value});
            if (result && !result.error) {
                this.openNewRoute('/categories/expense')
            }
        } catch {
          alert('Ошибка при редактировании категории');
        }
    }



}