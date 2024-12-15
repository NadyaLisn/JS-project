import Chart from "chart.js/auto";
import {HttpUtils} from "../utils/http-utils";


export class Main {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute
        this.btnElement = document.querySelectorAll('.nav-item-main');
        this.inputFromInterval = document.getElementById('interval-from');
        this.inputToInterval = document.getElementById('interval-to');
        this.chartIncome = document.getElementById('income-chart');
        this.chartExpenses = document.getElementById('expense-chart');
        this.btnOnclick();
        this.arrayCategoryIncome = [];
        this.arrayAmountIncome = [];
        this.arrayCategoryExpense = [];
        this.arrayAmountExpense = [];

    }

    btnOnclick() {
        this.btnElement.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const period = e.target.getAttribute('data-period');
                this.inputFromInterval.classList.remove('is-invalid');
                this.inputToInterval.classList.remove('is-invalid');
                if (period === "interval") {
                    if (!this.validateForm()) {
                        e.preventDefault();
                        return;
                    }
                }

                this.arrayCategoryIncome = [];
                this.arrayAmountIncome = [];
                this.arrayCategoryExpense = [];
                this.arrayAmountExpense = [];
                this.getPeriod(period).then();

            });
        });
    }



    async getPeriod(period) {
        let url;
        try {
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

                this.getCategory(result.response);

                this.showChart1();
                this.showChart2();
            }
        } catch {
            alert('Произошла ошибка, при запросе данных, обратитесь в поддержку');
        }
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

    getCategory(data) {

        function getItemCategoryAmount(data) {
            return data.reduce((acc, item) => {

                let category = item.category.trim();

                if (!acc[category]) {
                    acc[category] = 0;
                }
                acc[category] += item.amount;
                return acc
            }, {});
        }

        const incomeCategory = data.filter(function (item) {
            return item.type === "income"
        });

        let result = getItemCategoryAmount(incomeCategory);
        console.log(result);
        this.arrayCategoryIncome = Object.keys(result);
        this.arrayAmountIncome = Object.values(result)

        const expenseCategory = data.filter(function (item) {
            return item.type === "expense"
        })

        let result2 = getItemCategoryAmount(expenseCategory);
        console.log(result2);
        this.arrayCategoryExpense = Object.keys(result2)
        this.arrayAmountExpense = Object.values(result2);
    }


    showChart1() {

        if (this.myChart1) {
            this.myChart1.destroy();
        }
        const paddingLegends = {
            id: 'paddingLegends',
            beforeInit(chart) {
                // Get a reference to the original fit function
                const originalFit = chart.legend.fit;

                // Override the fit function
                chart.legend.fit = function fit() {
                    // Call the original function and bind scope in order to use `this` correctly inside it
                    originalFit.bind(chart.legend)();
                    // Change the height as suggested in other answers
                    this.height += 40;
                }
            }
        }
        const labelsIncome = this.arrayCategoryIncome.length ? this.arrayCategoryIncome : ['Данные отсутствуют']
        const dataIncome = this.arrayAmountIncome.length ? this.arrayAmountIncome : [1];

        this.myChart1 = new Chart(this.chartIncome, {
            type: 'pie',
            data: {
                labels: labelsIncome,

                datasets: [{

                    data: dataIncome,
                    label: ' ',
                    backgroundColor: [
                        '#DC3545',
                        '#FD7E14',
                        '#FFC107',
                        '#20C997',
                        '#0D6EFD',
                    ],
                    hoverOffset: 5
                }]
            },
            options: {
                plugins: {
                    legend: {
                        labels: {
                            font: {
                                size: 14,
                                family: 'Roboto, sans-serif',
                            },
                            color: '#000000',
                        },
                    },
                },
                scales: {
                    y: {
                        display: false
                    },
                    x: {
                        display: false
                    }
                },
            },
            plugins: [paddingLegends]
        });
    }

    showChart2() {
        if (this.chart2) {
            this.chart2.destroy();
        }

        const labelsExpense = this.arrayCategoryExpense.length ? this.arrayCategoryExpense : ['Данные отсутствуют'];
        const dataExpense = this.arrayAmountExpense.length ? this.arrayAmountExpense : [1];

        const paddingLegends = {
            id: 'paddingLegends',
            beforeInit(chart) {
                // Get a reference to the original fit function
                const originalFit = chart.legend.fit;

                // Override the fit function
                chart.legend.fit = function fit() {
                    // Call the original function and bind scope in order to use `this` correctly inside it
                    originalFit.bind(chart.legend)();
                    // Change the height as suggested in other answers
                    this.height += 40;
                }
            }
        }
        this.chart2 = new Chart(this.chartExpenses, {
            type: 'pie',
            data: {
                labels: labelsExpense,
                datasets: [{
                    data: dataExpense,
                    label: ' ',
                    backgroundColor: [
                        '#DC3545',
                        '#FD7E14',
                        '#FFC107',
                        '#20C997',
                        '#0D6EFD',
                    ],
                    hoverOffset: 5
                }]
            },
            options: {
                plugins: {
                    legend: {
                        labels: {
                            font: {
                                size: 14,
                                family: 'Roboto, sans-serif',
                            },
                            color: '#000000',
                            padding: 15,
                        },
                    },
                },
                scales: {
                    y: {
                        display: false
                    },
                    x: {
                        display: false
                    }
                },

            },
            plugins: [paddingLegends]

        });
    }

}
