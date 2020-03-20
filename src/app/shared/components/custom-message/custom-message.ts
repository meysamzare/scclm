export class ICustomMessage {
	constructor(
		public type = "",
		public message = "",
		public title = "",
		public count: number = 0
	) { }
}