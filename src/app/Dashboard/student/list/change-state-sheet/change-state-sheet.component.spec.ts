import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { StdChangeStateSheetComponent } from "./change-state-sheet.component";

describe("ChangeStateSheetComponent", () => {
    let component: StdChangeStateSheetComponent;
    let fixture: ComponentFixture<StdChangeStateSheetComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [StdChangeStateSheetComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StdChangeStateSheetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
