import { Injectable } from "@angular/core";
import * as signalR from "@aspnet/signalr";
import { AuthService } from "../Auth/auth.service";
import { MessageService } from "./message.service";
import { ChatService, INewMessage } from "./chat.service";
import { take } from "rxjs/operators";

@Injectable()
export class SignalRService {

    constructor(
        private auth: AuthService,
        private message: MessageService,
        private chat: ChatService
    ) { }

    public hubConnection: signalR.HubConnection = null;
    public hubConnectionUser: signalR.HubConnection = null;

    public startConnectionForUser() {

        var url = this.auth.apiUrl + "us";
        this.hubConnectionUser = new signalR.HubConnectionBuilder()
            .configureLogging(signalR.LogLevel.None)
            .withUrl(url, {
                accessTokenFactory: () => {
                    return this.auth.getToken();
                }
            })
            .build();

        this.hubConnectionUser.serverTimeoutInMilliseconds = 1000 * 60 * 60;
        this.hubConnectionUser.keepAliveIntervalInMilliseconds = 1000 * 60 * 60;

        this.hubConnectionUser
            .start();

        this.hubConnectionUser.on("anotherUserLoginAlert", () => {
            var codeMeli = prompt("شخص دیگری به این نام کاربری وارد سیستم شده است، لطفا برای ورود کد ملی خود را وارد کنید");
            if (this.auth.getUser().meliCode == codeMeli) {
                this.hubConnectionUser.invoke("removeOldUser", this.auth.getUser().username);
            } else {
                this.message.showErrorAlert("کد ملی وارد شده اشتباه است");
                this.auth.Logout();
            }
        });


        this.hubConnectionUser.on("closeConnection", () => {
            this.message.showWarningAlert("شخص دیگری با این نام کاربری وارد سیستم شد");
            this.auth.Logout();
        });

        var start = () => {
            try {
                this.hubConnectionUser.start();
            } catch (err) {
                if (this.auth.isUserLoggedinGuard()) {
                    // setTimeout(() => start(), 1000);
                }
            }
        };

        this.hubConnectionUser.onclose(async (e) => {
            if (this.auth.isUserLoggedinGuard()) {
                // start();
            }
        });


    }

    public stopConnectionUser() {
        this.hubConnectionUser.stop();
    }

    public startConnection() {

        var url = this.auth.apiUrl + "chatHub";

        this.hubConnection = new signalR.HubConnectionBuilder()
            .configureLogging(signalR.LogLevel.None)
            .withUrl(url, {
                accessTokenFactory: () => {
                    return this.auth.getToken();
                }
            })
            .build();

        this.hubConnection.serverTimeoutInMilliseconds = 1000 * 60 * 60;
        this.hubConnection.keepAliveIntervalInMilliseconds = 1000 * 60 * 60;

        this.hubConnection.start()

        this.hubConnection.on("newChatRecive", (newMessage: INewMessage) => {

            this.message.showInfoAlert("پیام جدید از طرف " + newMessage.senderName);

            this.chat.addNewMessage(newMessage);

        });

        var start = () => {
            try {
                this.hubConnection.start();
                // console.clear();
            } catch (err) {
                // setTimeout(() => start(), 1000);
            }
        };

        this.hubConnection.onclose(async (e) => {
            // start();
        });


    }

    getChatHubState(): signalR.HubConnectionState {
        if (this.hubConnection != null) {
            return this.hubConnection.state;
        }

        return signalR.HubConnectionState.Disconnected;
    }

    setCurrentComponent(component) {
        
    }

}
