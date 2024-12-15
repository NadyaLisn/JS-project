import config from "../config/config";
import {HttpUtils} from "./http-utils";

export class GetData {
    static getTypeOperation(operationType) {
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

    static async getOperationCategory(type) {
        let url = null;
        if (type === "expense") {
            url = `/categories/expense`;
        } else {
            url = `/categories/income`;
        }
        try {
            const result = await HttpUtils.request(url);
            if (result && !result.error) {
                return result;
            }
        } catch {
           alert('Ошибка при запросе категории, обратитесь в поддержку');
        }
    }

}