export class IPictureGallery {
    
    constructor() { }

    id: number;

    name: string;

    desc: string;

    createDate: string;

    like: number;

    disLike: number;

    viewCount: number;

    author: string;

    pictureCount: number = 0;

    createDateString = "";

    firstPicUrl = "";
}