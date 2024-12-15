import {GetData} from "../../utils/get-data";
import {HttpUtils} from "../../utils/http-utils";

export class OperationsCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.typeElement = document.getElementById('type-select');
        this.categoryElement = document.getElementById('category-select');
        this.amountElement = document.getElementById('amount-input');
        this.dateElement = document.getElementById('date-input');
        this.commentElement = document.getElementById('comment-input');
        this.btnSaveElement = document.getElementById('btn-save');
        this.btnCancelElement = document.getElementById('btn-cancel');
        this.updateCategory().then();
        this.btnSaveElement.addEventListener('click', this.createOperation.bind(this));
        this.btnCancelElement.onclick = function () {
            history.back();
        }
        this.typeElement.addEventListener('change', () => {
            this.updateCategory().then();
        });
    }

    async getCategory(type) {
        const category = await GetData.getOperationCategory(type);
        const response = category.response;
        console.log(category.response)
        this.categoryElement.innerHTML = '';
        for (let i = 0; i < response.length; i++) {
            const option = document.createElement("option");
            option.value = response[i].title;
            option.innerText = response[i].title;
            option.setAttribute("data-id", response[i].id);
            this.categoryElement.appendChild(option);
        }
    }

    async updateCategory() {
        const selectedCategoryType = this.typeElement.value;
        if (selectedCategoryType) {
            await this.getCategory(selectedCategoryType);
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

    getIdOption() {
        const option = this.categoryElement.querySelector(`option[value="${this.categoryElement.value}"]`);
        return option ? option.getAttribute('data-id') : null;
    }

    async createOperation() {
        if (this.validateForm()) {
            const categoryId = +this.getIdOption();
            try {
                const result = await HttpUtils.request('/operations', 'POST', false, {
                    type: this.typeElement.value,
                    amount: this.amountElement.value,
                    date: this.dateElement.value,
                    comment: this.commentElement.value,
                    category_id: categoryId
                });
                if (result && !result.error) {
                    this.openNewRoute('/operations');
                }
            } catch {
                alert('Ошибка при создании категории, обратитесь в поддержку');
            }
        }
    }
}