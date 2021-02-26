import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "src/app/shared/Auth/auth.service";
import { EncryptService } from "src/app/shared/services/encrypt.service";
import { IOnlineClass } from "src/app/Dashboard/OnlineClass/online-class";
import { IOnlineClassServer } from "src/app/Dashboard/OnlineClassServer/online-class-server";

const sha1 = require('js-sha1');
const parseString = require('xml2js').Parser({ explicitArray: false }).parseString;
const { iconvPercentEncoding } = require('iconv-percent-encoding');

type requestParam = { name: string, value: any };

@Injectable({
    providedIn: "root"
})
export class BigBlueButtonRepositoryService {
    constructor(
        private http: HttpClient,
        private auth: AuthService,
        private encryptServ: EncryptService
    ) { }


    private async _sendRequestToServer(
        methodCalledName: string,
        methodType: "POST" | "GET",
        onlineClassServerId: number,
        openGetUrl = false,
        customParserString?,
        ...params: requestParam[]
    ) {
        try {

            const server = await this._getOnlineClassServer(onlineClassServerId);

            const serverUrl = server.url;
            const serverPVKey = this.encryptServ.decrypt(server.privateKey);

            let query = "";

            params.forEach((param, index) => {
                query += `${param.name}=${param.value}${index != params.length - 1 ? '&' : ''}`;
            });

            let hashedString = `${methodCalledName}${query}${serverPVKey}`;
            let checksum = sha1(hashedString);

            let finalQuery = `${query}&checksum=${checksum}`;
            let url = `${serverUrl}api/${methodCalledName}?${finalQuery}`;

            if (methodType == "GET") {

                let xml = null;
                try {
                    xml = await this.http.get(url, {
                        responseType: "text",
                    }).toPromise();
                } catch (error) {

                }

                if (openGetUrl) {
                    let win = window.open(url, '_blank');
                    win.focus();
                }

                return new Promise<any | null>((resolve, reject) => {

                    let parserStringFinal = customParserString ? customParserString : parseString;

                    parserStringFinal(xml, (err, result) => {
                        if (err) {
                            reject(err);
                            return;
                        }

                        resolve(result.response);

                        if (result.response.returncode == "SUCCESS") {
                            resolve(result.response)
                        } else {

                        }
                    });
                });
            }

            if (methodType == "POST") {
                const result = await this.http.post<any>(url, null).toPromise();

                if (result.returncode == "SUCCESS") {
                    return result.response;
                }

                return null;
            }

        } catch (error) { }
    }

    private _getObjectAsParamArray(obj: any): requestParam[] {

        let params: requestParam[] = [];

        const keys = Object.keys(obj);
        const values = Object.values(obj);

        keys.forEach((key, index) => {
            const value = values[index];

            params.push({
                name: key,
                value: value
            });
        });

        return params;
    }


    async create(param: CreateParam): Promise<CreateReturn> {
        try {
            const meetingId = param.meetingID;
            const onlineClassServerId = await this._getOnlineClassServerId(meetingId);

            const params = this._getObjectAsParamArray(param);

            let data = await this._sendRequestToServer("create", "GET", onlineClassServerId, false, null, ...params);

            if (data.returncode == "FAILED") {
                //send a message to client
            }

            return data;
        } catch (error) {
            //send a message to client
        };
    }

    async join(param: JoinParam, openUrl = false): Promise<JoinReturn> {
        try {

            const meetingId = param.meetingID;
            const onlineClassServerId = await this._getOnlineClassServerId(meetingId);

            const params = this._getObjectAsParamArray(param);

            let data = await this._sendRequestToServer("join", "GET", onlineClassServerId, openUrl, null, ...params);

            if (data.returncode == "FAILED") {
                //send a message to client
            }

            return data;
        } catch (error) {

        }
    }

    async isMeetingRunning(meetingID: string): Promise<boolean> {
        try {
            const onlineClassServerId = await this._getOnlineClassServerId(meetingID);

            let data = await this._sendRequestToServer("isMeetingRunning", "GET", onlineClassServerId, false, null, { name: "meetingID", value: meetingID });


            if (data.returncode == "FAILED") {
                //send a message to client
            }

            return JSON.parse(data.running);
        } catch (error) {
            return false;
        }
    }

    async end(meetingID: string) {
        try {
            const onlineClass = await this._getOnlineClass(meetingID);
            const onlineClassServerId = onlineClass.onlineClassServerId;

            let data = await this._sendRequestToServer("end", "GET", onlineClassServerId, false, null,
                { name: "meetingID", value: meetingID },
                { name: "password", value: onlineClass.moderatorPW });

            if (data.returncode == "FAILED") {
                //send a message to client
            }

        } catch (error) {

        }
    }

    async getMeetingInfo(meetingID: string): Promise<MeetingInfoReturn> {
        try {
            const onlineClassServerId = await this._getOnlineClassServerId(meetingID);

            const ps = require('xml2js').Parser({ explicitArray: true }).parseString;
            let data = await this._sendRequestToServer("getMeetingInfo", "GET", onlineClassServerId, false, ps, { name: "meetingID", value: meetingID });


            if (data.returncode == "FAILED") {
                //send a message to client
            }

            let result: MeetingInfoReturn = new MeetingInfoReturn();

            result.fixParams(data);

            return result;
        } catch (error) {
            return null;
        }
    }

    async getMeetings(onlineClassServerId: number): Promise<getMeetingsParam> {

        try {

            const ps = require('xml2js').Parser({ explicitArray: true }).parseString;
            let data = await this._sendRequestToServer("getMeetings", "GET", onlineClassServerId, false, ps, ...[]);

            if (data.returncode == "FAILED") {
                //send a message to client
            }

            let result: getMeetingsParam = new getMeetingsParam();

            result.fixParams(data);

            return result;

        } catch (error) {
            console.log(error);
        }
    }

