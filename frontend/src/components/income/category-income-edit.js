import {UrlParams} from "../../utils/url-params";
import {HttpUtils} from "../../utils/http-utils";

export class CategoryIncomeEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.inputName = document.getElementById('inputNameCategory');
        this.btnSave = document.getElementById('btn-save');

        document.getElementById('cancel').onclick = function () {
            history.back();
        }
        const id = UrlParams.getUrlParam('id');
        if (!id) {
           this.openNewRoute('/categories/income');
        }
        this.btnSave.addEventListener('click', this.CategoryUpdate.bind(this, id));
        this.getCategory(id).then();
    }
    async getCategory(id) {
        try {
            const result = await HttpUtils.request('/categories/income/' + id);
            if (result && !result.error) {

                this.inputName.value = result.response.title;
            }
        } catch  {
           alert('Ошибка')
        }
    }

    async CategoryUpdate(id) {

            try {
                const result = await HttpUtils.request('/categories/income/' + id, 'PUT', false, {title: this.inputName.value});
                if (result && !result.error) {
                    this.openNewRoute('/categories/income')
                }
            } catch {
                alert('Ошибка при получении категории');
            }
    }



}