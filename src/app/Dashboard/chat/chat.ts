
export class IChat {
	constructor() { }

	id = 0;

	senderId: number;

	reciverId: number;

	reciveStatus: boolean;


	text: string = "";

	fileStatus: boolean;

	fileUrl: string;
	fileName = "";
	fileData = "";


	sendDateString: string = "";

	reciveDateString: string = "";

	senderFullName = "";


}

export let UnreadMessages = 0;