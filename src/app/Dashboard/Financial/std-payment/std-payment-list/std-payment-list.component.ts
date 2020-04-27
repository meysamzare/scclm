import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { merge } from 'rxjs';
import { IStdPayment } from '../std-payment';

@Component({
	selector: 'app-std-payment-list',
	templateUrl: './std-payment-list.component.html',
	styleUrls: ['./std-payment-list.component.scss'],
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
export class StdPaymentListComponent implements OnInit {

	displayedColumns: string[] = [
		"select",
		"id",
		"contract",
		"student",
		"paymenttype",
		"price",
		"action"
	];
	dataSource: MatTableDataSource<IStdPayment>;
	selection = new SelectionModel<IStdPayment>(true, []);

	StdPayments: IStdPayment[];

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

	getCurrentDataOfPage(): IStdPayment[] {
		let List: IStdPayment[];

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
		if (this.auth.isUserAccess("remove_StdPayment")) {
			if (this.selection.selected.length != 0) {
				let ids: number[] = [];
                this.selection.selected.forEach(row => ids.push(row.id));
                
                var deleteDatas = this.selection.selected;

				this.auth.post("/api/StdPayment/Delete", ids, {
                    type: 'Delete',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'StdPayment',
                    logSource: 'dashboard',
                    deleteObjects: deleteDatas,
                    table: "StdPayment",
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
		if (this.auth.isUserAccess("edit_StdPayment")) {
			this.router.navigate(["/dashboard/stdpayment/edit/" + id]);
		}
	}

	refreshDataSource() {
		this.selection.clear();

		this.auth
			.post("/api/StdPayment/Get", {
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
                tableName: 'StdPayment List',
                logSource: 'dashboard',
                object: {
                    sort: this.sort.active,
                    direction: this.sort.direction,
                    pageIndex: this.paginator.pageIndex,
                    pageSize: this.paginator.pageSize,
                    q: this.txtSearch
                },
                table: "StdPayment"
            })
			.subscribe(
				(data: jsondata) => {
					if (data.success) {
						this.isLoadingResults = false;
						this.itemLength = data.type;
						this.StdPayments = data.data;

						this.dataSource = new MatTableDataSource(this.StdPayments);
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