    getAttendeeArray(object: any[]) {
        let attendees = [];

        const obj = object[0];
        (obj.attendee as attendee[]).forEach(user => {
            let userObj = {};

            const keys = Object.keys(user);
            const values: any[][] = Object.values(user);

            keys.forEach((key, index) => {
                userObj[key] = values[index][0];
            });

            attendees.push(userObj);
        });

        return attendees as attendee[];
    }

    getStringPrecentEncoding(text: string) {
        const encodeCharset = "UTF-8";
        return iconvPercentEncoding(text, encodeCharset);
    }

    public async _getOnlineClass(meetingId: string) {
        const result = await this.auth.post("/api/OnlineClass/getOnlineClassByMeetingId", meetingId).toPromise();

        if (result && result.success) {
            return result.data as IOnlineClass;
        }

        return null;
    }

    public async _getOnlineClassServerId(meetingId: string) {
        const result = await this.auth.post("/api/OnlineClass/getOnlineClassServerId", meetingId).toPromise();

        if (result && result.success) {
            return result.data as number;
        }

        return null;
    }

    public async _getOnlineClassAllowedStudentIds(meetingId: string) {
        const result = await this.auth.post("/api/OnlineClass/getAllowedStudentIds", meetingId).toPromise();

        if (result && result.success) {
            return result.data as number[];
        }

        return [];
    }

    public async _getOnlineClassServer(id: number) {
        const result = await this.auth.post("/api/OnlineClassServer/getOnlineClassServer", id).toPromise();

        if (result && result.success) {
            return result.data as IOnlineClassServer;
        }

        return null;
    }


}

export class CreateParam {

    name: string;
    meetingID?: string;
    attendeePW?: string = "";
    moderatorPW?: string = "";
    welcome?: string = "";
    maxParticipants?: number = 60;
    record?: boolean = false;

    //Max length in minutes
    duration?: number = 0;
    isBreakout?: boolean = false;
    parentMeetingID?: string = "";
    sequence?: number = 0;

    autoStartRecording?: boolean = false;
    allowStartStopRecording?: boolean = true;

    muteOnStart?: boolean = false;
    allowModsToUnmuteUsers?: boolean = true;
    //prevent users from share there webcams
    lockSettingsDisableCam?: boolean = false;
    //prevent users from send private messages
    lockSettingsDisablePrivateChat?: boolean = true;
    //prevent users from send public messages
    lockSettingsDisablePublicChat?: boolean = false;
    lockSettingsDisableNote?: boolean = false;

    fixParams?() {
        if (!this.meetingID) {
            this.meetingID = randomString();
        }
        if (!this.attendeePW) {
            this.attendeePW = randomString();
        }
        if (!this.moderatorPW) {
            this.moderatorPW = randomString();
        }
    }
}

class CreateReturn {
    attendeePW = "";
    createDate = "";
    createTime = "";
    dialNumber = "";
    duration = "";
    hasBeenForciblyEnded = "";
    hasUserJoined = "";
    internalMeetingID = "";
    meetingID = "";
    message = "";
    messageKey = "";
    moderatorPW = "";
    parentMeetingID = "";
    returncode = "";
    voiceBridge = "";
}

export class JoinParam {
    fullName: string;
    meetingID: string;
    password: string;
    userID: string;

    joinViaHtml5?= true;
    guest?= false;
}

class JoinReturn {
    returncode = "";
    messageKey = "";
    message = "";
    meeting_id = "";
    user_id = "";
    auth_token = "";
    session_token = "";
    url = "";
}

export class MeetingInfoReturn {
    returncode = "";
    meetingName = "";
    meetingID = "";
    internalMeetingID = "";
    createTime = "";
    createDate = "";
    voiceBridge = "";
    dialNumber = "";
    attendeePW = "";
    moderatorPW = "";
    running = false;
    duration = 0;
    hasUserJoined = false;
    recording = false;
    hasBeenForciblyEnded = false;
    startTime = 0;
    endTime = 0;
    participantCount = 0;
    listenerCount = 0;
    voiceParticipantCount = 0;
    videoCount = 0;
    maxUsers = 0;
    moderatorCount = 0;
    attendees: attendee[] = [];
    metadata = "";
    isBreakout = false;


    fixParams(param: any) {
        const keys = Object.keys(param);
        const values: any[][] = Object.values(param);

        keys.forEach((key, index) => {
            if (key == "attendees") {
                this[key] = values[index];
            } else {
                this[key] = values[index][0];
            }
        });
    }
}

export class attendee {
    userID = "";
    fullName = "";
    role = "";
    isPresenter = false;
    isListeningOnly = false;
    hasJoinedVoice = false;
    hasVideo = false;
    clientType = "";
}

class getMeetingsParam {
    returncode = "";
    meetings: MeetingInfoReturn[] = [];
    message = "";
    messageKey = "";


    fixParams(param) {
        const keys = Object.keys(param);
        const values: any[][] = Object.values(param);

        keys.forEach((key, index) => {
            if (key == "meetings") {
                this[key] = values[index][0].meeting;

                if (this[key]) {
                    this[key].forEach((meeting, index) => {

                        let meet: MeetingInfoReturn = new MeetingInfoReturn();

                        meet.fixParams(meeting);

                        this[key][index] = meet;
                    });
                } else {
                    this[key] = [];
                }

            } else {
                this[key] = values[index][0];
            }
        });
    }
}


function randomString(stringLength = 15): string {
    let result = "";
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < stringLength; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}