export class IPost {
    constructor() { }

    id = 0;

    author: string;

    content: string = "";

    shortContent: string = "";

    title: string;

    name: string;

    haveComment: boolean;

    order: number;

    headerPicUrl: string;
    headerPicData = "";
    headerPicName = "";

    haveVideo: boolean;

    tags: string;

    url: string;

    isHighLight: boolean;

    isActive: boolean;

    type: PostType;

    dateCreate;
    dateEdited;

    dateCreateString = "";
    dateEditedString = "";


    haveSchedules = false;

    viewCount = 0;

    commentCount = 0;
}

export enum PostType {
    feed = 1,
    post = 2,
    fadak = 3,
    amoozesh = 4,
    enzebati = 5,
    parvaresh = 6,
    mali = 7,
    it = 8,
    moshaver = 9,

    //--------------

    voroodBeSystem = 10,
    sabteNam = 11,
    mokatebat = 12,
    ghesmathayeSamane = 13,
    faq = 14,
    ehrazeHoviat = 15,
    sharayetSabteNam = 16,
    darkhastTajdidNazar = 17,
    enteghadVaPishnahad = 18,
    daneshAmoozan = 19,
    daneshAmookhtegan = 20,
    forsatHayeShoghli = 21,
    tamasBaTaha = 22,
    darbareTaha = 23,
    dabirKhaneBargozidegan = 24,
    hedayatTahsil = 25,

    //--------------
}


export function getPostTypeString(type): string {
    if (type == 1) {
        return "اخبار";
    }
    if (type == 2) {
        return "بلاگ";
    }
    if (type == 3) {
        return "فدک";
    }
    if (type == 4) {
        return "معاونت آموزشی";
    }
    if (type == 5) {
        return "معاونت اجرایی";
    }
    if (type == 6) {
        return "معاونت پرورشی";
    }
    if (type == 7) {
        return "معاونت مالی و اداری";
    }
    if (type == 8) {
        return "انجمن اولیا و مربیان";
    }
    if (type == 9) {
        return "واحد مشاوره و هدایت تحصیلی";
    }
    if (type == 10) {
        return "نحوه ورود به سیستم";
    }
    if (type == 11) {
        return "رویه ثبت نام";
    }
    if (type == 12) {
        return "رویه پیگیری مکاتبات";
    }
    if (type == 13) {
        return "قسمت های مختلف سامانه";
    }
    if (type == 14) {
        return "پاسخ به پرسش های متداول";
    }
    if (type == 15) {
        return "رویه احراز هویت";
    }
    if (type == 16) {
        return "شرایط ثبت نام در طاها";
    }
    if (type == 17) {
        return "درخواست تجدید نظر";
    }
    if (type == 18) {
        return "انتقادات و پیشنهادات";
    }
    if (type == 19) {
        return "دانش آموزان";
    }
    if (type == 20) {
        return "دانش آموختگان";
    }
    if (type == 21) {
        return "فرصت‌های شغلی";
    }
    if (type == 22) {
        return "تماس با طاها";
    }
    if (type == 23) {
        return "درباره طاها";
    }
    if (type == 24) {
        return "دبیرخانه برگزیدگان طاها";
    }
    if (type == 25) {
        return "هدایت تحصیلی";
    }

    return "همه مطالب";
}

export function getPostTypeRoleString(type): string {
    if (type == 1) {
        return "post_feed";
    }
    if (type == 2) {
        return "post_post";
    }
    if (type == 3) {
        return "post_fadak";
    }
    if (type == 4) {
        return "post_amoozesh";
    }
    if (type == 5) {
        return "post_enzebati";
    }
    if (type == 6) {
        return "post_parvaresh";
    }
    if (type == 7) {
        return "post_mali";
    }
    if (type == 8) {
        return "post_it";
    }
    if (type == 9) {
        return "post_moshaver";
    }
    if (type == 10) {
        return "post_voroodBeSystem";
    }
    if (type == 11) {
        return "post_sabteNam";
    }
    if (type == 12) {
        return "post_mokatebat";
    }
    if (type == 13) {
        return "post_ghesmathayeSamane";
    }
    if (type == 14) {
        return "post_faq";
    }
    if (type == 15) {
        return "post_ehrazeHoviat";
    }
    if (type == 16) {
        return "post_sharayetSabteNam";
    }
    if (type == 17) {
        return "post_darkhastTajdidNazar";
    }
    if (type == 18) {
        return "post_enteghadVaPishnahad";
    }
    if (type == 19) {
        return "post_daneshAmoozan";
    }
    if (type == 20) {
        return "post_daneshAmookhtegan";
    }
    if (type == 21) {
        return "post_forsatHayeShoghli";
    }
    if (type == 22) {
        return "post_tamasBaTaha";
    }
    if (type == 23) {
        return "post_darbareTaha";
    }
    if (type == 24) {
        return "post_dabirKhaneBargozidegan";
    }
    if (type == 25) {
        return "post_hedayatTahsil";
    }

    return "";
}

export function getPostColor(type): string {

    if (type == PostType.amoozesh) {
        return "#8d68e4";
    }

    if (type == PostType.enzebati) {
        return "#e4b868";
    }

    if (type == PostType.fadak) {
        return "#e46868";
    }

    if (type == PostType.feed) {
        return "#e4689c";
    }

    if (type == PostType.it) {
        return "#686ce4";
    }

    if (type == PostType.mali) {
        return "#75e468";
    }

    if (type == PostType.moshaver) {
        return "#e4e068";
    }

    if (type == PostType.parvaresh) {
        return "#68dee4";
    }

    if (type == PostType.post) {
        return "#ad9fa3f7";
    }

    if (type == 10) {
        return "#3a528a";
    }

    if (type == 11) {
        return "#3a8a78";
    }

    if (type == 12) {
        return "#3f8a3a";
    }

    if (type == 13) {
        return "#593a8a";
    }

    if (type == 14) {
        return "#893a8a";
    }

    if (type == 15) {
        return "#8a3a66";
    }

    if (type == 16) {
        return "#8a3a84";
    }

    if (type == 17) {
        return "#3a8a5e";
    }

    if (type == 18) {
        return "#6f8a3a";
    }

    if (type == 19) {
        return "#8a753a";
    }

    if (type == 20) {
        return "#8a3a58";
    }

    if (type == 21) {
        return "#3a658a";
    }

    if (type == 22) {
        return "#285a6d";
    }

    if (type == 23) {
        return "#6d283e";
    }

    if (type == 24) {
        return "#282a6d";
    }

    if (type == 25) {
        return "#6c6d28";
    }
}