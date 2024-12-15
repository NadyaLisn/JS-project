import {UrlParams} from "../../utils/url-params";
import {HttpUtils} from "../../utils/http-utils";
import {GetData} from "../../utils/get-data";


export class OperationsEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.typeElement = document.getElementById('type-select');
        this.categoryElement = document.getElementById('category-select');
        this.amountElement = document.getElementById('amount-input');
        this.dateElement = document.getElementById('date-input');
        this.commentElement = document.getElementById('comment-input');
        this.btnSaveElement = document.getElementById('btn-save');
        this.btnCancelElement = document.getElementById('btn-cancel');
        const id = UrlParams.getUrlParam('id');
        if (!id) {
           this.openNewRoute('/operations')
            return;
        }

        this.getOperation(id).then()
        this.btnSaveElement.addEventListener('click', this.editOperation.bind(this, id));
        this.btnCancelElement.onclick = function () {
            history.back();
        }
        this.typeElement.addEventListener('change', () => {
            this.changeCategory().then();
        });
    }

    async getCategoryOperation(type) {
        const options = await GetData.getOperationCategory(type);
        const response = options.response
        this.categoryElement.innerHTML = '';
        for (let i = 0; i < response.length; i++) {
            const option = document.createElement("option");
            option.value = response[i].title;
            option.innerText = response[i].title;
            option.setAttribute("data-id", response[i].id);
            this.categoryElement.appendChild(option);
        }
    }
    async getOperation(id) {
        try {
            const result = await HttpUtils.request('/operations/' + id);
            const response = result.response
            if (result && !result.error) {

                this.typeElement.querySelectorAll('option').forEach(element => {
                    if (response.type === element.value) {
                        element.selected = true;
                    }
                });
                await this.getCategoryOperation(response.type);
                this.categoryElement.querySelectorAll('option').forEach(element => {
                    if (response.category === element.value) {
                        element.selected = true;
                    }
                });
                this.amountElement.value = result.response.amount;
                this.dateElement.value = result.response.date;
                this.commentElement.value = result.response.comment;
            }
        } catch {
            alert('Ошибка при получении операции');
        }
    }

    async changeCategory() {
        const selectedCategoryType = this.typeElement.value;
        if (selectedCategoryType) {
            await this.getCategoryOperation(selectedCategoryType);
        }
    }

    validateForm() {
        let isValid = true;

        if (this.amountElement.value) {
            this.amountElement.classList.remove('is-invalid');
        } else {
            this.amountElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.dateElement.value) {
            this.dateElement.classList.remove('is-invalid');
        } else {
            this.dateElement.classList.add('is-invalid');
            isValid = false;
        }
        return isValid;
    }
    getCategoryId() {
        const selectedCategory = this.categoryElement.querySelector(`option[value="${this.categoryElement.value}"]`);
        return selectedCategory ? selectedCategory.getAttribute('data-id') : null;
    }
    async editOperation(id) {
        if (this.validateForm()) {
            try {
                const operationId = +this.getCategoryId();

                const result = await HttpUtils.request('/operations/' + id, 'PUT', false, {
                    type: this.typeElement.value,
                    amount: +this.amountElement.value,
                    date: this.dateElement.value,
                    comment: this.commentElement.value,
                    category_id: operationId,
                });
                if (result && !result.error) {
                    this.openNewRoute('/operations');
                }
            } catch {
               alert('Ошибка при получении категории');
            }
        }
    }
}
