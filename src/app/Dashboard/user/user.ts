export class IUser {
    constructor() {}

    id: number = 0;

    username: string = "";

    password: string = "";

    firstname: string = "";

    lastname: string = "";

    meliCode: string = "";

    userState: number = 2;

    userStateDesc: string = "";

    roleId: number = null;

    fullName: string;

    roleName: string;

    userStateString: string;

    userStateColor: string;

    picUrl = "";
    picData = "";
    picName = "";
}