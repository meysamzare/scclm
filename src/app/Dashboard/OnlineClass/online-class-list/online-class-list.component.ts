import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { merge } from 'rxjs';
import { IOnlineClass } from '../online-class';
import { BigBlueButtonRepositoryService, MeetingInfoReturn } from 'public/Services/big-blue-button/big-blue-button-repository.service';
import { OnlineClassPresentsListModalComponent } from './modals/online-class-presents-list-modal/online-class-presents-list-modal.component';
import { OnlineClassLoginsModalComponent } from './modals/online-class-logins-modal/online-class-logins-modal.component';

@Component({
    selector: 'app-online-class-list',
    templateUrl: './online-class-list.component.html',
    styleUrls: ['./online-class-list.component.scss']
})
export class OnlineClassListComponent implements OnInit {
    displayedColumns: string[] = [
        "select",
        "id",
        "name",
        "authType",
        "grade",
        "isRunning",
        "userCount",
        "action"
    ];
    dataSource: MatTableDataSource<IOnlineClass>;
    selection = new SelectionModel<IOnlineClass>(true, []);

    PAGE_Datas: any[] = [];

    isLoading: boolean;
    isLoadingResults = true;

    txtSearch: string = "";

    itemLength;


    PAGE_TITLE = " کلاس مجازی ";
    PAGE_TITLES = " کلاس های مجازی ";
    PAGE_APIURL = "OnlineClass";
    PAGE_URL = "online-class";
    PAGE_ROLE = "OnlineClass";


    grades: any[] = [];
    selectedGrade: number = null;

    classesByGrade: any[] = [];
    selectedClass: number = null;

