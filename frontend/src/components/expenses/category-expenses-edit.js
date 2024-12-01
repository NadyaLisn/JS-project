export class CategoryExpensesEdit {
    constructor() {
        document.getElementById('cancel').onclick = function () {
            history.back();
        }
    }
}