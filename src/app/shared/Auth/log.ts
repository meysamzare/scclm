export class ILogParam {
    type: "none" | "Add" | "Edit" | "Delete" | "View" | "custom" = "none";
    agentId: number = null;
    agentType: "User" | "Teacher" | "StudentParent" | "Other" = "User";
    agentName = "";
    object?= null;
    oldObject?= null;
    deleteObjects?: any[] = null;
    tableName = "";
    logSource: "dashboard" | "TMA" | "PMA" | "Index" = "dashboard";
    desc?= "";
    event?= "";
}

export class ILog {

    constructor() { }

    agentId: number;
    agentType: string;
    agentName: string;
    desc: string;
    ev: string;
    logSource: string;
}

export function getAssinedPropNameAndValue(object: any): string {

    // var objectKEYS = Object.keys(object);
    // var objectVALUES = Object.values(object);

    // var text = "";

    // objectKEYS.forEach((key, index) => {
    //     var value = objectVALUES[index];

    //     text += key + ": " + value + (objectKEYS.length - 1 == index ? "" : ", ");
    // });

    return JSON.stringify(object);
}