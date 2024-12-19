import {HttpUtils} from "../../utils/http-utils";
import config from "../../config/config";
import {UrlParams} from "../../utils/url-params";


export class CategoryIncome {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.cardListElement = document.querySelector('.card-list');

        this.btnDelete = document.getElementById('btn-delete');
        this.getCategoryIncome().then()

    }

    async getCategoryIncome() {
        const result = await HttpUtils.request('/categories/income');
        if (result.redirect) {
            return this.openNewRoute(result.redirect)
        }

        console.log(result)

        if (result.error || !result.response) {
            return alert('Ошибка')

        }

        this.showRecords(result.response);
    }

    showRecords(incomeList) {
        console.log(incomeList)

        incomeList.forEach(category => {
            let cardElement = document.createElement('div');
            cardElement.classList.add("col", "mb-3", "mb-sm-0");
            let card = document.createElement('div');

            card.setAttribute("data-id", category.id);
            card.innerHTML = `
       <div class="card">
                                   <div class="card-body">
                                       <h5 class="card-title text-nowrap">${category.title}</h5>
                                       <div class="d-flex gap-2 flex-sm-wrap">
                                           <a href="/income-category-edit?id=${category.id}" class="btn btn-primary" id="btn-edit">Редактировать</a>
                                         <a href="/categories/income?id=${category.id}" type="button" class="btn btn-danger" data-bs-toggle="modal"
                                              data-bs-target="#exampleModal">Удалить</a>  
                                       </div>
                                </div>
                               </div>
                                  `;
            cardElement.appendChild(card);
            this.cardListElement.appendChild(cardElement);
            this.btnDelete.onclick = () => {
                this.deleteCategoryIncome(UrlParams.getUrlParam('id'), cardElement);
            }

        });

        let cardElement = document.createElement('div');
        let cardElementAdd = document.createElement('div');
        let cardElementAddBody = document.createElement('div');
        cardElement.classList.add("col", "mb-3", "mb-sm-0");
        cardElementAdd.classList.add("card");
        cardElementAddBody.classList.add("card-body", "income-add");
        let addCategory = document.createElement("a");

        addCategory.href = "/income-category-create";
        addCategory.classList.add( "text-decoration-none", "income-href");
        addCategory.innerHTML = '+';

        this.cardListElement.appendChild(cardElement);
        cardElement.appendChild(cardElementAdd);
        cardElementAdd.appendChild(cardElementAddBody);
        cardElementAddBody.appendChild(addCategory);
    }


    async deleteCategoryIncome(id, cardElement) {
        try {
            const result = await HttpUtils.request('/categories/income/' + id, 'DELETE', true);
            if (result) {
                cardElement.remove();
                this.openNewRoute('/categories/income')
            } else {
               alert("Ошибка")
            }
        } catch {
            alert("Ошибка")
        }
    }
}