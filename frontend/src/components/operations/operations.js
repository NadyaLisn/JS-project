import config from "../../config/config";
import {HttpUtils} from "../../utils/http-utils";

export class Operations {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute
        this.btnElement = document.querySelectorAll('.nav-item-main');
        this.tableElement = document.getElementById('tableData');
        this.inputFromInterval = document.getElementById('interval-from');
        this.inputToInterval = document.getElementById('interval-to');

        this.btnCraeteIncome = document.getElementById('btn-create-income');
        this.btnCreateExpense = document.getElementById('btn-create-expense');
        this.btnDeleteOperation = document.getElementById('operation-delete');
        this.getPeriod().then();

        this.btnOnclick();
        this.btnCraeteIncome.onclick = () => {
            this.openNewRoute('/operations-create')
        }
        this.btnCreateExpense.onclick = () => {
            this.openNewRoute('/operations-create')
        }
    }

    btnOnclick() {

        this.btnElement.forEach(btn => {

            btn.addEventListener('click', (e) => {
                let period = e.target.getAttribute('data-period');
                this.inputFromInterval.classList.remove('is-invalid');
                this.inputToInterval.classList.remove('is-invalid');
                if (period === "interval") {
                    if (!this.validateForm()) {
                        e.preventDefault();
                        return;
                    }
                }
                this.getPeriod(period).then();
            });

        });

    }


    async getPeriod(period) {
        let url;
        try {
            this.tableElement.innerHTML = '';
            if (period === "interval") {
                url = `/operations?period=interval&dateFrom=${this.inputFromInterval.value}&dateTo=${this.inputToInterval.value}`
            } else if (period) {
                url = `/operations?period=${period}`
            } else {
                url = `/operations`
            }
            const result = await HttpUtils.request(url);
            if (result.redirect) {
                return this.openNewRoute(result.redirect)
            }

            if (result) {
                this.showTableData(result.response);

            }
        } catch {
            alert('Ошибка');
        }
    }

    getTypeOperation(operationType) {
        let type = null;
        if (operationType === config.type.expense) {
            type = `<span class="text-danger">Расход</span>`;
        }
        if (operationType === config.type.income) {
            type = `<span class="text-success">Доход</span>`;
        }
        if (!operationType) {
            type = `<span class="text-primary">тип</span>`;
        }

        return type;
    }


    validateForm() {
        let isValid = true;

        if (this.inputFromInterval.value) {
            this.inputFromInterval.classList.remove('is-invalid');
        } else {
            this.inputFromInterval.classList.add('is-invalid');
            isValid = false;
        }

        if (this.inputToInterval.value) {
            this.inputToInterval.classList.remove('is-invalid');
        } else {
            this.inputToInterval.classList.add('is-invalid');
            isValid = false;
        }
        return isValid;
    }


    showTableData(data) {
        data.forEach((operation, i) => {
            let trElement = document.createElement("tr");
            trElement.insertCell().innerText = i + 1;
            trElement.insertCell().innerHTML = this.getTypeOperation(operation.type);
            trElement.insertCell().innerText = operation.category;
            trElement.insertCell().innerText = operation.amount + '$';
            trElement.insertCell().innerText = operation.date.replaceAll('-', '.');

            trElement.insertCell().innerText = operation.comment;

            trElement.insertCell().innerHTML = `
      <a href="/operations?id=${operation.id}" class="icon-table mx-2" data-bs-toggle="modal"
                                           data-bs-target="#exampleModal" id="open">
                                            <img src="/images/trash-icon.png" alt="">
                                        </a>
                                        <a href="/operations-edit?id=${operation.id}" class="icon-table">
                                            <img src="/images/pen-icon.png" alt="">
                                        </a>
      `;
            this.tableElement.appendChild(trElement);
            this.btnDeleteOperation.onclick = () => {
                this.openNewRoute("/operations-delete?id=" + operation.id)
            }
        });
    }

}