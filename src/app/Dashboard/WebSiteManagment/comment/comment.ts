export class IComment {

    constructor() { }

    id: number = 0;

    postId: number;

    fullName: string;

    email: string;

    ip: string;

    date: string;

    content: string;

    parentId: number = null;

    haveComformed: boolean;

    
    dateString = "";
    postTitleString = "";
    haveChildren = false;

}