import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { merge } from 'rxjs';
import { ISchedule } from '../schedule';

@Component({
	selector: 'app-schedule-list',
	templateUrl: './schedule-list.component.html',
	styleUrls: ['./schedule-list.component.scss'],
	styles: [
		`
		.example-loading-shade {
			position: absolute;
			top: 0;
			left: 0;
			bottom: 56px;
			right: 0;
			background: rgba(0, 0, 0, 0.15);
			z-index: 1;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	`
	]
})
export class ScheduleListComponent implements OnInit, AfterViewInit {

	displayedColumns: string[] = [
		"select",
		"id",
		"title",
		"post",
		"date",
		"action"
	];
	dataSource: MatTableDataSource<ISchedule>;
	selection = new SelectionModel<ISchedule>(true, []);

	Schedules: ISchedule[];

	isLoading: boolean;
	isLoadingResults = true;

	txtSearch: string = "";

	itemLength;

	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;

	constructor(
		private router: Router,
		private activeroute: ActivatedRoute,
		private auth: AuthService,
		private message: MessageService
	) { }

	getRowCanSelected(): number {
		let rowCanSelect: number = 0;

		this.getCurrentDataOfPage().forEach(row => {
			// if (!row.havePerson) {
			rowCanSelect += 1;
			// }
		});

		return rowCanSelect;
	}

	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.data.length;

		return numSelected === this.getRowCanSelected();
	}

	getCurrentDataOfPage(): ISchedule[] {
		let List: ISchedule[];

		this.dataSource.connect().subscribe(rows => (List = rows));

		return List;
	}

	public resetSelection(event?: PageEvent) {
		this.selection.clear();
	}

	haveAnyData(): boolean {
		return this.dataSource ? true : false;
	}

	/** Selects all rows if they are not all selected; otherwise clear selection. */
	masterToggle() {
		this.isAllSelected()
			? this.selection.clear()
			: this.getCurrentDataOfPage().forEach(row => {
				// if (!row.havePerson) {
				this.selection.select(row);
				// }
			});
	}

	deleteSelected() {
		if (this.auth.isUserAccess("remove_Schedule")) {
			if (this.selection.selected.length != 0) {
				let ids: number[] = [];
                this.selection.selected.forEach(row => ids.push(row.id));
                
                var deleteDatas = this.selection.selected;

				this.auth.post("/api/Schedule/Delete", ids, {
                    type: 'Delete',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'Schedule',
                    logSource: 'dashboard',
                    deleteObjects: deleteDatas,
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
		if (this.auth.isUserAccess("edit_Schedule")) {
			this.router.navigate(["/dashboard/schedule/edit/" + id]);
		}
	}

	refreshDataSource() {
		this.selection.clear();

		this.auth
			.post("/api/Schedule/Get", {
				sort: this.sort.active,
				direction: this.sort.direction,
				pageIndex: this.paginator.pageIndex,
				pageSize: this.paginator.pageSize,
				q: this.txtSearch
			}, {
                type: 'View',
                agentId: this.auth.getUserId(),
                agentType: 'User',
                agentName: this.auth.getUser().fullName,
                tableName: 'Schedule',
                logSource: 'dashboard',
                object: {
                    sort: this.sort.active,
                    direction: this.sort.direction,
                    pageIndex: this.paginator.pageIndex,
                    pageSize: this.paginator.pageSize,
                    q: this.txtSearch
                },
            })
			.subscribe(
				(data: jsondata) => {
					if (data.success) {
						this.isLoadingResults = false;
						this.itemLength = data.type;
						this.Schedules = data.data;

						this.dataSource = new MatTableDataSource(this.Schedules);
					} else {
						this.isLoadingResults = false;
						this.message.showMessageforFalseResult(data);
					}
				},
				er => {
					this.auth.handlerError(er);
				}
			);
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

}
