import { Component, OnInit, Input, Injectable } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable, merge } from 'rxjs';
import { CollectionViewer, SelectionChange } from '@angular/cdk/collections';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/Auth/auth.service';

@Component({
    selector: 'app-tree',
    templateUrl: './tree.component.html',
    styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {

    @Input() Url = "";


    treeControl: FlatTreeControl<DynamicFlatNode>;

    dataSource: DynamicDataSource;

    constructor(private database: DynamicDatabase) {

    }

    async ngOnInit() {
        this.database.setUrl(this.Url);
        this.treeControl = new FlatTreeControl<DynamicFlatNode>(this.getLevel, this.isExpandable);
        this.dataSource = new DynamicDataSource(this.treeControl, this.database);
        this.dataSource.data = await this.database.initialData();
    }

    getLevel = (node: DynamicFlatNode) => node.level;

    isExpandable = (node: DynamicFlatNode) => node.expandable;

    hasChild = (_: number, _nodeData: DynamicFlatNode) => _nodeData.expandable;

}

export class ITreeNode {
    id: string;
    parent: string;
    text: string;
    children: boolean;
}

export class DynamicFlatNode {
    constructor(
        public item: string,
        public level = 1,
        public expandable = false,
        public id = "",
        public isLoading = false
    ) { }
}

export class DynamicDataSource implements DataSource<DynamicFlatNode> {

    dataChange = new BehaviorSubject<DynamicFlatNode[]>([]);

    get data(): DynamicFlatNode[] { return this.dataChange.value; }
    set data(value: DynamicFlatNode[]) {
        this._treeControl.dataNodes = value;
        this.dataChange.next(value);
    }

    constructor(
        private _treeControl: FlatTreeControl<DynamicFlatNode>,
        private _database: DynamicDatabase
    ) { }

    connect(collectionViewer: CollectionViewer): Observable<DynamicFlatNode[]> {
        this._treeControl.expansionModel.changed.subscribe(change => {
            if ((change as SelectionChange<DynamicFlatNode>).added ||
                (change as SelectionChange<DynamicFlatNode>).removed) {
                this.handleTreeControl(change as SelectionChange<DynamicFlatNode>);
            }
        });

        return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.data));
    }

    disconnect(collectionViewer: CollectionViewer): void { }

    /** Handle expand/collapse behaviors */
    handleTreeControl(change: SelectionChange<DynamicFlatNode>) {
        if (change.added) {
            change.added.forEach(node => this.toggleNode(node, true));
        }
        if (change.removed) {
            change.removed.slice().reverse().forEach(node => this.toggleNode(node, false));
        }
    }

    /**
     * Toggle the node, remove from display list
     */
    async toggleNode(node: DynamicFlatNode, expand: boolean) {
        node.isLoading = true;
        const children = await this._database.getChildren(node.id);
        const index = this.data.indexOf(node);
        if (!children || index < 0) { // If no children, or cannot find the node, no op
            return;
        }

        if (expand) {
            const nodes = children.map(data =>
                new DynamicFlatNode(data.text, node.level + 1, data.children, data.id));
            this.data.splice(index + 1, 0, ...nodes);
        } else {
            let count = 0;
            for (let i = index + 1; i < this.data.length
                && this.data[i].level > node.level; i++, count++) { }
            this.data.splice(index + 1, count);
        }

        // notify the change
        this.dataChange.next(this.data);
        node.isLoading = false;
    }
}

@Injectable({
    providedIn: "root"
})
export class DynamicDatabase {

    Url = "";

    rootNodes: ITreeNode[] = [];

    constructor(
        private auth: AuthService
    ) { }

    setUrl = url => this.Url = url;

    /** Initial data from database */
    async initialData() {
        let rootNodes = await this.auth.get(`/api/${this.Url}/GetTreeRoot`, []).toPromise<ITreeNode[]>()
        return rootNodes.map(node => new DynamicFlatNode(node.text, 0, node.children, node.id));
    }

    async getChildren(id: string) {
        return this.auth.get(`/api/${this.Url}/GetTreeChildren/${id}`, []).toPromise<ITreeNode[]>();
    }
}