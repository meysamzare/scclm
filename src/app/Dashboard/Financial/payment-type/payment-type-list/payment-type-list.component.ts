import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, jsondata } from 'src/app/shared/Auth/auth.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { merge } from 'rxjs';
import { IPaymentType } from '../payment-type';

@Component({
	selector: 'app-payment-type-list',
	templateUrl: './payment-type-list.component.html',
	styleUrls: ['./payment-type-list.component.scss'],
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
export class PaymentTypeListComponent implements OnInit {
	displayedColumns: string[] = [
		"select",
		"id",
		"code",
		"title",
		"action"
	];
	dataSource: MatTableDataSource<IPaymentType>;
	selection = new SelectionModel<IPaymentType>(true, []);

	Salaries: IPaymentType[];

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
			if (!row.haveStdPayments) {
				rowCanSelect += 1;
			}
		});

		return rowCanSelect;
	}

	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.data.length;

		return numSelected === this.getRowCanSelected();
	}

	getCurrentDataOfPage(): IPaymentType[] {
		let List: IPaymentType[];

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
				if (!row.haveStdPayments) {
					this.selection.select(row);
				}
			});
	}

	deleteSelected() {
		if (this.auth.isUserAccess("remove_PaymentType")) {
			if (this.selection.selected.length != 0) {
				let ids: number[] = [];
                this.selection.selected.forEach(row => ids.push(row.id));
                
                var deleteDatas = this.selection.selected;

				this.auth.post("/api/PaymentType/Delete", ids, {
                    type: 'Delete',
                    agentId: this.auth.getUserId(),
                    agentType: 'User',
                    agentName: this.auth.getUser().fullName,
                    tableName: 'PaymentType',
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
		if (this.auth.isUserAccess("edit_PaymentType")) {
			this.router.navigate(["/dashboard/paymenttype/edit/" + id]);
		}
	}

	refreshDataSource() {
		this.selection.clear();

		this.auth
			.post("/api/PaymentType/Get", {
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
                tableName: 'PaymentType List',
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
						this.Salaries = data.data;

						this.dataSource = new MatTableDataSource(this.Salaries);
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
