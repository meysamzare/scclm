import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "src/app/shared/Auth/auth.service";

const sha1 = require('js-sha1');
const parseString = require('xml2js').Parser({ explicitArray: false }).parseString;

type requestParam = { name: string, value: any };

@Injectable({
    providedIn: "root"
})
export class BigBlueButtonRepositoryService {
    constructor(
        private http: HttpClient,
        private auth: AuthService
    ) { }


    private async _sendRequestToServer(
        methodCalledName: string,
        methodType: "POST" | "GET",
        openGetUrl = false,
        customParserString?,
        ...params: requestParam[]
    ) {
        try {
            let query = "";

            params.forEach((param, index) => {
                query += `${param.name}=${param.value}${index != params.length - 1 ? '&' : ''}`;
            });

            let hashedString = `${methodCalledName}${query}${this.auth.BBBSS}`;
            let checksum = sha1(hashedString);

            let finalQuery = `${query}&checksum=${checksum}`;
            let url = `${this.auth.BBBServer}api/${methodCalledName}?${finalQuery}`;

            if (methodType == "GET") {
                let xml = await this.http.get(url, {
                    responseType: "text"
                }).toPromise();

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

                        // if (result.response.returncode == "SUCCESS") {
                        //     resolve(result.response)
                        // } else {

                        // }
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

        } catch (error) {

        }
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
            const params = this._getObjectAsParamArray(param);

            let data = await this._sendRequestToServer("create", "GET", false, null, ...params);

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
            const params = this._getObjectAsParamArray(param);

            let data = await this._sendRequestToServer("join", "GET", openUrl, null, ...params);

            if (data.returncode == "FAILED") {
                //send a message to client
            }

            return data;
        } catch (error) {

        }
    }

    async isMeetingRunning(meetingID: string): Promise<boolean> {
        try {
            let data = await this._sendRequestToServer("isMeetingRunning", "GET", false, null, { name: "meetingID", value: meetingID });


            if (data.returncode == "FAILED") {
                //send a message to client
            }

            return data.running;
        } catch (error) {
            return false;
        }
    }

    async end(meetingID: string, password: string) {
        try {
            let data = await this._sendRequestToServer("end", "GET", false, null,
                { name: "meetingID", value: meetingID },
                { name: "password", value: password });

            if (data.returncode == "FAILED") {
                //send a message to client
            }

        } catch (error) {

        }
    }

    async getMeetingInfo(meetingID: string): Promise<MeetingInfoReturn> {
        try {
            const ps = require('xml2js').Parser({ explicitArray: true }).parseString;
            let data = await this._sendRequestToServer("getMeetingInfo", "GET", false, ps, { name: "meetingID", value: meetingID });


            if (data.returncode == "FAILED") {
                //send a message to client
            }

            console.log(data);


            let result: MeetingInfoReturn = new MeetingInfoReturn();

            result.fixParams(data);

            console.log(result);


            return result;
        } catch (error) {
            return null;
        }
    }

    async getMeetings(): Promise<getMeetingsParam> {

        try {

            const ps = require('xml2js').Parser({ explicitArray: true }).parseString;
            let data = await this._sendRequestToServer("getMeetings", "GET", false, ps, ...[]);

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

class MeetingInfoReturn {
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

class attendee {
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
    meetings: any[] = [];
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