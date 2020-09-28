export class IProduct {
    constructor() { }

    id: number;
    title: string;
    type: ProductType;
    value: number = 0;
    desc: string = "";
    totalPrice: number;

    totalType: ProductTotalType;

    haveComment: boolean;

    picUrl: string;
    picData: string = "";
    picName: string;

    tags: string;
    like: number;

    productCategoryId: number;
    productCategoryString: string = "";

    writerId: number;
    writerString: string = "";

    haveAnyLink = false;
}

export function getProductTypeString(type): string {
    if (type == 0) {
        return "کتاب";
    }
    if (type == 1) {
        return "جزوه";
    }
    if (type == 2) {
        return "فیلم";
    }
    if (type == 3) {
        return "صوت";
    }

    return "---";
}

export enum ProductType {
    Book = 0,
    Document = 1,
    Movie = 2,
    Voice = 3
}

export enum ProductTotalType {
    Docs = 0,
    VirtualLearn = 1
}