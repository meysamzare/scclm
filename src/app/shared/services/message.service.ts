import { Injectable } from "@angular/core";
import { jsondata } from "../Auth/auth.service";
import { CustomMessageService } from "../components/custom-message/custom-message.service";


@Injectable({
	providedIn: "root"
})
export class MessageService {
	constructor(
		private customMessage: CustomMessageService
	) {
		// toastr.options = {
		//     positionClass: "toast-top-left",
		//     closeButton: false,
		//     progressBar: true,
		//     showMethod: "fadeIn",
		//     hideMethod: "fadeOut"
		// };
	}

	public showSuccessAlert(message = "با موفقیت ثبت شد", title = "موفق") {

		// this.notifier.notify("success", message);

		this.customMessage.add({
			message: message,
			type: "success",
			title: title,
			count: 0
		});
		// return toastr.success(message, title);
	}
	public showErrorAlert(message, title = "خطا") {
		// this.notifier.notify("error", message);

		this.customMessage.add({
			message: message,
			type: "error",
			title: title,
			count: 0
		});

		// toastr.error(message, title);
	}
	public showWarningAlert(message, title = "اخطار") {
		// this.notifier.notify("warning", message);

		
		this.customMessage.add({
			message: message,
			type: "warning",
			title: title,
			count: 0
		});

		// toastr.warning(message, title);
	}
	public showInfoAlert(message, title = "") {
		// this.notifier.notify("info", message);
		
		this.customMessage.add({
			message: message,
			type: "info",
			title: title,
			count: 0
		});
		// toastr.info(message,  title);
	}

	public showMessageForSuccessResult(data: jsondata) {
		if (data.success) {
			this.showSuccessAlert("با موفقیت ثبت شد", "موفق");
		} else {
			this.showMessageforFalseResult(data);
		}
	}

	public showMessageforFalseResult(data: jsondata) {

		if (data.type.length < 1) {
			this.showErrorAlert(data.message, "خطا");
			return;
		}

		this.showMessageByType(data.type, "خطا", data.message);
	}

	public showMessageByType(type, title, message) {
		if (type == "warning") {
			return this.showWarningAlert(message, title);
		}

		if (type == "success") {
			return this.showSuccessAlert(message, title);
		}

		if (type == "info") {
			return this.showInfoAlert(message, title);
		}

		if (type == "error") {
			return this.showErrorAlert(message, title);
		}
	}

	public clearAll() {
		this.customMessage.clearAll();
	}
}
