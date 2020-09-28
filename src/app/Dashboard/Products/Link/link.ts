export class ILink {
    constructor() { }
    
    id: number;

    title: string;
    value: number = 0;
    desc: string;
    
    fileUrl: string;
    haveExternalUrl: boolean;
    fileData: string;
    fileName: string;
    
    like: number;
    viewCount: number;
    downloadTime: number;
    
    price: number;
    
    productId: number;
    productTitle: string = "";
}