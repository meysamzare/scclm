export class IAdvertising {
	constructor() { }

	id = 0;

	name: string;
	
	type: AdType;
	
	url: string = "http://";
	
	isActive: boolean;
	
	picUrl: string;
	
	picName: string = "";
	picData: string = "";
	
	
}


export enum AdType
{
	fullRow = 1,
	halfRow = 2
}