    courses = [];
    selectedCourseId = null;


    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    constructor(
        private router: Router,
        private activeroute: ActivatedRoute,
        private auth: AuthService,
        private message: MessageService,
        private dialog: MatDialog,
        private bbbRepo: BigBlueButtonRepositoryService
    ) {
        this.auth.post("/api/Grade/getAll").subscribe(data => {
            if (data.success) {
                this.grades = data.data;
            } else {
                this.auth.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });


        this.auth.post("/api/Course/getAll").subscribe(data => {
            if (data.success) {
                this.courses = data.data;
            } else {
                this.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });
    }


    getRowCanSelected(): number {
        let rowCanSelect: number = 0;

        this.getCurrentDataOfPage().forEach(row => {
            // if (!row.haveAnyProduct) {
            rowCanSelect += 1;
            // }
        });

        return rowCanSelect;
    }



    getCourseByGrade() {
        let gradeId = this.selectedGrade;

        if (gradeId) {
            return this.courses.filter(c => c.gradeId == gradeId);
        }

        return [];
    }

    onGradeSelected() {
        this.refreshDataSource();

        if (this.selectedGrade) {

            this.auth.post("/api/Class/getClassByGrade", this.selectedGrade).subscribe(data => {
                if (data.success) {
                    this.classesByGrade = data.data;
                } else {
                    this.auth.message.showMessageforFalseResult(data);
                }
            }, er => {
                this.auth.handlerError(er);
            });

        }
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;

        return numSelected === this.getRowCanSelected();
    }

    getCurrentDataOfPage(): IOnlineClass[] {
        let List: IOnlineClass[];

        this.dataSource.connect().subscribe(rows => (List = rows));

        return List;
    }

    public resetSelection(event?: PageEvent) {
        this.selection.clear();
    }

    haveAnyData(): boolean {
        return this.PAGE_Datas.length != 0 ? true : false;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected()
            ? this.selection.clear()
            : this.getCurrentDataOfPage().forEach(row => {
                // if (!row.haveAnyProduct) {
                this.selection.select(row);
                // }
            });
    }

    deleteSelected() {
        if (this.auth.isUserAccess("remove_" + this.PAGE_ROLE)) {
            if (this.selection.selected.length != 0) {
                let ids: number[] = [];
                this.selection.selected.forEach(row => ids.push(row.id));

                var deleteDatas = this.selection.selected;

                this.auth.post("/api/" + this.PAGE_APIURL + "/Delete", ids, {
                    type: 'Delete',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: this.PAGE_APIURL,
                    logSource: 'dashboard',
                    deleteObjects: deleteDatas,
                    table: this.PAGE_APIURL,
                    tableObjectIds: ids
                }).subscribe(
                    (data: jsondata) => {
                        if (data.success) {
                            this.message.showSuccessAlert(
                                "موارد انتخابی با موفقیت حذف شد"
                            );
                            this.refreshDataSource();
                            this.selection.clear();
                        } else {
                            this.message.showMessageforFalseResult(data);
                        }
                    },
                    er => {
                        this.auth.handlerError(er);
                    }
                );
            }
        }
    }

    onEdit(id) {
        if (this.auth.isUserAccess("edit_" + this.PAGE_ROLE)) {
            this.router.navigate(["/dashboard/" + this.PAGE_URL + "/edit/" + id]);
        }
    }

    refreshDataSource() {
        this.selection.clear();

        var obj = {
            getparams: {
                sort: this.sort.active,
                direction: this.sort.direction,
                pageIndex: this.paginator.pageIndex,
                pageSize: this.paginator.pageSize,
                q: this.txtSearch
            },
            selectedGrade: this.selectedGrade,
            selectedClass: this.selectedClass,
            selectedCourse: this.selectedCourseId,
        }

        this.auth.post("/api/" + this.PAGE_APIURL + "/Get", obj, {
            type: 'View',
            agentId: this.auth.getUserId(),
            agentType: 'User',
            agentName: this.auth.getUser().fullName,
            tableName: this.PAGE_APIURL + ' List Get Method',
            logSource: 'dashboard',
            object: obj,
            table: this.PAGE_APIURL
        }).subscribe(async data => {
            if (data.success) {
                this.isLoadingResults = false;
                this.itemLength = data.type;
                this.PAGE_Datas = data.data;

                this.dataSource = new MatTableDataSource(this.PAGE_Datas);


                const serverIds = Array.from(new Set(this.PAGE_Datas.map(c => c.serverId as number)));

                let serversMeetings: MeetingInfoReturn[] = [];

                for await (const serverId of serverIds) {
                    const meetings = await this.bbbRepo.getMeetings(serverId);

                    meetings.meetings.forEach(meet => serversMeetings.push(meet));
                }

                this.PAGE_Datas.forEach((onlineClass: IOnlineClass, index) => {
                    const serverMeet = serversMeetings.find(c => c.meetingID == onlineClass.meetingId);

                    let isRunning = false;
                    let usersCount = 0;

                    if (serverMeet) {
                        isRunning = JSON.parse(serverMeet.running as any);
                        usersCount = serverMeet.participantCount;
                    }


                    this.PAGE_Datas[index].isRunning = isRunning;
                    this.PAGE_Datas[index].usersCount = usersCount;

                });

                this.PAGE_Datas = this.PAGE_Datas.sort((x, y) => y.isRunning - x.isRunning);

                this.dataSource = new MatTableDataSource(this.PAGE_Datas);
            } else {
                this.isLoadingResults = false;
                this.message.showMessageforFalseResult(data);
            }
        }, er => {
            this.auth.handlerError(er);
        });

    }

    ngOnInit() {
        const changeed = merge(this.sort.sortChange, this.paginator.page);

        changeed.subscribe(() => {
            this.refreshDataSource();
        });
    }

    ngAfterViewInit(): void {
        this.refreshDataSource();
    }

    applyFilter(filterValue: string) {
        this.refreshDataSource();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }


    async isMeetingRunning(meetingId: string, className: string) {
        const isRunning = await this.bbbRepo.isMeetingRunning(meetingId)

        let message = "";
        if (isRunning) {
            message = `${className} در حال اجرا است`;
        } else {
            message = `${className} بسته است`;
        }

        this.refreshDataSource();

        alert(message);
    }

    async endMeeting(meetingId: string, className: string) {
        if (confirm("آیا از پایان جلسه این کلاس اطمینان دارید؟")) {
            try {
                await this.bbbRepo.end(meetingId);

                this.auth.logToServer({
                    type: 'Edit',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: "Send End Meeting Request For Class: " + className,
                    logSource: 'dashboard',
                    object: { meetingId, className },
                    oldObject: null,
                    table: this.PAGE_APIURL,
                    tableObjectIds: [meetingId]
                });

                this.refreshDataSource();
            } catch { }
        }
    }

    async join(meetingId: string, className: string) {
        const onlineClass = await this.bbbRepo._getOnlineClass(meetingId);

        await this.bbbRepo.create({
            name: this.bbbRepo.getStringPrecentEncoding(onlineClass.name),
            meetingID: onlineClass.meetingId,
            attendeePW: onlineClass.attendeePW,
            moderatorPW: onlineClass.moderatorPW,
            welcome: this.bbbRepo.getStringPrecentEncoding(onlineClass.welcome),
            maxParticipants: onlineClass.maxParticipants,
            record: onlineClass.record,
            duration: onlineClass.duration,
            isBreakout: onlineClass.isBreakout,
            parentMeetingID: onlineClass.parentMeetingID,
            sequence: onlineClass.sequence,
            autoStartRecording: onlineClass.autoStartRecording,
            allowStartStopRecording: onlineClass.allowStartStopRecording,
            muteOnStart: onlineClass.muteOnStart,
            allowModsToUnmuteUsers: onlineClass.allowModsToUnmuteUsers,
            lockSettingsDisableCam: onlineClass.lockSettingsDisableCam,
            lockSettingsDisablePrivateChat: onlineClass.lockSettingsDisablePrivateChat,
            lockSettingsDisablePublicChat: onlineClass.lockSettingsDisablePublicChat,
            lockSettingsDisableNote: onlineClass.lockSettingsDisableNote,
        });

        const obj = {
            fullName: this.bbbRepo.getStringPrecentEncoding(this.auth.getUser().fullName),
            meetingID: meetingId,
            password: onlineClass.moderatorPW,
            userID: `AdDashboard_${this.auth.getUserId()}`,
            joinViaHtml5: true
        };

        const joinResult = await this.bbbRepo.join(obj, true);

        this.auth.post("/api/OnlineClass/setLogin", {
            meetingId: meetingId,
            fullName: this.auth.getUser().fullName,
            userName: this.auth.getUser().username,
            userId: this.auth.getUserId(),
            agentType: 0,
        }).subscribe();

        this.auth.logToServer({
            type: 'View',
            agentId: this.auth.getUserId(),
            agentType: 'User',
            agentName: this.auth.getUser().fullName,
            tableName: "Send Join Request From Dashboard For Class: " + className,
            logSource: 'dashboard',
            object: { obj: obj, className, joinResult },
            oldObject: null,
            table: this.PAGE_APIURL,
            tableObjectIds: [meetingId]
        });

        this.refreshDataSource();
    }

    openOnlineClassPresentsList(meetingId: string, className: string) {
        this.dialog.open(OnlineClassPresentsListModalComponent, {
            data: {
                className: className,
                meetingId: meetingId,
            }
        })
    }

    openOnlineClassLoginsList(meetingId: string, className: string) {
        this.dialog.open(OnlineClassLoginsModalComponent, {
            data: {
                className: className,
                meetingId: meetingId,
            }
        })
    }

}