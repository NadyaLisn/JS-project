import {HttpUtils} from "../../utils/http-utils";
import {UrlParams} from "../../utils/url-params";

export class CategoryExpenses {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.cardListElement = document.querySelector('.card-list');

        this.btnDeleteElement = document.getElementById('btn-delete');

        this.getCategoryExpense().then()

    }

    async getCategoryExpense() {
        const result = await HttpUtils.request('/categories/expense');
        if (result.redirect) {
            return this.openNewRoute(result.redirect)
        }

        console.log(result)

        if (result.error || !result.response) {
            return alert('Ошибка')

        }

        this.showRecords(result.response);
    }

    showRecords(expenseList) {
        console.log(expenseList)
        //
        expenseList.forEach (category => {
            let cardElement = document.createElement('div');
            cardElement.classList.add("col", "mb-3");
            let card = document.createElement('div');
            card.setAttribute("data-id", category.id);
            card.innerHTML = `
       <div class="card">
                                   <div class="card-body">
                                       <h5 class="card-title">${category.title}</h5>
                                       <div class="d-flex gap-2 flex-sm-wrap">
                                           <a href="/expenses-category-edit?id=${category.id}" class="btn btn-primary">Редактировать</a>
                                           <a href="/categories/expense?id=${category.id}" type="button" class="btn btn-danger" data-bs-toggle="modal"
                                              data-bs-target="#exampleModal">Удалить</a>
                                       </div>
                                </div>
                               </div>
                                  `;
            cardElement.appendChild(card);
            this.cardListElement.appendChild(cardElement);

            this.btnDeleteElement.onclick = () => {
                this.deleteCategoryExpense(UrlParams.getUrlParam('id'), cardElement);
            }
        });
        let cardElement = document.createElement('div');
        let cardElementAdd = document.createElement('div');
        let cardElementAddBody = document.createElement('div');
        cardElement.classList.add("col", "mb-3");
        cardElementAdd.classList.add("card");
        cardElementAddBody.classList.add("card-body", "income-add");
        let addCategory = document.createElement("a");

        addCategory.href = "/expenses-category-create";
        addCategory.classList.add( "text-decoration-none", "income-href");
        addCategory.innerHTML = '+';

        this.cardListElement.appendChild(cardElement);
        cardElement.appendChild(cardElementAdd);
        cardElementAdd.appendChild(cardElementAddBody);
        cardElementAddBody.appendChild(addCategory);
    }

    async deleteCategoryExpense(id, cardElement) {
        try {
            const result = await HttpUtils.request('/categories/expense/' + id, 'DELETE', true);
            if (result) {
                cardElement.remove();
                this.openNewRoute('/categories/expense')
            } else {
                alert("Ошибка")
            }
        } catch {
            alert("Ошибка")
        }
    }
}