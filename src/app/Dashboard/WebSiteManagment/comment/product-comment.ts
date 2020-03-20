export class IProductComment {
    constructor() { }

    id: number = 0;

    productId: number;

    fullName: string;

    email: string;

    ip: string;

    date: string;

    content: string;

    parentId: number = null;

    haveComformed: boolean;


    dateString = "";
    productTitleString = "";
    haveChildren = false;
}

export enum CommentTotalType {
    post = 0,
    product = 1,
    virtualTeaching = 2
}