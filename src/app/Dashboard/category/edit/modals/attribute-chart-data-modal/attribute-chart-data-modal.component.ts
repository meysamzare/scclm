import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { IAttr } from 'src/app/Dashboard/attribute/attribute';
import { AuthService } from 'src/app/shared/Auth/auth.service';

@Component({
    templateUrl: './attribute-chart-data-modal.component.html',
    styleUrls: ['./attribute-chart-data-modal.component.scss']
})
export class AttributeChartDataModalComponent implements OnInit {

    Title = "";

    catId = 0
    attrId = 0

    attribute: IAttr = null;

    isLoading = true;

    chartData: number[] = [];
    chartDataLabel: Label[] = [];

    constructor(
        public dialogRef: MatDialogRef<AttributeChartDataModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private auth: AuthService,
    ) { }

    async ngOnInit() {

        await Promise.resolve();

        this.catId = this.data.catId;
        this.attrId = this.data.attrId;

        await this.refreshChartDatas();
    }

    async refreshChartDatas() {
        this.isLoading = true;

        const result = await this.auth.post("/api/Attribute/getAttributeChartData", {
            catId: this.catId,
            attrId: this.attrId
        }).toPromise();

        if (result.success) {
            const data: {
                attribute: IAttr,
                attrChartData: {
                    title: string,
                    isTrue: boolean,
                    precent: string,
                }[]
            } = result.data;


            this.attribute = data.attribute;

            this.Title = `داده های آماری فیلد ${this.attribute.title}`

            data.attrChartData.forEach(chartData => {
                this.chartData.push(+chartData.precent);
                this.chartDataLabel.push(chartData.title);
            });

        }

        this.isLoading = false;
    }

}
