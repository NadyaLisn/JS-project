// import {HttpUtils} from "../../utils/http-utils";


// export class OperationsDelete {
//
//     constructor(openNewRoute, trElement) {
//         this.tr = trElement
//         this.openNewRoute = openNewRoute;
//
//         const urlParams = new URLSearchParams(window.location.search);
//
//         const id = urlParams.get('id');
//         if (!id) {
//             return this.openNewRoute('/');
//         }
//
//         this.deleteOperation(id, this.tr).then();
//     }
//
//     async deleteOperation(id, trElement) {
//         const result = await HttpUtils.request('/operations/' + id, 'DELETE', true);
//         if (result.redirect) {
//             return this.openNewRoute(result.redirect)
//         }
//
//         if (result.error || !result.response || (result.response && result.response.error)) {
//             return alert('Возникла ошибка при удалении операции')
//         }
//         trElement.remove();
//
//     }
// }
//

