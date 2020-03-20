import { IPost } from "../post/post";

export class ISchedule {
	constructor() { }

	id = 0;

	postId: number;

	dateStart: string;
	
	dateEnd: string;
	
	title: string;
	
	content: string;


	dateStartString = "";
	dateEndString = "";
	postName = "";
	isOver = false;
	formatedDateEnd = "";

	
	picUrl: string;
	picName: string = "";
	picData: string = "";

	post: IPost;

}